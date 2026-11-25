/* =====================================================================
   Salad&Co – Adaptateur Supabase
   Remplace le runtime claude.ai (claude.use("db"), claude.use("user"))
   par Supabase, sans changer la logique de l'application.
   - Base : tables Supabase (id + data jsonb), protégées par RLS.
   - Clients (non connectés) : lecture de la config publique, disponibilités
     sans données personnelles, création de réservation via une fonction
     contrôlée côté serveur.
   - Équipes : connexion par code reçu par e-mail, réservée aux adresses
     @saladandco.fr inscrites dans la table "staff".
   ===================================================================== */
(function () {
  "use strict";
  const CFG = window.SC_CONFIG || {};
  const DOMAIN = (CFG.STAFF_DOMAIN || "saladandco.fr").toLowerCase();
  if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY || /VOTRE/.test(CFG.SUPABASE_URL)) {
    console.error("config.js : renseignez SUPABASE_URL et SUPABASE_ANON_KEY.");
  }
  const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });

  let session = null;

  /* ---------- utilitaires ---------- */
  function wrapErr(e) {
    const err = new Error((e && (e.message || e.details)) || "Erreur");
    err.code = (e && (e.code || e.status)) || "error";
    return err;
  }
  function snap(rows) {
    return { docs: rows.map(r => ({ id: r.id, data: () => r.data || {} })) };
  }
  // Colonnes dédiées (indexées, utilisées par la sécurité) pour les réservations
  const COLS = { reservations: { siteId: "site_id", date: "date" } };
  function colFor(table, field) {
    return (COLS[table] && COLS[table][field]) || ("data->>" + field);
  }
  const OPS = { "==": "eq", ">=": "gte", "<=": "lte", ">": "gt", "<": "lt", "!=": "neq" };

  /* ---------- requêtes façon "collection" ---------- */
  class Query {
    constructor(table, filters, lim) { this.table = table; this.filters = filters || []; this.lim = lim || null; }
    where(f, op, v) { return new Query(this.table, [...this.filters, [f, op, v]], this.lim); }
    limit(n) { return new Query(this.table, this.filters, n); }
    doc(id) { return new DocRef(this.table, id); }

    // Visiteur non connecté sur les réservations : disponibilités seulement
    // (ou personne connectée mais sur la page client : même vue que le public)
    isPublicResaQuery() {
      const clientView = typeof S !== "undefined" && S.view === "client";
      return this.table === "reservations" && (!session || clientView);
    }

    async get() {
      if (this.isPublicResaQuery()) {
        const f = Object.fromEntries(this.filters.map(([k, , v]) => [k, v]));
        if (!f.siteId || !f.date) return snap([]);
        const { data, error } = await sb.rpc("availability", { p_site: f.siteId, p_date: f.date });
        if (error) throw wrapErr(error);
        return snap((data || []).map((r, i) => ({ id: "a" + i, data: r })));
      }
      let q = sb.from(this.table).select("id,data");
      for (const [f, op, v] of this.filters) {
        const m = OPS[op]; if (!m) throw new Error("Opérateur non géré : " + op);
        q = q[m](colFor(this.table, f), v);
      }
      q = q.limit(this.lim || 5000);
      const { data, error } = await q;
      if (error) throw wrapErr(error);
      return snap(data || []);
    }

    onSnapshot(cb, onErr) {
      let alive = true, timer = null, channel = null, poll = null;
      const run = async () => {
        if (!alive) return;
        try { const s = await this.get(); if (alive) cb(s); }
        catch (e) { if (onErr) onErr(e); }
      };
      const soon = () => { clearTimeout(timer); timer = setTimeout(run, 250); };
      run();
      if (this.isPublicResaQuery()) {
        poll = setInterval(run, 20000);           // disponibilités : rafraîchies toutes les 20 s
      } else {
        channel = sb.channel("rt-" + this.table + "-" + Math.random().toString(36).slice(2))
          .on("postgres_changes", { event: "*", schema: "public", table: this.table }, soon)
          .subscribe();
        poll = setInterval(run, 120000);          // filet de sécurité
      }
      const vis = () => { if (document.visibilityState === "visible") soon(); };
      document.addEventListener("visibilitychange", vis);
      return () => {
        alive = false; clearTimeout(timer); clearInterval(poll);
        document.removeEventListener("visibilitychange", vis);
        if (channel) sb.removeChannel(channel);
      };
    }
  }

  class DocRef {
    constructor(table, id) { this.table = table; this.id = id; }
    async set(data) {
      // Réservation client (site public) : passe par la fonction serveur contrôlée
      if (this.table === "reservations" && (!session || data.source === "web")) {
        const { error } = await sb.rpc("create_reservation", { p_id: this.id, p_data: data });
        if (error) throw wrapErr(error);
        return;
      }
      const { error } = await sb.from(this.table).upsert({ id: this.id, data });
      if (error) throw wrapErr(error);
    }
    async update(patch) {
      const { data: row, error: e1 } = await sb.from(this.table).select("data").eq("id", this.id).single();
      if (e1) throw wrapErr(e1);
      const { error } = await sb.from(this.table).update({ data: { ...(row.data || {}), ...patch } }).eq("id", this.id);
      if (error) throw wrapErr(error);
    }
    async delete() {
      const { error } = await sb.from(this.table).delete().eq("id", this.id);
      if (error) throw wrapErr(error);
    }
  }

  const db = {
    collection: name => new Query(name),
    doc: path => { const [t, ...rest] = path.split("/"); return new DocRef(t, rest.join("/")); }
  };

  /* ---------- utilisateur connecté ---------- */
  function niceName(email) {
    const local = String(email || "").split("@")[0];
    return local.split(/[._-]+/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(" ") || email;
  }
  function normEmail(q) {
    q = String(q || "").trim().toLowerCase();
    if (!q) return "";
    if (!q.includes("@")) q += "@" + DOMAIN;
    return q;
  }
  const emailRe = new RegExp("^[a-z0-9._%+-]+@" + DOMAIN.replace(/\./g, "\\.") + "$");

  function makeUser() {
    const email = session.user.email.toLowerCase();
    return {
      id: async () => email,
      email,
      // "Éditeur" = profil Siège
      canEdit: async () => {
        const { data } = await sb.from("staff").select("data").eq("id", email).maybeSingle();
        return !!(data && /^siege/.test((data.data || {}).role || ""));
      },
      profiles: async ids => Object.fromEntries(ids.map(id => [id, { name: niceName(id) + " — " + id }])),
      // Recherche : on saisit l'adresse (ou prenom.nom) ; seules les adresses @saladandco.fr sont proposées
      search: async q => {
        const e = normEmail(q);
        return emailRe.test(e) ? [{ id: e, name: niceName(e), email: e }] : [];
      }
    };
  }

  /* ---------- connexion par code e-mail ---------- */
  const auth = {
    domain: DOMAIN,
    normEmail,
    isAllowed: e => emailRe.test(normEmail(e)),
    get session() { return session; },
    async sendCode(email) {
      email = normEmail(email);
      if (!emailRe.test(email)) throw new Error("Seules les adresses @" + DOMAIN + " peuvent se connecter.");
      const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
      if (error) {
        if (/not allowed|accès|database error/i.test(error.message))
          throw new Error("Cette adresse n'a pas encore d'accès. Demandez au siège de vous ajouter.");
        throw wrapErr(error);
      }
      return email;
    },
    async verifyCode(email, code) {
      const { error } = await sb.auth.verifyOtp({ email: normEmail(email), token: String(code).trim(), type: "email" });
      if (error) throw new Error("Code invalide ou expiré.");
    },
    async signOut() { await sb.auth.signOut(); location.reload(); }
  };

  /* ---------- point d'entrée compatible avec l'app ---------- */
  const ready = sb.auth.getSession().then(({ data }) => { session = data.session; });
  sb.auth.onAuthStateChange((_evt, s) => { session = s; });

  window.SC_AUTH = auth;
  window.SC_SB = sb;
  window.claude = {
    use: async name => {
      await ready;
      if (name === "db") return db;
      if (name === "user") return session ? makeUser() : null;
      return null; // "mcp" (Gmail) n'existe pas hors claude.ai
    }
  };
})();
