-- =====================================================================
-- Salad&Co – Réservation en ligne : schéma Supabase
-- À exécuter UNE FOIS dans Supabase → SQL Editor (en entier).
-- Principe :
--   * Les clients (non connectés) lisent la configuration publique
--     (restaurants, horaires, événements, capacités) et les disponibilités
--     SANS aucune donnée personnelle ; ils réservent via create_reservation().
--   * Les équipes se connectent par code e-mail. Seules les adresses
--     @saladandco.fr présentes dans la table "staff" peuvent créer un compte.
--   * Siège : tout. Directeur / adjoint : uniquement son restaurant.
-- =====================================================================

-- ---------- Tables ----------
create table if not exists public.sites       (id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
create table if not exists public.restaurants (id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
create table if not exists public.caps        (id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
create table if not exists public.events      (id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());

create table if not exists public.staff (
  id text primary key
     check (id = lower(id) and id ~ '^[a-z0-9._%+-]+@saladandco\.fr$'),
  data jsonb not null
     check (data->>'role' in ('siege-ops','siege-marketing','directeur','adjoint')),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id text primary key check (id ~ '^[A-Za-z0-9_-]{3,40}$'),
  data jsonb not null,
  site_id text generated always as (data->>'siteId') stored,
  date    text generated always as (data->>'date') stored,
  created_at timestamptz not null default now()
);
create index if not exists reservations_site_date on public.reservations (site_id, date);
create index if not exists reservations_date      on public.reservations (date);

-- ---------- Qui est connecté ? (fonctions utilisées par les règles) ----------
create or replace function public.my_email() returns text
language sql stable as $$
  select lower(coalesce(auth.jwt()->>'email',''))
$$;

create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select s.data->>'role' from public.staff s
  where s.id = public.my_email() and public.my_email() like '%@saladandco.fr'
$$;

create or replace function public.is_siege() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.my_role() like 'siege%', false)
$$;

create or replace function public.my_site() returns text
language sql stable security definer set search_path = public as $$
  select s.data->>'siteId' from public.staff s
  where s.id = public.my_email() and public.my_email() like '%@saladandco.fr'
    and s.data->>'role' in ('directeur','adjoint')
$$;

-- ---------- Sécurité ligne par ligne (RLS) ----------
alter table public.sites        enable row level security;
alter table public.restaurants  enable row level security;
alter table public.caps         enable row level security;
alter table public.events       enable row level security;
alter table public.staff        enable row level security;
alter table public.reservations enable row level security;

-- Configuration publique : lisible par tous, modifiable par le siège
do $$
declare t text;
begin
  foreach t in array array['sites','restaurants','caps','events'] loop
    execute format('drop policy if exists "%1$s_lecture" on public.%1$s', t);
    execute format('create policy "%1$s_lecture" on public.%1$s for select to anon, authenticated using (true)', t);
    execute format('drop policy if exists "%1$s_siege" on public.%1$s', t);
    execute format('create policy "%1$s_siege" on public.%1$s for all to authenticated using (public.is_siege()) with check (public.is_siege())', t);
  end loop;
end $$;

-- Capacité du jour : un directeur / adjoint peut ajuster celle de SON restaurant
drop policy if exists "caps_directeur" on public.caps;
create policy "caps_directeur" on public.caps for all to authenticated
  using (id = public.my_site()) with check (id = public.my_site());

-- Accès : chacun voit sa propre fiche ; le siège gère tout
drop policy if exists "staff_soi" on public.staff;
create policy "staff_soi" on public.staff for select to authenticated using (id = public.my_email());
drop policy if exists "staff_siege" on public.staff;
create policy "staff_siege" on public.staff for all to authenticated
  using (public.is_siege()) with check (public.is_siege());

-- Réservations : siège = toutes, directeur / adjoint = son restaurant. Aucun accès anonyme.
drop policy if exists "resa_lecture" on public.reservations;
create policy "resa_lecture" on public.reservations for select to authenticated
  using (public.is_siege() or site_id = public.my_site());
drop policy if exists "resa_creation" on public.reservations;
create policy "resa_creation" on public.reservations for insert to authenticated
  with check (public.is_siege() or site_id = public.my_site());
drop policy if exists "resa_modif" on public.reservations;
create policy "resa_modif" on public.reservations for update to authenticated
  using (public.is_siege() or site_id = public.my_site())
  with check (public.is_siege() or site_id = public.my_site());
-- (pas de suppression : une réservation s'annule, elle reste dans l'historique)

revoke all on public.reservations from anon;
revoke all on public.staff from anon;

-- ---------- Disponibilités publiques (sans données personnelles) ----------
create or replace function public.availability(p_site text, p_date text)
returns setof jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
           'service', r.data->>'service',
           'time',    r.data->>'time',
           'covers',  (r.data->>'covers')::int,
           'status',  r.data->>'status')
  from public.reservations r
  where r.site_id = p_site and r.date = p_date
    and coalesce(r.data->>'status','') <> 'annulee'
$$;

-- ---------- Réservation client, contrôlée côté serveur ----------
create or replace function public.create_reservation(p_id text, p_data jsonb)
returns void
language plpgsql volatile security definer set search_path = public as $$
declare
  v_site text := p_data->>'siteId';
  v_date text := p_data->>'date';
  v_svc  text := p_data->>'service';
  v_time text := p_data->>'time';
  v_cov  int;
  v_d    date;
  v_today date := (now() at time zone 'Europe/Paris')::date;
  v_cap  int;
  v_used int;
  v_phone text := regexp_replace(coalesce(p_data->>'phone',''), '[^0-9+]', '', 'g');
  v_email text := lower(trim(coalesce(p_data->>'email','')));
  v_ev   jsonb;
  v_site_cfg jsonb;
  v_row  jsonb;
begin
  if p_id is null or p_id !~ '^SC-[A-Z0-9]{6}$' then raise exception 'Référence invalide.'; end if;
  if exists (select 1 from public.reservations where id = p_id) then raise exception 'Référence déjà utilisée, réessayez.'; end if;

  -- Restaurant ouvert à la réservation
  if not exists (select 1 from public.restaurants where id = v_site and coalesce((data->>'closed')::boolean,false) = false) then
    raise exception 'Restaurant inconnu ou fermé à la réservation.';
  end if;
  select data into v_site_cfg from public.sites where id = v_site;
  if coalesce((v_site_cfg->>'active')::boolean, true) = false then
    raise exception 'Réservation en ligne indisponible pour ce restaurant.';
  end if;

  -- Date, heure, couverts
  begin v_d := v_date::date; exception when others then raise exception 'Date invalide.'; end;
  if v_d < v_today or v_d > v_today + 180 then raise exception 'Date hors période de réservation.'; end if;
  if v_time is null or v_time !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' then raise exception 'Heure invalide.'; end if;
  begin v_cov := (p_data->>'covers')::int; exception when others then raise exception 'Nombre de couverts invalide.'; end;
  if v_cov is null or v_cov < 1 or v_cov > 60 then raise exception 'Nombre de couverts invalide.'; end if;

  -- Coordonnées
  if length(trim(coalesce(p_data->>'lastName',''))) < 1 or length(p_data->>'lastName') > 80 then raise exception 'Nom obligatoire.'; end if;
  if length(coalesce(p_data->>'firstName','')) > 80 then raise exception 'Prénom trop long.'; end if;
  if length(v_phone) < 8 or length(v_phone) > 16 then raise exception 'Numéro de téléphone invalide.'; end if;
  if v_email <> '' and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Adresse e-mail invalide.'; end if;
  if length(coalesce(p_data->>'note','')) > 500 then raise exception 'Message trop long (500 caractères max).'; end if;

  -- Service : midi, soir ou événement actif pour ce restaurant
  if v_svc like 'evt:%' then
    select data into v_ev from public.events where id = substr(v_svc, 5);
    if v_ev is null or coalesce((v_ev->>'active')::boolean,true) = false
       or not (v_ev->>'scope' = 'all' or (v_ev->'sites') ? v_site) then
      raise exception 'Événement indisponible.';
    end if;
  elsif v_svc not in ('midi','soir') then
    raise exception 'Service invalide.';
  end if;

  -- Verrou par créneau pour éviter le surbooking simultané
  perform pg_advisory_xact_lock(hashtext(v_site || '|' || v_date || '|' || v_svc));

  -- Capacité (même règle que la page : ajustement du jour > événement > service > restaurant > 50)
  v_cap := coalesce(
    (select (data->'overrides'->>(v_date || '|' || v_svc))::int from public.caps where id = v_site),
    case when v_ev is not null then (v_ev->>'capacity')::int end,
    nullif(v_site_cfg->v_svc->>'capacity','')::int,
    nullif(v_site_cfg->>'capacity','')::int,
    50);
  select coalesce(sum((data->>'covers')::int),0) into v_used
    from public.reservations
   where site_id = v_site and date = v_date and data->>'service' = v_svc
     and coalesce(data->>'status','') <> 'annulee';
  if v_used + v_cov > v_cap then raise exception 'Plus assez de places sur ce service.'; end if;

  -- Anti-abus : doublon et rafale depuis un même numéro
  if exists (select 1 from public.reservations
             where site_id = v_site and date = v_date and data->>'service' = v_svc
               and regexp_replace(coalesce(data->>'phone',''), '[^0-9+]', '', 'g') = v_phone
               and coalesce(data->>'status','') <> 'annulee') then
    raise exception 'Une réservation existe déjà à ce numéro pour ce service. Contactez le restaurant pour la modifier.';
  end if;
  if (select count(*) from public.reservations
       where created_at > now() - interval '1 hour'
         and regexp_replace(coalesce(data->>'phone',''), '[^0-9+]', '', 'g') = v_phone) >= 5 then
    raise exception 'Trop de réservations récentes avec ce numéro.';
  end if;

  -- Seuls les champs attendus sont enregistrés ; statut et source imposés
  v_row := jsonb_build_object(
    'ref', p_id, 'siteId', v_site, 'date', v_date, 'service', v_svc, 'time', v_time, 'covers', v_cov,
    'firstName', trim(coalesce(p_data->>'firstName','')), 'lastName', trim(p_data->>'lastName'),
    'email', v_email, 'phone', trim(p_data->>'phone'), 'note', trim(coalesce(p_data->>'note','')),
    'status', 'confirmee', 'source', 'web', 'createdAt', to_char(now() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"'));
  if v_ev is not null then v_row := v_row || jsonb_build_object('eventTitle', v_ev->>'title'); end if;

  insert into public.reservations (id, data) values (p_id, v_row);
end $$;

revoke all on function public.create_reservation(text, jsonb) from public;
grant execute on function public.create_reservation(text, jsonb) to anon, authenticated;
revoke all on function public.availability(text, text) from public;
grant execute on function public.availability(text, text) to anon, authenticated;

-- ---------- Création de compte : uniquement @saladandco.fr ET ajouté par le siège ----------
create or replace function public.check_staff_signup() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if lower(coalesce(new.email,'')) !~ '@saladandco\.fr$'
     or not exists (select 1 from public.staff where id = lower(new.email)) then
    raise exception 'Adresse non autorisée';
  end if;
  return new;
end $$;

drop trigger if exists check_staff_signup on auth.users;
create trigger check_staff_signup before insert on auth.users
  for each row execute function public.check_staff_signup();

-- ---------- Temps réel (mise à jour instantanée du back-office) ----------
do $$
declare t text;
begin
  foreach t in array array['sites','restaurants','caps','events','staff','reservations'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- ---------- Restaurants de départ (modifiables ensuite dans le back-office) ----------
insert into public.restaurants (id, data) values
 ('heron',           '{"name":"Héron","city":"Villeneuve-d''Ascq","addr":"Centre commercial Héron Parc, avenue de l''Avenir","cp":"59650","lat":50.61547,"lon":3.12533,"fmt":"Centre commercial","closed":false}'),
 ('la-valette',      '{"name":"La Valette du Var","city":"La Valette-du-Var","addr":"138 avenue de l''Université","cp":"83160","lat":43.13841,"lon":6.01597,"fmt":"Zone commerciale","closed":false}'),
 ('le-pontet',       '{"name":"Le Pontet","city":"Le Pontet","addr":"Les Terrasses des Saveurs, 641 av. de Saint-Tronquet","cp":"84130","lat":43.98337,"lon":4.87444,"fmt":"Centre commercial","closed":false}'),
 ('lille-nationale', '{"name":"Lille Nationale","city":"Lille","addr":"7 rue Nationale","cp":"59800","lat":50.63684,"lon":3.06255,"fmt":"Centre-ville","closed":false}'),
 ('lomme',           '{"name":"Lomme","city":"Lomme","addr":"ZA du Grand But, 14 ter rue du Château d''Isenghien","cp":"59160","lat":50.65371,"lon":2.98535,"fmt":"Zone commerciale","closed":false}'),
 ('merignac',        '{"name":"Mérignac","city":"Mérignac","addr":"37 avenue John Fitzgerald Kennedy","cp":"33700","lat":44.83418,"lon":-0.66712,"fmt":"Zone commerciale","closed":false}'),
 ('mondeville',      '{"name":"Mondeville","city":"Mondeville","addr":"Rue Aristide Boucicaut","cp":"14120","lat":49.16360,"lon":-0.29939,"fmt":"Zone commerciale","closed":false}'),
 ('neuville',        '{"name":"Neuville en Ferrain","city":"Neuville-en-Ferrain","addr":"Promenade de Flandre, 126 route du Petit Menin","cp":"59960","lat":50.74221,"lon":3.14192,"fmt":"Centre commercial","closed":false}'),
 ('noyelles',        '{"name":"Noyelles Godault","city":"Noyelles-Godault","addr":"ZA des Bords de l''Eau, rue de Beaumont","cp":"62950","lat":50.40667,"lon":2.98000,"fmt":"Zone commerciale","closed":false}'),
 ('villenave',       '{"name":"Villenave d''Ornon","city":"Villenave-d''Ornon","addr":"1 rue Louis de Funès","cp":"33140","lat":44.78938,"lon":-0.53053,"fmt":"Zone commerciale","closed":false}')
on conflict (id) do nothing;
