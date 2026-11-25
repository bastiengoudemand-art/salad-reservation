/* ====================== Configuration par défaut (CDC 01/07/2024) ====================== */
const BASE_URL = (window.SC_CONFIG&&window.SC_CONFIG.BASE_URL)||(location.origin+location.pathname); // URL publique (config.js)
const DEFAULT_SITES = [
  ["heron","Héron"],["la-valette","La Valette du Var"],["le-pontet","Le Pontet"],
  ["lille-nationale","Lille Nationale"],["lomme","Lomme"],["merignac","Mérignac"],
  ["mondeville","Mondeville"],["neuville","Neuville en Ferrain"],["noyelles","Noyelles Godault"],
  ["villenave","Villenave d'Ornon"]
];
/* Coordonnées approximatives à valider */
const DEFAULT_SITE_INFO = { // adresses et positions : fiches Google Maps (23/11/2026)
  "heron":{city:"Villeneuve-d'Ascq",addr:"Centre commercial Héron Parc, avenue de l'Avenir",cp:"59650",lat:50.61547,lon:3.12533,fmt:"Centre commercial"},
  "la-valette":{city:"La Valette-du-Var",addr:"138 avenue de l'Université",cp:"83160",lat:43.13841,lon:6.01597,fmt:"Zone commerciale"},
  "le-pontet":{city:"Le Pontet",addr:"Les Terrasses des Saveurs, 641 av. de Saint-Tronquet",cp:"84130",lat:43.98337,lon:4.87444,fmt:"Centre commercial"},
  "lille-nationale":{city:"Lille",addr:"7 rue Nationale",cp:"59800",lat:50.63684,lon:3.06255,fmt:"Centre-ville"},
  "lomme":{city:"Lomme",addr:"ZA du Grand But, 14 ter rue du Château d'Isenghien",cp:"59160",lat:50.65371,lon:2.98535,fmt:"Zone commerciale"},
  "merignac":{city:"Mérignac",addr:"37 avenue John Fitzgerald Kennedy",cp:"33700",lat:44.83418,lon:-0.66712,fmt:"Zone commerciale"},
  "mondeville":{city:"Mondeville",addr:"Rue Aristide Boucicaut",cp:"14120",lat:49.16360,lon:-0.29939,fmt:"Zone commerciale"},
  "neuville":{city:"Neuville-en-Ferrain",addr:"Promenade de Flandre, 126 route du Petit Menin",cp:"59960",lat:50.74221,lon:3.14192,fmt:"Centre commercial"},
  "noyelles":{city:"Noyelles-Godault",addr:"ZA des Bords de l'Eau, rue de Beaumont",cp:"62950",lat:50.40667,lon:2.98000,fmt:"Zone commerciale"},
  "villenave":{city:"Villenave-d'Ornon",addr:"1 rue Louis de Funès",cp:"33140",lat:44.78938,lon:-0.53053,fmt:"Zone commerciale"}
};
/* Réglages par défaut propres à chaque site, déduits des horaires Google (23/11/2026).
   days["0"] = dimanche … days["6"] = samedi : surcharge des horaires de service ce jour-là. */
const SUN12={"0":{midi:{start:"12:00"}}};
const DEFAULT_SITE_CFG = {
  "heron":{days:SUN12},
  "la-valette":{days:SUN12},
  "le-pontet":{days:SUN12},
  "lille-nationale":{midi:{start:"11:00"},openDays:[1,2,3,4,5,6]},
  "merignac":{days:SUN12},
  "mondeville":{days:SUN12},
  "neuville":{midi:{start:"11:00"},soir:{start:"18:00"}},
  "noyelles":{days:SUN12},
  "villenave":{days:SUN12}
};
/* Liste vivante des restaurants : collection "restaurants" (siège), sinon liste par défaut */
const SITES=[];            // restaurants ouverts : [id, nom]
const ALL_SITES=[];        // y compris fermés (stats, historique)
const SITE_INFO={};
const RESTOS={};           // docs de la collection restaurants
function rebuildSites(){
  const src=Object.keys(RESTOS).length?Object.entries(RESTOS).map(([id,r])=>({id,...r}))
    :DEFAULT_SITES.map(([id,name])=>({id,name,...DEFAULT_SITE_INFO[id]}));
  src.sort((a,b)=>a.name.localeCompare(b.name,"fr"));
  SITES.length=0;ALL_SITES.length=0;Object.keys(SITE_INFO).forEach(k=>delete SITE_INFO[k]);
  src.forEach(r=>{ALL_SITES.push([r.id,r.name,!!r.closed]);if(!r.closed)SITES.push([r.id,r.name]);
    SITE_INFO[r.id]={city:r.city||"",addr:r.addr||"",cp:r.cp||"",lat:+r.lat||0,lon:+r.lon||0,fmt:r.fmt||"",closed:!!r.closed}});
}
/* Grandes villes (précision commune) ; sinon centre du département */
const CITY_COORDS = {"lille":[50.633,3.058],"roubaix":[50.690,3.181],"tourcoing":[50.724,3.161],"villeneuve d ascq":[50.623,3.145],"lomme":[50.644,2.987],"lambersart":[50.650,3.025],"marcq en baroeul":[50.672,3.096],"wattrelos":[50.701,3.215],"armentieres":[50.687,2.880],"seclin":[50.548,3.030],"lens":[50.432,2.833],"lievin":[50.423,2.778],"henin beaumont":[50.421,2.951],"douai":[50.370,3.080],"arras":[50.291,2.777],"bethune":[50.530,2.640],"valenciennes":[50.358,3.524],"cambrai":[50.176,3.235],"maubeuge":[50.278,3.973],"dunkerque":[51.034,2.377],"hazebrouck":[50.724,2.538],"saint omer":[50.750,2.252],"calais":[50.951,1.858],"boulogne sur mer":[50.726,1.614],"amiens":[49.894,2.296],"paris":[48.857,2.352],"bordeaux":[44.838,-0.579],"pessac":[44.806,-0.631],"talence":[44.808,-0.589],"begles":[44.808,-0.548],"libourne":[44.915,-0.243],"arcachon":[44.658,-1.168],"toulon":[43.124,5.928],"hyeres":[43.120,6.130],"la seyne sur mer":[43.101,5.878],"frejus":[43.433,6.737],"marseille":[43.296,5.370],"aix en provence":[43.529,5.447],"avignon":[43.949,4.806],"orange":[44.138,4.807],"carpentras":[44.055,5.048],"cavaillon":[43.837,5.038],"arles":[43.677,4.631],"nimes":[43.837,4.360],"caen":[49.183,-0.371],"bayeux":[49.276,-0.703],"lisieux":[49.146,0.226],"le havre":[49.494,0.107],"rouen":[49.443,1.100],"lyon":[45.764,4.836]};
let GEO=null; // chargé depuis geo.json
const EVENTS={}; let memEvents=false;
const CAPS={};   // ajustements de capacité du jour : caps/<siteId> {overrides:{"date|service":n}}
const STAFF={};  // rattachements : staff/<userId> {siteId}
let myId=null, demoRole="siege"; // événements (collection "events")
const DEFAULT_CFG = {
  active:true,
  midi:{on:true,start:"11:30",end:"13:00",cutoff:"10:30"},
  soir:{on:true,start:"18:30",end:"20:00",cutoff:"17:30"},
  minCovers:5, capacity:50, stepMin:15, maxAdvanceDays:60,
  openDays:[1,2,3,4,5,6,0]
};
const SVC_LABEL = {midi:"Midi",soir:"Soir"};
const DAY_LABEL = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const STATUS_LABEL = {confirmee:"Confirmée",arrivee:"Arrivée",noshow:"No-show",annulee:"Annulée"};

/* ====================== État ====================== */
let db=null, user=null, canEdit=false, dbReady=false;
const siteDocs = {};                 // siteId -> config stockée
let memReservations = [];            // repli sans base
const S = {
  view:"client", siteId:null, step:1, covers:5, date:todayStr(), time:null, service:null,
  q:"", origin:null, hover:null, sugg:[], resas:[], resaUnsub:null, resaKey:null, done:null, error:null, saving:false,
  admin:{tab:"jour", siteId:"lomme", date:todayStr(), editCfg:null, msg:null, stats:{period:"30",site:"all",rows:null}}
};

