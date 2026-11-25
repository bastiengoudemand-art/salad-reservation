/* Configuration à renseigner (Supabase → Project Settings → API).
   La clé "anon" est publique par conception : la sécurité repose sur les règles RLS de schema.sql.
   Ne mettez JAMAIS ici la clé "service_role". */
window.SC_CONFIG = {
  SUPABASE_URL: "https://hwtnvesqbuniyafdxiir.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dG52ZXNxYnVuaXlhZmR4aWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1NjczMDgsImV4cCI6MjExMTE0MzMwOH0.QaA4y-RGw6BwH4gJjq9YRNKXpjZ0RlPwg-90g6OY1mY",
  // Adresse publique de la page (sert aux liens Google et à l'adresse du back-office)
  BASE_URL: "https://reservation.saladandco.fr/",
  // Seules les adresses de ce domaine peuvent accéder au back-office
  STAFF_DOMAIN: "saladandco.fr"
};
