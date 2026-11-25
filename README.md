# Salad&Co – Réservation en ligne (Supabase + GitHub Pages)

Même application que l'artefact claude.ai (page client + back-office), désormais autonome :

- **Page client** : `https://reservation.saladandco.fr/` (à mettre sur saladandco.fr)
- **Back-office** : `https://reservation.saladandco.fr/#admin` (équipes uniquement)
- **Base de données et connexion** : Supabase
- **Hébergement** : GitHub Pages (gratuit, HTTPS automatique)

## Sécurité en bref

| Qui | Ce qu'il peut faire |
|---|---|
| Client (sans compte) | Voir restaurants, horaires, places restantes (jamais les noms/téléphones des autres), réserver. La réservation est revérifiée par le serveur : restaurant ouvert, date, capacité restante, doublon au même numéro, champs valides. |
| Directeur / adjoint | Se connecter avec son adresse @saladandco.fr (code reçu par mail). Voir et gérer **uniquement** les réservations de son restaurant, ajuster la capacité du jour. |
| Siège (Opérationnel / Marketing) | Tout : statistiques, événements, restaurants, paramétrage, liens Google, **gestion des accès**. |
| Toute autre personne | Ne peut pas créer de compte. Une adresse @saladandco.fr non ajoutée par le siège est refusée aussi. |

Ces règles sont appliquées **dans la base** (Row Level Security), pas seulement dans la page.

---

## 1. Supabase (≈ 15 min)

1. Créez un projet sur supabase.com. **Région : Europe (Paris – eu-west-3)** pour rester dans l'UE (RGPD).
2. **SQL Editor** → collez tout `supabase/01_schema.sql` → *Run*.
3. Ouvrez `supabase/02_premier_admin.sql`, remplacez `prenom.nom@saladandco.fr` par **votre** adresse, → *Run*. Vous êtes le premier profil Siège.
4. **Authentication → Emails → SMTP Settings** : branchez votre messagerie (Microsoft 365, Google Workspace, Brevo…). **Obligatoire** : sans SMTP personnalisé, Supabase n'envoie les codes qu'aux membres de l'équipe Supabase, avec un quota très faible.
5. **Authentication → Emails → Templates** : dans **Magic Link** *et* **Confirm signup**, mettez le code dans le message, par exemple :
   ```
   <h2>Votre code de connexion Salad&Co</h2>
   <p>Saisissez ce code dans le back-office : <b>{{ .Token }}</b></p>
   <p>Il expire dans quelques minutes. Si vous n'avez rien demandé, ignorez ce message.</p>
   ```
6. **Authentication → URL Configuration** : *Site URL* = `https://reservation.saladandco.fr`.
7. **Project Settings → API** : copiez *Project URL* et la clé **anon / public** dans `config.js`.
   ⚠️ Ne mettez jamais la clé `service_role` dans le site.

## 2. GitHub (≈ 10 min)

1. Créez un dépôt (ex. `reservation`) et déposez **tous** les fichiers de ce dossier à la racine (glisser-déposer dans *Add file → Upload files*).
2. **Settings → Pages** : *Source* = *Deploy from a branch*, branche `main`, dossier `/ (root)`.
3. *Custom domain* : `reservation.saladandco.fr` (déjà dans le fichier `CNAME`), puis cochez **Enforce HTTPS** dès que possible.
4. Chez votre hébergeur DNS de saladandco.fr : ajoutez un enregistrement **CNAME** `reservation` → `VOTRE-COMPTE.github.io`.

Le dépôt peut être public : il ne contient aucun secret (la clé anon est publique par conception). Sur un compte GitHub gratuit, Pages exige un dépôt public. Si vous voulez un dépôt privé : GitHub Pro, ou branchez le dépôt sur Netlify / Cloudflare Pages (le fichier `_headers` y ajoute des en-têtes de sécurité).

Autre sous-domaine ? Modifiez `CNAME`, `BASE_URL` dans `config.js` et la *Site URL* Supabase.

