-- =====================================================================
-- Premier accès Siège : à exécuter UNE FOIS après 01_schema.sql,
-- en remplaçant l'adresse par la vôtre (en minuscules).
-- Ensuite, tous les autres accès se donnent depuis le back-office (onglet « Accès »).
-- =====================================================================
insert into public.staff (id, data)
values ('prenom.nom@saladandco.fr', '{"role":"siege-ops","siteId":"siege"}')
on conflict (id) do update set data = excluded.data;
