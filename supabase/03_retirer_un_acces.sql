-- Retrait d'urgence d'un accès (équivalent du bouton « Retirer » de l'onglet Accès).
-- Supprime l'affectation ET le compte de connexion de la personne.
delete from public.staff where id = 'prenom.nom@saladandco.fr';
delete from auth.users  where lower(email) = 'prenom.nom@saladandco.fr';