## 3. Sur saladandco.fr

Bouton « Réserver une table » :
```html
<a href="https://reservation.saladandco.fr/" target="_blank" rel="noopener">Réserver une table</a>
```
Lien direct vers un restaurant : `https://reservation.saladandco.fr/#resto-lomme` (liste complète dans l'onglet *Liens Google*).

Intégration dans la page (iframe) :
```html
<iframe src="https://reservation.saladandco.fr/" title="Réserver chez Salad&Co"
        style="width:100%;min-height:900px;border:0" loading="lazy"></iframe>
```
Ne mettez **jamais** le lien `#admin` sur le site public.

## 4. Donner les accès

1. Allez sur `https://reservation.saladandco.fr/#admin`, saisissez votre adresse, entrez le code reçu.
2. Onglet **Accès** : choisissez l'affectation (Siège ou un restaurant) et la fonction, tapez `prenom.nom` (le domaine est ajouté) et cliquez sur la proposition.
3. Envoyez à la personne l'adresse du back-office. Elle se connecte avec son code.
4. **Retirer** coupe l'accès immédiatement (le compte ne voit plus rien). Pour supprimer aussi le compte : `supabase/03_retirer_un_acces.sql`.

Seul le Siège peut donner des accès, et uniquement à des adresses @saladandco.fr (contrôlé par la base).

## 5. Check-list du test grandeur nature

- [ ] Réserver depuis un téléphone en navigation privée → la résa apparaît en direct dans le back-office du bon restaurant.
- [ ] Un directeur ne voit que son restaurant ; il ne voit pas les onglets Siège.
- [ ] Une adresse gmail.com ou une adresse @saladandco.fr non ajoutée ne reçoit pas de code.
- [ ] Remplir un service jusqu'à la capacité → plus de créneau proposé ; une 2ᵉ résa au même numéro sur le même service est refusée.
- [ ] Pointage arrivée / no-show / annulation, résa téléphone, export PDF.
- [ ] Retirer un accès → la personne voit « Accès réservé » au rechargement.

## Différences avec la version claude.ai

- **Connexion** : code par e-mail au lieu du partage claude.ai.
- **Envoi de la liste par mail** : le PDF est partagé (mobile) ou téléchargé et la messagerie s'ouvre avec le mail prêt (le connecteur Gmail n'existe qu'à l'intérieur de claude.ai).
- **Données** : la base claude.ai ne contenait qu'un événement de test (« ev-test-brunch ») ; rien n'est repris. Les 10 restaurants sont créés par le script SQL, les horaires par défaut sont ceux de la page.
- Les horaires et jours d'ouverture sont contrôlés par la page ; la capacité, les doublons, la date et le restaurant sont en plus contrôlés par le serveur.

## RGPD (à prévoir avant l'ouverture au public)

La page collecte nom, téléphone, e-mail : ajoutez une mention d'information (finalité, durée de conservation, contact) sur saladandco.fr et prévoyez une purge régulière des anciennes réservations (ex. au-delà de 12 mois).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html`, `app.js` | L'application (page client + back-office) |
| `supabase-adapter.js` | Liaison avec Supabase (base, temps réel, connexion) |
| `config.js` | **À remplir** : URL et clé anon Supabase, adresse publique |
| `vendor/` | Bibliothèque Supabase (2.45.4) embarquée, aucun script externe |
| `jspdf*.js`, `geo.json`, `hero.jpg` | PDF, recherche par ville, visuel |
| `logo.png`, `logo-blanc.png` | Logo officiel (fond clair / fond noir) |
| `fonts/` | Polices Barlow, Barlow Condensed, Zilla Slab hébergées avec le site (licence OFL, aucun appel à Google) |
| `supabase/*.sql` | Base, sécurité, premier admin, retrait d'accès |
| `CNAME`, `.nojekyll`, `_headers` | Hébergement |