/* ====================== Utilitaires ====================== */
function pad(n){return String(n).padStart(2,"0")}
function todayStr(d=new Date()){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function addDays(s,n){const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return todayStr(d)}
function toMin(t){const [h,m]=t.split(":").map(Number);return h*60+m}
function fromMin(m){return pad(Math.floor(m/60))+":"+pad(m%60)}
function nowMin(){const d=new Date();return d.getHours()*60+d.getMinutes()}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function siteName(id){const s=ALL_SITES.find(x=>x[0]===id);return s?s[1]:id}
function norm(t){return String(t).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[-']/g," ").replace(/\s+/g," ").trim()}
const KX=Math.cos(46.5*Math.PI/180);
function proj(lat,lon){return [(lon+5.3)*KX*100,(51.2-lat)*100]}
function km(a,b){const R=6371,r=Math.PI/180,dLa=(b.lat-a.lat)*r,dLo=(b.lon-a.lon)*r;const h=Math.sin(dLa/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function deptOf(cp){if(!/^\d{5}$/.test(cp))return null;if(cp.startsWith("20"))return +cp<20200?"2A":"2B";if(cp.startsWith("97"))return null;return cp.slice(0,2)}
function originFor(label,dept,name){
  const n=norm(name||"");
  const site=Object.entries(SITE_INFO).find(([,i])=>norm(i.city)===n);
  if(site) return {label,lat:site[1].lat,lon:site[1].lon,precise:true};
  if(CITY_COORDS[n]) return {label,lat:CITY_COORDS[n][0],lon:CITY_COORDS[n][1],precise:true};
  const d=GEO&&GEO.deps[dept]; if(!d) return null;
  return {label,lat:d[1],lon:d[2],precise:false};
}
function suggestions(q){
  const out=[];const t=q.trim();if(!t)return out;
  if(/^\d{5}$/.test(t)){
    const dep=deptOf(t);const cs=GEO?GEO.communes.filter(c=>c[2]===t):[];
    if(cs.length) cs.slice(0,5).forEach(c=>out.push({label:`${c[0]} (${t})`,dept:c[1],name:c[0]}));
    else if(dep&&GEO&&GEO.deps[dep]) out.push({label:`${t} – ${GEO.deps[dep][0]}`,dept:dep,name:""});
    return out;
  }
  if(/^(\d{2}|2a|2b)$/i.test(t)){const d=t.toUpperCase();if(GEO&&GEO.deps[d])out.push({label:`${d} – ${GEO.deps[d][0]}`,dept:d,name:""});return out}
  const n=norm(t);if(n.length<2)return out;
  SITES.forEach(([id,nm])=>{const i=SITE_INFO[id];if(norm(nm).includes(n)||norm(i.city).includes(n))out.push({label:`${nm} – restaurant Salad&Co`,site:id})});
  if(GEO){const st=GEO.communes.filter(c=>norm(c[0]).startsWith(n));
    st.sort((a,b)=>a[0].length-b[0].length).slice(0,6-out.length).forEach(c=>out.push({label:`${c[0]} (${c[2]})`,dept:c[1],name:c[0]}))}
  return out.slice(0,6);
}
function cfg(id){
  const b=DEFAULT_SITE_CFG[id]||{}, d=siteDocs[id]||{};
  return {...DEFAULT_CFG,...b,...d,
    midi:{...DEFAULT_CFG.midi,...(b.midi||{}),...(d.midi||{})},
    soir:{...DEFAULT_CFG.soir,...(b.soir||{}),...(d.soir||{})},
    days:JSON.parse(JSON.stringify(d.days||b.days||{})),
    openDays:Array.isArray(d.openDays)?d.openDays:Array.isArray(b.openDays)?b.openDays:DEFAULT_CFG.openDays};
}
/* horaires d'un service pour une date donnée (surcharge du jour si elle existe) */
function svcHours(siteId,date,service){const c=cfg(siteId);const o=((c.days||{})[String(dowOf(date))]||{})[service]||{};return {...c[service],...o}}
function fmtDate(s){return new Date(s+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}
function newRef(){const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let r="SC-";for(let i=0;i<6;i++)r+=c[Math.floor(Math.random()*c.length)];return r}
function activeCovers(list,service){return list.filter(r=>r.service===service&&r.status!=="annulee").reduce((a,r)=>a+(+r.covers||0),0)}

/* ---------- Événements ---------- */
const WEEKDAYS=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
function dowOf(date){return new Date(date+"T12:00:00").getDay()}
function eventOccurs(ev,date){
  if(ev.recur==="weekly") return dowOf(date)===+ev.weekday && date>=(ev.from||"0000") && (!ev.to||date<=ev.to);
  return ev.date===date;
}
function eventAppliesTo(ev,siteId){return ev.scope==="all"||(ev.sites||[]).includes(siteId)}
function eventsFor(siteId,date){return Object.values(EVENTS).filter(ev=>ev.active!==false&&eventAppliesTo(ev,siteId)&&eventOccurs(ev,date)).sort((a,b)=>a.start.localeCompare(b.start))}
function svcKeys(siteId,date,resas){
  const k=["midi","soir",...eventsFor(siteId,date).map(e=>"evt:"+e.id)];
  (resas||[]).forEach(r=>{if(!k.includes(r.service))k.push(r.service)});
  return k;
}
function evOf(key){return key&&key.startsWith("evt:")?EVENTS[key.slice(4)]:null}
function svcLabel(key,resas){if(SVC_LABEL[key])return SVC_LABEL[key];const ev=evOf(key);if(ev)return ev.title;const r=(resas||[]).find(x=>x.service===key);return (r&&r.eventTitle)||"Événement"}
function capOverride(siteId,key,date){const o=(CAPS[siteId]||{}).overrides||{};const v=o[date+"|"+key];return v==null?null:+v}
function svcCap(siteId,key,date){const ov=date?capOverride(siteId,key,date):null;if(ov!=null)return ov;const ev=evOf(key);if(ev)return +ev.capacity;const c=cfg(siteId);return +((c[key]&&c[key].capacity)||c.capacity)}
function minCoversFor(siteId,date){const c=cfg(siteId);return Math.min(c.minCovers,...eventsFor(siteId,date).map(e=>+e.minCovers||2))}
function upcomingEvents(siteId,n=4){
  const out=[],c=cfg(siteId),t=todayStr();
  for(let i=0;i<=c.maxAdvanceDays&&out.length<n;i++){const d=addDays(t,i);eventsFor(siteId,d).forEach(ev=>{if(out.length<n)out.push({ev,date:d})})}
  return out;
}
function nextFeatured(){
  const t=todayStr();let best=null;
  for(let i=0;i<=60&&!best;i++){const d=addDays(t,i);
    const evs=Object.values(EVENTS).filter(ev=>ev.active!==false&&eventOccurs(ev,d)&&SITES.some(([id])=>eventAppliesTo(ev,id)&&cfg(id).active&&!(d===t&&ev.cutoff&&nowMin()>toMin(ev.cutoff))));
    const f=evs.find(e=>e.featured)||null;
    if(f)best={ev:f,date:d};
  }
  if(best)return best;
  for(let i=0;i<=60;i++){const d=addDays(t,i);const ev=Object.values(EVENTS).find(e=>e.active!==false&&eventOccurs(e,d)&&!(d===t&&e.cutoff&&nowMin()>toMin(e.cutoff)));if(ev)return {ev,date:d}}
  return null;
}
function evSites(ev){return SITES.filter(([id])=>eventAppliesTo(ev,id)&&cfg(id).active).map(([id])=>id)}
function renderFeatured(){
  const nf=nextFeatured();if(!nf)return "";
  const {ev,date}=nf;const sites=evSites(ev);
  const where=ev.scope==="all"?"Dans tous nos restaurants":sites.map(siteName).join(", ");
  const go=sites.length===1?`<button class="btn" data-evgo="${ev.id}|${date}|${sites[0]}">Réserver à ${esc(siteName(sites[0]))}</button>`:`<button class="btn" data-evgo="${ev.id}|${date}|">Choisir mon restaurant</button>`;
  const d=new Date(date+"T12:00:00");
  return `<div class="feat"><div class="feat-date"><span>${d.toLocaleDateString("fr-FR",{weekday:"short"})}</span><b>${d.getDate()}</b><span>${d.toLocaleDateString("fr-FR",{month:"short"})}</span></div>
    <div class="feat-txt"><div class="feat-tag">★ Prochain événement</div><h2>${esc(ev.title)}</h2>
    <p>${esc(fmtDate(date))} · ${ev.start.replace(":","h")}–${ev.end.replace(":","h")}${ev.recur==="weekly"?` · chaque ${WEEKDAYS[+ev.weekday]}`:""}<br><span class="muted">${esc(where)}${ev.description?" — "+esc(ev.description):""}</span></p></div>
    <div class="feat-cta">${go}<small>Dès ${+ev.minCovers||2} personnes</small></div></div>`;
}
function evWhen(ev){
  if(ev.recur==="weekly") return `Chaque ${WEEKDAYS[+ev.weekday]}${ev.from?` du ${fmtShort(ev.from)}`:""}${ev.to?` au ${fmtShort(ev.to)}`:""}`;
  return ev.date?fmtDate(ev.date):"—";
}
function fmtShort(s){return new Date(s+"T12:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}

/* Règles CDC : créneaux 15 min, cutoff jour J, capacité, jours d'ouverture, horizon */
function serviceState(siteId,date,service,resas,covers){
  const ev=evOf(service);
  if(service.startsWith("evt:")) return eventState(siteId,date,service,ev,resas,covers);
  const c=cfg(siteId), s=svcHours(siteId,date,service);
  if(!c.active) return {open:false,reason:"Réservation en ligne indisponible pour ce restaurant."};
  if(!s.on) return {open:false,reason:"Service non réservable."};
  const dow=new Date(date+"T12:00:00").getDay();
  if(!c.openDays.includes(dow)) return {open:false,reason:"Restaurant non réservable ce jour."};
  const today=todayStr();
  if(date<today) return {open:false,reason:"Date passée."};
  if(date>addDays(today,c.maxAdvanceDays)) return {open:false,reason:"Trop loin dans le futur."};
  const repl=eventsFor(siteId,date).find(e=>e.replaces===service);
  if(repl) return {open:false,reason:`Remplacé ce jour-là par l'événement « ${repl.title} ».`};
  if(date===today && nowMin()>toMin(s.cutoff)) return {open:false,reason:`Réservations closes pour aujourd'hui (jusqu'à ${s.cutoff.replace(":","h")}).`};
  if(covers<c.minCovers) return {open:false,reason:`À partir de ${c.minCovers} personnes.`};
  const used=activeCovers(resas,service), left=svcCap(siteId,service,date)-used;
  if(covers>left) return {open:false,reason:left<=0?"Complet.":`Plus que ${left} places sur ce service.`,left};
  const slots=[];for(let m=toMin(s.start);m<=toMin(s.end);m+=c.stepMin)slots.push(fromMin(m));
  return {open:true,slots,left};
}
function eventState(siteId,date,key,ev,resas,covers){
  const c=cfg(siteId);
  if(!ev||ev.active===false||!eventAppliesTo(ev,siteId)||!eventOccurs(ev,date)) return {open:false,reason:"Événement indisponible."};
  if(!c.active) return {open:false,reason:"Réservation en ligne indisponible pour ce restaurant."};
  const today=todayStr();
  if(date<today) return {open:false,reason:"Date passée."};
  if(date>addDays(today,c.maxAdvanceDays)) return {open:false,reason:"Trop loin dans le futur."};
  if(date===today && ev.cutoff && nowMin()>toMin(ev.cutoff)) return {open:false,reason:`Réservations closes pour aujourd'hui (jusqu'à ${ev.cutoff.replace(":","h")}).`};
  const min=+ev.minCovers||2; if(covers<min) return {open:false,reason:`À partir de ${min} personnes.`};
  const used=activeCovers(resas,key), left=svcCap(siteId,key,date)-used;
  if(covers>left) return {open:false,reason:left<=0?"Complet.":`Plus que ${left} places.`,left};
  const slots=[];for(let m=toMin(ev.start);m<=toMin(ev.end);m+=(+ev.step||15))slots.push(fromMin(m));
  return {open:true,slots,left};
}

/* ====================== Données ====================== */
function subscribeResas(siteId,date){
  const key=siteId+"|"+date;
  if(S.resaKey===key) return;
  if(S.resaUnsub){S.resaUnsub();S.resaUnsub=null}
  S.resaKey=key; S.resas=[];
  if(!db){S.resas=memReservations.filter(r=>r.siteId===siteId&&r.date===date);return}
  S.resaUnsub=db.collection("reservations").where("siteId","==",siteId).where("date","==",date)
    .onSnapshot(snap=>{S.resas=snap.docs.map(d=>({id:d.id,...d.data()}));render()},
      e=>{S.error="Impossible de lire les réservations ("+e.code+")";render()});
}
async function fetchResas(siteId,date){
  if(!db) return memReservations.filter(r=>r.siteId===siteId&&r.date===date);
  const snap=await db.collection("reservations").where("siteId","==",siteId).where("date","==",date).get();
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}
async function saveResa(r){
  if(!db){r.id="m"+Date.now();memReservations.push(r);S.resas=memReservations.filter(x=>x.siteId===r.siteId&&x.date===r.date);return}
  await db.collection("reservations").doc(r.ref).set(r);
}
async function updateResa(id,patch){
  if(!db){const r=memReservations.find(x=>x.id===id);Object.assign(r,patch);S.resas=[...S.resas];render();return}
  await db.doc("reservations/"+id).update(patch);
}

/* ====================== Routage ====================== */
function route(){
  const h=location.hash.replace("#","");
  if(h==="admin"){if(S.view!=="admin")S.resaKey=null;S.view="admin";if(S.admin.siteId)subscribeResas(S.admin.siteId,S.admin.date)}
  else{
    if(S.view!=="client")S.resaKey=null;
    S.view="client";
    const m=h.match(/^resto-(.+)$/);
    if(m&&SITES.some(s=>s[0]===m[1])){ if(S.siteId!==m[1]){S.siteId=m[1];S.step=2;S.time=null;S.done=null;
      if(S.evFocus&&EVENTS[S.evFocus.id]&&eventAppliesTo(EVENTS[S.evFocus.id],m[1])){S.date=S.evFocus.date;S.covers=Math.max(+EVENTS[S.evFocus.id].minCovers||2,Math.min(S.covers,+EVENTS[S.evFocus.id].minCovers||2))}
      else S.covers=Math.max(S.covers,cfg(m[1]).minCovers);
      S.evFocus=null} }
    else if(h==="reserver"||h===""){ /* garde l'état */ }
    if(S.siteId) subscribeResas(S.siteId,S.date);
  }
  render();
}
window.addEventListener("hashchange",route);

/* ====================== Rendu client ====================== */
function renderClient(){
  if(S.done){
    const r=S.done;
    return `<div class="card ok"><div class="big">✓</div><h1>Réservation confirmée</h1>
      <p class="muted">${r.eventTitle?esc(r.eventTitle)+" · ":""}${esc(siteName(r.siteId))} · ${esc(fmtDate(r.date))} à ${r.time.replace(":","h")} · ${r.covers} personnes</p>
      <p>Référence : <span class="ref">${r.ref}</span></p>
      <div class="note" style="text-align:left">Prototype : en production, un mail et un SMS de confirmation partent immédiatement, puis un rappel le jour J. Ces envois ne sont pas branchés ici.</div>
      <button class="btn ghost" data-act="restart">Nouvelle réservation</button></div>`;
  }
  const stepper=`<div class="steps">
    <span class="step ${S.step===1?"on":""}">1. Restaurant</span>
    <span class="step ${S.step===2?"on":""}">2. Date &amp; créneau</span>
    <span class="step ${S.step===3?"on":""}">3. Coordonnées</span></div>`;
  if(S.step===1||!S.siteId){
    return `<div class="hero"><div class="hero-txt"><p class="tag">Libre. Par Nature.</p><h1>Réservez <em>votre table</em></h1><p>50 ingrédients frais et de saison, à composer librement. Réservation pour les groupes à partir de ${DEFAULT_CFG.minCovers} personnes.</p></div></div>${renderFeatured()}${S.evFocus&&EVENTS[S.evFocus.id]?`<div class="note evfocus">★ ${esc(EVENTS[S.evFocus.id].title)} le ${esc(fmtDate(S.evFocus.date))} : choisissez votre restaurant ci-dessous. <a href="#reserver" data-act="evFocusClear">Annuler</a></div>`:""}${stepper}
      <div class="loc">
          <div class="loc-search"><input type="text" id="q" placeholder="Ville, code postal ou département" value="${esc(S.q)}" autocomplete="off" aria-label="Rechercher un restaurant">
            <button class="clr ${S.q||S.origin?"":"hide"}" data-act="clearQ" aria-label="Effacer">×</button>
            <div id="sugg" class="sugg"></div></div>
          <div id="locInfo" class="loc-info"></div>
          <div id="locList" class="loc-list"></div>
        <div class="loc-map card" id="locMap"></div>
      </div>`;
  }
  const c=cfg(S.siteId);
  const head=`<h1>${esc(siteName(S.siteId))}</h1><p class="muted"><a href="#reserver" data-act="change">Changer de restaurant</a></p>${stepper}`;
  if(S.step===2){
    const evDay=eventsFor(S.siteId,S.date);
    const services=["midi","soir",...evDay.map(e=>"evt:"+e.id)].map(svc=>{
      const st=serviceState(S.siteId,S.date,svc,S.resas,S.covers);
      const ev=evOf(svc), src=ev||svcHours(S.siteId,S.date,svc);
      const range=`${src.start.replace(":","h")}–${src.end.replace(":","h")}`;
      const title=ev?`<div class="svc-title evt">★ ${esc(ev.title)} · ${range}</div>${ev.description?`<div class="evt-desc">${esc(ev.description)}</div>`:""}`:`<div class="svc-title">${SVC_LABEL[svc]} · ${range}</div>`;
      if(!st.open) return `${title}<div class="empty">${esc(st.reason)}</div>`;
      return `${title}<div class="slots">${st.slots.map(t=>
        `<button class="slot ${S.time===t&&S.service===svc?"on":""}" data-slot="${t}" data-svc="${svc}">${t.replace(":","h")}</button>`).join("")}</div>`;
    }).join("");
    return `${head}<div class="card">
      <div class="row">
        <div class="field"><label>Nombre de personnes</label>
          <div class="counter"><button data-act="minus" aria-label="moins">−</button><output>${S.covers}</output><button data-act="plus" aria-label="plus">+</button></div>
          <small class="muted">Minimum ${c.minCovers} personnes${evDay.filter(e=>(+e.minCovers||2)<c.minCovers).map(e=>` (${+e.minCovers||2} pour ${esc(e.title)})`).join("")}</small></div>
        <div class="field"><label for="date">Date</label>
          <input type="date" id="date" value="${S.date}" min="${todayStr()}" max="${addDays(todayStr(),c.maxAdvanceDays)}"></div>
      </div>
      ${(()=>{const up=upcomingEvents(S.siteId).filter(x=>x.date!==S.date);return up.length?`<div class="evt-up"><span>Événements à venir :</span>${up.map(x=>`<button class="chip" data-evdate="${x.date}">★ ${esc(x.ev.title)} · ${esc(new Date(x.date+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"}))}</button>`).join("")}</div>`:""})()}
      <label>Heure d'arrivée</label>${services}
      <div style="margin-top:20px"><button class="btn" data-act="next" ${S.time?"":"disabled"}>Continuer</button></div>
    </div>`;
  }
  // étape 3
  return `${head}<div class="card">
    <div class="summary"><span><b>Date</b>${esc(fmtDate(S.date))}</span><span><b>Heure</b>${S.time.replace(":","h")}</span><span><b>Personnes</b>${S.covers}</span>${evOf(S.service)?`<span><b>Événement</b>${esc(evOf(S.service).title)}</span>`:""}</div>
    <form id="f">
      <div class="row">
        <div class="field"><label for="fn">Prénom</label><input type="text" id="fn" required autocomplete="given-name"></div>
        <div class="field"><label for="ln">Nom</label><input type="text" id="ln" required autocomplete="family-name"></div>
      </div>
      <div class="row">
        <div class="field"><label for="em">Email</label><input type="email" id="em" required autocomplete="email"></div>
        <div class="field"><label for="ph">Téléphone mobile</label><input type="tel" id="ph" required pattern="[0-9+ .]{10,}" autocomplete="tel"></div>
      </div>
      <div class="field"><label for="nt">Commentaire (optionnel)</label><textarea id="nt" rows="2" maxlength="300" placeholder="Anniversaire, chaise haute…"></textarea></div>
      <div class="field"><label style="font-weight:400;display:flex;gap:8px;align-items:start"><input type="checkbox" id="rgpd" required> J'accepte que Salad&amp;Co utilise mes coordonnées pour gérer ma réservation (confirmation et rappel par mail/SMS).</label></div>
      ${S.error?`<div class="err">${esc(S.error)}</div>`:""}
      <div style="display:flex;gap:8px"><button type="button" class="btn ghost" data-act="back">Retour</button>
      <button class="btn" ${S.saving?"disabled":""}>${S.saving?"Validation…":"Confirmer la réservation"}</button></div>
    </form></div>`;
}

/* ====================== Rendu back-office ====================== */
function isSiegeRole(r){return /^siege/.test(r||"")}
function rolesFor(aff){return ROLES.filter(([v])=>aff==="siege"?isSiegeRole(v):!isSiegeRole(v))}
function affOptions(sel){return `<option value="siege" ${sel==="siege"?"selected":""}>Siège</option><optgroup label="Restaurants">${SITES.map(([sid,n])=>`<option value="${sid}" ${sel===sid?"selected":""}>${esc(n)}</option>`).join("")}</optgroup>`}
function roleLabel(r){const x=ROLES.find(([v])=>v===r);return x?x[1]:r==="siege"?"Siège":"Directeur / Directrice"}
function staffIsSiege(){return !!(myId&&STAFF[myId]&&isSiegeRole(STAFF[myId].role))}
function isSiege(){return dbReady?(canEdit||staffIsSiege())&&!S.admin.preview:demoRole==="siege"}
function mySite(){if(S.admin.preview)return S.admin.preview;if(!dbReady)return demoRole==="resto"?"lomme":null;return myId&&STAFF[myId]&&!isSiegeRole(STAFF[myId].role)?STAFF[myId].siteId:null}
function renderLogin(){
  const L=S.login||(S.login={step:1,email:"",msg:null,busy:false});
  const dom=window.SC_AUTH?SC_AUTH.domain:"saladandco.fr";
  const msg=L.msg?`<div class="${L.msg.err?"err":"note"}">${esc(L.msg.t)}</div>`:"";
  if(L.step===1)return `<div class="card denied"><h1>Back-office Salad&amp;Co</h1>
    <p class="muted">Connexion réservée aux équipes : saisissez votre adresse @${esc(dom)}, vous recevrez un code par e-mail.</p>
    <form id="lf"><div class="field"><label for="lEmail">Adresse e-mail professionnelle</label>
    <input type="text" id="lEmail" autocomplete="username" inputmode="email" placeholder="prenom.nom@${esc(dom)}" value="${esc(L.email)}" required></div>
    ${msg}<button class="btn" ${L.busy?"disabled":""}>${L.busy?"Envoi…":"Recevoir mon code"}</button></form>
    <p><a href="#reserver">Réserver une table</a></p></div>`;
  return `<div class="card denied"><h1>Code de connexion</h1>
    <p class="muted">Un code a été envoyé à <b>${esc(L.email)}</b>. Il est valable quelques minutes.</p>
    <form id="lc"><div class="field"><label for="lCode">Code reçu par e-mail</label>
    <input type="text" id="lCode" inputmode="numeric" autocomplete="one-time-code" maxlength="10" required></div>
    ${msg}<button class="btn" ${L.busy?"disabled":""}>${L.busy?"Vérification…":"Se connecter"}</button>
    <button type="button" class="btn ghost" data-act="loginBack">Changer d'adresse</button></form></div>`;
}
async function loginSend(){
  const L=S.login;L.email=document.getElementById("lEmail").value;L.busy=true;L.msg=null;render();
  try{L.email=await SC_AUTH.sendCode(L.email);L.step=2}catch(e){L.msg={t:e.message,err:true}}
  L.busy=false;render();
}
async function loginVerify(){
  const L=S.login;const code=(document.getElementById("lCode").value||"").replace(/\D/g,"");
  if(!code){L.msg={t:"Saisissez le code reçu par e-mail.",err:true};render();return}
  L.busy=true;L.msg=null;render();
  try{await SC_AUTH.verifyCode(L.email,code);location.reload()}
  catch(e){L.msg={t:e.message,err:true};L.busy=false;render()}
}
function logoutBtn(){return user?`<button class="btn sm ghost" data-act="logout" title="${esc(myId||"")}">Se déconnecter</button>`:""}
function renderAdmin(){
  const A=S.admin;
  if(!dbReady)return `<div class="card"><p class="muted">Chargement…</p></div>`;
  if(!user)return renderLogin();
  if(dbReady&&!canEdit&&!(myId&&STAFF[myId]))return `<div class="card denied"><h1>Accès réservé</h1><p class="muted">Vous êtes connecté(e) avec ${esc(myId||"")}, mais cette adresse n'a pas (ou plus) d'affectation. Demandez au siège de vous donner accès.</p><p><a href="#reserver">Réserver une table</a> · ${logoutBtn()}</p></div>`;
  const siege=isSiege(), locked=!siege&&mySite();
  if(locked&&A.siteId!==locked){A.siteId=locked;subscribeResas(A.siteId,A.date)}
  const TABS=siege?[["jour","Réservations"],["stats","Statistiques"],["events","Événements"],["restos","Restaurants"],["param","Paramétrage"],["google","Liens Google"],["acces","Accès"]]:[["jour","Réservations"]];
  if(!TABS.some(t=>t[0]===A.tab))A.tab="jour";
  const roleBar=`<div class="rolebar ${siege?"siege":"resto"}"><b>${siege?"Espace siège"+(dbReady&&staffIsSiege()?" · "+esc(roleLabel(STAFF[myId].role).replace("Siège – ","")):""):"Espace restaurant"}</b>${A.preview?`<span>Aperçu de</span><select id="pvSite" class="pv-sel">${SITES.map(([sid,n])=>`<option value="${sid}" ${A.preview===sid?"selected":""}>${esc(n)}</option>`).join("")}</select><span>tel que le voit son directeur</span>`:`<span>${siege?(dbReady&&!canEdit?"Tous les restaurants · consultation. Pour créer/modifier (événements, restaurants, paramétrage, accès), le propriétaire doit vous partager la page en « Éditeur ».":"Tous les restaurants · statistiques, événements, paramétrage"):locked?`${esc(roleLabel((STAFF[myId]||{}).role))} · ${esc(siteName(locked))}`:"Aucune affectation — demandez au siège de vous affecter"}</span>`}
    ${!dbReady?`<span class="demo-switch">Démo : voir comme <button class="btn sm ${demoRole==="siege"?"":"ghost"}" data-role="siege">Siège</button><button class="btn sm ${demoRole==="resto"?"":"ghost"}" data-role="resto">Restaurant</button></span>`
      :`<span style="margin-left:auto;display:flex;gap:6px">${(canEdit||staffIsSiege())?`<button class="btn sm ghost" data-act="togglePreview">${A.preview?"Revenir à l'espace siège":"Aperçu espace restaurant"}</button>`:""}${logoutBtn()}</span>`}</div>`;
  const tabs=`<div class="tabs">${TABS.map(([k,l])=>
    `<button data-tab="${k}" class="${A.tab===k?"on":""}">${l}</button>`).join("")}</div>`;
  const siteSel=locked?`<div class="field"><label>Restaurant</label><div class="locked-site">${esc(siteName(locked))}</div></div>`:`<div class="field"><label for="aSite">Restaurant</label><select id="aSite">${SITES.map(([id,n])=>
    `<option value="${id}" ${id===A.siteId?"selected":""}>${esc(n)}</option>`).join("")}</select></div>`;
  let body="";
  if(A.tab==="jour"&&!siege&&!locked&&dbReady){
    body=`<div class="card empty">Votre compte n'a pas encore d'affectation. Demandez au siège de vous affecter (onglet Accès).</div>`;
  } else if(A.tab==="jour"){
    const c=cfg(A.siteId);
    const evRepl=eventsFor(A.siteId,A.date).map(e=>e.replaces);
    const cols=svcKeys(A.siteId,A.date,S.resas).filter(k=>!(evRepl.includes(k)&&!S.resas.some(r=>r.service===k))).map(svc=>{
      const list=S.resas.filter(r=>r.service===svc).sort((a,b)=>a.time.localeCompare(b.time));
      const cap=svcCap(A.siteId,svc,A.date)||1, ovr=capOverride(A.siteId,svc,A.date)!=null, used=activeCovers(S.resas,svc), pct=Math.min(100,Math.round(used/cap*100));
      const isEv=svc.startsWith("evt:");
      return `<div class="card ${isEv?"evt-card":""}"><h2>${isEv?"★ ":""}${esc(svcLabel(svc,S.resas))} <span class="muted" style="font-weight:400;font-size:14px">${used} / ${cap} couverts${ovr?` <span class="pill p-arrivee">ajusté ce jour</span>`:""}</span>${A.capEdit!==svc?`<button class="btn sm ghost capbtn" data-capedit="${esc(svc)}" title="Modifier la capacité">✎ Capacité</button>`:""}</h2>
        ${A.capEdit===svc?renderCapForm(svc,cap,ovr):""}
        <div class="bar"><i style="width:${pct}%" class="${pct>=100?"full":pct>=80?"warn":""}"></i></div>
        ${list.length?`<table class="plan"><tr><th>Heure</th><th>Client</th><th>Pers.</th><th>Statut</th><th></th></tr>${list.map(r=>`
          <tr><td class="c-time"><b>${r.time.replace(":","h")}</b></td>
          <td class="c-client">${esc(r.firstName)} ${esc(r.lastName)}<br><small class="muted"><a class="tel" href="tel:${esc((r.phone||"").replace(/[^0-9+]/g,""))}">${esc(r.phone)}</a> · ${esc(r.ref)}${r.source==="telephone"?" · tél.":""}</small>${r.note?`<br><small>💬 ${esc(r.note)}</small>`:""}</td>
          <td class="c-cov">${r.covers}<span class="m-only"> pers.</span></td><td class="c-st"><span class="pill p-${r.status}">${STATUS_LABEL[r.status]||r.status}</span></td>
          <td class="c-act"><div class="acts">${r.status==="confirmee"?`<button class="btn sm ghost" data-st="arrivee" data-id="${r.id}">Arrivée</button><button class="btn sm ghost" data-st="noshow" data-id="${r.id}">No-show</button><button class="btn sm red" data-st="annulee" data-id="${r.id}">Annuler</button>`:`<button class="btn sm ghost" data-st="confirmee" data-id="${r.id}">Rétablir</button>`}</div></td></tr>`).join("")}</table>`
          :`<div class="empty">Aucune réservation.</div>`}</div>`;
    }).join("");
    body=`<div class="toolbar">${siteSel}
      <div class="field"><label for="aDate">Date</label><input type="date" id="aDate" value="${A.date}"></div>
      <div class="daynav"><button class="btn ghost sm" data-act="prevDay" aria-label="Jour précédent">◀</button><button class="btn ghost sm" data-act="today">Aujourd'hui</button><button class="btn ghost sm" data-act="nextDay" aria-label="Jour suivant">▶</button></div>
      <div class="tb-right"><button class="btn sm ghost" data-act="pdf">⤓ PDF du jour</button><button class="btn sm ghost" data-act="mailOpen">✉ Envoyer par mail</button><button class="btn sm" data-act="phoneResa">+ Résa téléphone</button></div></div>
      ${A.exportMsg?`<div class="${A.exportMsg.err?"err":"note"}">${A.exportMsg.html}</div>`:""}
      ${A.mail?renderMailForm():""}
      <p class="muted" style="margin-top:-6px">${esc(fmtDate(A.date))} · ${S.resas.filter(r=>r.status!=="annulee").length} réservation(s)</p>
      ${A.phone?renderPhoneForm():""}
      <div class="svc">${cols}</div>`;
  } else if(A.tab==="stats"){
    body=renderStats();
  } else if(A.tab==="restos"){
    body=renderRestos();
  } else if(A.tab==="acces"){
    body=renderAccess();
  } else if(A.tab==="events"){
    body=renderEventsTab();
  } else if(A.tab==="param"){
    const c=A.editCfg||cfg(A.siteId);
    const dis=isSiege()?"":"disabled";
    const svcBlock=svc=>`<div class="card"><h2><label style="display:flex;gap:8px;align-items:center;font-size:16px"><input type="checkbox" data-c="${svc}.on" ${c[svc].on?"checked":""} ${dis}> Service ${SVC_LABEL[svc].toLowerCase()}</label></h2>
      <div class="row"><div class="field"><label>Premier créneau</label><input type="time" step="900" data-c="${svc}.start" value="${c[svc].start}" ${dis}></div>
      <div class="field"><label>Dernier créneau</label><input type="time" step="900" data-c="${svc}.end" value="${c[svc].end}" ${dis}></div></div>
      <div class="row"><div class="field"><label>Réservation jour J possible jusqu'à</label><input type="time" data-c="${svc}.cutoff" value="${c[svc].cutoff}" ${dis}></div>
      <div class="field"><label>Capacité (couverts)</label><input type="number" min="1" data-c="${svc}.capacity" value="${c[svc].capacity||c.capacity}" ${dis}></div></div></div>`;
    body=`<div class="toolbar">${siteSel}</div>
      ${isSiege()?"":`<div class="note">Lecture seule : le paramétrage est géré par le siège.</div>`}
      <div class="card"><label style="display:flex;gap:8px;align-items:center;font-size:16px"><input type="checkbox" data-c="active" ${c.active?"checked":""} ${dis}> Réservation en ligne active</label></div>
      <div class="svc">${svcBlock("midi")}${svcBlock("soir")}</div>
      <div class="card"><div class="row">
        <div class="field"><label>Couverts minimum</label><input type="number" min="1" data-c="minCovers" value="${c.minCovers}" ${dis}></div>
        <div class="field"><label>Pas des créneaux (min)</label><select data-c="stepMin" ${dis}>${[15,30].map(v=>`<option ${c.stepMin==v?"selected":""}>${v}</option>`).join("")}</select></div>
        <div class="field"><label>Réservable jusqu'à J+</label><input type="number" min="1" data-c="maxAdvanceDays" value="${c.maxAdvanceDays}" ${dis}></div>
      </div>
      <label>Jours réservables</label><div class="days">${[1,2,3,4,5,6,0].map(d=>`<label><input type="checkbox" data-day="${d}" ${c.openDays.includes(d)?"checked":""} ${dis}> ${DAY_LABEL[d]}</label>`).join("")}</div></div>
      <div class="card"><h2>Horaires par jour</h2><p class="muted" style="margin-top:-6px;font-size:13px">Par défaut, chaque jour reprend les horaires des services ci-dessus. Modifiez une case pour un jour particulier (ex. ouverture à 12h00 le dimanche) ; les cases en vert sont ajustées.</p>
      <table class="daytable"><tr><th>Jour</th><th>Midi : 1er créneau</th><th>Dernier</th><th>Soir : 1er créneau</th><th>Dernier</th><th></th></tr>
      ${[1,2,3,4,5,6,0].map(d=>{const o=(c.days||{})[String(d)]||{};const cell=(svc,k)=>{const ov=o[svc]&&o[svc][k]!=null;return `<td><input type="time" step="900" class="${ov?"ov":""}" data-dh="${d}.${svc}.${k}" value="${ov?o[svc][k]:c[svc][k]}" ${dis||!c.openDays.includes(d)?"disabled":""}></td>`};
        return `<tr class="${c.openDays.includes(d)?"":"off-row"}"><td><b>${DAY_LABEL[d]}</b>${c.openDays.includes(d)?"":` <small class="muted">non réservable</small>`}</td>${cell("midi","start")}${cell("midi","end")}${cell("soir","start")}${cell("soir","end")}<td>${Object.keys(o).length&&isSiege()?`<button class="btn sm ghost" data-dhreset="${d}">Rétablir</button>`:""}</td></tr>`}).join("")}</table></div>
      ${A.msg?`<div class="${A.msg.err?"err":"note"}">${esc(A.msg.t)}</div>`:""}
      ${isSiege()?`<button class="btn" data-act="saveCfg">Enregistrer</button> <button class="btn ghost" data-act="resetCfg">Annuler les modifications</button>`:""}`;
  } else {
    const base=BASE_URL||"[URL de la page]";
    body=`<div class="card how"><h2>Bouton « Réserver » sur Google</h2>
      <p class="muted">Chaque restaurant a son lien, qui ouvre directement le formulaire du bon site. À coller dans sa fiche Google Business Profile :</p>
      <ol><li>Ouvrir la fiche du restaurant (business.google.com ou recherche Google en étant connecté au compte gestionnaire)</li>
      <li>Modifier le profil → <b>Réservations</b> (ou « Liens de réservation ») → Ajouter un lien</li>
      <li>Coller le lien ci-dessous et le définir comme lien préféré</li>
      <li>Faire de même sur saladandco.fr (bouton « Réserver » de chaque page restaurant)</li></ol>
      <div class="note">Si un prestataire tiers (ex. ancien outil) a un lien « Réserver » sur la fiche, il faut le retirer ou choisir ce lien comme préféré.</div></div>
      <div class="card">${SITES.map(([id,n])=>{const u=base+"#resto-"+id;return `<div class="linkrow"><b>${esc(n)}</b><code>${esc(u)}</code><button class="btn sm ghost" data-copy="${esc(u)}">Copier</button></div>`}).join("")}</div>`;
  }
  return `<h1>Back-office réservations</h1><p class="muted">${dbReady?"Données partagées en temps réel":"Mode démo : données non enregistrées"}</p>${roleBar}${tabs}${body}`;
}
function renderMailForm(){
  const A=S.admin;let last="";try{last=localStorage.getItem("sc_mail_to")||""}catch{}
  return `<div class="card"><h2>Envoyer la liste par mail</h2><form id="mf">
    <p class="muted" style="margin-top:-6px">${esc(siteName(A.siteId))} · ${esc(fmtDate(A.date))} — le PDF est partagé (mobile) ou téléchargé, puis votre messagerie s\'ouvre avec le mail prêt.</p>
    <div class="field"><label for="mTo">Destinataire(s)</label><input type="text" id="mTo" required placeholder="prenom.nom@saladandco.fr, autre@…" value="${esc(A.mailTo??last)}"></div>
    <button class="btn" ${A.sending?"disabled":""}>${A.sending?"Envoi…":"Envoyer"}</button> <button type="button" class="btn ghost" data-act="mailClose">Fermer</button></form></div>`;
}
/* ---------- Export PDF / mail ---------- */
function loadScript(src){return new Promise((res,rej)=>{if(document.querySelector(`script[src="${src}"]`))return res();const el=document.createElement("script");el.src=src;el.onload=res;el.onerror=()=>rej(new Error("Chargement impossible : "+src));document.head.appendChild(el)})}
async function logoPng(){
  const img=new Image();img.src="logo.png";await img.decode();
  const c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;
  const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0);return c.toDataURL("image/jpeg",0.92);
}
function dayRows(){
  const act=S.resas.filter(r=>r.status!=="annulee");
  return svcKeys(S.admin.siteId,S.admin.date,S.resas).map(svc=>({svc,list:act.filter(r=>r.service===svc).sort((a,b)=>a.time.localeCompare(b.time))}));
}
async function buildPdf(){
  await loadScript("jspdf.umd.min.js");
  await loadScript("jspdf.plugin.autotable.min.js");
  const A=S.admin,c=cfg(A.siteId);const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:"mm",format:"a4"});
  const G=[0,0,0];
  try{const lg=await logoPng();if(lg)doc.addImage(lg,"JPEG",14,9,44,15.2)}catch{}
  doc.setFont("helvetica","bold");doc.setFontSize(16);doc.text("Réservations du jour",196,16,{align:"right"});
  doc.setFont("helvetica","normal");doc.setFontSize(11);doc.text(`${siteName(A.siteId)} · ${fmtDate(A.date)}`,196,23,{align:"right"});
  doc.setDrawColor(...G);doc.setLineWidth(.8);doc.line(14,28,196,28);
  let y=36;
  for(const {svc,list} of dayRows()){
    const cov=list.reduce((a,r)=>a+(+r.covers||0),0);
    doc.setFont("helvetica","bold");doc.setFontSize(13);doc.setTextColor(0);
    if(y>250){doc.addPage();y=20}
    doc.text(`${svc.startsWith("evt:")?"Événement : ":""}${svcLabel(svc,S.resas)} — ${list.length} réservation(s), ${cov} couverts / ${svcCap(A.siteId,svc,A.date)}`,14,y);
    doc.autoTable({startY:y+3,margin:{left:14,right:14},
      head:[["Heure","Client","Pers.","Téléphone","Commentaire","Réf.","Arrivé"]],
      body:list.length?list.map(r=>[r.time.replace(":","h"),`${r.firstName||""} ${r.lastName||""}`.trim(),String(r.covers),r.phone||"",r.note||"",r.ref+(r.source==="telephone"?" (tél.)":""),r.status==="arrivee"?"Oui":r.status==="noshow"?"No-show":""]):[[{content:"Aucune réservation",colSpan:7,styles:{halign:"center",textColor:120}}]],
      styles:{fontSize:9.5,cellPadding:2.2,valign:"middle"},headStyles:{fillColor:G,textColor:255},
      columnStyles:{0:{cellWidth:16,fontStyle:"bold"},1:{cellWidth:38},2:{cellWidth:13,halign:"center"},3:{cellWidth:30},5:{cellWidth:26,fontSize:8},6:{cellWidth:16,halign:"center"}},
      alternateRowStyles:{fillColor:[240,255,240]}});
    y=doc.lastAutoTable.finalY+12;
  }
  const n=S.resas.filter(r=>r.status==="annulee").length;
  doc.setFontSize(8.5);doc.setTextColor(120);
  doc.text(`${n?n+" réservation(s) annulée(s) non listée(s) · ":""}Édité le ${new Date().toLocaleString("fr-FR")}`,14,287);
  return doc;
}
function pdfName(){return `reservations-${S.admin.siteId}-${S.admin.date}.pdf`}
function setExportMsg(html,err){S.admin.exportMsg={html,err};render()}
async function downloadPdf(){
  setExportMsg("Préparation du PDF…");
  try{
    const doc=await buildPdf();
    const dl=await claude.use("downloads").catch(()=>null);
    if(!dl){setExportMsg("Le téléchargement n'est pas disponible dans cette vue. Utilisez l'envoi par mail.",true);return}
    await dl.save({filename:pdfName(),data:doc.output("blob")});
    setExportMsg("PDF prêt : "+esc(pdfName()));
  }catch(e){
    if(e&&e.code==="declined"){setExportMsg("Téléchargement annulé.");return}
    if(e&&e.code==="rate_limited"){setExportMsg("Une demande de téléchargement est déjà ouverte.",true);return}
    setExportMsg("Impossible de générer le PDF ("+esc(e.code||e.message)+").",true);
  }
}
function mailHtml(){
  const A=S.admin;const rows=dayRows().map(({svc,list})=>{
    const cov=list.reduce((a,r)=>a+(+r.covers||0),0);
    return `<h3 style="font-family:Arial;color:#00704a;margin:18px 0 6px">${esc(svcLabel(svc,S.resas))} — ${list.length} résa, ${cov} couverts</h3>`+
    (list.length?`<table cellpadding="6" style="border-collapse:collapse;font-family:Arial;font-size:13px"><tr style="background:#000;color:#fff"><th align="left">Heure</th><th align="left">Client</th><th>Pers.</th><th align="left">Téléphone</th><th align="left">Commentaire</th></tr>`+
      list.map(r=>`<tr style="border-bottom:1px solid #e3e8e4"><td><b>${r.time.replace(":","h")}</b></td><td>${esc((r.firstName||"")+" "+(r.lastName||""))}</td><td align="center">${r.covers}</td><td>${esc(r.phone)}</td><td>${esc(r.note||"")}</td></tr>`).join("")+`</table>`
    :`<p style="font-family:Arial;color:#777">Aucune réservation.</p>`)}).join("");
  return `<div style="font-family:Arial"><h2 style="margin:0">Réservations ${esc(siteName(A.siteId))}</h2><p style="color:#555;margin:4px 0 0">${esc(fmtDate(A.date))}</p>${rows}<p style="color:#888;font-size:12px;margin-top:18px">Liste complète en PDF jointe. Envoyé depuis le back-office réservation Salad&amp;Co.</p></div>`;
}
async function sendMail(){
  // Hors claude.ai il n'y a pas de connecteur Gmail : on partage le PDF (mobile)
  // ou on le télécharge et on ouvre la messagerie avec le mail pré-rempli.
  const A=S.admin;const raw=document.getElementById("mTo").value;A.mailTo=raw;
  const to=raw.split(/[,;\s]+/).map(x=>x.trim()).filter(Boolean);
  if(!to.length||to.some(x=>!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x))){setExportMsg("Adresse e-mail invalide.",true);return}
  A.sending=true;setExportMsg("Préparation du PDF…");
  try{
    const doc=await buildPdf();const blob=doc.output("blob");
    const subject=`Réservations ${siteName(A.siteId)} – ${fmtDate(A.date)}`;
    const file=new File([blob],pdfName(),{type:"application/pdf"});
    try{localStorage.setItem("sc_mail_to",raw)}catch{}
    if(navigator.canShare&&navigator.canShare({files:[file]})){
      await navigator.share({files:[file],title:subject,text:"Liste des réservations en pièce jointe (PDF)."});
      A.sending=false;A.mail=false;setExportMsg("PDF partagé.");return;
    }
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=pdfName();document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
    location.href="mailto:"+to.map(encodeURIComponent).join(",")+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent("Bonjour,\n\nVous trouverez ci-joint la liste des réservations.\n");
    A.sending=false;A.mail=false;setExportMsg("PDF téléchargé et messagerie ouverte : joignez le fichier "+esc(pdfName())+" au mail.");
  }catch(e){A.sending=false;if(e&&e.name==="AbortError"){setExportMsg("Partage annulé.");return}setExportMsg("Échec ("+esc(e.message||e)+").",true)}
}
function newEvent(){
  const t=todayStr();let d=t;while(dowOf(d)!==0)d=addDays(d,1);
  return {id:"",title:"Brunch du dimanche",description:"",scope:"select",sites:[S.admin.siteId],recur:"weekly",date:d,weekday:0,from:t,to:"",
    start:"11:00",end:"13:30",step:15,cutoff:"10:00",capacity:40,minCovers:2,replaces:"midi",active:true,featured:false};
}
function renderEventsTab(){
  const A=S.admin, list=Object.values(EVENTS).sort((a,b)=>(a.title||"").localeCompare(b.title||""));
  const dis=isSiege()?"":"disabled";
  const scopeTxt=ev=>ev.scope==="all"?`<span class="pill p-confirmee">Tous les sites</span>`:(ev.sites||[]).map(siteName).join(", ")||"—";
  const table=list.length?`<table><tr><th>Événement</th><th>Quand</th><th>Horaires</th><th>Sites</th><th>Cap.</th><th></th></tr>${list.map(ev=>`
    <tr class="${ev.active===false?"off-row":""}"><td><b>${esc(ev.title)}</b>${ev.replaces&&ev.replaces!=="none"?`<br><small class="muted">remplace le service du ${ev.replaces}</small>`:""}${ev.active===false?`<br><small class="muted">désactivé</small>`:""}${ev.featured?`<br><span class="pill p-confirmee">★ mis en avant</span>`:""}</td>
    <td>${esc(evWhen(ev))}</td><td>${ev.start.replace(":","h")}–${ev.end.replace(":","h")}<br><small class="muted">min ${ev.minCovers} pers.</small></td>
    <td>${scopeTxt(ev)}</td><td>${ev.capacity}</td>
    <td><div class="acts">${isSiege()?`<button class="btn sm ghost" data-evedit="${ev.id}">Modifier</button><button class="btn sm red" data-evdel="${ev.id}">Supprimer</button>`:""}</div></td></tr>`).join("")}</table>`
    :`<div class="empty">Aucun événement pour l'instant.</div>`;
  const f=A.evEdit;
  const form=f?`<div class="card"><h2>${f.id?"Modifier l'événement":"Nouvel événement"}</h2><form id="ef">
    <div class="row"><div class="field"><label>Nom</label><input type="text" data-e="title" value="${esc(f.title)}" required maxlength="60"></div>
    <div class="field"><label>Description (visible par le client)</label><input type="text" data-e="description" value="${esc(f.description)}" maxlength="160" placeholder="Brunch à volonté, boissons chaudes incluses…"></div></div>
    <div class="field"><label>Restaurants concernés</label>
      <div class="seg"><label><input type="radio" name="scope" data-e="scope" value="all" ${f.scope==="all"?"checked":""}> Tous les sites</label>
      <label><input type="radio" name="scope" data-e="scope" value="select" ${f.scope!=="all"?"checked":""}> En local (sélection)</label></div>
      ${f.scope!=="all"?`<div class="days" style="margin-top:8px">${SITES.map(([id,n])=>`<label><input type="checkbox" data-esite="${id}" ${(f.sites||[]).includes(id)?"checked":""}> ${esc(n)}</label>`).join("")}</div>`:""}</div>
    <div class="field"><label>Récurrence</label>
      <div class="seg"><label><input type="radio" name="recur" data-e="recur" value="once" ${f.recur!=="weekly"?"checked":""}> Date unique</label>
      <label><input type="radio" name="recur" data-e="recur" value="weekly" ${f.recur==="weekly"?"checked":""}> Chaque semaine</label></div></div>
    ${f.recur==="weekly"?`<div class="row"><div class="field"><label>Jour</label><select data-e="weekday">${[1,2,3,4,5,6,0].map(d=>`<option value="${d}" ${+f.weekday===d?"selected":""}>${WEEKDAYS[d]}</option>`).join("")}</select></div>
      <div class="field"><label>Du</label><input type="date" data-e="from" value="${f.from||""}"></div>
      <div class="field"><label>Au (optionnel)</label><input type="date" data-e="to" value="${f.to||""}"></div></div>`
     :`<div class="row"><div class="field"><label>Date</label><input type="date" data-e="date" value="${f.date||""}" required></div><div></div></div>`}
    <div class="row"><div class="field"><label>Premier créneau</label><input type="time" step="900" data-e="start" value="${f.start}" required></div>
      <div class="field"><label>Dernier créneau</label><input type="time" step="900" data-e="end" value="${f.end}" required></div>
      <div class="field"><label>Pas (min)</label><select data-e="step">${[15,30].map(v=>`<option ${+f.step===v?"selected":""}>${v}</option>`).join("")}</select></div>
      <div class="field"><label>Résa jour J jusqu'à</label><input type="time" data-e="cutoff" value="${f.cutoff||""}"></div></div>
    <div class="row"><div class="field"><label>Capacité par restaurant</label><input type="number" min="1" data-e="capacity" value="${f.capacity}" required></div>
      <div class="field"><label>Couverts minimum</label><input type="number" min="1" data-e="minCovers" value="${f.minCovers}" required></div>
      <div class="field"><label>Remplace le service</label><select data-e="replaces">${[["none","Aucun (en plus)"],["midi","Midi"],["soir","Soir"]].map(([v,l])=>`<option value="${v}" ${f.replaces===v?"selected":""}>${l}</option>`).join("")}</select></div>
      <div class="field"><label>&nbsp;</label><label style="display:flex;gap:8px;align-items:center;font-weight:500;margin-top:10px"><input type="checkbox" data-e="active" ${f.active!==false?"checked":""}> Actif</label>
      <label style="display:flex;gap:8px;align-items:center;font-weight:500;margin-top:8px"><input type="checkbox" data-e="featured" ${f.featured?"checked":""}> Mettre en avant (encart d'accueil)</label></div></div>
    ${A.evMsg?`<div class="${A.evMsg.err?"err":"note"}">${esc(A.evMsg.t)}</div>`:""}
    <button class="btn">${f.id?"Enregistrer":"Créer l'événement"}</button> <button type="button" class="btn ghost" data-act="evCancel">Annuler</button></form></div>`:"";
  return `
    ${!f&&A.evMsg?`<div class="${A.evMsg.err?"err":"note"}">${esc(A.evMsg.t)}</div>`:""}
    ${form}
    <div class="card"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><h2 style="margin:0">Événements</h2>
      ${isSiege()&&!f?`<button class="btn sm" data-act="evNew" style="margin-left:auto">+ Nouvel événement</button>`:""}</div>${table}</div>`;
}
async function saveEvent(){
  const A=S.admin,f=A.evEdit;
  const err=t=>{A.evMsg={t,err:true};render()};
  if(!f.title.trim())return err("Donnez un nom à l'événement.");
  if(f.scope!=="all"&&!(f.sites||[]).length)return err("Sélectionnez au moins un restaurant.");
  if(f.recur==="weekly"){if(f.to&&f.from&&f.to<f.from)return err("La date de fin précède la date de début.")}else if(!f.date)return err("Choisissez une date.");
  if(toMin(f.start)>toMin(f.end))return err("Le premier créneau doit précéder le dernier.");
  if(+f.minCovers>+f.capacity)return err("Le minimum de couverts dépasse la capacité.");
  const id=f.id||("ev"+Date.now().toString(36)+Math.random().toString(36).slice(2,6));
  const data={title:f.title.trim(),description:(f.description||"").trim(),scope:f.scope==="all"?"all":"select",sites:f.scope==="all"?[]:f.sites,
    recur:f.recur==="weekly"?"weekly":"once",date:f.recur==="weekly"?"":f.date,weekday:+f.weekday,from:f.recur==="weekly"?(f.from||todayStr()):"",to:f.recur==="weekly"?(f.to||""):"",
    start:f.start,end:f.end,step:+f.step||15,cutoff:f.cutoff||"",capacity:+f.capacity,minCovers:+f.minCovers,replaces:f.replaces||"none",active:f.active!==false,featured:!!f.featured,updatedAt:new Date().toISOString()};
  try{
    if(db) await db.doc("events/"+id).set(data);
    EVENTS[id]={id,...data};A.evEdit=null;A.evMsg={t:`Événement « ${data.title} » enregistré.`};render();
  }catch(e){err("Enregistrement refusé ("+(e.code||e.message)+").")}
}
async function deleteEvent(id){
  const A=S.admin;const n=EVENTS[id]&&EVENTS[id].title;
  try{if(db)await db.doc("events/"+id).delete();delete EVENTS[id];A.evMsg={t:`Événement « ${n} » supprimé. Les réservations déjà prises restent visibles dans le planning.`}}
  catch(e){A.evMsg={t:"Suppression refusée ("+(e.code||e.message)+").",err:true}}
  render();
}
function renderCapForm(svc,cap,ovr){
  const A=S.admin,isEv=svc.startsWith("evt:");
  return `<form id="cf" class="capform"><div class="capgrid">
    <div class="field"><label>Nombre de couverts</label><input type="number" id="capN" min="1" max="999" value="${cap}" required></div>
    <div class="field"><label>Appliquer</label><div class="seg">
      <label><input type="radio" name="capScope" value="day" ${A.capScope!=="default"?"checked":""}> Ce jour uniquement (${esc(new Date(A.date+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"}))})</label>
      ${isSiege()?`<label><input type="radio" name="capScope" value="default" ${A.capScope==="default"?"checked":""}> ${isEv?"À toutes les dates de l'événement":"Tous les jours (par défaut)"}</label>`:""}</div></div></div>
    ${!isEv&&A.capScope==="default"?"":""}
    <button class="btn sm">Enregistrer</button> <button type="button" class="btn sm ghost" data-act="capCancel">Annuler</button>
    ${ovr?` <button type="button" class="btn sm ghost" data-act="capReset">Revenir à la capacité par défaut</button>`:""}
    ${!isSiege()?`<p class="muted" style="font-size:12px;margin:8px 0 0">La capacité par défaut est fixée par le siège.</p>`:isEv?`<p class="muted" style="font-size:12px;margin:8px 0 0">« Toutes les dates » modifie la capacité de l'événement sur tous ses restaurants.</p>`:`<p class="muted" style="font-size:12px;margin:8px 0 0">« Tous les jours » modifie la capacité par défaut du service du ${esc(svcLabel(svc).toLowerCase())} à ${esc(siteName(A.siteId))} (modifiable aussi dans Paramétrage).</p>`}
  </form>`;
}
async function writeSite(siteId,patch){
  const base={...(siteDocs[siteId]||{})};const data={...base,...patch,updatedAt:new Date().toISOString()};
  if(db) await db.doc("sites/"+siteId).set(data);
  siteDocs[siteId]=data;
}
async function saveCap(reset){
  const A=S.admin,svc=A.capEdit,key=A.date+"|"+svc;
  const ov={...((CAPS[A.siteId]||{}).overrides||{})};
  const writeCaps=async()=>{const data={overrides:ov,updatedAt:new Date().toISOString()};if(db)await db.doc("caps/"+A.siteId).set(data);CAPS[A.siteId]=data};
  // purge des ajustements passés
  Object.keys(ov).forEach(k=>{if(k.slice(0,10)<addDays(todayStr(),-7))delete ov[k]});
  try{
    if(reset){delete ov[key];await writeCaps();A.exportMsg={html:"Capacité par défaut rétablie pour ce jour."}}
    else{
      const n=+document.getElementById("capN").value;
      const scope=(document.querySelector('input[name="capScope"]:checked')||{}).value;
      if(!(n>=1)){A.exportMsg={html:"Nombre de couverts invalide.",err:true};render();return}
      const used=activeCovers(S.resas,svc);
      if(scope==="day"||!isSiege()){ov[key]=n;await writeCaps()}
      else{
        delete ov[key];
        const ev=evOf(svc);
        if(ev){const data={...ev,capacity:n,updatedAt:new Date().toISOString()};delete data.id;if(db)await db.doc("events/"+ev.id).set(data);EVENTS[ev.id]={id:ev.id,...data};await writeCaps()}
        else{const c=cfg(A.siteId);if(n<c.minCovers){A.exportMsg={html:`La capacité doit être au moins égale au minimum de ${c.minCovers} couverts.`,err:true};render();return}
          await writeSite(A.siteId,{active:c.active,midi:c.midi,soir:c.soir,minCovers:c.minCovers,stepMin:c.stepMin,maxAdvanceDays:c.maxAdvanceDays,openDays:c.openDays,capacity:c.capacity,[svc]:{...c[svc],capacity:n}});await writeCaps()}
      }
      A.exportMsg={html:`Capacité ${esc(svcLabel(svc))} : ${n} couverts ${scope==="day"?"pour ce jour":"par défaut"}.`+(used>n?` <b>Attention : ${used} couverts déjà réservés.</b>`:""),err:used>n};
    }
    A.capEdit=null;
  }catch(e){A.exportMsg={html:"Enregistrement refusé ("+esc(e.code||e.message)+").",err:true}}
  render();
}
/* ---------- Statistiques (siège) ---------- */
function statsRange(){
  const st=S.admin.stats, t=todayStr(), d=new Date(t+"T12:00:00");
  if(st.period==="7")return [addDays(t,-6),t];
  if(st.period==="30")return [addDays(t,-29),t];
  if(st.period==="month")return [t.slice(0,8)+"01",t];
  if(st.period==="prev"){const p=new Date(d.getFullYear(),d.getMonth()-1,1),e=new Date(d.getFullYear(),d.getMonth(),0);return [todayStr(p),todayStr(e)]}
  if(st.period==="next30")return [t,addDays(t,29)];
  return [st.from||addDays(t,-29),st.to||t];
}
async function loadStats(){
  const st=S.admin.stats;const [from,to]=statsRange();st.loading=true;st.err=null;st.key=st.period+from+to;render();
  try{
    let rows;
    if(db){let q=db.collection("reservations").where("date",">=",from).where("date","<=",to);const snap=await q.limit(1000).get();rows=snap.docs.map(d=>({id:d.id,...d.data()}))}
    else rows=memReservations.filter(r=>r.date>=from&&r.date<=to);
    st.rows=rows;st.range=[from,to];
  }catch(e){st.err="Lecture impossible ("+(e.code||e.message)+")."}
  st.loading=false;render();
}
function svcGroup(k){return k==="midi"||k==="soir"?k:"evt"}
const SERIES=[["midi","Midi","var(--s1)"],["soir","Soir","var(--s2)"],["evt","Événements","var(--s3)"]];
function pct(a,b){return b?Math.round(a/b*100)+" %":"—"}
function renderStats(){
  const st=S.admin.stats;const [from,to]=statsRange();
  if(!st.rows||st.key!==st.period+from+to){if(!st.loading)setTimeout(loadStats,0)}
  const all=(st.rows||[]).filter(r=>st.site==="all"||r.siteId===st.site);
  const ok=all.filter(r=>r.status!=="annulee"), canc=all.length-ok.length;
  const cov=ok.reduce((a,r)=>a+(+r.covers||0),0);
  const t=todayStr(), past=ok.filter(r=>r.date<t||(r.date===t&&r.status!=="confirmee"));
  const noshow=past.filter(r=>r.status==="noshow").length, arrived=past.filter(r=>r.status==="arrivee").length;
  const web=ok.filter(r=>r.source!=="telephone").length;
  const filters=`<div class="toolbar stats-filters">
    <div class="field"><label for="stPeriod">Période</label><select id="stPeriod">${[["7","7 derniers jours"],["30","30 derniers jours"],["month","Mois en cours"],["prev","Mois précédent"],["next30","30 prochains jours"],["custom","Personnalisée"]].map(([v,l])=>`<option value="${v}" ${st.period===v?"selected":""}>${l}</option>`).join("")}</select></div>
    ${st.period==="custom"?`<div class="field"><label>Du</label><input type="date" id="stFrom" value="${from}"></div><div class="field"><label>Au</label><input type="date" id="stTo" value="${to}"></div>`:""}
    <div class="field"><label for="stSite">Restaurant</label><select id="stSite"><option value="all">Tous les restaurants</option>${ALL_SITES.map(([id,n,cl])=>`<option value="${id}" ${st.site===id?"selected":""}>${esc(n)}${cl?" (fermé)":""}</option>`).join("")}</select></div>
    <div class="tb-right"><button class="btn sm ghost" data-act="statsCsv">⤓ Export CSV</button><button class="btn sm ghost" data-act="statsReload">↻ Actualiser</button></div></div>`;
  if(st.loading&&!st.rows)return filters+`<div class="card empty">Chargement des statistiques…</div>`;
  if(st.err)return filters+`<div class="err">${esc(st.err)}</div>`;
  const tile=(lbl,val,sub)=>`<div class="kpi"><span>${lbl}</span><b>${val}</b>${sub?`<small>${sub}</small>`:""}</div>`;
  const kpis=`<div class="kpis">
    ${tile("Réservations",ok.length,canc?`${canc} annulée(s) · ${pct(canc,all.length)}`:"aucune annulation")}
    ${tile("Couverts",cov,ok.length?`${(cov/ok.length).toFixed(1).replace(".",",")} pers. / résa`:"")}
    ${tile("Taux de no-show",pct(noshow,noshow+arrived),`${noshow} sur ${noshow+arrived} pointées`)}
    ${tile("Réservées en ligne",pct(web,ok.length),`${ok.length-web} par téléphone`)}</div>`;
  if(!all.length)return filters+kpis+`<div class="card empty">Aucune réservation sur la période (${esc(fmtShort(from))} – ${esc(fmtShort(to))}).</div>`;
  // couverts par jour, empilés par service
  const days=[];for(let d=from;d<=to&&days.length<93;d=addDays(d,1))days.push(d);
  const byDay=days.map(d=>{const o={d,midi:0,soir:0,evt:0};ok.filter(r=>r.date===d).forEach(r=>o[svcGroup(r.service)]+=+r.covers||0);o.tot=o.midi+o.soir+o.evt;return o});
  const maxV=Math.max(10,...byDay.map(o=>o.tot));const step=Math.pow(10,Math.floor(Math.log10(maxV)));const top=Math.ceil(maxV/step)*step;
  const narrow=window.innerWidth<640;const W=narrow?420:900,H=narrow?220:240,pl=30,pb=22,pt=8,bw=(W-pl)/days.length,barW=Math.max(2,Math.min(28,bw-2));
  const y=v=>pt+(H-pt-pb)*(1-v/top);
  const grid=[0,top/2,top].map(v=>`<line x1="${pl}" x2="${W}" y1="${y(v)}" y2="${y(v)}" class="gl"/><text x="${pl-6}" y="${y(v)+4}" text-anchor="end" class="ax">${v}</text>`).join("");
  const lblEvery=Math.ceil(days.length/(narrow?5:12));
  const bars=byDay.map((o,i)=>{const x=pl+i*bw+(bw-barW)/2;let acc=0;const segs=SERIES.filter(([k])=>o[k]>0).map(([k,,c],j,arr)=>{const h=(H-pt-pb)*o[k]/top;const yy=y(acc+o[k]);acc+=o[k];const last=j===arr.length-1;
      return `<rect x="${x}" y="${yy+ (j>0?0:0)}" width="${barW}" height="${Math.max(0,h-(j<arr.length-1?2:0))}" fill="${c}" ${last?`rx="${Math.min(4,barW/2)}"`:""}/>`}).join("");
    const tip=`${new Date(o.d+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"})} — ${o.tot} couverts|Midi ${o.midi} · Soir ${o.soir}${o.evt?` · Événements ${o.evt}`:""}`;
    return `<g class="bar-g" data-tip="${esc(tip)}"><rect x="${pl+i*bw}" y="${pt}" width="${bw}" height="${H-pt-pb}" fill="transparent"/>${segs}</g>${i%lblEvery===0?`<text x="${x+barW/2}" y="${H-6}" text-anchor="middle" class="ax">${o.d.slice(8)}/${o.d.slice(5,7)}</text>`:""}`}).join("");
  const legend=`<div class="legend">${SERIES.map(([,l,c])=>`<span><i style="background:${c}"></i>${l}</span>`).join("")}</div>`;
  const chart=`<div class="card"><h2>Couverts réservés par jour</h2>${legend}<div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Couverts réservés par jour et par service">${grid}${bars}</svg><div class="tip hide" id="tip"></div></div></div>`;
  // par restaurant
  const bySite=ALL_SITES.map(([id,n,cl])=>{const L=all.filter(r=>r.siteId===id),O=L.filter(r=>r.status!=="annulee"),P=O.filter(r=>r.status==="arrivee"||r.status==="noshow");
    return {id,n,res:O.length,cov:O.reduce((a,r)=>a+(+r.covers||0),0),ns:P.filter(r=>r.status==="noshow").length,np:P.length,canc:L.length-O.length,tot:L.length,web:O.filter(r=>r.source!=="telephone").length,closed:cl,evt:O.filter(r=>svcGroup(r.service)==="evt").reduce((a,r)=>a+(+r.covers||0),0)}})
    .filter(x=>(st.site==="all"||x.id===st.site)&&!(x.closed&&!x.tot)).sort((a,b)=>b.cov-a.cov);
  const maxC=Math.max(1,...bySite.map(x=>x.cov));
  const siteTable=`<div class="card"><h2>Par restaurant</h2><table class="stable"><tr><th>Restaurant</th><th>Couverts</th><th class="num">Résas</th><th class="num">Pers./résa</th><th class="num">No-show</th><th class="num">Annul.</th><th class="num">En ligne</th><th class="num">Dont évén.</th></tr>
    ${bySite.map(x=>`<tr><td><b>${esc(x.n)}</b>${x.closed?` <small class="muted">(fermé)</small>`:""}</td><td><div class="hbar"><i style="width:${x.cov/maxC*100}%"></i><span>${x.cov}</span></div></td><td class="num">${x.res}</td><td class="num">${x.res?(x.cov/x.res).toFixed(1).replace(".",","):"—"}</td><td class="num">${pct(x.ns,x.np)}</td><td class="num">${pct(x.canc,x.tot)}</td><td class="num">${pct(x.web,x.res)}</td><td class="num">${x.evt||"—"}</td></tr>`).join("")}</table></div>`;
  // créneaux
  const byTime={};ok.forEach(r=>{byTime[r.time]=(byTime[r.time]||0)+(+r.covers||0)});
  const times=Object.entries(byTime).sort((a,b)=>b[1]-a[1]).slice(0,8);const maxT=Math.max(1,...times.map(x=>x[1]));
  const slotCard=`<div class="card"><h2>Créneaux les plus demandés</h2>${times.map(([tm,v])=>`<div class="hrow"><span>${tm.replace(":","h")}</span><div class="hbar"><i style="width:${v/maxT*100}%"></i><span>${v} couv.</span></div></div>`).join("")}</div>`;
  // événements
  const evAgg={};ok.filter(r=>svcGroup(r.service)==="evt").forEach(r=>{const k=r.eventTitle||svcLabel(r.service);evAgg[k]=evAgg[k]||{res:0,cov:0,sites:new Set()};evAgg[k].res++;evAgg[k].cov+=+r.covers||0;evAgg[k].sites.add(r.siteId)});
  const evCard=`<div class="card"><h2>Événements</h2>${Object.keys(evAgg).length?`<table class="stable"><tr><th>Événement</th><th class="num">Résas</th><th class="num">Couverts</th><th class="num">Sites</th></tr>${Object.entries(evAgg).sort((a,b)=>b[1].cov-a[1].cov).map(([k,v])=>`<tr><td><b>${esc(k)}</b></td><td class="num">${v.res}</td><td class="num">${v.cov}</td><td class="num">${v.sites.size}</td></tr>`).join("")}</table>`:`<div class="empty">Aucune réservation sur un événement.</div>`}</div>`;
  return `${filters}<p class="muted" style="margin:-6px 0 12px">${esc(fmtShort(from))} – ${esc(fmtShort(to))} · ${st.site==="all"?"tous les restaurants":esc(siteName(st.site))}${(st.rows||[]).length>=1000?" · limité aux 1000 premières réservations":""}</p>${kpis}${chart}${siteTable}<div class="svc">${slotCard}${evCard}</div>`;
}
function statsCsv(){
  const st=S.admin.stats;const rows=(st.rows||[]).filter(r=>st.site==="all"||r.siteId===st.site).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const head=["Date","Heure","Restaurant","Service","Personnes","Nom","Téléphone","Email","Statut","Canal","Commentaire","Référence"];
  const q=v=>`"${String(v??"").replace(/"/g,'""')}"`;
  return "﻿"+[head.join(";"),...rows.map(r=>[r.date,r.time,siteName(r.siteId),svcLabel(r.service,[r]),r.covers,`${r.firstName||""} ${r.lastName||""}`.trim(),r.phone,r.email,STATUS_LABEL[r.status]||r.status,r.source==="telephone"?"Téléphone":"En ligne",r.note,r.ref].map(q).join(";"))].join("\r\n");
}
async function downloadCsv(){
  const st=S.admin.stats;const [from,to]=statsRange();
  try{const dl=await claude.use("downloads").catch(()=>null);if(!dl){setExportMsg("Téléchargement indisponible dans cette vue.",true);return}
    await dl.save({filename:`reservations-${st.site}-${from}_${to}.csv`,data:statsCsv()})}
  catch(e){if(e&&e.code!=="declined")setExportMsg("Export impossible ("+esc(e.code||e.message)+").",true)}
}
/* ---------- Restaurants (siège) ---------- */
const FORMATS=["Centre commercial","Zone commerciale","Centre-ville","Shop in shop","Drive"];
function slugify(t){return norm(t).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,40)||"resto"}
function renderRestos(){
  const A=S.admin,f=A.rEdit;
  const rows=ALL_SITES.map(([id,n,cl])=>{const i=SITE_INFO[id];return `<tr class="${cl?"off-row":""}"><td><b>${esc(n)}</b>${cl?` <span class="pill p-annulee" style="text-decoration:none">Fermé</span>`:""}<br><small class="muted">${esc(i.addr)} · ${esc(i.cp)} ${esc(i.city)}</small></td>
    <td>${esc(i.fmt)}</td><td>${i.lat?`<small class="muted">${i.lat.toFixed(4)}, ${i.lon.toFixed(4)}</small>`:`<small class="err-inline">position manquante</small>`}</td>
    <td><div class="acts"><button class="btn sm ghost" data-redit="${id}">Modifier</button>${cl?`<button class="btn sm ghost" data-ropen="${id}">Réactiver</button>`:`<button class="btn sm red" data-rclose="${id}">Fermer</button>`}</div></td></tr>`}).join("");
  const form=f?`<div class="card"><h2>${f.isNew?"Nouveau restaurant":"Modifier "+esc(f.name)}</h2><form id="rf">
    <div class="row"><div class="field"><label>Nom affiché</label><input type="text" data-r="name" value="${esc(f.name)}" required maxlength="40" placeholder="ex. Lille Euralille"></div>
      <div class="field"><label>Format</label><select data-r="fmt">${FORMATS.map(x=>`<option ${f.fmt===x?"selected":""}>${x}</option>`).join("")}</select></div></div>
    <div class="field"><label>Adresse</label><input type="text" data-r="addr" value="${esc(f.addr)}" maxlength="120" placeholder="Centre commercial…, n° et rue"></div>
    <div class="row"><div class="field"><label>Code postal</label><input type="text" data-r="cp" value="${esc(f.cp)}" pattern="\\d{5}" required></div>
      <div class="field"><label>Ville</label><input type="text" data-r="city" value="${esc(f.city)}" required maxlength="60"></div></div>
    <div class="row"><div class="field"><label>Latitude</label><input type="text" data-r="lat" value="${f.lat||""}" placeholder="50.6435"></div>
      <div class="field"><label>Longitude</label><input type="text" data-r="lon" value="${f.lon||""}" placeholder="2.9865"></div></div>
    <p class="muted" style="font-size:13px;margin:-6px 0 12px">Position sur la carte : dans Google Maps, clic droit sur le restaurant → cliquez sur les coordonnées pour les copier, puis collez-les ici (« 50.6435, 2.9865 » dans Latitude remplit les deux). Sans coordonnées, le restaurant est placé au centre de sa ville ou de son département.</p>
    ${A.rMsg?`<div class="${A.rMsg.err?"err":"note"}">${esc(A.rMsg.t)}</div>`:""}
    <button class="btn">${f.isNew?"Créer le restaurant":"Enregistrer"}</button> <button type="button" class="btn ghost" data-act="rCancel">Annuler</button></form></div>`:"";
  return `${!f&&A.rMsg?`<div class="${A.rMsg.err?"err":"note"}">${esc(A.rMsg.t)}</div>`:""}${form}
    <div class="card"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><h2 style="margin:0">Restaurants (${SITES.length} ouverts)</h2>${!f?`<button class="btn sm" data-act="rNew" style="margin-left:auto">+ Nouveau restaurant</button>`:""}</div>
    <table><tr><th>Restaurant</th><th>Format</th><th>Carte</th><th></th></tr>${rows}</table>
    <p class="muted" style="font-size:13px;margin:12px 0 0">Fermer un restaurant le retire de la réservation en ligne, de la carte et des liens Google ; son historique reste dans les statistiques. Pensez à retirer aussi le lien « Réserver » de sa fiche Google.</p></div>`;
}
function guessCoords(f){
  const n=norm(f.city||"");if(CITY_COORDS[n])return CITY_COORDS[n];
  const d=GEO&&GEO.deps[deptOf(f.cp||"")];return d?[d[1],d[2]]:[0,0];
}
async function saveResto(){
  const A=S.admin,f=A.rEdit;const err=t=>{A.rMsg={t,err:true};render()};
  if(!f.name.trim())return err("Indiquez le nom du restaurant.");
  if(!/^\d{5}$/.test(f.cp||""))return err("Code postal invalide.");
  let lat=parseFloat(String(f.lat).replace(",",".")),lon=parseFloat(String(f.lon).replace(",","."));
  if(!(lat>41&&lat<51.5&&lon>-5.5&&lon<10)){if(f.lat||f.lon)return err("Coordonnées hors de France : vérifiez latitude / longitude.");[lat,lon]=guessCoords(f)}
  let id=f.id;if(f.isNew){id=slugify(f.name);let k=2;while(ALL_SITES.some(x=>x[0]===id))id=slugify(f.name)+"-"+(k++)}
  const data={name:f.name.trim(),addr:(f.addr||"").trim(),cp:f.cp,city:f.city.trim(),fmt:f.fmt||FORMATS[0],lat:+lat.toFixed(5),lon:+lon.toFixed(5),closed:!!f.closed,updatedAt:new Date().toISOString()};
  try{await ensureRestosSeeded();if(db)await db.doc("restaurants/"+id).set(data);RESTOS[id]=data;rebuildSites();A.rEdit=null;A.rMsg={t:`${data.name} enregistré.${f.isNew?" Pensez à régler ses horaires dans Paramétrage et à ajouter son lien dans sa fiche Google.":""}`};render()}
  catch(e){err("Enregistrement refusé ("+(e.code||e.message)+").")}
}
async function ensureRestosSeeded(){
  // première modification : on enregistre la liste par défaut dans la base
  if(Object.keys(RESTOS).length)return;
  for(const [id,name] of DEFAULT_SITES){const i=DEFAULT_SITE_INFO[id];const data={name,addr:i.addr,cp:i.cp,city:i.city,fmt:i.fmt,lat:i.lat,lon:i.lon,closed:false,updatedAt:new Date().toISOString()};
    if(db)await db.doc("restaurants/"+id).set(data);RESTOS[id]=data}
}
async function setRestoClosed(id,closed){
  const A=S.admin;
  try{
    let future=0;if(closed){const rs=db?(await db.collection("reservations").where("siteId","==",id).where("date",">=",todayStr()).get()).docs.map(d=>d.data()):memReservations.filter(r=>r.siteId===id&&r.date>=todayStr());future=rs.filter(r=>r.status!=="annulee").length}
    await ensureRestosSeeded();const data={...RESTOS[id],closed,updatedAt:new Date().toISOString()};
    if(db)await db.doc("restaurants/"+id).set(data);RESTOS[id]=data;rebuildSites();
    if(A.siteId===id&&closed)A.siteId=SITES[0]?SITES[0][0]:A.siteId;
    A.rMsg={t:closed?`${data.name} est fermé à la réservation.${future?` Attention : ${future} réservation(s) à venir restent à traiter (voir planning ou export).`:""}`:`${data.name} est de nouveau ouvert à la réservation.`,err:closed&&future>0};
  }catch(e){A.rMsg={t:"Modification refusée ("+(e.code||e.message)+").",err:true}}
  render();
}
/* ---------- Accès (siège) ---------- */
function renderAccess(){
  const A=S.admin;const ids=Object.keys(STAFF);
  const names=A.staffNames||{};
  if(user&&ids.some(id=>!names[id]))user.profiles(ids).then(ps=>{A.staffNames=Object.fromEntries(ids.map(id=>[id,ps[id].name||"Personne inconnue"]));if(A.tab==="acces")render()}).catch(()=>{});
  const sorted=ids.sort((a,b)=>(isSiegeRole(STAFF[b].role)-isSiegeRole(STAFF[a].role))||siteName(STAFF[a].siteId).localeCompare(siteName(STAFF[b].siteId))||(STAFF[a].role||"").localeCompare(STAFF[b].role||""));
  const list=ids.length?`<table><tr><th>Personne</th><th>Affectation</th><th>Fonction</th><th></th></tr>${sorted.map(id=>`<tr><td>${esc(names[id]||"…")}</td>
    <td><select data-staffsite="${esc(id)}">${affOptions(isSiegeRole(STAFF[id].role)?"siege":STAFF[id].siteId)}</select></td>
    <td><select data-staffrole="${esc(id)}">${rolesFor(isSiegeRole(STAFF[id].role)?"siege":"resto").map(([v,l])=>`<option value="${v}" ${((STAFF[id].role==="siege"?"siege-ops":STAFF[id].role)||"directeur")===v?"selected":""}>${l}</option>`).join("")}</select></td>
    <td>${id===myId?`<small class="muted">vous</small>`:`<button class="btn sm red" data-staffdel="${esc(id)}">Retirer</button>`}</td></tr>`).join("")}</table>`:`<div class="empty">Aucune personne affectée pour l'instant.</div>`;
  return `<div class="card how"><h2>Qui a accès à quoi ?</h2>
    <p><b>Adresse du back-office</b> (à mettre en favori, à ne pas diffuser aux clients) :</p>
    <div class="linkrow"><code>${esc((BASE_URL||"")+"#admin")}</code><button class="btn sm ghost" data-copy="${esc((BASE_URL||"")+"#admin")}">Copier</button></div>
    <p class="muted" style="font-size:13px">La page client n'affiche aucun lien vers cet espace, et une personne sans accès y voit « Accès réservé ».</p>
    <p>Seules les adresses <b>@${esc(SC_AUTH.domain)}</b> ajoutées ci-dessous peuvent se connecter (code reçu par e-mail) :</p>
    <ol><li><b>Siège</b> (Opérationnel ou Marketing) : accès à tout — statistiques, événements, restaurants, paramétrage, liens Google, accès.</li>
    <li><b>Directeurs et adjoints</b> : réservations de leur restaurant uniquement, pointage, résas téléphone, PDF/mail, capacité du jour.</li></ol>
    <p class="muted">Étapes : 1) choisissez l'affectation et la fonction ; 2) saisissez l'adresse (ou simplement prenom.nom) et cliquez dessus ; 3) envoyez-lui l'adresse du back-office. Retirer une personne lui coupe l'accès immédiatement.</p></div>
    <div class="card"><h2>Affecter une personne</h2>
      <div class="toolbar"><div class="field" style="flex:1;position:relative"><label for="staffQ">Adresse e-mail</label><input type="text" id="staffQ" autocomplete="off" placeholder="prenom.nom@${esc(SC_AUTH.domain)}"><div class="sugg" id="staffSugg"></div></div>
      <div class="field"><label for="staffSite">Affectation</label><select id="staffSite">${affOptions(A.newAff||SITES[0][0])}</select></div>
      <div class="field"><label for="staffRole">Fonction</label><select id="staffRole">${rolesFor(A.newAff==="siege"?"siege":"resto").map(([v,l])=>`<option value="${v}" ${A.newRole===v?"selected":""}>${l}</option>`).join("")}</select></div></div>
      <p class="muted" style="font-size:13px;margin:0">Choisissez l'affectation et la fonction, puis tapez un nom et cliquez sur la personne. Chaque directeur et adjoint a son propre accès, limité à son restaurant ; un profil Siège (Opérationnel ou Marketing) voit tous les restaurants et tous les onglets.</p>
      ${A.staffMsg?`<div class="${A.staffMsg.err?"err":"note"}">${esc(A.staffMsg.t)}</div>`:""}
      ${!user?`<div class="note">La recherche de personnes n'est pas disponible en mode démo.</div>`:""}</div>
    <div class="card"><h2>Personnes affectées</h2>${list}</div>`;
}
const ROLES=[["siege-ops","Siège – Opérationnel"],["siege-marketing","Siège – Marketing"],["directeur","Directeur / Directrice"],["adjoint","Adjoint(e)"]];
async function setStaff(id,siteId,role){
  const A=S.admin;role=role||(STAFF[id]&&STAFF[id].role)||"directeur";siteId=siteId||(STAFF[id]&&STAFF[id].siteId);
  try{if(db)await db.doc("staff/"+id).set({siteId,role,updatedAt:new Date().toISOString()});STAFF[id]={siteId,role};A.staffMsg={t:"Affectation enregistrée."}}
  catch(e){A.staffMsg={t:"Enregistrement refusé ("+(e.code||e.message)+").",err:true}}
  render();
}
async function delStaff(id){
  const A=S.admin;try{if(db)await db.doc("staff/"+id).delete();delete STAFF[id];A.staffMsg={t:"Affectation retirée."}}catch(e){A.staffMsg={t:"Suppression refusée ("+(e.code||e.message)+").",err:true}}
  render();
}
function renderPhoneForm(){
  return `<div class="card"><h2>Réservation prise par téléphone</h2><form id="pf">
    <div class="row"><div class="field"><label>Service</label><select id="pSvc">${svcKeys(S.admin.siteId,S.admin.date).map(k=>`<option value="${esc(k)}">${esc(svcLabel(k))}</option>`).join("")}</select></div>
    <div class="field"><label>Heure</label><input type="time" id="pTime" step="900" required></div></div>
    <div class="row"><div class="field"><label>Nom</label><input type="text" id="pName" required></div>
    <div class="field"><label>Téléphone</label><input type="tel" id="pPhone" required></div></div>
    <div class="row"><div class="field"><label>Personnes</label><input type="number" id="pCov" min="1" value="5" required></div>
    <div class="field"><label>Commentaire</label><input type="text" id="pNote"></div></div>
    <button class="btn">Ajouter</button> <button type="button" class="btn ghost" data-act="cancelPhone">Fermer</button></form></div>`;
}

function sortedSites(){
  let L=SITES.map(([id,n])=>({id,n,i:SITE_INFO[id],d:S.origin?km(S.origin,SITE_INFO[id]):null}));
  const fe=S.evFocus&&EVENTS[S.evFocus.id];if(fe)L=L.filter(x=>eventAppliesTo(fe,x.id));
  if(S.origin)L.sort((a,b)=>a.d-b.d);
  return L;
}
function renderLoc(){
  const list=document.getElementById("locList");if(!list)return;
  const L=sortedSites();
  const clr=document.querySelector(".clr");if(clr)clr.classList.toggle("hide",!(S.q||S.origin));
  document.getElementById("locInfo").innerHTML=S.origin?`Restaurants les plus proches de <b>${esc(S.origin.label)}</b>${S.origin.precise?"":" <span class=\"muted\">(distance depuis le centre du département)</span>"}`:`<span class="muted">${SITES.length} restaurants Salad&amp;Co</span>`;
  list.innerHTML=L.map(({id,n,i,d},k)=>{const c=cfg(id);return `<div class="loc-item ${S.hover===id?"hl":""}" data-hover="${id}">
    <div class="loc-num">${k+1}</div>
    <div class="loc-txt"><b>${esc(n)}</b>${S.evFocus&&EVENTS[S.evFocus.id]&&eventAppliesTo(EVENTS[S.evFocus.id],id)?`<span class="ev-badge">★ ${esc(EVENTS[S.evFocus.id].title)}</span>`:""}<small>${esc(i.addr)}<br>${i.cp} ${esc(i.city)} · ${esc(i.fmt)}</small></div>
    <div class="loc-act">${d!=null?`<span class="km">≈ ${d<10?d.toFixed(1):Math.round(d)} km</span>`:""}
    <button class="btn sm" data-site="${id}" ${c.active?"":"disabled"}>${c.active?"Réserver":"Indisponible"}</button></div></div>`}).join("");
  renderMap(L);
}
function renderMap(L){
  const box=document.getElementById("locMap");if(!box)return;
  let vb=[0,0,1040,1000];
  const pts=L.map(x=>proj(x.i.lat,x.i.lon));
  const focus=[];
  if(S.zoomIds){L.forEach((x,k)=>{if(S.zoomIds.includes(x.id))focus.push(pts[k])})}
  else if(S.origin){focus.push(proj(S.origin.lat,S.origin.lon));L.slice(0,3).forEach((x,k)=>{if(k===0||x.d<L[0].d*1.6+40)focus.push(pts[k])})}
  if(focus.length){
    let x0=Math.min(...focus.map(p=>p[0])),x1=Math.max(...focus.map(p=>p[0])),y0=Math.min(...focus.map(p=>p[1])),y1=Math.max(...focus.map(p=>p[1]));
    let w=Math.max(Math.max(x1-x0,y1-y0)*1.6+40,S.zoomIds?45:130);const cx=(x0+x1)/2,cy=(y0+y1)/2;vb=[cx-w/2,cy-w/2,w,w];
  }
  const sc=vb[2]/((box.clientWidth||500)-16), r=11*sc, fs=12*sc;
  // regroupement des repères trop proches à l'échelle affichée
  const items=L.map((x,k)=>({x,k,p:pts[k]}));const groups=[];
  items.forEach(it=>{const g=groups.find(g=>Math.hypot(g.p[0]-it.p[0],g.p[1]-it.p[1])<r*2.1);if(g){g.m.push(it)}else groups.push({p:it.p,m:[it]})});
  const pins=groups.sort((a,b)=>a.m.some(i=>i.x.id===S.hover)-b.m.some(i=>i.x.id===S.hover)).map(g=>{
    if(g.m.length>1){const [px,py]=g.p;const ids=g.m.map(i=>i.x.id).join(",");const names=g.m.map(i=>i.x.n).join(", ");
      return `<g class="pin grp" data-zoom="${ids}" tabindex="0" role="button" aria-label="${g.m.length} restaurants : ${esc(names)}"><title>${esc(names)}</title>
      <circle cx="${px}" cy="${py}" r="${r*1.45}"/><text x="${px}" y="${py+fs*.36}" font-size="${fs}" class="num" text-anchor="middle">+${g.m.length}</text></g>`}
    const {x,k,p}=g.m[0];const [px,py]=p;const hl=S.hover===x.id;const rr=hl?r*1.25:r;return `<g class="pin ${hl?"hl":""}" data-site="${x.id}" data-hover="${x.id}" tabindex="0" role="button" aria-label="${esc(x.n)}"><title>${esc(x.n)}</title>
    <circle cx="${px}" cy="${py}" r="${rr}"/><text x="${px}" y="${py+fs*.36}" font-size="${fs}" class="num" text-anchor="middle">${k+1}</text>${hl?`<text x="${px+rr+4*sc}" y="${py+fs*.36}" font-size="${fs*1.15}" class="lbl">${esc(x.n)}</text>`:""}</g>`}).join("");
  const me=S.origin?(()=>{const [mx,my]=proj(S.origin.lat,S.origin.lon);return `<g class="me"><circle cx="${mx}" cy="${my}" r="${r*1.5}" class="halo"/><circle cx="${mx}" cy="${my}" r="${r*.6}"/></g>`})():"";
  box.innerHTML=`<svg viewBox="${vb.join(" ")}" preserveAspectRatio="xMidYMid meet">
    ${GEO?`<path d="${GEO.path}" class="deps" stroke-width="${1.2*sc}"/>`:`<text x="520" y="500" text-anchor="middle" class="muted">Chargement de la carte…</text>`}
    ${me}${pins}</svg>
    ${focus.length?`<button class="btn sm ghost zoomout" data-act="fullMap">Voir toute la France</button>`:""}`;
}
function renderSugg(){
  const el=document.getElementById("sugg");if(!el)return;
  el.innerHTML=S.sugg.length?S.sugg.map((x,k)=>`<button data-sg="${k}">${esc(x.label)}</button>`).join(""):(S.q.trim().length>=2&&!S.origin?`<div class="none">Aucun résultat</div>`:"");
}
function pickSugg(k){
  const x=S.sugg[k];if(!x)return;
  if(x.site){location.hash="resto-"+x.site;return}
  const o=originFor(x.label,x.dept,x.name);if(!o)return;
  S.origin=o;S.q=x.label;S.sugg=[];S.zoomIds=null;
  const inp=document.getElementById("q");if(inp)inp.value=x.label;
  renderSugg();renderLoc();
}
function render(){
  // la page client ne montre aucun lien vers le back-office
  document.getElementById("hdrNav").innerHTML=S.view==="admin"?`<a href="#reserver" target="_self">Voir la page client</a>`:"";
  document.getElementById("hdrSub").textContent=S.view==="admin"?"Back-office":"Réservation en ligne";
  document.body.classList.toggle("v-admin",S.view==="admin");
  document.getElementById("app").innerHTML=S.view==="admin"?renderAdmin():renderClient();
  renderLoc();renderSugg();
}

/* ====================== Interactions ====================== */
document.addEventListener("click",async e=>{
  const t=e.target.closest("button,a,g.pin");if(!t)return;
  const A=S.admin;
  if(t.dataset.sg!==undefined){pickSugg(+t.dataset.sg);return}
  if(t.dataset.zoom){S.zoomIds=t.dataset.zoom.split(",");renderMap(sortedSites());return}
  if(t.dataset.site){location.hash="resto-"+t.dataset.site;return}
  if(t.dataset.slot){S.time=t.dataset.slot;S.service=t.dataset.svc;render();return}
  if(t.dataset.evdate){S.date=t.dataset.evdate;S.time=null;subscribeResas(S.siteId,S.date);render();return}
  if(t.dataset.tab){A.tab=t.dataset.tab;A.rEdit=null;A.rMsg=null;A.editCfg=null;A.msg=null;A.evEdit=null;A.evMsg=null;render();return}
  if(t.dataset.evedit){A.evEdit=JSON.parse(JSON.stringify(EVENTS[t.dataset.evedit]));if(A.evEdit.recur==="once"&&!A.evEdit.date)A.evEdit.date=todayStr();A.evMsg=null;render();return}
  if(t.dataset.evdel){if(t.textContent!=="Confirmer ?"){t.textContent="Confirmer ?";return}await deleteEvent(t.dataset.evdel);return}
  if(t.dataset.redit){const i=SITE_INFO[t.dataset.redit];A.rEdit={id:t.dataset.redit,name:siteName(t.dataset.redit),...i};A.rMsg=null;render();return}
  if(t.dataset.rclose){if(t.textContent!=="Confirmer ?"){t.textContent="Confirmer ?";return}await setRestoClosed(t.dataset.rclose,true);return}
  if(t.dataset.ropen){await setRestoClosed(t.dataset.ropen,false);return}
  if(t.dataset.evgo){const [id,date,site]=t.dataset.evgo.split("|");S.evFocus={id,date};
    if(site){location.hash="resto-"+site}else{render();const el=document.querySelector(".loc");if(el)el.scrollIntoView({behavior:"smooth",block:"start"})}return}
  if(t.dataset.role){demoRole=t.dataset.role;A.tab="jour";render();return}
  if(t.dataset.staffpick){const sel=document.getElementById("staffSite"),ro=document.getElementById("staffRole");const aff=sel?sel.value:SITES[0][0];await setStaff(t.dataset.staffpick,aff,ro&&ro.value?ro.value:(aff==="siege"?"siege-ops":"directeur"));return}
  if(t.dataset.staffdel){if(t.textContent!=="Confirmer ?"){t.textContent="Confirmer ?";return}await delStaff(t.dataset.staffdel);return}
  if(t.dataset.capedit){A.capEdit=t.dataset.capedit;A.capScope="day";A.exportMsg=null;render();return}
  if(t.dataset.dhreset){const c=A.editCfg||JSON.parse(JSON.stringify(cfg(A.siteId)));A.editCfg=c;if(c.days)delete c.days[t.dataset.dhreset];A.msg=null;render();return}
  if(t.dataset.copy){try{await navigator.clipboard.writeText(t.dataset.copy);t.textContent="Copié ✓"}catch{t.textContent="Sélectionnez le lien"}return}
  if(t.dataset.st){const st=t.dataset.st;if(st==="annulee"&&t.textContent!=="Confirmer ?"){t.textContent="Confirmer ?";return}
    try{await updateResa(t.dataset.id,{status:st,updatedAt:new Date().toISOString()})}catch(err){alertMsg("Échec de la mise à jour ("+(err.code||err.message)+")")}return}
  const act=t.dataset.act;if(!act)return;
  if(act==="logout"){SC_AUTH.signOut();return}
  if(act==="loginBack"){S.login={step:1,email:S.login.email,msg:null,busy:false};render();return}
  const c=S.siteId?cfg(S.siteId):DEFAULT_CFG;
  switch(act){
    case "minus":S.covers=Math.max(S.siteId?minCoversFor(S.siteId,S.date):c.minCovers,S.covers-1);S.time=null;break;
    case "plus":S.covers=Math.min(S.siteId?Math.max(...svcKeys(S.siteId,S.date).map(k=>svcCap(S.siteId,k,S.date))):c.capacity,S.covers+1);S.time=null;break;
    case "next":if(S.time){S.step=3;S.error=null}break;
    case "back":S.step=2;S.error=null;break;
    case "change":e.preventDefault();S.siteId=null;S.step=1;S.time=null;location.hash="reserver";break;
    case "restart":S.done=null;S.step=2;S.time=null;break;
    case "prevDay":A.capEdit=null;A.date=addDays(A.date,-1);subscribeResas(A.siteId,A.date);break;
    case "nextDay":A.capEdit=null;A.date=addDays(A.date,1);subscribeResas(A.siteId,A.date);break;
    case "today":A.capEdit=null;A.date=todayStr();subscribeResas(A.siteId,A.date);break;
    case "clearQ":S.q="";S.origin=null;S.sugg=[];S.zoomIds=null;break;
    case "fullMap":S.zoomIds=null;if(!S.origin){break}S.origin=null;S.q="";S.sugg=[];break;
    case "pdf":downloadPdf();return;
    case "mailOpen":A.mail=true;A.exportMsg=null;break;
    case "mailClose":A.mail=false;break;
    case "phoneResa":A.phone=true;break;
    case "cancelPhone":A.phone=false;break;
    case "rNew":A.rEdit={isNew:true,name:"",addr:"",cp:"",city:"",fmt:FORMATS[0],lat:"",lon:""};A.rMsg=null;break;
    case "rCancel":A.rEdit=null;A.rMsg=null;break;
    case "evFocusClear":e.preventDefault();S.evFocus=null;break;
    case "togglePreview":A.preview=A.preview?null:(SITES.some(x=>x[0]===A.siteId)?A.siteId:SITES[0][0]);A.tab="jour";subscribeResas(A.preview||A.siteId,A.date);break;
    case "statsReload":A.stats.rows=null;A.stats.key=null;break;
    case "statsCsv":downloadCsv();return;
    case "capCancel":A.capEdit=null;break;
    case "capReset":await saveCap(true);return;
    case "evNew":A.evEdit=newEvent();A.evMsg=null;break;
    case "evCancel":A.evEdit=null;A.evMsg=null;break;
    case "resetCfg":A.editCfg=null;A.msg=null;break;
    case "saveCfg":await saveCfg();break;
  }
  render();
});
function alertMsg(m){S.admin.msg={t:m,err:true};render()}

document.addEventListener("change",e=>{
  const t=e.target, A=S.admin;
  if(t.id==="date"){S.date=t.value||todayStr();S.time=null;S.covers=Math.max(S.covers,minCoversFor(S.siteId,S.date));subscribeResas(S.siteId,S.date);render()}
  if(t.id==="aSite"){A.capEdit=null;A.exportMsg=null;A.siteId=t.value;A.editCfg=null;A.msg=null;subscribeResas(A.siteId,A.date);render()}
  if(t.id==="aDate"){A.capEdit=null;A.exportMsg=null;A.date=t.value||todayStr();subscribeResas(A.siteId,A.date);render()}
  if(A.rEdit&&t.dataset.r){A.rEdit[t.dataset.r]=t.value;return}
  if(t.id==="pvSite"){A.preview=t.value;A.siteId=t.value;subscribeResas(t.value,A.date);render();return}
  if(t.name==="capScope"){A.capScope=t.value;return}
  if(t.id==="stPeriod"){A.stats.period=t.value;if(t.value==="custom"){const [f,to]=[addDays(todayStr(),-29),todayStr()];A.stats.from=A.stats.from||f;A.stats.to=A.stats.to||to}render();return}
  if(t.id==="stFrom"||t.id==="stTo"){A.stats[t.id==="stFrom"?"from":"to"]=t.value;render();return}
  if(t.id==="stSite"){A.stats.site=t.value;render();return}
  if(t.dataset.staffsite){const id=t.dataset.staffsite,cur=STAFF[id]||{};
    if(t.value==="siege"){setStaff(id,"siege",isSiegeRole(cur.role)?cur.role:"siege-ops")}
    else setStaff(id,t.value,isSiegeRole(cur.role)?"directeur":cur.role);return}
  if(t.id==="staffRole"){A.newRole=t.value;return}
  if(t.id==="staffSite"){A.newAff=t.value;A.newRole=rolesFor(t.value==="siege"?"siege":"resto")[0][0];render();const q=document.getElementById("staffQ");return}
  if(t.dataset.staffrole){setStaff(t.dataset.staffrole,null,t.value);return}
  if(A.evEdit&&(t.dataset.e||t.dataset.esite)){
    const f=A.evEdit;
    if(t.dataset.esite){f.sites=t.checked?[...new Set([...(f.sites||[]),t.dataset.esite])]:(f.sites||[]).filter(x=>x!==t.dataset.esite)}
    else{const k=t.dataset.e;f[k]=t.type==="checkbox"?t.checked:t.value;}
    A.evMsg=null;
    if(["scope","recur"].includes(t.dataset.e))render();
    return;
  }
  if(t.dataset.dh){const c=A.editCfg||JSON.parse(JSON.stringify(cfg(A.siteId)));A.editCfg=c;c.days=c.days||{};
    const [d,svc,k]=t.dataset.dh.split(".");c.days[d]=c.days[d]||{};c.days[d][svc]=c.days[d][svc]||{};
    if(t.value===c[svc][k])delete c.days[d][svc][k];else c.days[d][svc][k]=t.value;
    if(!Object.keys(c.days[d][svc]).length)delete c.days[d][svc];if(!Object.keys(c.days[d]).length)delete c.days[d];
    A.msg=null;render();return}
  if(t.dataset.c||t.dataset.day){
    const c=A.editCfg||JSON.parse(JSON.stringify(cfg(A.siteId)));A.editCfg=c;
    if(t.dataset.day){const d=+t.dataset.day;c.openDays=t.checked?[...new Set([...c.openDays,d])]:c.openDays.filter(x=>x!==d)}
    else{const [k,sub]=t.dataset.c.split(".");const v=t.type==="checkbox"?t.checked:(t.type==="number"||k==="stepMin")?+t.value:t.value;
      if(sub&&!c[k])c[k]={};
      if(sub)c[k][sub]=v;else c[k]=v}
    A.msg=null;
  }
});

document.addEventListener("input",e=>{
  if(S.admin.rEdit&&e.target.dataset&&e.target.dataset.r){const f=S.admin.rEdit,k=e.target.dataset.r;f[k]=e.target.value;
    if(k==="lat"&&/,\s*-?\d/.test(e.target.value)&&/^\s*-?\d+[.]\d+\s*,\s*-?\d+[.]\d+\s*$/.test(e.target.value)){const [a,b]=e.target.value.split(",");f.lat=a.trim();f.lon=b.trim();render()}
    return}
  if(S.admin.evEdit&&e.target.dataset&&e.target.dataset.e&&e.target.type!=="radio"&&e.target.type!=="checkbox"){S.admin.evEdit[e.target.dataset.e]=e.target.value;return}
  if(e.target.id==="staffQ"){const q=e.target.value;if(!user)return;user.search(q).then(hits=>{const el=document.getElementById("staffSugg");if(!el)return;el.innerHTML="";
    hits.forEach(h=>{const b=document.createElement("button");b.type="button";b.dataset.staffpick=h.id;b.textContent=h.name+(h.email?" — "+h.email:"");el.appendChild(b)});
    if(!hits.length&&q.trim()){const d=document.createElement("div");d.className="none";d.textContent="Aucun résultat";el.appendChild(d)}});return}
  if(e.target.id!=="q")return;
  S.q=e.target.value;S.origin=null;S.zoomIds=null;S.sugg=suggestions(S.q);renderSugg();renderLoc();
});
document.addEventListener("keydown",e=>{
  if(e.target.id==="q"&&e.key==="Enter"){e.preventDefault();pickSugg(0)}
  if(e.target.matches&&e.target.matches("g.pin")&&(e.key==="Enter"||e.key===" ")){e.preventDefault();if(e.target.dataset.zoom){S.zoomIds=e.target.dataset.zoom.split(",");renderMap(sortedSites())}else location.hash="resto-"+e.target.dataset.site}
});
document.addEventListener("mousemove",e=>{
  const tip=document.getElementById("tip");if(!tip)return;const g=e.target.closest&&e.target.closest(".bar-g");
  if(!g){tip.classList.add("hide");return}
  const [a,b]=g.dataset.tip.split("|");tip.innerHTML=`<b>${esc(a)}</b><br>${esc(b)}`;tip.classList.remove("hide");
  const box=tip.parentElement.getBoundingClientRect();let x=e.clientX-box.left+12;if(x+tip.offsetWidth>box.width)x=e.clientX-box.left-tip.offsetWidth-12;
  tip.style.left=x+"px";tip.style.top=(e.clientY-box.top-10)+"px";
});
let hoverT=null;
document.addEventListener("mouseover",e=>{
  const h=e.target.closest&&e.target.closest("[data-hover]");const id=h?h.dataset.hover:null;
  if(id===S.hover)return;clearTimeout(hoverT);hoverT=setTimeout(()=>{S.hover=id;
    document.querySelectorAll(".loc-item").forEach(el=>el.classList.toggle("hl",el.dataset.hover===id));
    renderMap(sortedSites());},40);
});
document.addEventListener("submit",async e=>{
  e.preventDefault();
  if(e.target.id==="f") return submitClient();
  if(e.target.id==="lf") return loginSend();
  if(e.target.id==="lc") return loginVerify();
  if(e.target.id==="pf") return submitPhone();
  if(e.target.id==="mf") return sendMail();
  if(e.target.id==="ef") return saveEvent();
  if(e.target.id==="cf") return saveCap(false);
  if(e.target.id==="rf") return saveResto();
});

async function submitClient(){
  const v=id=>document.getElementById(id).value.trim();
  const r={ref:newRef(),siteId:S.siteId,date:S.date,service:S.service,time:S.time,covers:S.covers,
    firstName:v("fn"),lastName:v("ln"),email:v("em"),phone:v("ph"),note:v("nt"),
    status:"confirmee",source:"web",createdAt:new Date().toISOString()};
  if(evOf(r.service))r.eventTitle=evOf(r.service).title;
  S.saving=true;S.error=null;render();
  try{
    const fresh=await fetchResas(r.siteId,r.date);       // contrôle capacité au dernier moment
    const st=serviceState(r.siteId,r.date,r.service,fresh,r.covers);
    if(!st.open||!st.slots.includes(r.time)) throw new Error(st.reason||"Créneau indisponible.");
    await saveResa(r);
    S.done=r;
  }catch(err){S.error=err.code==="quota_exceeded"?"Capacité de stockage atteinte, contactez le restaurant.":(err.message||"Erreur, réessayez.")}
  S.saving=false;render();
}
async function submitPhone(){
  const A=S.admin, v=id=>document.getElementById(id).value.trim();
  const time=v("pTime");
  const r={ref:newRef(),siteId:A.siteId,date:A.date,service:v("pSvc"),time,covers:+v("pCov"),
    firstName:"",lastName:v("pName"),email:"",phone:v("pPhone"),note:v("pNote"),
    status:"confirmee",source:"telephone",createdAt:new Date().toISOString()};
  if(evOf(r.service))r.eventTitle=evOf(r.service).title;
  try{await saveResa(r);A.phone=false;render()}catch(err){alertMsg("Échec ("+(err.code||err.message)+")")}
}
async function saveCfg(){
  const A=S.admin,c=A.editCfg;if(!c){A.msg={t:"Aucune modification."};return}
  for(const svc of ["midi","soir"]) if(toMin(c[svc].start)>toMin(c[svc].end)){A.msg={t:`Service ${svc} : le premier créneau doit précéder le dernier.`,err:true};return}
  for(const [d,o] of Object.entries(c.days||{}))for(const svc of ["midi","soir"]){const h={...c[svc],...(o[svc]||{})};if(toMin(h.start)>toMin(h.end)){A.msg={t:`${DAY_LABEL[+d]}, service ${svc} : le premier créneau doit précéder le dernier.`,err:true};return}}
  for(const svc of ["midi","soir"]) if(c[svc].capacity&&c.minCovers>c[svc].capacity){A.msg={t:"Le minimum de couverts dépasse la capacité du service "+svc+".",err:true};return}
  const data={...(siteDocs[A.siteId]||{}),active:c.active,midi:c.midi,soir:c.soir,days:c.days||{},minCovers:c.minCovers,capacity:c.capacity,stepMin:c.stepMin,maxAdvanceDays:c.maxAdvanceDays,openDays:c.openDays,updatedAt:new Date().toISOString()};
  try{
    if(db) await db.doc("sites/"+A.siteId).set(data); else siteDocs[A.siteId]=data;
    siteDocs[A.siteId]=data;A.editCfg=null;A.msg={t:"Paramétrage enregistré pour "+siteName(A.siteId)+"."};
  }catch(err){A.msg={t:"Enregistrement refusé ("+(err.code||err.message)+").",err:true}}
}

/* ====================== Démarrage ====================== */
rebuildSites();
route();
fetch("geo.json").then(r=>r.json()).then(g=>{GEO=g;if(S.q)S.sugg=suggestions(S.q);renderLoc();renderSugg()}).catch(()=>{});
(async()=>{
  try{ db=await claude.use("db"); }catch{ db=null }
  try{ user=await claude.use("user"); canEdit=user?!!(await user.canEdit()):false; myId=user?await user.id():null }catch{ canEdit=false }
  if(!db){canEdit=false;document.getElementById("app").innerHTML=`<div class="card err">Service momentanément indisponible. Merci de réessayer plus tard ou d'appeler le restaurant.</div>`;return}
  dbReady=true;
  const timer=setTimeout(()=>{document.getElementById("hdrSub").textContent="Réservation en ligne · connexion lente…"},10000);
  db.collection("sites").onSnapshot(snap=>{
    clearTimeout(timer);document.getElementById("hdrSub").textContent="Réservation en ligne";
    snap.docs.forEach(d=>siteDocs[d.id]=d.data());render();
  },()=>clearTimeout(timer));
  db.collection("restaurants").onSnapshot(snap=>{Object.keys(RESTOS).forEach(k=>delete RESTOS[k]);snap.docs.forEach(d=>RESTOS[d.id]=d.data());rebuildSites();render()},()=>{});
  db.collection("caps").onSnapshot(snap=>{snap.docs.forEach(d=>CAPS[d.id]=d.data());render()},()=>{});
  db.collection("staff").onSnapshot(snap=>{Object.keys(STAFF).forEach(k=>delete STAFF[k]);snap.docs.forEach(d=>STAFF[d.id]=d.data());S.admin.staffNames=null;render()},()=>{});
  db.collection("events").onSnapshot(snap=>{
    Object.keys(EVENTS).forEach(k=>delete EVENTS[k]);
    snap.docs.forEach(d=>EVENTS[d.id]={id:d.id,...d.data()});render();
  },()=>{});
  S.resaKey=null; route();
})();
