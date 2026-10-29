
(function(){
"use strict";


const LS_KEYS = {
  SIM_DATE: "ops_demo_v1_sim_date",       // ISO string or null (null = real time)
  REAL_CLOCK: "ops_demo_v1_real_clock",   // "1" once someone explicitly chooses the real production clock

  DATA_OVERRIDE: "ops_demo_v1_data_override", // JSON snapshot if imported
  PLANNING: "ops_demo_v1_planning",       // Planning Store: authored tasks, decisions, notes, dismissals
  PREVIEW_DAYOF: "ops_demo_v1_preview_dayof", // "1" while a manager has deliberately opted in, THIS SESSION


  TASKS_RESET_MIGRATION: "ops_demo_v1_tasks_reset_migration", // RESET TASKS milestone: set to






  VENUE_TIMELINE_RESET_MIGRATION: "ops_demo_v1_venue_timeline_reset_migration", // VENUE AND TIMELINE DATA







  TIMELINE_SHEET_IMPORT_MIGRATION: "ops_demo_v1_timeline_sheet_import_migration", // GOOGLE SHEET TIMELINE







  CHECKLIST_TASK_IMPORT_MIGRATION: "ops_demo_v1_checklist_task_import_migration"
  
};

function isPreviewMode(){ return true; }

const TASKS_RESET_MIGRATION_VERSION = "2026-08-20-v1";

const VENUE_TIMELINE_RESET_MIGRATION_VERSION = "2026-08-21-v1";

const TIMELINE_SHEET_IMPORT_MIGRATION_VERSION = "2030-06-13-ceremony-10am-v2";
const CHECKLIST_TASK_IMPORT_MIGRATION_VERSION = "2026-08-28-v1";

const ALL_AUDIO_DOWNLOAD_URL = "assets/demo-audio-notice.txt";

const ICONS = {
  mission: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"/></svg>',
  timeline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  directory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 4v16"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.22a2 2 0 0 1 2.11-.45c.83.31 1.71.53 2.61.65A2 2 0 0 1 22 16.92z"/></svg>',
  message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c.7-3.4 3.2-5.4 6.2-5.4s5.5 2 6.2 5.4"/><circle cx="17.5" cy="8.5" r="2.5"/><path d="M15.6 14.7c2.4.3 4.2 2.1 4.8 4.9"/></svg>',
  person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c.9-4 3.5-6.2 7.2-6.2s6.3 2.2 7.2 6.2"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 4.6L3 17.2V21h3.8l6.3-6.3a4 4 0 0 0 4.6-5.4l-2.8 2.8-2.6-.6-.6-2.6z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56v.08h-3v-.08A1.7 1.7 0 0 0 10.66 18.7a1.7 1.7 0 0 0-1.88.34l-.06.06L6.6 16.98l.06-.06A1.7 1.7 0 0 0 7 15.04a1.7 1.7 0 0 0-1.56-1.04h-.08v-3h.08A1.7 1.7 0 0 0 7 9.96a1.7 1.7 0 0 0-.34-1.88L6.6 8.02 8.72 5.9l.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.04-1.56V4.66h3v.08a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.04h.08v3h-.08A1.7 1.7 0 0 0 19.4 15z"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>',
  alertTriangle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 21.5 20h-19z"/><path d="M12 9.5v4.2"/><circle cx="12" cy="17" r=".6" fill="currentColor" stroke="none"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.6 2.6L16.2 9"/></svg>',
  infoCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.3"/><circle cx="12" cy="8" r=".6" fill="currentColor" stroke="none"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r=".7" fill="currentColor" stroke="none"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M13 5l7 7-7 7"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4.5" width="12" height="17" rx="2"/><path d="M9 4.5V3.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 11.5l2 2 4-4.4"/></svg>',
  siren: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15a7 7 0 0 1 14 0v3H5z"/><path d="M12 4v3M5.5 8.5l1.8 1.8M18.5 8.5l-1.8 1.8"/><path d="M3 21h18"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 19a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 16.6 8.1 4 4 0 0 1 17.5 16"/><path d="M6.5 19h11"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.3S3.5 15 3.5 8.9A4.9 4.9 0 0 1 12 5.6a4.9 4.9 0 0 1 8.5 3.3C20.5 15 12 20.3 12 20.3z"/></svg>',
  shirt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 6l2 3 2-1.3V21h8V7.7L18 9l2-3-4-3-2 2h-4z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 5.2-5.2 2.2 2.2-5.2z"/></svg>',
  shuttle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="10" rx="2.5"/><path d="M3 12h18M8 17v2M16 17v2"/><circle cx="7.5" cy="19.2" r="1"/><circle cx="16.5" cy="19.2" r="1"/></svg>'
};


const state = {
  
  view: "mission",           // mission | timeline | directory
  
  planningMode: true,
  timelineDayFilter: "all",
  timelineAudience: "ops",   // view preview only — which tier's timeline am I looking at
  timelineEventId: null,     // event-first Timeline: null = show the event picker cards
  planningFilter: "blocking",
  missionDrill: null,        // null (Mission overview) | "tasks" | "event" — progressive-disclosure


  missionEventId: null,      // which event's workspace is open, when missionDrill === "event"
  taskScopeId: null,         // event id, or "__wedding_wide", when missionDrill === "tasks" and a

  taskScopeReturnsToHub: false, // RANDOM-PAGE CLARITY: true when the current task-scope detail was


  eventHubSection: null,     // null (hub landing) | "people" | "plans" | "transport" — which

  briefToday: false,  // person/team brief: "today only" toggle
  drawerStack: [],
  searchQuery: "",

  
  manageDirectorySection: null, // which advanced-directory category (inside Manage Wedding) to



  contactsFilter: "",        // plain-text filter typed into the Contacts page's own search box
  simDate: null               // temporary admin-only demo clock; null means real time
};


const CANONICAL_SHEET_TIMELINE_ITEMS = (weddingData.timelineItems || []).map(t => JSON.parse(JSON.stringify(t)));

let data = weddingData; // may be replaced by import


let planning = (typeof planningSeed !== "undefined")
  ? JSON.parse(JSON.stringify(planningSeed))
  : null;
function hasPlanning(){ return !!planning; }



function normalizeDataShape(d){
  if(!d || typeof d !== "object" || Array.isArray(d)) return false;
  ["events","timelineItems","teams","people","vendors","venues","contacts","transportation","assignments"]
    .forEach(key=>{ if(!Array.isArray(d[key])) d[key] = []; });


  weddingData.events.forEach(seed=>{
    let record = d.events.find(e=>e.id===seed.id);
    if(!record){ d.events.push(JSON.parse(JSON.stringify(seed))); return; }
    ["title","date","startTime","endTime","venueId","lens"].forEach(field=>{ record[field] = seed[field] == null ? seed[field] : JSON.parse(JSON.stringify(seed[field])); });
  });




  ["people"].forEach(key=>d[key].forEach(record=>{ record.phone = ""; }));

  ["contacts", "venues"].forEach(key=>weddingData[key].forEach(seed=>{
    if(key === "contacts" && !seed.phone) return;
    let record = d[key].find(r=>r.id===seed.id);
    if(!record){ record = JSON.parse(JSON.stringify(seed)); d[key].push(record); }
    ["name","role","contactName","phone","address"].forEach(field=>{
      if(seed[field] !== undefined) record[field] = seed[field];
    });
  }));
  const verifiedVendorContactIds = new Set([
    "vendor_demo_1", "vendor_demo_3", "vendor_demo_5",
    "vendor_demo_6", "vendor_demo_7"
  ]);
  d.vendors.forEach(vendor=>{
    if(!verifiedVendorContactIds.has(vendor.id)) return;
    const seed = weddingData.vendors.find(v=>v.id===vendor.id);
    if(!seed) return;
    vendor.contactName = seed.contactName || "";
    vendor.phone = seed.phone || "";
    if(seed.additionalContacts) vendor.additionalContacts = JSON.parse(JSON.stringify(seed.additionalContacts));
    else delete vendor.additionalContacts;
  });
  d.transportation.forEach(record=>{ record.driverPhone = null; });


  const parentPlaceholders = {
    person_demo_29: "Groom's Mother",
    person_demo_30: "Bride's Father",
    person_demo_31: "Bride's Mother"
  };
  d.people.forEach(person=>{
    const placeholder = parentPlaceholders[person.id];
    if(!placeholder) return;
    const seed = weddingData.people.find(p=>p.id === person.id);
    if(!seed) return;
    if(!person.name || person.name === placeholder || (person.id === "person_demo_31" && person.name === "Dipikia")) person.name = seed.name;
    if(!person.role || person.role === "Parent of the bride" || person.role === "Parent of the groom") person.role = seed.role;
  });

  d.vendors.forEach(vendor=>{
    if(vendor.id === "vendor_demo_2" && (!vendor.type || vendor.type === "Photography")) vendor.type = "Makeup Artist";
    if(vendor.id === "vendor_demo_1" && (!vendor.type || vendor.type === "Videography")) vendor.type = "Photography & Videography";
  });
  if(!d.wedding || typeof d.wedding !== "object") d.wedding = weddingData.wedding;
  return true;
}
function normalizePlanningShape(p){
  if(!p || typeof p !== "object" || Array.isArray(p)) return false;
  if(!Array.isArray(p.tasks)) p.tasks = [];
  if(!Array.isArray(p.notes)) p.notes = [];
  if(!Array.isArray(p.decisions)) p.decisions = [];
  if(!Array.isArray(p.dismissals)) p.dismissals = [];
  return true;
}

function reconcileChecklistTasks(targetPlanning){
  if(!targetPlanning || typeof planningSeed === "undefined") return false;
  const canonical = (planningSeed.tasks||[]).filter(t=>String(t.sourceId||"").startsWith("wedding-checklist::"));
  const canonicalIds = new Set(canonical.map(t=>t.sourceId));
  const existing = new Map((targetPlanning.tasks||[]).filter(t=>t.sourceId).map(t=>[t.sourceId,t]));
  let changed = false;
  targetPlanning.tasks = (targetPlanning.tasks||[]).filter(t=>{
    if(!String(t.sourceId||"").startsWith("wedding-checklist::")) return true;
    const keep = canonicalIds.has(t.sourceId);
    if(!keep) changed = true;
    return keep;
  });
  const sourceFields = ["title","detail","priority","group","ownerId","dueDate","scope","scopeEventId","blocksEventId"];
  canonical.forEach(seed=>{
    const current = existing.get(seed.sourceId);
    if(!current){ targetPlanning.tasks.push(JSON.parse(JSON.stringify(seed))); changed = true; return; }
    
    if(current.status !== "done" && current.status !== "dismissed" && current.status !== seed.status){
      current.status = seed.status;
      changed = true;
    }
    sourceFields.forEach(field=>{
      const next = seed[field] == null ? null : seed[field];
      const prev = current[field] == null ? null : current[field];
      if(JSON.stringify(prev) !== JSON.stringify(next)){ current[field] = next; changed = true; }
    });
  });
  return changed;
}


const CANONICAL_VENUE_IDS = ["venue_demo_1", "venue_demo_2", "venue_demo_3"];
const LEGACY_VENUE_ID_REMAP = {
  venue_demo_1_garba: "venue_demo_1",
  venue_demo_1_wedding: "venue_demo_1",
  venue_family_home: null,
  venue_hilton_garden_inn: null
};

const CANONICAL_VENUE_FIELDS = ["id","name","kind","address","contactName","phone","eventIds","parkingNotes"];
function venueRecordMatchesCanonical(record, canonical){
  if(!record) return false;
  return CANONICAL_VENUE_FIELDS.every(f=>{
    const a = record[f], b = canonical[f];
    if(Array.isArray(b)) return Array.isArray(a) && a.length===b.length && a.every((v,i)=>v===b[i]);
    return a === b;
  });
}

function isCanonicalVenueSet(venues){
  if(!Array.isArray(venues) || venues.length !== CANONICAL_VENUE_IDS.length) return false;
  return CANONICAL_VENUE_IDS.every(id=>{
    const matches = venues.filter(v=>v && v.id===id);
    return matches.length === 1 && venueRecordMatchesCanonical(matches[0], weddingData.venues.find(v=>v.id===id));
  });
}

const LEGACY_DEMO_TIMELINE_ITEM_IDS = new Set([
  "tl_vidhi_setup","tl_vidhi_family","tl_vidhi_ganesh","tl_vidhi_grahshanti","tl_vidhi_pithi","tl_vidhi_blessings","tl_vidhi_lunch","tl_vidhi_cleanup",
  "tl_mehndi_setup","tl_mehndi_begins","tl_mehndi_guests","tl_mehndi_food","tl_mehndi_mingle","tl_mehndi_wrap",
  "tl_sangeet_setup","tl_sangeet_soundcheck","tl_sangeet_guests","tl_sangeet_entrance","tl_sangeet_family_perf","tl_sangeet_friend_perf","tl_sangeet_dinner","tl_sangeet_garba","tl_sangeet_dj","tl_sangeet_envelope","tl_sangeet_closing",
  "tl_wed_vendor_arrival","tl_wed_decor_ready","tl_wed_groom_ready","tl_wed_baraat_staging","tl_wed_baraat","tl_wed_welcome","tl_wed_jaimala","tl_wed_ceremony_begins","tl_wed_kanyadaan","tl_wed_pheras","tl_wed_sindoor","tl_wed_blessings","tl_wed_exit","tl_wed_envelope","tl_wed_transition",
  "tl_rec_cocktail","tl_rec_doors","tl_rec_family_entrance","tl_rec_wp_entrance","tl_rec_couple_entrance","tl_rec_first_dance","tl_rec_speeches","tl_rec_dinner","tl_rec_cake","tl_rec_dance","tl_rec_envelope","tl_rec_wrap"
]);

function sanitizeVenueTimelineData(d, p, opts){
  if(!d) return false;
  const fullTimelineReset = !!(opts && opts.fullTimelineReset);
  let changed = false;
  if(!isCanonicalVenueSet(d.venues)){
    d.venues = weddingData.venues.map(v=>JSON.parse(JSON.stringify(v)));
    changed = true;
  }
  (d.events||[]).forEach(e=>{
    if(Object.prototype.hasOwnProperty.call(LEGACY_VENUE_ID_REMAP, e.venueId)){
      e.venueId = LEGACY_VENUE_ID_REMAP[e.venueId];
      changed = true;
    }
  });
  const staleItemIds = fullTimelineReset
    ? new Set((d.timelineItems||[]).map(t=>t.id))
    : new Set((d.timelineItems||[]).filter(t=>LEGACY_DEMO_TIMELINE_ITEM_IDS.has(t.id)).map(t=>t.id));
  if(staleItemIds.size){
    d.timelineItems = (d.timelineItems||[]).filter(t=>!staleItemIds.has(t.id));
    d.assignments = (d.assignments||[]).filter(a=>!(a.targetType==="timelineItem" && staleItemIds.has(a.targetId)));
    changed = true;
  }
  if(p){
    const beforeCount = (p.notes||[]).length + (p.decisions||[]).length + (p.tasks||[]).length;
    if(staleItemIds.size){
      p.notes = (p.notes||[]).filter(n=>!(n.entityType==="timelineItem" && staleItemIds.has(n.entityId)));
      p.decisions = (p.decisions||[]).filter(dd=>!(dd.entityType==="timelineItem" && staleItemIds.has(dd.entityId)));
      p.tasks = (p.tasks||[]).filter(t=>!(t.entityType==="timelineItem" && staleItemIds.has(t.entityId)));
    }
    [p.notes||[], p.decisions||[]].forEach(list=>list.forEach(rec=>{
      if(rec.entityType==="venue" && Object.prototype.hasOwnProperty.call(LEGACY_VENUE_ID_REMAP, rec.entityId)){
        rec.entityId = LEGACY_VENUE_ID_REMAP[rec.entityId] || rec.entityId;
        changed = true;
      }
    }));
    if((p.notes||[]).length + (p.decisions||[]).length + (p.tasks||[]).length !== beforeCount) changed = true;
  }
  return changed;
}


function pruneDanglingTimelineRefs(d, p, removedIds){
  if(!removedIds || !removedIds.size) return;
  d.assignments = (d.assignments||[]).filter(a=>!(a.targetType==="timelineItem" && removedIds.has(a.targetId)));
  if(p){
    p.notes = (p.notes||[]).filter(n=>!(n.entityType==="timelineItem" && removedIds.has(n.entityId)));
    p.decisions = (p.decisions||[]).filter(dd=>!(dd.entityType==="timelineItem" && removedIds.has(dd.entityId)));
    p.tasks = (p.tasks||[]).filter(t=>!(t.entityType==="timelineItem" && removedIds.has(t.entityId)));
  }
}


function reconcileSourceTimelineItems(d, p, opts){
  if(!d) return false;
  const isFirstImport = !!(opts && opts.isFirstImport);
  
  const canonical = CANONICAL_SHEET_TIMELINE_ITEMS;
  const existing = d.timelineItems || [];

  if(isFirstImport){
    const oldIds = existing.map(t=>t.id).slice().sort();
    const newIds = canonical.map(c=>c.id).slice().sort();
    if(oldIds.length === newIds.length && oldIds.every((id,i)=>id===newIds[i])) return false; // already exactly canonical
    const removed = new Set(existing.map(t=>t.id).filter(id=>!canonical.some(c=>c.id===id)));
    d.timelineItems = canonical.map(c=>JSON.parse(JSON.stringify(c)));
    pruneDanglingTimelineRefs(d, p, removed);
    return true;
  }

  const canonicalById = new Map(canonical.map(c=>[c.id, c]));


  const renamedSources = {};
  let renamed = false;
  existing.forEach(t=>{
    const replacement = canonical.find(c=>c.sourceId === renamedSources[t.sourceId]);
    if(!replacement || existing.some(other=>other.id === replacement.id)) return;
    const oldId = t.id;
    t.id = replacement.id;
    t.sourceId = replacement.sourceId;
    (d.assignments||[]).forEach(a=>{
      if(a.targetType === "timelineItem" && a.targetId === oldId) a.targetId = t.id;
    });
    if(p) [p.notes||[], p.decisions||[], p.tasks||[]].forEach(list=>list.forEach(rec=>{
      if(rec.entityType === "timelineItem" && rec.entityId === oldId) rec.entityId = t.id;
    }));
    renamed = true;
  });
  const existingSourceManaged = existing.filter(t=>t.sourceId);
  const existingNonSource = existing.filter(t=>!t.sourceId);
  const SOURCE_DERIVED_FIELDS = ["eventId","time","title","notes","sourceRow","sourceTimeLabel","sourceDateLabel","sourceTab","venueId","audience","kind","guestTitle","guestSubMoments","audioTracks"];

  let changed = renamed;
  const keptSourceManaged = [];
  existingSourceManaged.forEach(t=>{
    const c = canonicalById.get(t.id);
    if(!c){ changed = true; return; } // this source row no longer exists in the refreshed sheet — drop it
    const merged = Object.assign({}, t);
    SOURCE_DERIVED_FIELDS.forEach(f=>{ merged[f] = c[f]; });
    if(JSON.stringify(merged) !== JSON.stringify(t)) changed = true;
    keptSourceManaged.push(merged);
  });
  const removedIds = new Set(existingSourceManaged.filter(t=>!canonicalById.has(t.id)).map(t=>t.id));
  const keptIds = new Set(keptSourceManaged.map(t=>t.id));
  const insertedFresh = canonical.filter(c=>!keptIds.has(c.id)).map(c=>JSON.parse(JSON.stringify(c)));
  if(insertedFresh.length) changed = true;
  if(!changed) return false;

  d.timelineItems = [...existingNonSource, ...keptSourceManaged, ...insertedFresh];
  pruneDanglingTimelineRefs(d, p, removedIds);
  return true;
}
function loadPersisted(){
  
  if(isPreviewMode()){
    try{
      const savedDemoDate = localStorage.getItem(LS_KEYS.SIM_DATE);
      state.simDate = savedDemoDate && !Number.isNaN(new Date(savedDemoDate).getTime()) ? savedDemoDate : "2030-06-15T10:00:00";
    }catch(e){ state.simDate = "2030-06-15T10:00:00"; }
  } else {
    state.simDate = null;
  }
  try{
    const override = localStorage.getItem(LS_KEYS.DATA_OVERRIDE);
    if(override){
      const parsed = JSON.parse(override);
      if(normalizeDataShape(parsed)) data = parsed;
      
    }
  }catch(e){  }
  normalizeDataShape(data); // no-op when data is already complete (the common case)
  try{
    const saved = localStorage.getItem(LS_KEYS.PLANNING);
    if(saved && planning){
      const parsed = JSON.parse(saved);
      if(normalizePlanningShape(parsed)) planning = parsed;
      
    }
  }catch(e){  }
  if(planning) normalizePlanningShape(planning);
  
  try{
    if(planning && localStorage.getItem(LS_KEYS.TASKS_RESET_MIGRATION) !== TASKS_RESET_MIGRATION_VERSION){
      planning.tasks = JSON.parse(JSON.stringify(planningSeed.tasks));
      planning.dismissals = [];
      persistPlanning();
      localStorage.setItem(LS_KEYS.TASKS_RESET_MIGRATION, TASKS_RESET_MIGRATION_VERSION);
    }
  }catch(e){  }
  
  try{
    if(planning && localStorage.getItem(LS_KEYS.CHECKLIST_TASK_IMPORT_MIGRATION) !== CHECKLIST_TASK_IMPORT_MIGRATION_VERSION){
      if(reconcileChecklistTasks(planning)) persistPlanning();
      localStorage.setItem(LS_KEYS.CHECKLIST_TASK_IMPORT_MIGRATION, CHECKLIST_TASK_IMPORT_MIGRATION_VERSION);
    }
  }catch(e){  }
  
  try{
    if(localStorage.getItem(LS_KEYS.VENUE_TIMELINE_RESET_MIGRATION) !== VENUE_TIMELINE_RESET_MIGRATION_VERSION){
      if(sanitizeVenueTimelineData(data, planning, {fullTimelineReset:true})){
        persistDataOverride();
        if(planning) persistPlanning();
      }
      localStorage.setItem(LS_KEYS.VENUE_TIMELINE_RESET_MIGRATION, VENUE_TIMELINE_RESET_MIGRATION_VERSION);
    }
  }catch(e){  }
  
  try{
    const prevSheetImportFlag = localStorage.getItem(LS_KEYS.TIMELINE_SHEET_IMPORT_MIGRATION);
    if(prevSheetImportFlag !== TIMELINE_SHEET_IMPORT_MIGRATION_VERSION){
      if(reconcileSourceTimelineItems(data, planning, {isFirstImport: !prevSheetImportFlag})){
        persistDataOverride();
        if(planning) persistPlanning();
      }
      localStorage.setItem(LS_KEYS.TIMELINE_SHEET_IMPORT_MIGRATION, TIMELINE_SHEET_IMPORT_MIGRATION_VERSION);
    }
  }catch(e){  }
}
function persistPlanning(){
  if(!planning) return;
  try{ localStorage.setItem(LS_KEYS.PLANNING, JSON.stringify(planning)); }catch(e){}
}
function persistDataOverride(){
  try{ localStorage.setItem(LS_KEYS.DATA_OVERRIDE, JSON.stringify(data)); }catch(e){}
}


function now(){ return state.simDate ? new Date(state.simDate) : new Date(); }
function localDateTimeValue(value){
  const d = new Date(value);
  const pad = n=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function operationalControlsActive(){
  return getPhase() === "week";
}

function byId(arr, id){ return arr.find(x=>x.id===id); }
function ev(id){ return byId(data.events, id); }
function tlItem(id){ return byId(data.timelineItems, id); }
function team(id){ return byId(data.teams, id); }
function person(id){ return byId(data.people, id); }
function vendor(id){ return byId(data.vendors, id); }
function venueOf(id){ return byId(data.venues, id); }
function contactOf(id){ return byId(data.contacts, id); }

function fmtDate(d, opts){
  return new Date(d).toLocaleDateString('en-US', opts || {weekday:'long', month:'long', day:'numeric'});
}
function fmtTime(d){
  return new Date(d).toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit', hour12:true});
}

function displayTimeLabel(item){
  return item.sourceTimeLabel != null ? normalizeTimeLabel(item.sourceTimeLabel) : fmtTime(item.time);
}
function normalizeTimeLabel(raw){
  if(typeof raw === "number" && Number.isFinite(raw)) {
    const minutes = Math.floor(((raw % 1 + 1) % 1) * 1440 + 1e-7);
    return `${Math.floor(minutes / 60) % 12 || 12}:${String(minutes % 60).padStart(2,"0")} ${minutes < 720 ? "AM" : "PM"}`;
  }
  if(typeof raw !== "string") return raw;
  const TIME_RE = /^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?\s*([AaPp][Mm])?$/;
  const parseToken = (tok) => {
    const m = tok.trim().match(TIME_RE);
    if(!m || Number(m[1]) > 23 || Number(m[2]) > 59) return null;
    return {hour: parseInt(m[1], 10), minute: m[2], meridiem: m[3] ? m[3].toUpperCase() : null};
  };
  
  const toMin = (t, meridiem) => ((t.hour % 12) + (meridiem === "PM" ? 12 : 0)) * 60 + parseInt(t.minute, 10);
  const fmt = (t) => `${t.hour % 12 || 12}:${t.minute} ${t.meridiem}`;
  const rangeMatch = raw.match(/^\s*(.+?)\s*[-\u2013\u2014]\s*(.+?)\s*$/);
  if(rangeMatch){
    const start = parseToken(rangeMatch[1]);
    const end = parseToken(rangeMatch[2]);
    if(start && end){
      
      if(!start.meridiem && end.meridiem){
        const same = end.meridiem, other = same === "AM" ? "PM" : "AM";
        start.meridiem = toMin(start, same) <= toMin(end, end.meridiem) ? same : other;
      } else if(!end.meridiem && start.meridiem){
        const same = start.meridiem, other = same === "AM" ? "PM" : "AM";
        end.meridiem = toMin(end, same) >= toMin(start, start.meridiem) ? same : other;
      }
      if(!start.meridiem && !end.meridiem) {
        start.meridiem = start.hour < 12 ? "AM" : "PM";
        end.meridiem = end.hour < 12 ? "AM" : "PM";
      }
      if(start.meridiem && end.meridiem) return `${fmt(start)} \u2013 ${fmt(end)}`;
    }
  }
  const single = parseToken(raw);
  if(single){
    single.meridiem ||= single.hour < 12 ? "AM" : "PM";
    return fmt(single);
  }

  return raw.replace(/\b(\d{1,2}):(\d{2}):\d{2}(?:\.\d+)?/g, "$1:$2");
}
function fmtDateTimeShort(d){
  return new Date(d).toLocaleString('en-US', {month:'short', day:'numeric', hour:'numeric', minute:'2-digit', hour12:true});
}
function esc(s){
  return (s==null? "": String(s)).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function initials(name){
  return name.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();
}
function telHref(phone){
  return "tel:" + String(phone).replace(/[^\d+]/g,"");
}
function smsHref(phone){
  return "sms:" + String(phone).replace(/[^\d+]/g,"");
}
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._tm);
  toast._tm = setTimeout(()=>t.classList.remove("show"), 2400);
}


function compareWithinEvent(a, b){
  const aHasRow = typeof a.sourceRow === "number";
  const bHasRow = typeof b.sourceRow === "number";
  if(aHasRow && bHasRow) return a.sourceRow - b.sourceRow;
  if(aHasRow !== bHasRow) return aHasRow ? -1 : 1;
  return new Date(a.time) - new Date(b.time);
}

function itemsForEvent(eventId){
  return data.timelineItems.filter(t=>t.eventId===eventId).sort(compareWithinEvent);
}
function allItemsSorted(){
  
  return data.timelineItems
    .map((it, i) => ({it, i}))
    .sort((a,b)=> (new Date(a.it.time) - new Date(b.it.time)) || (a.i - b.i))
    .map(x => x.it);
}



const KIND_META = {
  ritual:      {label:"Ritual",     icon:ICONS.sparkle},
  performance: {label:"Performance",icon:ICONS.mission},
  speech:      {label:"Speech",     icon:ICONS.message},
  entrance:    {label:"Entrance",   icon:ICONS.arrowRight},
  service:     {label:"Service",    icon:ICONS.users},
  prep:        {label:"Prep",       icon:ICONS.clipboard},
  setup:       {label:"Setup",      icon:ICONS.wrench},
  logistics:   {label:"Logistics",  icon:ICONS.target},
  transition:  {label:"Transition", icon:ICONS.chevron},
  photo:       {label:"Photo",      icon:ICONS.checkCircle},
  
  agenda:      {label:"Agenda",     icon:ICONS.timeline}
};
function kindMeta(kind){ return KIND_META[kind] || {label:"Moment", icon:ICONS.timeline}; }


const AUDIENCE_RANK = { public:0, internal:1, ops:2 };
const AUDIENCE_META = {
  public:   {label:"Guests",         short:"Guest-visible"},
  internal: {label:"Wedding Team",   short:"Team"},
  ops:      {label:"Coordinators only", short:"Coordinators"}
};
function audienceRank(a){ return AUDIENCE_RANK[a] ?? AUDIENCE_RANK.ops; }
function visibleTo(item, viewer){ return audienceRank(item.audience) <= audienceRank(viewer); }


function rollupParentOf(item){
  if(!item || !item.rollupParentId) return null;
  const p = tlItem(item.rollupParentId);
  if(!p || p.rollupParentId) return null;   // guard: refuse a second level
  return p;
}
function childrenOf(itemId){
  const parent = tlItem(itemId);
  if(!parent || parent.rollupParentId) return [];   // a child can't have children
  return allItemsSorted().filter(x=>x.rollupParentId === itemId);
}
function isRollupParent(item){ return !!item && !item.rollupParentId && childrenOf(item.id).length > 0; }


function includedTeamStepsLabel(count){
  return `Includes ${count} team step${count===1?'':'s'}`;
}

function shownAsPartOfHtml(parent){
  if(!parent) return "";
  return `Shown to guests as part of <span class="chip" data-open-drawer="timelineItem:${parent.id}" style="padding:4px 9px;">${esc(parent.guestTitle || parent.title)}</span>`;
}

function stepVsGuestDurationHtml(stepDur, guestDur){
  if(!stepDur) return "—";
  if(!guestDur || guestDur === stepDur) return stepDur;
  return `This step: ${stepDur}<br><span style="color:var(--ink-faint);">Guest schedule item: ${guestDur}</span>`;
}


function displayTitle(item, viewer){
  if(viewer === "public" && item.guestTitle) return item.guestTitle;
  return item.title;
}


function endTimeOf(item){
  const start = new Date(item.time).getTime();
  const sorted = allItemsSorted();
  const idx = sorted.findIndex(x=>x.id===item.id);
  const nextInEvent = sorted.slice(idx+1).find(x=>x.eventId===item.eventId);
  if(nextInEvent) return new Date(nextInEvent.time).getTime();
  const parentEvent = ev(item.eventId);
  if(parentEvent) return new Date(parentEvent.endTime).getTime();
  return start + 20*60000;
}

function spanEndOf(item){
  const kids = childrenOf(item.id);
  if(!kids.length) return endTimeOf(item);
  return Math.max(endTimeOf(item), endTimeOf(kids[kids.length-1]));
}
function durationOf(item, opts){
  const end = (opts && opts.rollup) ? spanEndOf(item) : endTimeOf(item);
  return Math.max(0, Math.round((end - new Date(item.time).getTime()) / 60000));
}
function fmtDuration(mins){
  if(mins <= 0) return "";
  if(mins < 60) return mins + " min";
  const h = Math.floor(mins/60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}


function dayKeyOf(item){
  const e = ev(item.eventId);
  return (e && e.date) ? e.date : String(item.time).slice(0,10);
}
function deriveDayGroups(){
  const byDay = new Map();
  data.events.forEach(e=>{
    if(!e.date) return;
    if(!byDay.has(e.date)) byDay.set(e.date, []);
    byDay.get(e.date).push(e);
  });
  const days = [...byDay.keys()].sort();
  return days.map(d=>{
    const evs = byDay.get(d).sort((a,b)=>new Date(a.startTime)-new Date(b.startTime));
    const dayLabel = fmtDate(d+"T12:00:00", {month:'short', day:'numeric'});
    return { id:d, label:`${dayLabel} · ${evs.map(e=>e.title).join(" & ")}`, shortLabel:dayLabel, events:evs };
  });
}

function weddingWeekBounds(){
  const dates = data.events.map(e=>e.date).filter(Boolean).sort();
  const fallback = data.wedding.primaryDate;
  return { start: dates[0] || fallback, end: dates[dates.length-1] || fallback };
}


function timelineQuery(opts){
  const o = opts || {};
  const viewer = o.audience || "ops";
  let items = allItemsSorted().filter(it=>visibleTo(it, viewer));
  if(o.day && o.day !== "all") items = items.filter(it=>dayKeyOf(it) === o.day);
  if(o.eventId){
    items = items.filter(it=>it.eventId === o.eventId);
    
    items = items.slice().sort(compareWithinEvent);
  }
  if(o.rollup) items = items.filter(it=>!rollupParentOf(it));
  return items;
}





function linkedTaskCountFor(item){
  if(!hasPlanning()) return 0;
  return openTasks().filter(t=>t.entityType === "timelineItem" && t.entityId === item.id).length;
}

function itemNeedsAttention(item){
  
  if(effectiveStatus(item) === "complete") return false;
  return linkedTaskCountFor(item) > 0;
}


function effectiveStatus(item){
  if(item.status === "tbd") return "tbd";
  const t = now().getTime();
  const start = new Date(item.time).getTime();
  const end = endTimeOf(item);

  if(item.completedAt) return "complete";
  if(item.actualStartTime) return "current";
  if(t < start) return "upcoming";
  if(t >= start && t < end) return "current";
  return "complete";
}


const TIMELINE_AUTO_CROSS_OFF_MS = 30 * 60 * 1000;
function timelineItemIsAutoCrossed(item){
  if(!item || item.status === "tbd") return false;
  const start = new Date(item.time).getTime();
  return Number.isFinite(start) && now().getTime() >= start + TIMELINE_AUTO_CROSS_OFF_MS;
}

function statusMeta(effStatus){
  switch(effStatus){
    case "complete": return {label:"Complete", cls:"status-green", icon:"✓"};
    case "current": return {label:"Happening Now", cls:"status-blue", icon:"●"};
    case "upcoming": return {label:"Upcoming", cls:"status-gray", icon:"○"};
    case "tbd": return {label:"TBD", cls:"status-gray", icon:"?"};
    default: return {label:effStatus, cls:"status-gray", icon:"•"};
  }
}


function getPhase(){
  const t = now();
  const bounds = weddingWeekBounds();
  const weekStart = new Date(bounds.start+"T00:00:00");
  const weekEnd = new Date(bounds.end+"T23:59:59");
  if(t < weekStart) return "planning";
  if(t > weekEnd) return "post";
  return "week";
}
function daysUntil(targetIso){
  const t = now();
  const target = new Date(targetIso+"T00:00:00");
  const ms = target - new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return Math.round(ms / 86400000);
}
function currentLiveItem(){
  const sorted = allItemsSorted();
  return sorted.find(it => effectiveStatus(it) === "current");
}
function nextUpcomingItem(){
  const t = now().getTime();
  const sorted = allItemsSorted();
  return sorted.find(it => new Date(it.time).getTime() > t);
}

function currentLiveEvent(){
  const t = now().getTime();
  return data.events.find(e=>{
    const start = new Date(e.startTime).getTime();
    const end = new Date(e.endTime).getTime();
    return t >= start && t < end;
  }) || null;
}

function liveEventPhotoHtml(requestedEventId, allowConfiguredPreview=false){
  const liveItem = currentLiveItem();
  const actualLiveEvent = liveItem ? ev(liveItem.eventId) : currentLiveEvent();
  const requestedEvent = requestedEventId ? ev(requestedEventId) : null;

  const displayEvent = allowConfiguredPreview && requestedEventId ? requestedEvent : actualLiveEvent;
  if(requestedEventId && !allowConfiguredPreview && (!actualLiveEvent || requestedEventId !== actualLiveEvent.id)) return "";
  if(!displayEvent){
    
    if(!requestedEventId && !allowConfiguredPreview){
      const earliestEvent = [...data.events].sort((a,b)=>new Date(a.startTime)-new Date(b.startTime))[0];
      if(earliestEvent && now() < new Date(earliestEvent.startTime)){
        return `
          <section class="team-live-photo-card is-disabled" aria-label="Guest photo camera — coming soon">
            <div class="team-live-photo-copy">
              <div class="team-live-photo-eyebrow"><span></span> Coming Soon</div>
              <div class="team-live-photo-title">${ICONS.camera} Event Camera</div>
              <p>Photo sharing starts at Vidhi.</p>
            </div>
            <div class="team-live-photo-actions">
              <button class="btn" type="button" disabled aria-disabled="true" title="Check back closer to the wedding.">${ICONS.camera} Check back closer to the wedding.</button>
            </div>
          </section>
        `;
      }
    }
    return "";
  }
  if(displayEvent.id === MEHNDI_EVENT_ID){
    return `
      <section class="team-live-photo-card is-disabled" aria-label="Guest photo camera for ${esc(displayEvent.title)} — not yet available">
        <div class="team-live-photo-copy">
          <div class="team-live-photo-eyebrow"><span></span> Not Yet Available</div>
          <div class="team-live-photo-title">${ICONS.camera} ${esc(displayEvent.title)} Event Camera</div>
          <p>Photo sharing starts at Vidhi — this event's camera link is intentionally disabled during Mehndi.</p>
        </div>
        <div class="team-live-photo-actions">
          <button class="btn" type="button" disabled aria-disabled="true" title="Photo sharing starts at Vidhi">${ICONS.camera} Photo Sharing Starts at Vidhi</button>
        </div>
      </section>
    `;
  }
  const config = displayEvent && displayEvent.lens;
  if(!config || typeof config.url !== "string" || !/^https:\/\//i.test(config.url)) return "";
  const isLive = !!actualLiveEvent && actualLiveEvent.id === displayEvent.id;
  const qr = typeof config.qrImageUrl === "string" && /^(?:https:\/\/|qr\/)/i.test(config.qrImageUrl)
    ? `<details class="team-live-photo-qr"><summary>Show venue QR code</summary><img src="${esc(config.qrImageUrl)}" alt="QR code for the ${esc(displayEvent.title)} event camera"></details>`
    : "";
  return `
    <section class="team-live-photo-card ${isLive?'is-live':'is-preview'}" aria-label="Guest photo camera for ${esc(displayEvent.title)}">
      <div class="team-live-photo-copy">
        <div class="team-live-photo-eyebrow"><span></span> ${isLive?'Guest photo link is live':'Guest photo link ready'}</div>
        <div class="team-live-photo-title">${ICONS.camera} ${esc(displayEvent.title)} Event Camera</div>
        <p>${isLive
          ? 'Guests can open this camera now. Venue QR signs should point to this same event link.'
          : `Use this area to test the camera and venue QR. Guests will only see it during ${esc(fmtTime(displayEvent.startTime))} – ${esc(fmtTime(displayEvent.endTime))}.`}</p>
        ${data.wedding.hashtag ? `<div class="team-live-photo-hashtag">Hashtag stays active: <strong>${esc(data.wedding.hashtag)}</strong></div>` : ""}
      </div>
      <div class="team-live-photo-actions">
        <a class="btn ${isLive?'btn-primary':''}" href="${esc(config.url)}" target="_blank" rel="noopener" aria-label="${isLive?'Take a photo with':'Test'} the ${esc(displayEvent.title)} event camera (opens in a new tab)">${ICONS.camera} ${isLive?'Take a Photo':'Test Photo Link'}</a>
        ${qr}
      </div>
    </section>
  `;
}
function nextUpcomingEvent(){
  const t = now().getTime();
  return [...data.events].sort((a,b)=>new Date(a.startTime)-new Date(b.startTime)).find(e=>new Date(e.startTime).getTime() > t) || null;
}
function opsThemeEvent(){
  if(state.view !== "mission" && state.timelineEventId && ev(state.timelineEventId)) return ev(state.timelineEventId);
  if(state.missionEventId && ev(state.missionEventId)) return ev(state.missionEventId);
  return currentLiveEvent() || nextUpcomingEvent() || data.events[data.events.length-1] || null;
}

function opsThemeClass(){
  const earliestEvent = [...data.events].sort((a,b)=>new Date(a.startTime)-new Date(b.startTime))[0];
  const hasExplicitOrLiveEvent = (state.view !== "mission" && state.timelineEventId && ev(state.timelineEventId)) || (state.missionEventId && ev(state.missionEventId)) || currentLiveEvent();
  if(!hasExplicitOrLiveEvent && earliestEvent && now() < new Date(earliestEvent.startTime)){
    return "ops-theme-countdown";
  }
  const event = opsThemeEvent();
  return event ? `ops-theme-${event.id.replace(/^event_/,"")}` : "ops-theme-default";
}
function applyOpsTheme(){
  const app = document.getElementById("app");
  if(app) app.className = opsThemeClass();
  const spotlight = document.getElementById("side-event-spotlight");
  if(spotlight) spotlight.innerHTML = sidebarEventSpotlightHtml();
}

function photoGroupDisplayTitle(title){
  const match = /^Group\s+\d+/.exec(title || "");
  return match ? match[0] : (title || "");
}
function familyReferenceLinksHtml(){
  return `<section class="family-reference-card" aria-label="Wedding reference lists">
    <div class="family-reference-copy">
      <div class="family-reference-eyebrow">Quick references</div>
      <div class="family-reference-title">Find people quickly</div>
      <p>Open the day-of lists right here—no spreadsheet detour.</p>
    </div>
    <div class="family-reference-actions">
      <button class="btn" type="button" data-open-seating="true">${ICONS.users} Reception Seating</button>
      <button class="btn" type="button" data-open-drawer="photoGroups:">${ICONS.camera} Photo Groups</button>
    </div>
  </section>`;
}

function eventToolsHtml(){
  const photoHtml = liveEventPhotoHtml();
  const t = now();
  const weddingStart = new Date("2030-06-15T07:00:00");
  const photoEnd = new Date("2030-06-15T14:00:00");
  const receptionStart = new Date("2030-06-15T18:00:00");
  const receptionEnd = new Date("2030-06-15T23:30:00");
  let secondaryHtml = "";
  if(t >= weddingStart && t < photoEnd){
    const groups = COMBINED_PHOTO_GROUPS.filter(g=>g.count>0);
    const totalPeople = groups.reduce((sum,g)=>sum+g.count, 0);
    secondaryHtml = `
      <div class="event-tools-secondary" data-tool="photo-groups">
        <div class="event-tools-secondary-copy">
          <div class="event-tools-secondary-eyebrow">Wedding ceremony</div>
          <div class="event-tools-secondary-title">${ICONS.camera} Photo Groups</div>
          <p>${groups.length} groups · ${totalPeople} people ready to be called.</p>
        </div>
        <button class="btn btn-sm" type="button" data-open-drawer="photoGroups:">View Groups</button>
      </div>
    `;
  } else if(t >= receptionStart && t < receptionEnd){
    secondaryHtml = `
      <div class="event-tools-secondary" data-tool="reception-seating">
        <div class="event-tools-secondary-copy">
          <div class="event-tools-secondary-eyebrow">Reception</div>
          <div class="event-tools-secondary-title">${ICONS.users} Reception Seating</div>
          <p>Search a name or browse by table — no spreadsheet needed.</p>
        </div>
        <button class="btn btn-sm" type="button" data-open-seating="true">Find a Table</button>
      </div>
    `;
  }
  if(!photoHtml && !secondaryHtml) return "";
  return `
    <section class="event-tools-module" aria-label="Event tools">
      <div class="event-tools-eyebrow">Event Tools</div>
      ${photoHtml ? `<div class="event-tools-primary">${photoHtml}</div>` : ""}
      ${secondaryHtml}
    </section>
  `;
}
function todaysEvents(){
  const t = now();
  const y = t.getFullYear(), m = t.getMonth(), d = t.getDate();
  return data.events.filter(e=>{
    const s = new Date(e.startTime);
    return s.getFullYear()===y && s.getMonth()===m && s.getDate()===d;
  }).sort((a,b)=>new Date(a.startTime)-new Date(b.startTime));
}
function nextMajorEvent(){
  const t = now().getTime();
  return [...data.events].sort((a,b)=>new Date(a.startTime)-new Date(b.startTime)).find(e=>new Date(e.startTime).getTime() > t);
}




const ENTITY_COLLECTIONS = {
  event:        ()=>data.events,
  timelineItem: ()=>data.timelineItems,
  team:         ()=>data.teams,
  person:       ()=>data.people,
  vendor:       ()=>data.vendors,
  venue:        ()=>data.venues,
  contact:      ()=>data.contacts,
  transportation: ()=>data.transportation||[]
};
function entityById(type, id){
  const get = ENTITY_COLLECTIONS[type];
  return get ? byId(get(), id) : null;
}
function entityLabel(type, id){
  if(type === "task") return taskById(id)?.title || null;
  if(type === "decision") return decisionOf(id)?.title || null;
  if(type === "transportation"){ const t = transportationById(id); return t ? transportationLabel(t) : null; }
  const o = entityById(type, id);
  return o ? (o.title || o.name || id) : null;
}


const ROLE_META = {
  primary:          {label:"Primary",     order:0},
  vendorLiaison:    {label:"Vendor Liaison", order:1},
  familyCoordinator:{label:"Family Coordinator", order:1},
  supporting:       {label:"Supporting",  order:2},
  backup:           {label:"Backup",      order:3}
};
function roleMeta(role){ return ROLE_META[role] || {label:role, order:9}; }

function allAssignments(){ return data.assignments || []; }
function assignmentsFor(targetType, targetId){
  return allAssignments().filter(a=>a.targetType===targetType && a.targetId===targetId)
    .sort((a,b)=>roleMeta(a.role).order-roleMeta(b.role).order);
}
function primaryAssignmentOf(targetType, targetId){
  return assignmentsFor(targetType, targetId).find(a=>a.role==="primary") || null;
}

function assigneeOf(a){
  if(a.assigneeType === "person"){ const p = person(a.assigneeId); return p ? {type:"person", id:p.id, name:p.name, phone:p.phone} : null; }
  const t = team(a.assigneeId); return t ? {type:"team", id:t.id, name:t.name} : null;
}
function assigneeChip(a){
  const who = assigneeOf(a);
  if(!who) return "";
  return `<span class="chip" data-open-drawer="${who.type}:${who.id}">${esc(who.name)}</span>`;
}


function assignmentsForPerson(personId){
  const p = person(personId);
  if(!p) return [];
  const direct = allAssignments().filter(a=>a.assigneeType==="person" && a.assigneeId===personId)
    .map(a=>({...a, via:null}));
  const viaTeams = allAssignments().filter(a=>a.assigneeType==="team" && (p.teamIds||[]).includes(a.assigneeId))
    .map(a=>({...a, via:team(a.assigneeId)?.name || null}));
  return [...direct, ...viaTeams].sort((a,b)=>roleMeta(a.role).order-roleMeta(b.role).order);
}
function assignmentsForTeam(teamId){
  const t = team(teamId);
  if(!t) return [];
  const direct = allAssignments().filter(a=>a.assigneeType==="team" && a.assigneeId===teamId)
    .map(a=>({...a, via:null}));
  const viaMembers = allAssignments().filter(a=>a.assigneeType==="person" && (t.memberIds||[]).includes(a.assigneeId))
    .map(a=>({...a, via:person(a.assigneeId)?.name || null}));
  return [...direct, ...viaMembers].sort((a,b)=>roleMeta(a.role).order-roleMeta(b.role).order);
}
function assignmentsForVendor(vendorId){ return assignmentsFor("vendor", vendorId); }
function vendorLiaisonOf(vendorId){ return assignmentsForVendor(vendorId).find(a=>a.role==="vendorLiaison") || null; }


function timelineItemsForPerson(personId){
  const p = person(personId);
  if(!p) return [];
  const byTeam = data.timelineItems.filter(t=>(t.ownerTeamIds||[]).some(id=>(p.teamIds||[]).includes(id)));
  const byAssignment = assignmentsForPerson(personId)
    .filter(a=>a.targetType==="timelineItem")
    .map(a=>tlItem(a.targetId)).filter(Boolean);
  const seen = new Set();
  return [...byTeam, ...byAssignment].filter(t=>{
    if(seen.has(t.id)) return false; seen.add(t.id); return true;
  }).sort((a,b)=>new Date(a.time)-new Date(b.time));
}
function isSameDay(dateA, dateB){
  return dateA.getFullYear()===dateB.getFullYear() && dateA.getMonth()===dateB.getMonth() && dateA.getDate()===dateB.getDate();
}
function timelineItemsForPersonToday(personId){
  const t = now();
  return timelineItemsForPerson(personId).filter(item=>isSameDay(new Date(item.time), t));
}


function vendorsForPerson(personId){
  const items = timelineItemsForPerson(personId);
  const ids = new Set();
  items.forEach(t=>(t.vendorIds||[]).forEach(id=>ids.add(id)));
  assignmentsForPerson(personId).filter(a=>a.targetType==="vendor").forEach(a=>ids.add(a.targetId));
  return [...ids].map(vendor).filter(Boolean);
}
function openTasksForPerson(personId){
  return openTasks().filter(t=>t.ownerId === personId);
}


const PRIORITY_RANK = { urgent:0, high:1, normal:2, low:3 };
function priorityRank(p){ return PRIORITY_RANK[p] ?? 2; }
function isOverdue(task){
  return !!task.dueDate && task.status !== "done" && task.status !== "dismissed" &&
         new Date(task.dueDate+"T23:59:59") < now();
}
function isBlocking(task){
  if(task.status === "done" || task.status === "dismissed") return false;
  return task.priority === "urgent" || task.status === "blocked" || isOverdue(task);
}

function isDueSoon(task, days){
  if(!task.dueDate || task.status === "done" || task.status === "dismissed") return false;
  const due = new Date(task.dueDate+"T23:59:59").getTime();
  const nowT = now().getTime();
  const windowMs = (days || 3) * 24*60*60*1000;
  return due >= nowT && due <= nowT + windowMs;
}

function isDoNow(task){
  return isBlocking(task) || isDueSoon(task, 3);
}

function severityOf(task){
  if(task.priority === "urgent") return "red";
  if(task.priority === "high") return "yellow";
  if(task.priority === "low") return "gray";
  return "gray";
}
function severityRank(s){ return {red:0, yellow:1, blue:2, gray:3}[s] ?? 4; }




function allTasks(){
  if(!hasPlanning()) return [];
  return planning.tasks || [];
}
function openTasks(){ return allTasks().filter(t=>t.status !== "done" && t.status !== "dismissed"); }
function doneTasks(){ return allTasks().filter(t=>t.status === "done" || t.status === "dismissed"); }

function planningIssues(){ return openTasks().filter(isBlocking); }
function taskById(id){ return allTasks().find(t=>t.id === id); }

function taskScope(t){
  if(t.scopeEventId) return { type:"event", eventId:t.scopeEventId };
  if(t.blocksEventId) return { type:"event", eventId:t.blocksEventId };
  if(t.entityType === "event" && t.entityId) return { type:"event", eventId:t.entityId };
  return { type:"wedding" };
}
function taskEventId(t){ const s = taskScope(t); return s.type === "event" ? s.eventId : null; }

function tasksForEntity(type, id){
  if(type === "event") return openTasks().filter(t=>taskEventId(t) === id);
  return openTasks().filter(t=>t.entityType===type && t.entityId===id);
}
function sortTasks(list){
  return [...list].sort((a,b)=>
    priorityRank(a.priority)-priorityRank(b.priority) ||
    String(a.dueDate||"9999").localeCompare(String(b.dueDate||"9999")) ||
    String(a.title).localeCompare(String(b.title))
  );
}
function planningReadiness(){
  const all = allTasks();
  return {
    total: all.length,
    done: all.filter(t=>t.status==="done").length,
    open: openTasks().length,
    blocking: planningIssues().length,
    daysOut: daysUntil(data.wedding.primaryDate)
  };
}


function notesFor(type, id){
  if(!hasPlanning()) return [];
  return (planning.notes||[]).filter(n=>n.entityType===type && n.entityId===id);
}
function decisionOf(id){ return hasPlanning() ? byId(planning.decisions, id) : null; }
function openDecisions(){ return hasPlanning() ? planning.decisions.filter(d=>d.status==="open") : []; }
function decidedDecisions(){ return hasPlanning() ? planning.decisions.filter(d=>d.status==="decided") : []; }



function createAuthoredTask(fields){
  if(!hasPlanning() || !fields.title || !fields.title.trim()) return null;
  if(!fields.ownerId) return null;
  const t = {
    id: "task_"+Math.random().toString(36).slice(2,10),
    source: "authored",
    title: fields.title.trim(),
    detail: fields.detail ? fields.detail.trim() : "",
    status: "open",
    priority: "normal",
    group: null,
    ownerId: fields.ownerId,
    dueDate: fields.dueDate || null
  };
  if(fields.scopeEventId){
    t.scopeEventId = fields.scopeEventId;
    t.blocksEventId = fields.scopeEventId;
  } else if(fields.scope === "wedding"){
    t.scope = "wedding";
  }
  if(fields.linkedTimelineItemId) t.linkedTimelineItemId = fields.linkedTimelineItemId;
  if(fields.entityType && fields.entityId){
    t.entityType = fields.entityType;
    t.entityId = fields.entityId;
    if(fields.entityType === "event" && !t.scopeEventId){ t.scopeEventId = fields.entityId; t.blocksEventId = fields.entityId; }
  }
  planning.tasks.push(t);
  persistPlanning();
  return t.id;
}

function createTaskOwner(name){
  const clean = String(name||"").trim().replace(/\s+/g," ");
  if(!clean) return null;
  const existing = data.people.find(p=>String(p.name||"").trim().toLowerCase()===clean.toLowerCase());
  if(existing) return existing.id;
  const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,32) || "owner";
  let id = `person_${slug}`;
  while(person(id)) id = `person_${slug}_${Math.random().toString(36).slice(2,6)}`;
  data.people.push({id, name:clean, role:"Wedding Team", phone:"", teamIds:[], hotel:"", notes:"", side:""});
  persistDataOverride();
  return id;
}
function setAuthoredTaskStatus(id, status){
  const t = byId(planning.tasks, id);
  if(!t) return;
  t.status = status;
  if(status === "done") t.completedAt = now().toISOString().slice(0,10);
  else delete t.completedAt;
  persistPlanning();
}

function updateAuthoredTaskDetails(id, fields){
  const t = byId(planning.tasks, id);
  if(!t || t.source !== "authored") return false;
  if("ownerId" in fields) t.ownerId = fields.ownerId || null;
  if("dueDate" in fields) t.dueDate = fields.dueDate || null;
  if("scopeEventId" in fields){
    if(fields.scopeEventId){
      t.scopeEventId = fields.scopeEventId;
      t.blocksEventId = fields.scopeEventId;
      t.scope = null;
    } else {
      t.scopeEventId = null;
      t.blocksEventId = null;
      t.scope = "wedding";
      
      if(t.entityType === "event"){ t.entityType = null; t.entityId = null; }
    }
  }
  if("linkedTimelineItemId" in fields) t.linkedTimelineItemId = fields.linkedTimelineItemId || null;
  persistPlanning();
  return true;
}



function markItemStarted(id){
  const t = tlItem(id);
  if(!t) return;
  t.actualStartTime = now().toISOString();
  persistDataOverride();
}
function markItemComplete(id){
  const t = tlItem(id);
  if(!t) return;
  if(!t.actualStartTime) t.actualStartTime = t.time; // backfill so delay math stays sane
  t.completedAt = now().toISOString();
  persistDataOverride();
}
function reopenItem(id){
  const t = tlItem(id);
  if(!t) return;
  t.completedAt = null;
  persistDataOverride();
}
function markVendorArrived(id){
  const v = vendor(id);
  if(!v) return;
  v.checkedInAt = now().toISOString();
  persistDataOverride();
}
function unmarkVendorArrived(id){
  const v = vendor(id);
  if(!v) return;
  v.checkedInAt = null;
  persistDataOverride();
}
function assignmentById(id){ return allAssignments().find(a=>a.id===id) || null; }
function acknowledgeAssignment(id){
  const a = assignmentById(id);
  if(!a) return;
  a.acknowledgedAt = now().toISOString();
  persistDataOverride();
}
function completeAssignment(id){
  const a = assignmentById(id);
  if(!a) return;
  a.completedAt = now().toISOString();
  persistDataOverride();
}
function reopenAssignment(id){
  const a = assignmentById(id);
  if(!a) return;
  a.completedAt = null;
  persistDataOverride();
}


function setVendorStatus(id, status){
  const v = vendor(id);
  if(!v || (status !== "confirmed" && status !== "pending")) return;
  v.status = status;
  persistDataOverride();
}
function setVendorArrival(id, iso){
  const v = vendor(id);
  if(!v) return;
  v.arrival = iso || "";
  persistDataOverride();
}
function setVenueAddress(id, address){
  const v = data.venues.find(x=>x.id===id);
  if(!v) return;
  v.address = (address||"").trim();
  persistDataOverride();
}
function setEventOwnerTeams(id, teamIds){
  const e = ev(id);
  if(!e) return;
  e.ownerTeamIds = Array.isArray(teamIds) ? teamIds.filter(Boolean) : [];
  persistDataOverride();
}
function setTimelineItemSong(id, title){
  const t = tlItem(id);
  if(!t || !("songTitle" in t)) return; // only for items the schema already models this on
  t.songTitle = (title||"").trim() || null;
  persistDataOverride();
}
function setTimelineItemSpeakers(id, personIds){
  const t = tlItem(id);
  if(!t || !("speakerPersonIds" in t)) return;
  t.speakerPersonIds = Array.isArray(personIds) ? personIds.filter(Boolean) : [];
  persistDataOverride();
}

function setVendorLiaison(id, personId){
  const v = vendor(id);
  if(!v) return;
  data.assignments = (data.assignments||[]).filter(a=>!(a.targetType==="vendor" && a.targetId===id && a.role==="vendorLiaison"));
  if(personId){
    data.assignments.push({ id:"asn_"+Math.random().toString(36).slice(2,10), assigneeType:"person", assigneeId:personId,
      role:"vendorLiaison", targetType:"vendor", targetId:id, instruction:null, acknowledgedAt:null, completedAt:null });
  }
  persistDataOverride();
}
function setTimelineItemPrimaryAssignee(id, personId){
  const t = tlItem(id);
  if(!t) return;
  data.assignments = (data.assignments||[]).filter(a=>!(a.targetType==="timelineItem" && a.targetId===id && a.role==="primary"));
  if(personId){
    data.assignments.push({ id:"asn_"+Math.random().toString(36).slice(2,10), assigneeType:"person", assigneeId:personId,
      role:"primary", targetType:"timelineItem", targetId:id, instruction:null, acknowledgedAt:null, completedAt:null });
  }
  persistDataOverride();
}

function addNote(type, id, body){
  if(!hasPlanning() || !body.trim()) return;
  planning.notes.push({ id:"note_"+Math.random().toString(36).slice(2,10), entityType:type, entityId:id,
                        body:body.trim(), createdDate: now().toISOString().slice(0,10), authorPersonId:null });
  persistPlanning();
}
function decideDecision(id, chosenOption, rationale){
  const d = decisionOf(id);
  if(!d) return;
  d.status = "decided"; d.chosenOption = chosenOption;
  d.rationale = rationale || ""; d.decidedDate = now().toISOString().slice(0,10);
  persistPlanning();
}


function computeAlerts(){
  return sortTasks(planningIssues()).map(t=>({
    severity: severityOf(t),
    text: t.title,
    sub: t.detail,
    targetType: "task",
    targetId: t.id
  }));
}




function dayOfIssues(){
  const t = now().getTime();
  const WINDOW = 24*60*60*1000;
  return sortTasks(planningIssues().filter(task=>{
    const eid = taskEventId(task);
    if(!eid) return false;
    const e = ev(eid);
    if(!e) return false;
    const start = new Date(e.startTime).getTime();
    const end = new Date(e.endTime).getTime();
    return (t >= start - WINDOW && t <= end) || (t >= start && t <= end);
  }));
}


function eventOfAssignmentTarget(a){
  if(a.targetType === "event") return ev(a.targetId);
  if(a.targetType === "timelineItem") return ev(tlItem(a.targetId)?.eventId);
  if(a.targetType === "vendor"){
    const todayIds = new Set(todaysEvents().map(e=>e.id));
    const v = vendor(a.targetId);
    const matchId = (v?.eventIds||[]).find(id=>todayIds.has(id));
    return matchId ? ev(matchId) : null;
  }
  return null;
}
function assignmentsToday(){
  const todayIds = new Set(todaysEvents().map(e=>e.id));
  if(!todayIds.size) return [];
  return allAssignments().filter(a=>{
    const e = eventOfAssignmentTarget(a);
    return e && todayIds.has(e.id);
  });
}


function weatherFor(eventId){ return ev(eventId)?.weatherNote || null; }
function weatherToday(){
  const e = todaysEvents()[0] || nextMajorEvent();
  return e && e.weatherNote ? {note: e.weatherNote, eventTitle: e.title} : null;
}

function minutesUntil(iso){ return Math.round((new Date(iso).getTime() - now().getTime()) / 60000); }
function countdownLabel(iso){
  const m = minutesUntil(iso);
  if(m <= 0) return "Starting now";
  if(m < 60) return `in ${m} min`;
  const h = Math.floor(m/60), r = m % 60;
  return r ? `in ${h}h ${r}m` : `in ${h}h`;
}


function assignmentCoverage(){
  const requiring = data.timelineItems.filter(t=>t.requiresAssignment);
  const covered = requiring.filter(t=>primaryAssignmentOf("timelineItem", t.id));
  return { total: requiring.length, covered: covered.length, missing: requiring.length - covered.length };
}

function missingResponsibilities(){
  const items = data.timelineItems.filter(t=>t.requiresAssignment && !primaryAssignmentOf("timelineItem", t.id));
  const events = data.events.filter(e=>(!e.ownerTeamIds || !e.ownerTeamIds.length) && !primaryAssignmentOf("event", e.id));
  return { items, events };
}


function vendorReadiness(v){
  if(v.checkedInAt) return "ready";
  if(v.arrival && now().getTime() >= new Date(v.arrival).getTime()) return "flagged";
  return "expected";
}
function vendorsActiveToday(){
  const today = todaysEvents();
  const ids = new Set();
  today.forEach(e=>(e.vendorIds||[]).forEach(id=>ids.add(id)));
  if(!ids.size){
    const nxt = nextMajorEvent();
    if(nxt) (nxt.vendorIds||[]).forEach(id=>ids.add(id));
  }
  return [...ids].map(vendor).filter(Boolean);
}


function coordinatesWithFor(personId){
  const items = timelineItemsForPerson(personId);
  const seen = new Map();
  items.forEach(item=>{
    assignmentsFor("timelineItem", item.id).forEach(a=>{
      const who = assigneeOf(a);
      if(!who || (who.type==="person" && who.id===personId)) return;
      const key = who.type+":"+who.id;
      if(!seen.has(key)) seen.set(key, {...who, itemTitle:item.title});
    });
    (item.vendorIds||[]).forEach(vid=>{
      const v = vendor(vid);
      if(!v) return;
      const key = "vendor:"+vid;
      if(!seen.has(key)) seen.set(key, {type:"vendor", id:vid, name:v.name, itemTitle:item.title});
    });
  });
  return [...seen.values()];
}


function allTransportation(){ return data.transportation || []; }
function transportationById(id){ return allTransportation().find(t=>t.id===id) || null; }
function transportationFor(eventId, venueId){
  return allTransportation().filter(t=>
    (!eventId || t.eventId === eventId) &&
    (!venueId || t.pickupVenueId === venueId || t.destinationVenueId === venueId)
  );
}

function isGuestFacingTransportation(t){ return t.lifecycle === "confirmed" && t.audience === "public"; }

function guestFacingTransportation(eventId){
  return allTransportation()
    .filter(isGuestFacingTransportation)
    .filter(t=>!eventId || t.eventId === eventId)
    .sort((a,b)=>new Date(a.departureTime)-new Date(b.departureTime));
}
function transportationLabel(t){
  const pickup = venueOf(t.pickupVenueId)?.name || "Pickup TBD";
  const dest = venueOf(t.destinationVenueId)?.name || "Destination TBD";
  return `${pickup} → ${dest}`;
}
function transportationDriverLabel(t){
  if(t.vendorId) return vendor(t.vendorId)?.name || null;
  return t.driverName || null;
}
const TRANSPORT_LIFECYCLE_META = {
  draft:     {label:"Draft",     cls:"status-gray"},
  confirmed: {label:"Confirmed", cls:"status-green"}
};


function nextTransportationToday(){
  const t = now().getTime();
  return allTransportation()
    .filter(tr => tr.departureTime && isSameDay(new Date(tr.departureTime), now()))
    .filter(tr => {
      const dep = new Date(tr.departureTime).getTime();
      const arr = tr.arrivalTime ? new Date(tr.arrivalTime).getTime() : dep + 45*60000;
      return t <= arr + 60*60000; // still relevant up to an hour after arrival
    })
    .sort((a,b)=>new Date(a.departureTime)-new Date(b.departureTime))[0] || null;
}


function createTransportation(fields){
  if(!fields || !fields.departureTime) return null;
  if(!data.transportation) data.transportation = [];
  const t = {
    id: "trans_"+Math.random().toString(36).slice(2,10),
    direction: fields.direction || "hotel_to_venue",
    pickupVenueId: fields.pickupVenueId || null,
    destinationVenueId: fields.destinationVenueId || null,
    eventId: fields.eventId || null,
    departureTime: fields.departureTime,
    arrivalTime: fields.arrivalTime || null,
    vendorId: fields.vendorId || null,
    driverName: fields.driverName || null,
    driverPhone: fields.driverPhone || null,
    capacity: fields.capacity ? Number(fields.capacity) : null,
    guestInstructions: fields.guestInstructions || null,
    lifecycle: "draft",
    audience: fields.audience || "public"
  };
  data.transportation.push(t);
  persistDataOverride();
  return t.id;
}
function updateTransportation(id, fields){
  const t = transportationById(id);
  if(!t) return false;
  Object.assign(t, fields);
  persistDataOverride();
  return true;
}
function setTransportationLifecycle(id, lifecycle){
  const t = transportationById(id);
  if(!t) return;
  t.lifecycle = lifecycle;
  persistDataOverride();
}


function createTimelineItem(fields){
  if(!fields || !fields.eventId || !fields.title || !fields.time) return null;
  const e = ev(fields.eventId);
  if(!e) return null;
  if(!data.timelineItems) data.timelineItems = [];
  const item = {
    id: "tl_"+Math.random().toString(36).slice(2,10),
    eventId: fields.eventId,
    time: fields.time,
    title: fields.title,
    kind: fields.kind || "logistics",
    audience: fields.audience || "internal",
    guestTitle: null,
    rollupParentId: null,
    ownerTeamIds: [],
    vendorIds: [],
    venueId: e.venueId || null,
    notes: "",
    status: "upcoming",
    actualStartTime: null,
    completedAt: null
  };
  data.timelineItems.push(item);
  persistDataOverride();
  return item.id;
}


const TYPE_ICON = {
  event: ICONS.calendar, timelineItem: ICONS.timeline, team: ICONS.users, person: ICONS.person, vendor: ICONS.wrench,
  venue: ICONS.mapPin, contact: ICONS.phone,
  task: ICONS.clipboard, decision: ICONS.checkCircle, note: ICONS.message, transportation: ICONS.shuttle
};




const NAV_ITEMS = [
  {id:"mission",   label:"Home",     icon:ICONS.mission},
  {id:"timeline",  label:"Schedule", icon:ICONS.timeline},
  {id:"tasks",     label:"Responsibilities", icon:ICONS.clipboard},
  {id:"directory", label:"Contacts", icon:ICONS.directory}
];
function navItems(){ return NAV_ITEMS; }


const DAY_OF_RESPONSIBILITIES = [
  {id:"resp_01",eventId:"event_mehndi",time:"2030-06-13T17:30:00",title:"Final venue setup check",owner:"Demo Operations Team",detail:"Confirm the tent, tables, food area, mehndi seating, specialty tables, welcome table, lights and decorations are ready."},
  {id:"resp_03",eventId:"event_mehndi",time:"2030-06-13T21:00:00",title:"Late-guest food",owner:"Demo Operations Team",detail:"Pack food and ensure it reaches the hotel for guests arriving late."},
  {id:"resp_04",eventId:"event_vidhi",time:"2030-06-14T04:30:00",title:"Draping aunty transportation",owner:"Demo Operations Team",detail:"Pick her up and bring her to the hotel by 5:00 AM."},
  {id:"resp_05",eventId:"event_vidhi",time:"2030-06-14T07:45:00",title:"Pooja items onsite",owner:"Demo Operations Team",detail:"Confirm the required pooja items for both sides are physically onsite and separated."},
  {id:"resp_06",eventId:"event_vidhi",time:"2030-06-14T07:50:00",title:"Immediate-family arrival check",owner:"Demo Operations Team",detail:"Everyone required for photos and the opening poojas confirms their own on-time arrival."},
  {id:"resp_07",eventId:"event_vidhi",time:"2030-06-14T08:50:00",title:"Opening pooja participants ready",owner:"Demo Operations Team",detail:"Gather the participants for both sides' Ganesh Sthapan, Mandva/Mandwa and Thambli."},
  {id:"resp_08",eventId:"event_vidhi",time:"2030-06-14T09:25:00",title:"Mameru front-entrance transition",owner:"Demo Operations Team",detail:"Ensure the first Mameru group and required items are ready at the front entrance."},
  {id:"resp_09",eventId:"event_vidhi",time:"2030-06-14T10:50:00",title:"Jordan outfit change and Varadh handoff",owner:"Demo Operations Team",detail:"Help Jordan transition so she reaches Alex's Varadh at the front entrance by 11:20 AM."},
  {id:"resp_10",eventId:"event_vidhi",time:"2030-06-14T11:15:00",title:"Alex's Varadh group ready",owner:"Demo Operations Team",detail:"Stage Alex's side and the required ceremonial items at the front entrance."},
  {id:"resp_11",eventId:"event_vidhi",time:"2030-06-14T12:15:00",title:"Lunch delivered to Alex & Jordan",owner:"Demo Operations Team",detail:"Bring the couple's lunch to the suite during their Haldi outfit change."},
  {id:"resp_12",eventId:"event_vidhi",time:"2030-06-14T12:45:00",title:"Haldi entrance lineup",owner:"Demo Operations Team",detail:"Gather and order the bridesmaids and groomsmen for the 12:50 PM entrance."},
  {id:"resp_13",eventId:"event_sangeet",time:"2030-06-14T18:20:00",title:"Rickshaw entrance ready",owner:"Demo Operations Team",detail:"Confirm the rickshaw, entrance path, couple and music cue are ready."},
  {id:"resp_14",eventId:"event_sangeet",time:"2030-06-14T18:30:00",title:"Performance lineup",owner:"Demo Operations Team",detail:"Keep each performer near the stage before their scheduled performance."},
  {id:"resp_15",eventId:"event_sangeet",time:"2030-06-14T18:30:00",title:"Performance audio tested",owner:"Demo Operations Team",detail:"Confirm every performance MP3 is downloaded locally, labeled and tested."},
  {id:"resp_16",eventId:"event_sangeet",time:"2030-06-14T19:55:00",title:"Skit file and participants ready",owner:"Demo Operations Team",detail:"Confirm the final skit audio and details are with the DJ and everyone is ready."},
  {id:"resp_17",eventId:"event_sangeet",time:"2030-06-14T23:00:00",title:"Wedding décor turnover begins",owner:"Demo Operations Team",detail:"Confirm Sangeet breakdown and the overnight wedding setup begin on time."},
  {id:"resp_18",eventId:"event_wedding",time:"2030-06-15T04:30:00",title:"Draping aunty transportation",owner:"Demo Operations Team",detail:"Pick her up and bring her to the hotel by 5:00 AM."},
  {id:"resp_19",eventId:"event_wedding",time:"2030-06-15T08:00:00",title:"Pandit arrival and ceremony timing",owner:"Demo Operations Team",detail:"Confirm the Pandit is onsite and verify the final ceremony timing."},
  {id:"resp_20",eventId:"event_wedding",time:"2030-06-15T08:45:00",title:"Baraat car ready",owner:"Demo Operations Team",detail:"Confirm the car is onsite, decorated, accessible and the keys are with the correct person."},
  {id:"resp_21",eventId:"event_wedding",time:"2030-06-15T08:45:00",title:"Baraat readiness and on-time start",owner:"Demo Operations Team",detail:"Gather the family, confirm the music cue and ensure the Baraat starts at 9:00 AM."},
  {id:"resp_22",eventId:"event_wedding",time:"2030-06-15T09:35:00",title:"Welcome rituals ready",owner:"Demo Operations Team",detail:"Stage the participants and everything needed at the entrance."},
  {id:"resp_23",eventId:"event_wedding",time:"2030-06-15T09:50:00",title:"Ceremony pooja items at mandap",owner:"Demo Operations Team",detail:"Verify all ceremony materials are complete and placed per the Pandit's instructions."},
  {id:"resp_24",eventId:"event_wedding",time:"2030-06-15T10:20:00",title:"Processional lineup",owner:"Demo Operations Team",detail:"Arrange the demo flower party, wedding party, candle entrants and performers in timeline order."},
  {id:"resp_25",eventId:"event_wedding",time:"2030-06-15T10:20:00",title:"Entrance items distributed",owner:"Demo Operations Team",detail:"Confirm the sign, baskets, flowers and candles reach the correct people."},
  {id:"resp_26",eventId:"event_wedding",time:"2030-06-15T10:50:00",title:"Bride entrance ready",owner:"Demo Operations Team",detail:"Gather Jordan, her brothers and mamas and confirm flowers and music are ready."},
  {id:"resp_27",eventId:"event_wedding",time:"2030-06-15T11:00:00",title:"Passed-drink service timing",owner:"Demo Operations Team",detail:"Begin service only after Jordan is seated and do not interfere with entrances."},
  {id:"resp_28",eventId:"event_wedding",time:"2030-06-15T11:50:00",title:"Photo-exit flowers ready",owner:"Demo Operations Team",detail:"Distribute the flowers and stage everyone before the 11:55 AM exit."},
  {id:"resp_29",eventId:"event_wedding",time:"2030-06-15T12:00:00",title:"Group-picture coordination",owner:"Demo Operations Team",detail:"Call photo groups in numerical order and keep the next group ready."},
  {id:"resp_30",eventId:"event_wedding",time:"2030-06-15T09:50:00",title:"Marriage license and rings / jewelry custody",owner:"Demo Operations Team",detail:"Confirm who brings them, holds them during the ceremony and takes them afterward."},
  {id:"resp_31",eventId:"event_reception",time:"2030-06-15T19:00:00",title:"Guest seating and ballroom closure",owner:"Demo Operations Team",detail:"Help guests find seats and confirm everyone is seated before entrances."},
  {id:"resp_32",eventId:"event_reception",time:"2030-06-15T19:20:00",title:"Reception entrance lineup",owner:"Demo Operations Team",detail:"Arrange every entrance participant in order and coordinate the music cues."},
  {id:"resp_33",eventId:"event_reception",time:"2030-06-15T20:00:00",title:"Cake ready for cutting",owner:"Demo Operations Team",detail:"Confirm the cake, knife, plates, photographer and venue team are ready after the first dance."},
  {id:"resp_34",eventId:"event_reception",time:"2030-06-15T20:10:00",title:"Speakers and dancers on deck",owner:"Demo Operations Team",detail:"Keep the next speaker or performer ready without interrupting the program."},
  {id:"resp_35",eventId:"event_reception",time:"2030-06-15T19:20:00",title:"Reception audio backup tested",owner:"Demo Operations Team",detail:"Confirm entrance, dance and performance audio is downloaded locally and tested."},
  {id:"resp_36",eventId:"event_reception",time:"2030-06-15T23:00:00",title:"Décor pickup",owner:"Demo Operations Team",detail:"Confirm which items are removed, retained or returned."}
];


function dayOfResponsibilitiesForPerson(personId){
  const p = person(personId);
  if(!p) return [];
  const normalize = value => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  const fullName = normalize(p.name);
  const firstName = fullName.split(" ")[0];
  const uniqueFirst = data.people.filter(other=>normalize(other.name).split(" ")[0] === firstName).length === 1;
  return DAY_OF_RESPONSIBILITIES.filter(r=>r.owner.split(/\s*(?:\/|&|,|\band\b)\s*/i).some(owner=>{
    const name = normalize(owner);
    return name === fullName || (uniqueFirst && name === firstName);
  })).sort((a,b)=>new Date(a.time)-new Date(b.time));
}

function responsibilitiesForEvent(eventId){
  return DAY_OF_RESPONSIBILITIES.filter(r=>r.eventId===eventId).sort((a,b)=>new Date(a.time)-new Date(b.time));
}


let installBannerDismissed = false;
function isOpsStandalone(){
  return navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}
function opsInstallBannerHtml(){
  const isAppleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(navigator.userAgent);
  if((!isAppleMobile && !isAndroid) || isOpsStandalone() || installBannerDismissed) return "";
  try { if(localStorage.getItem('wedding_ops_install_dismissed') === '1') return ""; } catch(e) {}
  return `<aside class="ops-install-banner" aria-label="Save to Home Screen">
    <div><details><summary><span class="ops-install-glint" aria-hidden="true">↓</span> Save to Home Screen <span class="ops-install-chevron" aria-hidden="true">⌄</span></summary>
        ${isAndroid ? `<ol><li>Open this website in Chrome. If you scanned the QR code in another app, open its menu and choose to open in Chrome first.</li><li>Tap the three-dot menu, then <strong>Add to Home screen</strong> or <strong>Install and create shortcut</strong>.</li><li>Choose <strong>Install</strong> if offered, or <strong>Create shortcut</strong>, then confirm <strong>Add</strong>.</li></ol><p>A shortcut may open in Chrome rather than a separate app window. You can dismiss this suggestion after adding it.</p>` : `<ol><li>Open this website in Safari.</li><li>Tap Share (the square with an upward arrow). It may be inside the More menu.</li><li>Choose <strong>Add to Home Screen</strong>. If shown, leave <strong>Open as Web App</strong> on, then tap <strong>Add</strong>.</li></ol>`}
        <p>No download needed. Your existing access protection still applies.</p>
      </details>
    </div>
    <button class="ops-install-dismiss" type="button" data-dismiss-install aria-label="Dismiss save app suggestion">×</button>
  </aside>`;
}

function sidebarEventSpotlightHtml(){
  const event = opsThemeEvent();
  if(!event) return `<span class="side-spotlight-kicker">The celebration</span><strong>Alex &amp; Jordan</strong>`;
  return `<span class="side-spotlight-kicker">Event spotlight</span>
    <strong>${esc(event.title)}</strong>
    <span class="side-spotlight-date">${fmtDate(celebrationStart(event),{month:'short',day:'numeric'})} <span aria-hidden="true">·</span> ${fmtTime(celebrationStart(event))}</span>`;
}

function demoClockControlHtml(scope){
  const suffix = scope === "mobile" ? "-mobile" : "";
  const open = scope === "desktop" && state.simDate ? " open" : "";
  return `<details class="demo-clock-control" data-demo-clock-scope="${scope}"${open}>
    <summary><span class="demo-badge-dot" aria-hidden="true"></span><span>Try the Demo Clock<small>${state.simDate ? `${fmtDate(now(),{month:'short',day:'numeric'})} · ${fmtTime(now())}` : 'Choose an event moment'}</small></span><span class="demo-clock-chevron" aria-hidden="true">⌄</span></summary>
    <p class="demo-clock-hint">Jump through the events to see live schedules, tasks, and seating change.</p>
    <div class="demo-clock-panel">
      <label for="demo-clock-preset${suffix}">Jump to</label>
      <select id="demo-clock-preset${suffix}" data-demo-clock-preset>
        <option value="">Choose a moment…</option>
        <option value="2030-06-13T18:15">Mehndi · 6:15 PM</option>
        <option value="2030-06-14T10:00">Vidhi · 10:00 AM</option>
        <option value="2030-06-14T19:30">Sangeet · 7:30 PM</option>
        <option value="2030-06-15T10:15">Wedding · 10:15 AM</option>
        <option value="2030-06-15T12:05">Photo Groups · 12:05 PM</option>
        <option value="2030-06-15T19:10">Reception Seating · 7:10 PM</option>
        <option value="2030-06-15T20:10">Reception Program · 8:10 PM</option>
      </select>
      <label for="demo-clock-custom${suffix}">Custom date &amp; time</label>
      <input id="demo-clock-custom${suffix}" data-demo-clock-custom type="datetime-local" value="${localDateTimeValue(now())}">
      <div class="demo-clock-actions"><button class="btn btn-sm" data-demo-clock-apply>Apply</button><button class="btn btn-sm" data-demo-clock-live>Real Time</button></div>
    </div>
  </details>`;
}

function renderShell(){
  const app = document.getElementById("app");
  app.className = opsThemeClass();
  app.innerHTML = `
    <nav class="sidebar" aria-label="Main navigation">
      <button class="brand" id="logo-btn-desktop" aria-label="Event Ops Event Operations home">
        <span class="brand-mark" aria-hidden="true">A<span>&amp;</span>J</span>
        <span class="brand-text">
          <span class="brand-title">Alex &amp; Jordan</span>
          <span class="brand-sub">Event Operations</span>
        </span>
      </button>
      <div class="side-wedding-date">June 13–16, 2030</div>
      <section class="side-event-spotlight" id="side-event-spotlight" aria-label="Event spotlight">${sidebarEventSpotlightHtml()}</section>
        ${isPreviewMode() ? `
        ${demoClockControlHtml("desktop")}
        ` : ""}
      <div class="side-nav-heading">Your event guide</div>
      ${navItems().map(n=>`
        <button class="side-btn ${state.view===n.id?'active':''}" data-nav="${n.id}" aria-label="${esc(n.label)}" ${state.view===n.id?'aria-current="page"':''}>
          <span class="side-nav-icon" aria-hidden="true">${n.icon}</span>
          <span class="side-nav-copy"><span>${n.label}</span><small aria-hidden="true">${({mission:'What’s happening now',timeline:'Every moment, in order',tasks:'Who’s doing what',directory:'Find your people'})[n.id]||''}</small></span>
          <span class="side-nav-arrow" aria-hidden="true">›</span>
        </button>
      `).join("")}
      <button class="search-pill side-search" id="global-search-btn" aria-label="Search everything">
        ${ICONS.search}<span>Search everything</span><span class="kbd">⌘K</span>
      </button>
      <div class="side-footer">

        <button class="side-footer-link" id="manage-wedding-btn">${ICONS.settings} Manage</button>
      </div>
    </nav>
    <div class="app-main">
      <div class="topbar">
        <button class="brand" id="logo-btn-mobile" aria-label="Event Ops Event Operations home">
          <span class="brand-mark" aria-hidden="true">A<span>&amp;</span>J</span>
          <span class="brand-text">
            <span class="brand-title">Alex &amp; Jordan</span>
            <span class="brand-sub">Event Operations</span>
          </span>
        </button>
        <div class="topbar-actions">
          <button class="icon-btn" id="global-search-btn-mobile" aria-label="Search everything">${ICONS.search}</button>
          <button class="icon-btn" id="manage-wedding-btn-mobile" aria-label="Manage Wedding">${ICONS.settings}</button>
        </div>
      </div>
      ${isPreviewMode() ? `<div class="mobile-demo-clock">${demoClockControlHtml("mobile")}</div>` : ""}
      ${opsInstallBannerHtml()}
      <main id="view-mission" class="view"></main>
      <main id="view-timeline" class="view"></main>
      <main id="view-tasks" class="view"></main>
      <main id="view-directory" class="view"></main>
      <main id="view-manage" class="view"></main>
    </div>
    <nav class="bottom-nav" aria-label="Bottom navigation">
      ${NAV_ITEMS.map(n=>`
        <button class="nav-btn ${state.view===n.id ? 'active':''}" data-nav="${n.id}" aria-label="${esc(n.label)}" ${state.view===n.id?'aria-current="page"':''}>
          <span class="mobile-nav-icon" aria-hidden="true">${n.icon}</span><span>${n.label.split(' ')[0]}</span>
        </button>
      `).join("")}
    </nav>
  `;
  wireShellEvents();
}

function wireShellEvents(){
  document.querySelector('[data-dismiss-install]')?.addEventListener('click', (event)=>{
    installBannerDismissed = true;
    try { localStorage.setItem('wedding_ops_install_dismissed', '1'); } catch(e) {}
    event.currentTarget.closest('.ops-install-banner').remove();
  });
  document.querySelectorAll("[data-nav]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const target = btn.getAttribute("data-nav");
      if(target === "timeline") state.timelineEventId = null; // Schedule always opens on the event picker
      if(target === "tasks"){ state.taskScopeId = null; state.taskScopeReturnsToHub = false; } // Tasks always opens on the scope picker
      if(target === "directory") state.contactsFilter = ""; // Contacts always opens unfiltered
      state.view = target;
      renderShell();
      renderActiveView();
      window.scrollTo(0, 0);
    });
  });
  const logoHandler = makeLogoTapHandler();
  const lb1 = document.getElementById("logo-btn-desktop");
  const lb2 = document.getElementById("logo-btn-mobile");
  if(lb1) lb1.addEventListener("click", logoHandler);
  if(lb2) lb2.addEventListener("click", logoHandler);
  const mw1 = document.getElementById("manage-wedding-btn");
  const mw2 = document.getElementById("manage-wedding-btn-mobile");
  if(mw1) mw1.addEventListener("click", openManageWedding);
  if(mw2) mw2.addEventListener("click", openManageWedding);
  const search1 = document.getElementById("global-search-btn");
  const search2 = document.getElementById("global-search-btn-mobile");
  if(search1) search1.addEventListener("click", openSearch);
  if(search2) search2.addEventListener("click", openSearch);
  function setDemo(value){
    if(!value) return;
    const d = new Date(value);
    if(Number.isNaN(d.getTime())) return;
    state.simDate = d.toISOString();
    try{ localStorage.setItem(LS_KEYS.SIM_DATE,state.simDate); }catch(e){}
    state.view = "mission"; state.timelineEventId = null; state.missionEventId = null;
    renderShell(); renderActiveView();
  }
  document.querySelectorAll(".demo-clock-control").forEach(clock=>{
    const preset = clock.querySelector("[data-demo-clock-preset]");
    const custom = clock.querySelector("[data-demo-clock-custom]");
    const apply = clock.querySelector("[data-demo-clock-apply]");
    const live = clock.querySelector("[data-demo-clock-live]");
    if(preset) preset.addEventListener("change",()=>setDemo(preset.value));
    if(apply) apply.addEventListener("click",()=>setDemo(custom.value));
    if(live) live.addEventListener("click",()=>{
      state.simDate = null;
      try{ localStorage.removeItem(LS_KEYS.SIM_DATE); }catch(e){}
      state.view = "mission"; state.timelineEventId = null; state.missionEventId = null;
      renderShell(); renderActiveView();
    });
  });
}

function makeLogoTapHandler(){
  let taps = 0, timer = null;
  return function(){
    taps++;
    clearTimeout(timer);
    timer = setTimeout(()=>{ taps = 0; }, 900);
    if(taps >= 3){
      taps = 0;
      clearTimeout(timer);
      openManageWedding();
    }
  };
}

function renderActiveView(){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  if(state.view === "mission"){
    document.getElementById("view-mission").classList.add("active");
    renderMissionControl();
  } else if(state.view === "timeline"){
    document.getElementById("view-timeline").classList.add("active");
    renderTimeline();
  } else if(state.view === "tasks"){
    document.getElementById("view-tasks").classList.add("active");
    renderTasksControl();
  } else if(state.view === "directory"){
    document.getElementById("view-directory").classList.add("active");
    renderContacts();
  } else if(state.view === "manage"){
    document.getElementById("view-manage").classList.add("active");
    renderManageWedding();
  }
}

function openManageWedding(){
  state.view = "manage";
  renderShell();
  renderActiveView();
}


function renderManageWedding(){
  const el = document.getElementById("view-manage");
  if(state.missionDrill === "event" && state.missionEventId && ev(state.missionEventId)){
    renderEventWorkspace(el, state.missionEventId);
    return;
  }
  state.missionDrill = null;
  state.eventHubSection = null;
  renderManageLanding(el);
}

function renderManageLanding(el){
  const sortedEvents = [...data.events].sort((a,b)=>new Date(a.startTime)-new Date(b.startTime));

  el.innerHTML = `
    <div class="section-head"><span class="section-title">Manage Wedding</span></div>
    <p style="font-size:12.5px; color:var(--ink-faint); margin:-6px 0 16px;">Advanced tools — not shown to Guests, and not part of the everyday Home/Schedule/Tasks/Contacts flow.</p>

    <div class="section">
      <div class="drawer-section-title">Event Workspaces</div>
      <div class="studio-events-grid">
        ${sortedEvents.map(e=>`<div class="studio-event-card clickable" data-mw-event="${e.id}">
          <div class="studio-event-card-date">${fmtDate(e.startTime,{month:'short',day:'numeric'})}</div>
          <div class="studio-event-card-title">${esc(e.title)}</div>
        </div>`).join("")}
      </div>
    </div>

    <div class="section">
      <div class="drawer-section-title">Directory</div>
      <p style="font-size:12.5px; color:var(--ink-faint); margin-bottom:10px;">The full entity directory — People, Teams, Vendors, Venues, and Contacts.</p>
      <button class="btn btn-block" id="mw-directory-btn">${ICONS.directory} Browse Full Directory</button>
    </div>

    <div class="section">
      <div class="drawer-section-title">Data &amp; Backup</div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="btn btn-block" id="mw-export-btn">Export Backup (JSON)</button>
        <button class="btn btn-block" id="mw-import-btn">Import Backup</button>
        <input type="file" id="mw-import-file" accept="application/json" style="display:none;">
      </div>
    </div>

  `;
  
  wireManageLandingEvents(el);
}

function wireManageLandingEvents(el){
  el.querySelector("#mw-directory-btn").addEventListener("click", ()=>renderDirectory(el));

  el.querySelectorAll("[data-mw-event]").forEach(c=>c.addEventListener("click", ()=>{
    state.missionDrill = "event";
    state.missionEventId = c.getAttribute("data-mw-event");
    state.eventHubSection = null;
    renderManageWedding();
  }));

  el.querySelector("#mw-export-btn").addEventListener("click", ()=>{
    const snapshot = { data, planning, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `vs-event-ops-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast("Backup exported");
  });
  const fileInput = el.querySelector("#mw-import-file");
  el.querySelector("#mw-import-btn").addEventListener("click", ()=>fileInput.click());
  fileInput.addEventListener("change", (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const parsed = JSON.parse(reader.result);
        if(parsed.data && normalizeDataShape(parsed.data)){
          data = parsed.data;
          persistDataOverride();
          if(parsed.planning && normalizePlanningShape(parsed.planning)){
            planning = parsed.planning;
            persistPlanning();
          }
          
          if(sanitizeVenueTimelineData(data, planning)){
            persistDataOverride();
            if(planning) persistPlanning();
          }
          
          if(reconcileSourceTimelineItems(data, planning)){
            persistDataOverride();
            if(planning) persistPlanning();
          }
          
          if(planning && reconcileChecklistTasks(planning)) persistPlanning();
          renderShell(); renderActiveView();
          toast("Backup imported successfully");
        } else {
          toast("That file doesn't look like a Event Ops Event Operations backup");
        }
      }catch(err){ toast("Import failed — invalid JSON"); }
    };
    reader.readAsText(file);
  });
}



function renderMissionControl(){
  const el = document.getElementById("view-mission");
  state.missionDrill = null;
  state.taskScopeId = null;
  state.eventHubSection = null;

  const phase = getPhase();

  
  if(phase === "week"){ renderDayOfHome(el); return; }

  const alerts = computeAlerts().sort((a,b)=>severityRank(a.severity)-severityRank(b.severity));
  const heroHtml = phase === "planning" ? heroPlanning(alerts) : heroPostWedding();

  
  el.innerHTML = `
    ${heroHtml}
    ${eventToolsHtml()}
    ${state.planningMode ? renderMissionPlanningPanelHtml() : ""}
  `;

  if(state.planningMode) wireMissionPlanningPanelEvents(el);
  wireDrawerTriggers(el);
}


function taskWhyLabel(t){
  if(t.status === "blocked") return "Blocked";
  if(t.priority === "urgent") return "Urgent";
  const overdue = t.dueDate && t.status!=="done" && new Date(t.dueDate+"T23:59:59") < now();
  if(overdue) return "Overdue";
  const dueToday = t.dueDate && t.status!=="done" && isSameDay(new Date(t.dueDate+"T12:00:00"), now());
  if(dueToday) return "Due today";
  return "Open";
}

function renderTeamFocusRow(t){
  const owner = ownerName(t.ownerId);
  const scope = taskContextLabel(t) || "Wedding-wide";
  return `
    <div class="ptask is-blocking clickable" data-open-drawer="task:${t.id}">
      <div class="ptask-mark">${ICONS.alertTriangle}</div>
      <div class="ptask-body">
        <div class="ptask-title">${esc(t.title)}</div>
        <div class="ptask-meta">
          <span class="ptask-warn">· ${esc(taskWhyLabel(t))}</span>
          <span>· ${owner ? esc(owner) : "Needs an owner"}</span>
          <span>· ${esc(scope)}</span>
        </div>
      </div>
    </div>
  `;
}



function renderMissionPlanningPanelHtml(){
  const upcoming = DAY_OF_RESPONSIBILITIES.filter(r=>new Date(r.time)>=now()).sort((a,b)=>new Date(a.time)-new Date(b.time)).slice(0,3);

  return `
    <div class="section mission-planning-panel">
      <div class="section-head">
        <span class="section-title">Next Responsibilities</span>
      </div>
      ${upcoming.length
        ? `<div class="card"><div class="responsibility-list compact">${upcoming.map(r=>`<div class="responsibility-card" data-event-palette="${r.eventId}"><div class="responsibility-time">${fmtDate(r.time,{month:'short',day:'numeric'})}<br>${fmtTime(r.time)}</div><div class="responsibility-copy"><div class="responsibility-title">${esc(r.title)}</div><div class="responsibility-owner"><span>OWNER</span> ${esc(r.owner)}</div></div></div>`).join("")}</div></div>`
        : `<div class="card empty-state"><div class="empty-state-icon">${ICONS.checkCircle}</div><p>No upcoming responsibilities.</p></div>`}
      <button class="btn btn-block" style="margin-top:14px;" data-mission-view-tasks>${ICONS.clipboard} View Responsibilities</button>
    </div>
  `;
}
function wireMissionPlanningPanelEvents(el){
  const btn = el.querySelector("[data-mission-view-tasks]");
  if(btn) btn.addEventListener("click", ()=>{
    state.view = "tasks";
    state.taskScopeId = null;
    state.taskScopeReturnsToHub = false;
    renderShell();
    renderActiveView();
  });
}


function heroPlanning(alerts){
  const weekendStart = weddingWeekBounds().start;
  const daysLeft = daysUntil(weekendStart);
  const nextEvt = nextMajorEvent();
  return `
    <div class="hero">
      <div class="hero-eyebrow">Planning Phase</div>
      <div class="hero-big">Wedding Weekend Begins in ${daysLeft} Day${daysLeft===1?'':'s'}</div>
      <p class="hero-sub">${esc(data.wedding.coupleNames)} · ${fmtDate(weekendStart+"T00:00:00",{month:'long', day:'numeric', year:'numeric'})}</p>
      <div class="hero-rows">
        <div class="hero-row">
          <div class="hero-row-icon">${ICONS.arrowRight}</div>
          <div class="hero-row-text">
            <div class="hero-row-label">Next Event</div>
            <div class="hero-row-value">${nextEvt ? esc(nextEvt.title) + " · " + fmtDate(nextEvt.startTime,{month:'short', day:'numeric'}) : "All events complete"}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}



function renderDayOfTransportCard(){
  const t = nextTransportationToday();
  if(!t) return "";
  const lm = TRANSPORT_LIFECYCLE_META[t.lifecycle] || TRANSPORT_LIFECYCLE_META.draft;
  const driver = transportationDriverLabel(t);
  const driverPhone = t.vendorId ? vendor(t.vendorId)?.phone : t.driverPhone;
  const returnLeg = allTransportation().find(r=>
    r.id !== t.id && r.direction !== t.direction &&
    r.departureTime && isSameDay(new Date(r.departureTime), now())
  );
  return `
    <div class="section">
      <div class="section-head"><span class="section-title">Transportation</span></div>
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
          <div>
            <div style="font-weight:700; font-size:15px;">${esc(transportationLabel(t))}</div>
            <div style="font-size:13px; color:var(--ink-dim); margin-top:4px;">Departs ${fmtTime(t.departureTime)} · ${countdownLabel(t.departureTime)}${t.arrivalTime ? " · arrives ~" + fmtTime(t.arrivalTime) : ""}</div>
          </div>
          <span class="status-pill ${lm.cls}"><span class="status-dot"></span>${lm.label}</span>
        </div>
        ${t.lifecycle === "draft" ? `<p style="font-size:12.5px; color:var(--yellow); margin-top:10px;">Not yet confirmed — treat the schedule as tentative.</p>` : ""}
        ${driver ? `<div style="font-size:13px; color:var(--ink-dim); margin-top:10px;">Driver / vendor: ${esc(driver)}</div>` : ""}
        ${t.capacity ? `<div style="font-size:12.5px; color:var(--ink-faint); margin-top:2px;">Capacity ${t.capacity}</div>` : ""}
        ${returnLeg ? `<div style="font-size:12.5px; color:var(--ink-faint); margin-top:8px;">Return departs ${fmtTime(returnLeg.departureTime)}</div>` : ""}
        <div class="tl-actions" style="margin-top:12px;">
          <button class="btn btn-sm" data-open-drawer="transportation:${t.id}">View Details</button>
          ${driverPhone ? `` : ""}
        </div>
      </div>
    </div>
  `;
}


const VIDHI_EVENT_ID = "event_vidhi";

const MEHNDI_EVENT_ID = "event_mehndi";
function vidhiSideOf(item){
  const title = (item && item.title || "").trim();
  if(/^alex/i.test(title)) return "alex";
  if(/^jordan/i.test(title)) return "jordan";
  return null;
}

function vidhiMergeItem(sortedItems){
  let lastSideTime = null;
  sortedItems.forEach(it=>{
    if(!vidhiSideOf(it)) return;
    const tm = new Date(it.time).getTime();
    if(lastSideTime === null || tm > lastSideTime) lastSideTime = tm;
  });
  if(lastSideTime === null) return null;
  return sortedItems.find(it => new Date(it.time).getTime() > lastSideTime) || null;
}

function vidhiSideStatus(sortedItems, side, mergeItem, nowMs){
  const sideItems = sortedItems.filter(it=>vidhiSideOf(it)===side);
  let current = null, next = null;
  for(const it of sideItems){
    const tm = new Date(it.time).getTime();
    if(tm <= nowMs) current = it; else { next = it; break; }
  }
  if(!next && mergeItem) next = mergeItem;
  return { current, next };
}

function vidhiComputeTracks(items){
  const sorted = items.slice().sort((a,b)=> new Date(a.time) - new Date(b.time));
  const merge = vidhiMergeItem(sorted);
  if(!merge) return null;
  const nowMs = now().getTime();
  const isDual = nowMs < new Date(merge.time).getTime();
  const alex = vidhiSideStatus(sorted, "alex", merge, nowMs);
  const jordan = vidhiSideStatus(sorted, "jordan", merge, nowMs);
  if(!alex.current && !alex.next && !jordan.current && !jordan.next) return null;
  return { sorted, merge, isDual, alex, jordan };
}
function vidhiSideCardHtml(label, side){
  return `
    <div class="vidhi-side-card">
      <div class="vidhi-side-label">${esc(label)}</div>
      <div class="vidhi-side-current">${side.current ? esc(side.current.title) : "Not started yet"}</div>
      ${side.next ? `<div class="vidhi-side-next">Next: ${esc(side.next.title)} · ${fmtTime(side.next.time)}</div>` : ""}
    </div>
  `;
}

function vidhiDualHeroHtml(currentEvent, tracks, actionsHtml){
  return `
    <div class="hero hero-vidhi">
      <div class="hero-eyebrow is-live">Live Now · ${esc(currentEvent.title)}</div>
      <div class="hero-big">Two Sides, Running in Parallel</div>
      <p class="hero-sub">Both sides merge at ${esc(tracks.merge.title)} · ${countdownLabel(tracks.merge.time)}</p>
      <div class="vidhi-side-grid">
        ${vidhiSideCardHtml("Alex's Side", tracks.alex)}
        ${vidhiSideCardHtml("Jordan's Side", tracks.jordan)}
      </div>
      ${actionsHtml}
    </div>
  `;
}

function vidhiOpsSummaryCardHtml(items){
  const tracks = vidhiComputeTracks(items);
  if(!tracks) return "";
  return `
    <div class="card vidhi-track-card ${tracks.isDual?'':'is-merged'}">
      <div class="section-title" style="margin-bottom:10px;">${tracks.isDual ? "Two Sides, Running in Parallel" : "Together"}</div>
      ${tracks.isDual ? `
        <div class="vidhi-side-grid">
          ${vidhiSideCardHtml("Alex's Side", tracks.alex)}
          ${vidhiSideCardHtml("Jordan's Side", tracks.jordan)}
        </div>
        <p class="vidhi-merge-note">Both sides merge at ${esc(tracks.merge.title)} · ${fmtTime(tracks.merge.time)}</p>
      ` : `
        <p class="vidhi-merge-note">Alex's and Jordan's sides merged at ${esc(tracks.merge.title)} · ${fmtTime(tracks.merge.time)}.</p>
      `}
    </div>
  `;
}


function renderDayOfHome(el){
  const liveItem = currentLiveItem();
  const nextItem = nextUpcomingItem();
  const liveEvent = liveItem ? null : currentLiveEvent(); // event-level fallback — see currentLiveEvent()
  const currentEvent = liveItem ? ev(liveItem.eventId) : (liveEvent || todaysEvents()[0] || null);

  el.innerHTML = `
    ${heroDayOf(liveItem, nextItem, currentEvent, liveEvent)}
    ${eventToolsHtml()}
    ${renderDayOfTransportCard()}
  `;

  el.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click", ()=>{
    const g = b.getAttribute("data-goto");
    if(g === "timeline"){ state.timelineEventId = null; state.view="timeline"; renderShell(); renderActiveView(); }
  }));
  el.querySelectorAll("[data-call]").forEach(b=>b.addEventListener("click", (e)=>{ e.stopPropagation(); window.location.href = telHref(b.getAttribute("data-call")); }));
  wireDrawerTriggers(el);
}


function heroDayOf(liveItem, nextItem, currentEvent, liveEvent){
  const actionsHtml = `
    <div class="hero-actions">
      <button class="btn btn-primary" data-goto="timeline">${ICONS.timeline} Open Schedule</button>
      <button class="btn" data-open-drawer="emergencyContacts:">${ICONS.siren} Emergency Contacts</button>
    </div>
  `;

  
  const vidhiTracks = (currentEvent && currentEvent.id === VIDHI_EVENT_ID) ? vidhiComputeTracks(itemsForEvent(currentEvent.id)) : null;
  if(vidhiTracks && vidhiTracks.isDual){
    return vidhiDualHeroHtml(currentEvent, vidhiTracks, actionsHtml);
  }
  const vidhiTogetherSuffix = (vidhiTracks && !vidhiTracks.isDual) ? " · Together" : "";

  
  if(!liveItem && liveEvent){
    const nextEventFallback = nextItem ? null : nextUpcomingEvent();
    const subParts = [];
    if(nextItem) subParts.push(`Next: ${esc(nextItem.title)} ${countdownLabel(nextItem.time)}`);
    else if(nextEventFallback) subParts.push(`Next: ${esc(nextEventFallback.title)} ${countdownLabel(nextEventFallback.startTime)}`);
    return `
      <div class="hero">
        <div class="hero-eyebrow is-live">Live Now${vidhiTogetherSuffix}</div>
        <div class="hero-big">${esc(liveEvent.title)}</div>
        <p class="hero-sub">${subParts.length ? subParts.join(" · ") : "In progress"}</p>
        ${actionsHtml}
      </div>
    `;
  }

  if(liveItem){
    const eff = effectiveStatus(liveItem);
    const meta = statusMeta(eff);
    
    const linkedCount = linkedTaskCountFor(liveItem);
    const subParts = [meta.label];
    if(linkedCount) subParts.push(`${linkedCount} linked task${linkedCount===1?'':'s'}`);
    if(nextItem) subParts.push(`Next: ${esc(nextItem.title)} ${countdownLabel(nextItem.time)}`);
    return `
      <div class="hero">
        <div class="hero-eyebrow is-live">Live Now · ${esc(currentEvent?.title||"")}${vidhiTogetherSuffix}</div>
        <div class="hero-big">${esc(liveItem.title)}</div>
        <p class="hero-sub">${subParts.join(" · ")}</p>
        ${actionsHtml}
      </div>
    `;
  }

  
  const today = todaysEvents();
  const dayLabel = fmtDate(now(), {weekday:'long', month:'long', day:'numeric'});
  const compactDayLabel = fmtDate(now(), {weekday:'short', month:'short', day:'numeric'});
  const todayNotStarted = today.length && today.every(e=>new Date(e.startTime) > now());
  const todayWrappedUp = today.length && today.every(e=>new Date(e.endTime) <= now());
  const gapSubhead = !today.length ? "A quieter day between events."
    : todayNotStarted ? "Today's events haven't started yet."
    : todayWrappedUp ? "Today's events have wrapped up."
    : "A short break between today's events.";
  const subParts = [gapSubhead];
  if(nextItem) subParts.push(`Next: ${esc(nextItem.title)} ${countdownLabel(nextItem.time)}`);
  else { const nextEventFallback = nextUpcomingEvent(); if(nextEventFallback) subParts.push(`Next: ${esc(nextEventFallback.title)} ${countdownLabel(nextEventFallback.startTime)}`); }
  return `
    <div class="hero">
      <div class="hero-eyebrow hero-week-banner"><span>Wedding Week · <span class="hero-week-date-full">${dayLabel}</span><span class="hero-week-date-compact">${compactDayLabel}</span></span></div>
      <div class="hero-big">${today.length ? esc(today.map(e=>e.title).join(" + ")) : "No events scheduled today"}</div>
      <p class="hero-sub">${subParts.join(" · ")}</p>
      ${actionsHtml}
    </div>
  `;
}


function renderTodaysAssignments(container, assignments){
  if(!assignments.length){
    container.innerHTML = `<div class="card empty-state"><div class="empty-state-icon">${ICONS.clipboard}</div><p>Nothing individually assigned for today — team ownership covers it.</p></div>`;
    return;
  }
  const sorted = [...assignments].sort((a,b)=>roleMeta(a.role).order-roleMeta(b.role).order);
  container.innerHTML = sorted.map(a=>{
    const who = assigneeOf(a);
    const label = entityLabel(a.targetType, a.targetId);
    const done = !!a.completedAt;
    const ack = !!a.acknowledgedAt;
    const stateLabel = done ? "Done" : (ack ? "Acknowledged" : "Not yet acknowledged");
    return `<div class="card clickable" data-open-drawer="${a.targetType}:${a.targetId}">
      <div class="alert-row">
        <div class="alert-icon ${done?'status-green':(ack?'status-blue':'status-gray')}">${done?ICONS.checkCircle:ICONS.clipboard}</div>
        <div style="flex:1; min-width:0;">
          <div class="alert-text">${who ? esc(who.name) : "Unknown"} <span class="arole role-${esc(a.role)}" style="margin-left:4px;">${esc(roleMeta(a.role).label)}</span></div>
          <div class="alert-sub">${esc(label||"")} · ${esc(stateLabel)}</div>
        </div>
      </div>
    </div>`;
  }).join("");
  wireDrawerTriggers(container);
}

const VENDOR_READINESS_META = {
  ready:   {label:"Checked In",     cls:"status-green"},
  flagged: {label:"Not Checked In", cls:"status-red"},
  expected:{label:"Expected",       cls:"status-gray"}
};
function renderVendorReadinessGrid(container, list){
  if(list.length===0){
    container.innerHTML = `<div class="card empty-state"><div class="empty-state-icon">${ICONS.wrench}</div><p>No vendors active right now.</p></div>`;
    return;
  }
  container.innerHTML = list.map(v=>{
    const rm = VENDOR_READINESS_META[vendorReadiness(v)];
    return `
    <div class="card clickable vcard" data-open-drawer="vendor:${v.id}">
      <div class="avatar">${initials(v.name)}</div>
      <div class="vcard-body">
        <div class="vcard-name">${esc(v.name)}</div>
        <div class="vcard-role">${esc(v.type)}</div>
        <div class="vcard-meta">${v.arrival ? "Arrives " + fmtTime(v.arrival) : "Arrival time TBD"} · ${esc(v.contactName||"")}</div>
      </div>
      <span class="status-pill ${rm.cls}"><span class="status-dot"></span>${rm.label}</span>
    </div>`;
  }).join("");
  wireDrawerTriggers(container);
}


function renderOperationalStatus(container){
  const issues = dayOfIssues();
  const coverage = assignmentCoverage();
  const missing = missingResponsibilities();
  const vendorsToday = vendorsActiveToday();
  const vendorsReady = vendorsToday.filter(v=>vendorReadiness(v)==="ready").length;
  const vendorsFlagged = vendorsToday.filter(v=>vendorReadiness(v)==="flagged").length;

  const stats = [
    {label:"Vendors Ready", value:`${vendorsReady}/${vendorsToday.length}`, warn: vendorsFlagged>0},
    {label:"Assignment Coverage", value:`${coverage.covered}/${coverage.total}`, warn: coverage.missing>0},
    {label:"Open Risks", value:String(issues.length), warn: issues.length>0}
  ];

  const rows = [];
  issues.forEach(t=>rows.push({severity:severityOf(t), text:t.title, sub:t.detail, targetType:"task", targetId:t.id}));
  missing.items.forEach(it=>rows.push({severity:"yellow", text:`${it.title} still needs someone named`, sub: ev(it.eventId)?.title||"", targetType:"timelineItem", targetId:it.id}));
  missing.events.forEach(e=>rows.push({severity:"red", text:`${e.title} has no operations lead`, sub:"No team, no named primary", targetType:"event", targetId:e.id}));

  container.innerHTML = `
    <div class="grid cols-3" style="margin-bottom:14px;">
      ${stats.map(s=>`
        <div class="card" style="text-align:center;">
          <div style="font-size:22px; font-weight:800; ${s.warn?'color:var(--yellow);':''}">${esc(s.value)}</div>
          <div style="font-size:11px; color:var(--ink-faint); text-transform:uppercase; letter-spacing:.05em; font-weight:600; margin-top:4px;">${s.label}</div>
        </div>
      `).join("")}
    </div>
    <div class="grid" id="mc-opstatus-list"></div>
  `;
  renderAlertsList(document.getElementById("mc-opstatus-list"), rows.sort((a,b)=>severityRank(a.severity)-severityRank(b.severity)));
}

function renderEmergencyContactsCard(container){
  const list = [contactOf("contact_coordinator"), contactOf("contact_venue_manager"), contactOf("contact_emergency")].filter(Boolean);
  if(!list.length){
    container.innerHTML = `<div class="card empty-state"><div class="empty-state-icon">${ICONS.siren}</div><p>No emergency contacts on file.</p></div>`;
    return;
  }
  container.innerHTML = list.map(c=>`
    <div class="card clickable vcard" data-open-drawer="contact:${c.id}">
      <div class="avatar">${initials(c.name)}</div>
      <div class="vcard-body"><div class="vcard-name">${esc(c.name)}</div><div class="vcard-role">${esc(c.role)}</div></div>
      <div class="vcard-actions">
        ${c.phone ? `<a class="btn btn-sm" href="${telHref(c.phone)}" aria-label="Call ${esc(c.name)}">${ICONS.phone} ${esc(c.phone)}</a>` : `<span class="vcard-meta">Number not yet provided</span>`}
      </div>
    </div>
  `).join("");
  container.querySelectorAll("[data-call]").forEach(b=>b.addEventListener("click", (e)=>{ e.stopPropagation(); window.location.href = telHref(b.getAttribute("data-call")); }));
  wireDrawerTriggers(container);
}

function heroPostWedding(){
  return `
    <div class="hero">
      <div class="hero-eyebrow is-archive">Archive</div>
      <div class="hero-big">${esc(data.wedding.coupleNames)} — Officially Married</div>
      <p class="hero-sub">Every wedding event is complete. Here's the archive.</p>
      <div class="hero-rows">
        <div class="hero-row">
          <div class="hero-row-icon">${ICONS.checkCircle}</div>
          <div class="hero-row-text">
            <div class="hero-row-label">Events Completed</div>
            <div class="hero-row-value">${data.events.length} of ${data.events.length}</div>
          </div>
        </div>
        <div class="hero-row">
          <div class="hero-row-icon">${ICONS.clipboard}</div>
          <div class="hero-row-text">
            <div class="hero-row-label">Final Notes</div>
            <div class="hero-row-value">${planningReadiness().done} of ${planningReadiness().total} planning items closed</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTimelinePreview(){
  const liveItem = currentLiveItem();
  const sorted = allItemsSorted();
  let items;
  if(liveItem){
    const idx = sorted.findIndex(i=>i.id===liveItem.id);
    items = sorted.slice(Math.max(0, idx-1), idx+3);
  } else {
    const nextItem = nextUpcomingItem();
    if(nextItem){
      const idx = sorted.findIndex(i=>i.id===nextItem.id);
      items = sorted.slice(Math.max(0, idx-1), idx+3);
    } else {
      items = sorted.slice(-4);
    }
  }
  if(items.length === 0){
    return `<div class="card empty-state"><div class="empty-state-icon">${ICONS.calendar}</div><p>No timeline items yet.</p></div>`;
  }
  return `<div class="card"><div class="tl-list">${items.map(it=>renderTimelineItemRow(it, {audience:"ops", rollup:false})).join("")}</div></div>`;
}



function renderTimelineItemRow(item, opts){
  const o = opts || {};
  const viewer = o.audience || "ops";
  const eff = effectiveStatus(item);
  const meta = statusMeta(eff);
  const km = kindMeta(item.kind);
  const parent = rollupParentOf(item);
  const isChild = !!parent;
  const isCrossed = timelineItemIsAutoCrossed(item);
  const needsOwner = viewer !== "public" && item.requiresAssignment && !primaryAssignmentOf("timelineItem", item.id);
  const attentionCue = needsOwner
    ? `<span class="tl-aud" style="color:var(--yellow); border-color:rgba(250,204,21,0.3);">Needs owner</span>`
    : "";
  return `
    <div class="tl-item is-${eff} ${isCrossed?'is-auto-crossed':''} kind-${esc(item.kind||'other')} ${isChild?'is-child':''}" data-tl-id="${item.id}">
      <div class="tl-dot">${km.icon}</div>
      <div class="card tl-card clickable" data-open-drawer="timelineItem:${item.id}">
        <div class="tl-top">
          <div>
            <div class="tl-time">${esc(displayTimeLabel(item))}</div>
            <div class="tl-title">${esc(displayTitle(item, viewer))}</div>
            ${attentionCue ? `<div class="tl-meta">${attentionCue}</div>` : ""}
          </div>
          <div class="tl-top-right">
            ${
              eff !== "upcoming" ? `<span class="status-pill ${meta.cls}"><span class="status-dot"></span>${meta.label}</span>` : ""}
            <span class="tl-chevron" aria-hidden="true">${ICONS.chevron}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}


function renderTimelineList(items, viewer){
  const set = new Set(items.map(i=>i.id));
  const out = [];
  items.forEach(item=>{
    if(rollupParentOf(item) && set.has(item.rollupParentId)) return; // rendered inside its parent
    out.push(renderTimelineItemRow(item, {audience:viewer}));
    const kids = childrenOf(item.id).filter(k=>set.has(k.id));
    if(kids.length){
      out.push(`<div class="tl-children">${kids.map(k=>renderTimelineItemRow(k, {audience:viewer, rollup:false})).join("")}</div>`);
    }
  });
  return out.join("");
}


const TIMELINE_PHASE_DEFINITIONS = {
  event_mehndi: [
    {label:"Getting Ready & Travel", from:5, to:8},
    {label:"Setup & Arrivals", from:9, to:11},
    {label:"Mehndi Celebration", from:12, to:16}
  ],
  event_vidhi: [
    {label:"Getting Ready & Setup", from:5, to:11},
    {label:"Arrivals & Family Photos", from:12, to:18},
    {label:"Breakfast & Opening Poojas", from:19, to:21},
    {label:"Family Rituals", from:22, to:30},
    {label:"Lunch & Haldi / Pithi", from:31, to:35}
  ],
  event_sangeet: [
    {label:"Getting Ready & Setup", from:5, to:9},
    {label:"Guest Arrival & Dinner", from:10, to:11},
    {label:"Sangeet Program", from:12, to:29},
    {label:"Garba & Dancing", from:30, to:31},
    {label:"Wedding Setup", from:32, to:33}
  ],
  event_wedding: [
    {label:"Getting Ready & Setup", from:5, to:11},
    {label:"First Look & Photos", from:12, to:17},
    {label:"Pre-Wedding & Baraat", from:18, to:21},
    {label:"Wedding Ceremony", from:22, to:32},
    {label:"Lunch, Vidai & After Rituals", from:33, to:35}
  ],
  event_reception: [
    {label:"Getting Ready & Setup", from:5, to:7},
    {label:"Cocktail Hour & Seating", from:8, to:11},
    {label:"Reception Program", from:12, to:30},
    {label:"Dancing & Dinner", from:31, to:32},
    {label:"Breakdown", from:33, to:33}
  ],
  event_farewell: [
    {label:"Breakfast & Departures", from:5, to:6},
    {label:"Wrap-Up", from:7, to:7}
  ]
};

function timelinePhasesForEvent(eventId, items){
  const definitions = TIMELINE_PHASE_DEFINITIONS[eventId] || [];
  const phases = definitions.map((d, index)=>({...d, id:eventId+"-phase-"+index, items:[]}));
  const added = {id:eventId+"-phase-added", label:"Added Items", from:null, to:null, items:[]};
  items.forEach(item=>{
    const sourceRow = typeof item.sourceRow === "number" ? item.sourceRow : null;
    const phase = sourceRow == null ? added : phases.find(p=>sourceRow>=p.from && sourceRow<=p.to);
    (phase || added).items.push(item);
  });
  if(added.items.length) phases.push(added);
  return phases.filter(p=>p.items.length);
}

function concurrentTimelineGroups(items){
  const groups = [];
  items.forEach(item=>{
    const label = displayTimeLabel(item);
    const last = groups[groups.length-1];
    if(last && last.label === label) last.items.push(item);
    else groups.push({label, items:[item]});
  });
  return groups;
}

function renderOpsRunSheetRow(item){
  const eff = effectiveStatus(item);
  const meta = statusMeta(eff);
  const isCrossed = timelineItemIsAutoCrossed(item);
  const assignment = primaryAssignmentOf("timelineItem", item.id);
  const assignedTo = assignment ? assigneeOf(assignment) : null;
  const needsOwner = item.requiresAssignment && !assignment;
  const cue = needsOwner ? "Needs owner" : "";
  return `
    <div class="tl-item ops-run-row is-${eff} ${isCrossed?'is-auto-crossed':''}" data-tl-id="${item.id}">
      <div class="tl-card ops-run-card clickable" data-open-drawer="timelineItem:${item.id}">
        <div class="ops-run-main">
          <div class="tl-title">${esc(item.title)}</div>
          ${assignedTo ? `<div class="ops-run-owner">${ICONS.users} ${esc(assignedTo.name)}</div>` : ""}
          ${cue ? `<div class="ops-run-cue">${esc(cue)}</div>` : ""}
        </div>
        <div class="ops-run-state">
          ${eff !== "upcoming" ? `<span class="status-pill ${meta.cls}"><span class="status-dot"></span>${meta.label}</span>` : ""}
          <span class="tl-chevron" aria-hidden="true">${ICONS.chevron}</span>
        </div>
      </div>
    </div>`;
}

function renderOpsPhase(phase, open){
  const complete = phase.items.filter(i=>effectiveStatus(i)==="complete").length;
  const current = phase.items.filter(i=>effectiveStatus(i)==="current").length;
  const groups = concurrentTimelineGroups(phase.items);
  const firstTime = displayTimeLabel(phase.items[0]);
  const statusText = current ? "Happening now" : (complete===phase.items.length ? "Completed" : `${phase.items.length-complete} remaining`);
  return `
    <details class="ops-phase ${current?'is-current':''} ${complete===phase.items.length?'is-complete':''}" ${open?'open':''} data-ops-phase="${phase.id}">
      <summary class="ops-phase-summary">
        <span class="ops-phase-marker">${complete===phase.items.length ? ICONS.checkCircle : ICONS.timeline}</span>
        <span class="ops-phase-heading">
          <span class="ops-phase-title">${esc(phase.label)}</span>
          <span class="ops-phase-time">Starts ${esc(firstTime)} · ${phase.items.length} ${phase.items.length===1?'activity':'activities'}</span>
        </span>
        <span class="ops-phase-status">${esc(statusText)}</span>
        <span class="ops-phase-disclosure">${ICONS.chevron}</span>
      </summary>
      <div class="ops-phase-body">
        ${groups.map(group=>`
          <div class="ops-time-group ${group.items.length>1?'is-parallel':''}">
            <div class="ops-time-column">
              <span class="ops-time-label">${esc(group.label)}</span>
              ${group.items.length>1 ? `<span class="ops-parallel-label">${group.items.length} parallel</span>` : ""}
            </div>
            <div class="ops-time-items">${group.items.map(renderOpsRunSheetRow).join("")}</div>
          </div>
        `).join("")}
      </div>
    </details>`;
}

function renderOpsFocusStrip(items){
  const current = items.find(i=>effectiveStatus(i)==="current");
  const upcoming = items.find(i=>effectiveStatus(i)==="upcoming");
  if(current){
    return `<div class="ops-focus-strip"><span class="ops-focus-live">Now</span><b>${esc(current.title)}</b>${upcoming ? `<span class="ops-focus-next">Next: ${esc(upcoming.title)} at ${esc(displayTimeLabel(upcoming))}</span>` : ""}</div>`;
  }
  if(upcoming){
    return `<div class="ops-focus-strip"><span class="ops-focus-live is-next">Next</span><b>${esc(upcoming.title)}</b><span class="ops-focus-next">${esc(displayTimeLabel(upcoming))}</span></div>`;
  }
  return `<div class="ops-focus-strip is-complete">${ICONS.checkCircle}<b>Event schedule complete</b></div>`;
}

function renderOpsRunSheet(eventId, items){
  const phases = timelinePhasesForEvent(eventId, items);
  const activeIndex = phases.findIndex(p=>p.items.some(i=>effectiveStatus(i)==="current"));
  const firstIncompleteIndex = phases.findIndex(p=>p.items.some(i=>effectiveStatus(i)!=="complete"));
  
  const eventIsCurrent = currentLiveEvent()?.id === eventId;
  const defaultOpenIndex = eventIsCurrent
    ? (activeIndex>=0 ? activeIndex : (firstIncompleteIndex>=0 ? firstIncompleteIndex : Math.max(0, phases.length-1)))
    : -1;
  return `<div class="ops-run-sheet" id="tl-full-list">
    ${renderOpsFocusStrip(items)}
    <div class="ops-phase-list">${phases.map((phase,index)=>renderOpsPhase(phase,index===defaultOpenIndex)).join("")}</div>
  </div>`;
}

function renderQuickActions(container, actions){
  container.innerHTML = actions.map((a,i)=>`
    <button class="quick-btn" data-qa="${i}">
      <span class="quick-btn-icon">${a.icon}</span>
      <span class="quick-btn-label">${esc(a.label)}</span>
    </button>
  `).join("");
  container.querySelectorAll("[data-qa]").forEach(btn=>{
    const a = actions[+btn.getAttribute("data-qa")];
    btn.addEventListener("click", ()=>{
      if(a.nav === "timeline"){ state.timelineEventId = null; state.view="timeline"; renderShell(); renderActiveView(); }
      else if(a.nav === "alerts"){ document.getElementById("mc-alerts")?.scrollIntoView({behavior:'smooth', block:'start'}); }
      else if(a.nav === "vendors"){ openDirectorySection("vendors"); }
      else if(a.nav === "teams"){ openDirectorySection("teams"); }
      else if(a.nav === "venue-map"){ const v = todaysEvents()[0]; openDrawer("venue", v ? v.venueId : data.venues[0].id); }
      else if(a.nav === "emergency"){ openDirectorySection("contacts"); }
      else if(a.contact){ openDrawer("contact", a.contact); }
    });
  });
}

function renderActiveVendors(container){
  const today = todaysEvents();
  let vendorIds = new Set();
  today.forEach(e=>(e.vendorIds||[]).forEach(v=>vendorIds.add(v)));
  if(vendorIds.size === 0){

    const nxt = nextMajorEvent();
    if(nxt) (nxt.vendorIds||[]).forEach(v=>vendorIds.add(v));
  }
  const list = [...vendorIds].map(vendor).filter(Boolean);
  if(list.length===0){
    container.innerHTML = `<div class="card empty-state"><div class="empty-state-icon">${ICONS.wrench}</div><p>No vendors active right now.</p></div>`;
    return;
  }
  container.innerHTML = list.map(v=>`
    <div class="card clickable vcard" data-open-drawer="vendor:${v.id}">
      <div class="avatar">${initials(v.name)}</div>
      <div class="vcard-body">
        <div class="vcard-name">${esc(v.name)}</div>
        <div class="vcard-role">${esc(v.type)}</div>
        <div class="vcard-meta">${v.arrival ? "Arrives " + fmtTime(v.arrival) : "Arrival time TBD"} · ${esc(v.contactName||"")}</div>
      </div>
      <div class="vcard-actions">
        ${v.phone ? `` : ""}
      </div>
    </div>
  `).join("");
  container.querySelectorAll("[data-call]").forEach(b=>b.addEventListener("click", (ev)=>{ ev.stopPropagation(); window.location.href = telHref(b.getAttribute("data-call")); }));
}

function renderAlertsList(container, alerts){
  if(alerts.length===0){
    container.innerHTML = `<div class="card empty-state"><div class="empty-state-icon">${ICONS.checkCircle}</div><p>No open alerts. Everything's in good shape.</p></div>`;
    return;
  }
  const iconFor = s=>({red:ICONS.alertTriangle, yellow:ICONS.alertTriangle, blue:ICONS.infoCircle, gray:ICONS.infoCircle}[s]||ICONS.infoCircle);
  const clsFor = s=>({red:"status-red", yellow:"status-yellow", blue:"status-blue", gray:"status-gray"}[s]||"status-gray");
  container.innerHTML = alerts.map(a=>`
    <div class="card ${a.targetType ? 'clickable':''}" ${a.targetType && a.targetId ? `data-open-drawer="${a.targetType}:${a.targetId}"`:''}>
      <div class="alert-row">
        <div class="alert-icon ${clsFor(a.severity)}">${iconFor(a.severity)}</div>
        <div style="flex:1; min-width:0;">
          <div class="alert-text">${esc(a.text)}</div>
          ${a.sub ? `<div class="alert-sub">${esc(a.sub)}</div>` : ""}
        </div>
      </div>
    </div>
  `).join("");
  wireDrawerTriggers(container);
}



function dayStatusStrip(items){
  if(!items.length) return "";
  const complete = items.filter(it=>effectiveStatus(it)==="complete").length;
  const current = items.filter(it=>effectiveStatus(it)==="current").length;
  
  const withLinkedTasks = items.filter(it=>linkedTaskCountFor(it) > 0).length;
  return `<div class="day-status-strip">
    <span class="dss-item"><b>${complete}</b> of <b>${items.length}</b> complete</span>
    ${current ? `<span class="dss-item is-current">${current} happening now</span>` : ""}
    ${withLinkedTasks ? `<span class="dss-item is-linked">${withLinkedTasks} with linked tasks</span>` : ""}
  </div>`;
}


function renderTimeline(){
  const el = document.getElementById("view-timeline");
  const eventObj = state.timelineEventId ? ev(state.timelineEventId) : null;
  if(!eventObj){ state.timelineEventId = null; renderTimelineEventPicker(el); return; }
  renderTimelineForEvent(el, eventObj);
}


function celebrationStart(e){
  const windows = typeof EVENT_GUEST_WINDOWS !== "undefined" ? EVENT_GUEST_WINDOWS : {};
  return windows[e.id] ? `${e.date}T${windows[e.id][0]}:00` : e.startTime;
}
function renderTimelineEventPicker(el){
  const events = [...data.events].sort((a,b)=>new Date(a.startTime)-new Date(b.startTime));
  const phase = getPhase();
  const liveEventId = phase === "week" && currentLiveItem() ? currentLiveItem().eventId : null;

  const dayGroups = new Map();
  events.forEach(e=>{
    const key = e.date || String(e.startTime).slice(0,10);
    if(!dayGroups.has(key)) dayGroups.set(key, []);
    dayGroups.get(key).push(e);
  });

  el.innerHTML = `
    <div class="section-head">
      <span class="section-title">Schedule</span>
    </div>
    <div class="schedule-tools">
      <a class="btn" href="${esc(ALL_AUDIO_DOWNLOAD_URL)}" download="demo-audio-notice.txt">${ICONS.music} Demo audio information</a>
    </div>
    ${[...dayGroups.entries()].map(([day, dayEvents])=>`
      <div class="section-head" style="margin-top:18px;"><span class="section-title" style="font-size:14px; color:var(--ink-dim);">${esc(fmtDate(day+"T12:00:00",{weekday:'long', month:'long', day:'numeric'}))}</span></div>
      <div class="studio-events-grid timeline-event-grid">
        ${dayEvents.map(e=>{
          const isLive = liveEventId === e.id;
          return `<button type="button" class="studio-event-card timeline-event-card clickable ${isLive?'is-live':''}" data-event-palette="${e.id}" data-timeline-open-event="${e.id}">
            ${isLive ? `<span class="status-pill status-blue timeline-event-live-pill"><span class="status-dot"></span>Live Now</span>` : ""}
            <span class="event-card-kicker">${esc({event_mehndi:"A joyful beginning",event_vidhi:"Blessings & traditions",event_sangeet:"An evening of rhythm",event_wedding:"Together, forever",event_reception:"A night to remember",event_farewell:"Until next time"}[e.id]||"Our celebration")}</span>
            <div class="studio-event-card-title">${esc(e.title)}</div>
            <div class="timeline-event-card-sub">${fmtTime(celebrationStart(e))} · ${esc(venueOf(e.venueId)?.name||"Venue TBD")}</div>
            <span class="event-card-footer">Open the schedule <span aria-hidden="true">↗</span></span>
          </button>`;
        }).join("")}
      </div>
    `).join("")}
  `;
  el.querySelectorAll("[data-timeline-open-event]").forEach(b=>b.addEventListener("click", ()=>{
    state.timelineEventId = b.getAttribute("data-timeline-open-event");
    applyOpsTheme();
    renderTimeline();
    window.scrollTo(0, 0);
  }));
}


function renderTimelineForEvent(el, eventObj){
  const viewer = "ops"; // always the full Wedding Team view — no in-page guest-preview toggle
  const items = timelineQuery({eventId: eventObj.id, audience: viewer});
  const dayOfMode = getPhase() === "week";

  const listHtml = renderOpsRunSheet(eventObj.id, items);

  
  const addBtn = `<button class="btn ${items.length?'btn-sm':'btn-primary'}" style="${items.length?'':'margin-top:12px;'}" data-open-drawer="newTimelineItem:${eventObj.id}">${ICONS.calendar} Add Timeline Item</button>`;
  const body = items.length
    ? `<div style="margin-bottom:10px;">${addBtn}</div>${listHtml}`
    : `<div class="card empty-state"><div class="empty-state-icon">${ICONS.calendar}</div><p>Timeline not added yet.</p>${addBtn}</div>`;

  el.innerHTML = `
    <button class="studio-back" data-timeline-back>${ICONS.chevron} Back to all events</button>
    <div class="event-theme-banner">
      <div class="event-theme-banner-copy">
        <span class="event-theme-kicker">Event run of show</span>
        <h1>${esc(eventObj.title)}</h1>
        <span class="event-theme-date">${fmtDate(eventObj.startTime,{weekday:'long', month:'long', day:'numeric'})} · Celebration starts ${fmtTime(celebrationStart(eventObj))}</span>
      </div>
    </div>
    ${eventObj.id === "event_wedding" ? `<div class="card" style="margin-bottom:16px"><h2>Wedding Ceremony</h2><a class="btn btn-sm" href="assets/ceremony-guide.html" target="_blank" rel="noopener">View Ceremony Brochure ↗</a> <button class="btn btn-sm" type="button" data-open-drawer="photoGroups:">View Wedding Photo Groups</button></div>` : ""}
    ${eventObj.id === "event_reception" ? `<div class="card reception-seating-shortcut"><h2>Reception Seating</h2><div class="reception-seating-actions"><a class="btn btn-sm" href="assets/reception-floor-plan.svg" target="_blank" rel="noopener" aria-label="View reception layout in a new tab">View Layout ↗</a><button class="btn btn-sm" type="button" data-open-seating="true">Find a Table</button></div></div>` : ""}
    ${eventObj.id === VIDHI_EVENT_ID ? vidhiOpsSummaryCardHtml(items) : ""}
    ${body}
  `;
  el.querySelector("[data-timeline-back]").addEventListener("click", ()=>{
    state.timelineEventId = null;
    applyOpsTheme();
    renderTimeline();
    window.scrollTo(0, 0);
  });
  wireDrawerTriggers(el);
}


const CONTACT_GROUPS = [
  {id:"essential",    label:"Essential",
    items:()=> data.people.filter(p=>p.id==="person_demo_01" || p.id==="person_demo_02")},
  {id:"coordinators", label:"Coordinators",
    items:()=> data.vendors.filter(v=>v.id==="vendor_demo_3")},
  {id:"familyLeads",  label:"Family Leads",
    items:()=> data.people.filter(p=>/^Parent of/i.test(p.role||""))},
  {id:"teams",        label:"Teams", items:()=> data.teams},
  {id:"vendors",      label:"Vendors",
    items:()=> data.vendors.filter(v=>v.id!=="vendor_demo_3")},
  {id:"venues",       label:"Venues", items:()=> data.venues.filter(v=>v.kind!=="hotel")},
  {id:"hotels",       label:"Hotels", items:()=> data.venues.filter(v=>v.kind==="hotel")},
  {id:"emergency",    label:"Emergency", items:()=> data.contacts}
];
let directoryOpenSection = null;

function openDirectorySection(id){
  directoryOpenSection = id;
  state.view = "directory";
  renderShell();
  renderActiveView();
  setTimeout(()=>{
    document.getElementById("dir-sec-"+id)?.scrollIntoView({behavior:'smooth', block:'start'});
  }, 50);
}


function contactRowHtml(kind, it){
  
  const drawerType = kind === "vendor" ? "contactVendor" : kind === "venue" ? "contactVenue" : kind === "contact" ? "contact" : kind === "team" ? "team" : "contactPerson";
  const name = it.name;
  
  const role = kind === "vendor" ? (it.type || "Vendor")
    : kind === "venue" ? (it.kind === "hotel" ? "Hotel" : "Venue")
    : kind === "team" ? (it.mission || "Wedding team")
    : (it.role || "");
  const phone = it.phone || "";
  const contactLines = kind === "vendor"
    ? [{name:it.contactName, phone}, ...(it.additionalContacts||[])].filter(c=>c.name||c.phone)
    : (phone || it.contactName ? [{name:it.contactName, phone}] : []);
  return `
    <div class="card clickable vcard" data-open-drawer="${drawerType}:${it.id}">
      <div class="avatar">${initials(name)}</div>
      <div class="vcard-body">
        <div class="vcard-name">${esc(name)}</div>
        <div class="vcard-role">${esc(role)}</div>
        ${contactLines.map(c=>`<div class="vcard-meta">${esc([c.name, c.phone].filter(Boolean).join(" · "))}</div>`).join("")}
      </div>
      ${phone ? `
        <div class="vcard-actions">
          <button class="circle-btn" data-call="${esc(phone)}" aria-label="Call ${esc(name)}">${ICONS.phone}</button>
          <button class="circle-btn" data-text="${esc(phone)}" aria-label="Message ${esc(name)}">${ICONS.message}</button>
        </div>
      ` : ""}
    </div>
  `;
}
function contactGroupKind(groupId){
  if(groupId === "coordinators" || groupId === "vendors") return "vendor";
  if(groupId === "venues" || groupId === "hotels") return "venue";
  if(groupId === "teams") return "team";
  if(groupId === "emergency") return "contact";
  return "person"; // essential, familyLeads
}
function renderContacts(){
  const el = document.getElementById("view-directory");
  const q = (state.contactsFilter||"").trim().toLowerCase();
  el.innerHTML = `
    <div class="section-head"><span class="section-title">Contacts</span></div>
    ${familyReferenceLinksHtml()}
    <input class="pinput" id="contacts-search" type="text" placeholder="Search contacts…" value="${esc(state.contactsFilter||"")}" style="margin-bottom:16px;">
    <div id="contacts-groups"></div>
  `;
  const groupsEl = document.getElementById("contacts-groups");
  const groupsHtml = CONTACT_GROUPS.map(g=>{
    const kind = contactGroupKind(g.id);
    let items = g.items();
    if(q) items = items.filter(it=>(it.name||"").toLowerCase().includes(q) || (it.role||it.type||it.mission||it.address||"").toLowerCase().includes(q));
    if(!items.length) return ""; // never render an empty category
    return `
      <div class="section contacts-group" id="dir-sec-${g.id}">
        <div class="section-head"><span class="section-title" style="font-size:14px; color:var(--ink-dim);">${esc(g.label)}</span></div>
        <div class="subgrid">${items.map(it=>contactRowHtml(kind, it)).join("")}</div>
      </div>
    `;
  }).join("");
  groupsEl.innerHTML = groupsHtml || `<div class="card empty-state"><p>No contacts match "${esc(state.contactsFilter)}".</p></div>`;
  const searchInput = document.getElementById("contacts-search");
  searchInput.addEventListener("input", ()=>{
    state.contactsFilter = searchInput.value;
    const caret = searchInput.selectionStart;
    renderContacts();
    const again = document.getElementById("contacts-search");
    again.focus();
    try{ again.setSelectionRange(caret, caret); }catch(e){}
  });
  if(directoryOpenSection){
    document.getElementById("dir-sec-"+directoryOpenSection)?.scrollIntoView({behavior:'smooth', block:'start'});
    directoryOpenSection = null;
  }
  el.querySelectorAll("[data-call]").forEach(b=>b.addEventListener("click", (e)=>{ e.stopPropagation(); window.location.href = telHref(b.getAttribute("data-call")); }));
  el.querySelectorAll("[data-text]").forEach(b=>b.addEventListener("click", (e)=>{ e.stopPropagation(); window.location.href = smsHref(b.getAttribute("data-text")); }));
  wireDrawerTriggers(el);
}


const DIRECTORY_SECTIONS = [
  {id:"people", label:"People", icon:ICONS.person, items:()=>data.people},
  {id:"teams", label:"Teams", icon:ICONS.users, items:()=>data.teams},
  {id:"vendors", label:"Vendors", icon:ICONS.wrench, items:()=>data.vendors},
  {id:"venues", label:"Venues", icon:ICONS.mapPin, items:()=>data.venues.filter(v=>v.kind!=="hotel")},
  {id:"hotels", label:"Hotels", icon:ICONS.mapPin, items:()=>data.venues.filter(v=>v.kind==="hotel")},
  {id:"contacts", label:"Contacts", icon:ICONS.phone, items:()=>data.contacts}
];

function renderDirectory(el){
  el.innerHTML = `
    <button class="studio-back" data-manage-back>${ICONS.chevron} Manage Wedding</button>
    <div class="section-head"><span class="section-title">Directory</span></div>
    <div class="grid" id="dir-cats"></div>
  `;
  el.querySelector("[data-manage-back]").addEventListener("click", ()=>{ renderManageWedding(); });
  const catsEl = document.getElementById("dir-cats");
  catsEl.innerHTML = DIRECTORY_SECTIONS.map(sec=>{
    const count = sec.items().length;
    return `
      <div class="card clickable dir-cat" data-dir-open="${sec.id}">
        <div class="dir-icon">${sec.icon}</div>
        <div>
          <div class="dir-title">${sec.label}</div>
          <div class="dir-count">${count} ${count===1?'entry':'entries'}</div>
        </div>
        <span class="dir-chev">${ICONS.chevron}</span>
      </div>
      <div class="card" id="advdir-sec-${sec.id}" style="display:none;">
        <div class="section-title" style="margin-bottom:10px;">${sec.label}</div>
        <div class="subgrid">${renderDirectoryItems(sec.id, sec.items())}</div>
      </div>
    `;
  }).join("");
  catsEl.querySelectorAll("[data-dir-open]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.getAttribute("data-dir-open");
      const secEl = document.getElementById("advdir-sec-"+id);
      const isOpen = secEl.style.display !== "none";
      document.querySelectorAll('[id^="advdir-sec-"]').forEach(s=>s.style.display="none");
      secEl.style.display = isOpen ? "none" : "block";
      if(!isOpen) secEl.scrollIntoView({behavior:'smooth', block:'nearest'});
    });
  });
  wireDrawerTriggers(el);
}

function renderDirectoryItems(sectionId, items){
  return items.map(it=>{
    switch(sectionId){
      case "people": {
        const teamNames = (it.teamIds||[]).map(id=>team(id)?.name).filter(Boolean);
        const isTbd = it.teamIds && it.teamIds.length===0 && /TBD/i.test(it.notes||"");
        return `<div class="card clickable vcard" data-open-drawer="person:${it.id}">
          <div class="avatar">${initials(it.name)}</div>
          <div class="vcard-body"><div class="vcard-name">${esc(it.name)}</div><div class="vcard-role">${esc(it.role)}</div>
          ${teamNames.length ? `<div class="vcard-meta">${esc(teamNames.join(", "))}</div>` : (isTbd ? `<div class="vcard-meta" style="color:var(--yellow);">Team TBD</div>` : "")}</div>
        </div>`;
      }
      case "teams": {
        const memCount = (it.memberIds||[]).length;
        return `<div class="card clickable" data-open-drawer="team:${it.id}">
          <div class="dir-title">${esc(it.name)}</div>
          <div class="dir-count">${esc(it.mission)} · ${memCount} member${memCount===1?'':'s'}</div>
        </div>`;
      }
      case "vendors": {
        return `<div class="card clickable vcard" data-open-drawer="vendor:${it.id}">
          <div class="avatar">${initials(it.name)}</div>
          <div class="vcard-body"><div class="vcard-name">${esc(it.name)}</div><div class="vcard-role">${esc(it.type)}</div></div>
          <span class="status-pill ${it.status==='confirmed'?'status-green':'status-red'}"><span class="status-dot"></span>${it.status==='confirmed'?'Confirmed':'Pending'}</span>
        </div>`;
      }
      case "venues":
      case "hotels": {
        return `<div class="card clickable" data-open-drawer="venue:${it.id}">
          <div class="dir-title">${esc(it.name)}</div>
          <div class="dir-count">${it.address ? esc(it.address) : 'Details TBD'}</div>
        </div>`;
      }
      case "contacts": {
        return `<div class="card clickable vcard" data-open-drawer="contact:${it.id}">
          <div class="avatar">${initials(it.name)}</div>
          <div class="vcard-body"><div class="vcard-name">${esc(it.name)}</div><div class="vcard-role">${esc(it.role)}</div></div>
          ${it.phone ? `<div class="vcard-actions"></div>` : ""}
        </div>`;
      }
      default: return "";
    }
  }).join("") || `<div class="empty-state" style="grid-column:1/-1;">Nothing here yet.</div>`;
}


function buildSearchIndex(){
  const idx = [];
  data.people.forEach(p=>idx.push({type:"person", id:p.id, title:p.name, sub:p.role}));
  data.teams.forEach(t=>idx.push({type:"team", id:t.id, title:t.name, sub:t.mission}));
  data.vendors.forEach(v=>idx.push({type:"vendor", id:v.id, title:v.name, sub:v.type}));
  data.events.forEach(e=>idx.push({type:"event", id:e.id, title:e.title, sub:e.subtitle}));
  data.timelineItems.forEach(t=>idx.push({type:"timelineItem", id:t.id, title:t.title, sub:(ev(t.eventId)?.title||"")+" · "+fmtDateTimeShort(t.time)}));
  data.venues.forEach(v=>idx.push({type:"venue", id:v.id, title:v.name, sub:v.address||"Address TBD"}));
  data.contacts.forEach(c=>idx.push({type:"contact", id:c.id, title:c.name, sub:c.role}));
  if(state.planningMode){
    
    openTasks().forEach(t=>idx.push({type:"task", id:t.id, title:t.title, sub:t.detail}));
  }
  return idx;
}
const TYPE_LABEL = {person:"People", team:"Teams", vendor:"Vendors", event:"Events", timelineItem:"Schedule", venue:"Venues", contact:"Contacts", task:"To Do", decision:"Decisions"};

function openSearch(){
  const overlay = document.getElementById("search-overlay");
  overlay.classList.add("open");
  overlay.removeAttribute("aria-hidden");
  const input = document.getElementById("search-input");
  state.searchQuery = "";
  input.value = "";
  renderSearchResults("");
  setTimeout(()=>input.focus(), 30);
}
function closeSearch(){
  const overlay = document.getElementById("search-overlay");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  if(document.activeElement && overlay.contains(document.activeElement)) document.activeElement.blur();
}
function renderSearchResults(query){
  const idx = buildSearchIndex();
  const q = query.trim().toLowerCase();
  const results = q ? idx.filter(r=> r.title.toLowerCase().includes(q) || (r.sub||"").toLowerCase().includes(q)) : idx.slice(0,0);
  const container = document.getElementById("search-results");
  if(!q){
    container.innerHTML = `<div class="search-empty">Start typing to search people, teams, vendors, events, venues, contacts, and issues.</div>`;
    return;
  }
  if(results.length===0){
    container.innerHTML = `<div class="search-empty">No matches for "${esc(query)}"</div>`;
    return;
  }
  const groups = {};
  results.forEach(r=>{ (groups[r.type] = groups[r.type]||[]).push(r); });
  container.innerHTML = Object.keys(groups).map(type=>`
    <div class="search-group-title">${TYPE_LABEL[type]}</div>
    ${groups[type].map(r=>`
      <div class="search-result" data-open-drawer="${r.type}:${r.id}">
        <div class="search-result-icon">${TYPE_ICON[r.type]}</div>
        <div>
          <div class="search-result-title">${esc(r.title)}</div>
          <div class="search-result-sub">${esc(r.sub||"")}</div>
        </div>
      </div>
    `).join("")}
  `).join("");
  container.querySelectorAll("[data-open-drawer]").forEach(el=>{
    el.addEventListener("click", ()=>{
      const raw = el.getAttribute("data-open-drawer");
      const cut = raw.indexOf(":");
      closeSearch();
      openDrawer(raw.slice(0, cut), raw.slice(cut+1));
    });
  });
}


function wireDrawerTriggers(scope){
  scope.querySelectorAll("[data-open-drawer]").forEach(el=>{
    el.addEventListener("click", (e)=>{
      e.stopPropagation();
      
      const raw = el.getAttribute("data-open-drawer");
      const cut = raw.indexOf(":");
      openDrawer(raw.slice(0, cut), raw.slice(cut+1));
    });
  });
}

function openDrawer(type, id){
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("drawer-overlay");
  drawer.innerHTML = renderDrawerContent(type, id);
  overlay.classList.add("open");
  drawer.classList.add("open");
  drawer.removeAttribute("aria-hidden");
  
  drawer.querySelectorAll("audio").forEach(a=>{ try{ a.load(); }catch(err){} });
  wireDrawerTriggers(drawer);
  wirePhotoGroupSearch(drawer);
  drawer.querySelectorAll("[data-drawer-close]").forEach(b=>b.addEventListener("click", closeDrawer));
  drawer.querySelectorAll("[data-call]").forEach(b=>b.addEventListener("click", ()=>window.location.href=telHref(b.getAttribute("data-call"))));
  drawer.querySelectorAll("[data-text]").forEach(b=>b.addEventListener("click", ()=>window.location.href=smsHref(b.getAttribute("data-text"))));
  wirePlanningDrawer(drawer, type, id);
  wireDayOfDrawer(drawer, type, id);
  wireBriefToggle(drawer, ()=>openDrawer(type, id));
  drawer.querySelectorAll("[data-drawer-nav]").forEach(b=>b.addEventListener("click", ()=>{
    const g = b.getAttribute("data-drawer-nav");
    
    const section = b.getAttribute("data-drawer-nav-section");
    if(g === "directory" && section){ closeDrawer(); openDirectorySection(section); return; }
    closeDrawer();
    
    if(g === "eventHub"){
      
      state.missionDrill = "event";
      state.missionEventId = b.getAttribute("data-drawer-nav-event");
      state.eventHubSection = null;
      state.view = "manage";
      renderShell(); renderActiveView();
      return;
    }
    
    if(g === "timeline") state.timelineEventId = b.getAttribute("data-drawer-nav-event") || null;
    state.view = g;
    renderShell(); renderActiveView();
  }));
  drawer.focus();
}
function closeDrawer(){
  const drawer = document.getElementById("drawer");
  drawer.classList.remove("open");
  document.getElementById("drawer-overlay").classList.remove("open");
  
  drawer.setAttribute("aria-hidden", "true");
  if(document.activeElement && drawer.contains(document.activeElement)) document.activeElement.blur();
}


function drawerShell(icon, title, subtitle, sections, actions, opts){
  opts = opts || {};
  return `
    <div class="drawer-close-row"><button class="icon-btn" data-drawer-close aria-label="Close">${ICONS.close}</button></div>
    ${opts.hideIcon ? "" : `<div class="drawer-hero-icon">${icon}</div>`}
    <div class="drawer-title">${esc(title)}</div>
    ${subtitle ? `<div class="drawer-subtitle">${subtitle}</div>` : ""}
    ${opts.topActions && opts.topActions.length ? `<div class="drawer-actions drawer-actions-top${opts.compactActions ? " drawer-actions-compact" : ""}">${opts.topActions.join("")}</div>` : ""}
    ${sections.map(s=> s.collapsed ? `
      <details class="drawer-disclosure">
        <summary class="drawer-section-title">${esc(s.title)}</summary>
        <div class="drawer-disclosure-body">${s.html}</div>
      </details>
    ` : `
      <div class="drawer-section">
        <div class="drawer-section-title">${esc(s.title)}</div>
        ${s.html}
      </div>
    `).join("")}
    ${actions && actions.length ? `<div class="drawer-actions">${actions.join("")}</div>` : ""}
  `;
}
function drawerRow(label, value){
  return `<div class="drawer-row"><span class="drawer-row-label">${esc(label)}</span><span class="drawer-row-value">${value}</span></div>`;
}
function chipsFor(items){
  if(!items.length) return `<p style="color:var(--ink-faint); font-size:13.5px;">None linked yet.</p>`;
  return `<div class="drawer-chip-row">${items.join("")}</div>`;
}


const PLANNING_RECORD_TYPES = new Set(["task","decision","note"]);

const PLANNING_NOTES_OWNED_ELSEWHERE = new Set(["timelineItem"]);

const CONTACT_DRAWER_TYPES = new Set(["contact","contactPerson","contactVendor","contactVenue"]);

function notesComposerHtml(type, id){
  const notes = notesFor(type, id);
  let html = notes.length
    ? notes.map(n=>`<div class="pnote"><div class="pnote-body">${esc(n.body)}</div><div class="pnote-meta">${esc(n.createdDate)}</div></div>`).join("")
    : `<p style="color:var(--ink-faint); font-size:13px;">No notes yet.</p>`;
  if(hasPlanning() && state.planningMode){
    html += `<div class="pnote-add"><input class="pinput" id="note-input" type="text" placeholder="Add a note…"><button class="btn btn-sm" id="note-save">Add</button></div>`;
  }
  return html;
}

function planningContextHtml(type, id){
  if(!hasPlanning() || !state.planningMode || PLANNING_RECORD_TYPES.has(type) || CONTACT_DRAWER_TYPES.has(type) || type === "timelineItem" || type === "newTask" || type === "transportation" || type === "newTransportation" || type === "newTimelineItem" || type === "emergencyContacts" || type === "photoGroups") return "";
  const tasks = sortTasks(tasksForEntity(type, id));
  let html = `<div class="drawer-section">
    <div class="drawer-section-title">Related Tasks</div>
    ${tasks.length ? `<div class="pgroup-list">${tasks.map(renderTaskRow).join("")}</div>` : `<p style="color:var(--ink-faint); font-size:13px;">Nothing outstanding here.</p>`}
    <button class="btn btn-sm" style="margin-top:10px;" data-open-drawer="newTask:${type}:${id}">+ Add task</button>
  </div>`;
  if(!PLANNING_NOTES_OWNED_ELSEWHERE.has(type)){
    html += `<div class="drawer-section">
      <div class="drawer-section-title">Notes</div>
      ${notesComposerHtml(type, id)}
    </div>`;
  }
  return html;
}
function renderDrawerContent(type, id){
  const html = baseDrawerContent(type, id);
  const extra = planningContextHtml(type, id);
  if(!extra) return html;
  const marker = '<div class="drawer-actions">';
  const at = html.indexOf(marker);
  return at === -1 ? html + extra : html.slice(0, at) + extra + html.slice(at);
}
function baseDrawerContent(type, id){
  switch(type){
    case "vendor": return drawerVendor(vendor(id));
    case "person": return drawerPerson(person(id));
    case "team": return drawerTeam(team(id));
    case "event": return drawerEvent(ev(id));
    case "timelineItem": return drawerTimelineItem(tlItem(id));
    case "venue": return drawerVenue(venueOf(id));
    case "contact": return drawerContact(contactOf(id));
    
    case "contactPerson": return drawerContactPerson(person(id));
    case "contactVendor": return drawerContactVendor(vendor(id));
    case "contactVenue": return drawerContactVenue(venueOf(id));
    case "task": return drawerTask(taskById(id));
    case "decision": return drawerDecision(decisionOf(id));
    case "note": return drawerNote(id);
    case "newTask": return drawerNewTask(id);
    case "transportation": return drawerTransportation(transportationById(id));
    case "newTransportation": return drawerNewTransportation(id);
    case "newTimelineItem": return drawerNewTimelineItem(id);
    case "emergencyContacts": return drawerEmergencyContacts();
    case "photoGroups": return drawerPhotoGroups();
    default: return `<div class="drawer-close-row"><button class="icon-btn" data-drawer-close>${ICONS.close}</button></div><p>Not found.</p>`;
  }
}


function targetChip(a){
  const label = entityLabel(a.targetType, a.targetId);
  if(!label) return '<span style="color:var(--ink-faint);">Unknown</span>';
  return `<span class="chip" data-open-drawer="${a.targetType}:${a.targetId}">${esc(label)}</span>`;
}

function renderResponsibility(a){
  const rm = roleMeta(a.role);
  const item = a.targetType === "timelineItem" ? tlItem(a.targetId) : null;
  const timeLabel = item ? " · " + displayTimeLabel(item) : "";
  const dayOf = operationalControlsActive(); // WEDDING-DAY SAFETY: real controls, gated (see helper)
  const done = !!a.completedAt;
  const ack = !!a.acknowledgedAt;
  const actionsHtml = (dayOf && a.via === null || dayOf && a.via === undefined) ? `
    <div class="aresp-actions">
      ${!ack && !done ? `<button class="btn btn-sm" data-ack-assignment="${a.id}">Acknowledge</button>` : ""}
      ${ack && !done ? `<span class="aresp-state">Acknowledged</span>` : ""}
      ${!done ? `<button class="btn btn-sm btn-primary" data-complete-assignment="${a.id}">Mark Done</button>` : `<button class="btn btn-sm" data-reopen-assignment="${a.id}">Reopen</button>`}
    </div>` : "";
  return `<div class="aresp">
    <span class="arole role-${esc(a.role)}">${esc(rm.label)}</span>
    <div class="aresp-body">
      <div class="aresp-title">${targetChip(a)}${timeLabel}${done ? ' <span class="aresp-state">· Done</span>' : ""}</div>
      ${a.via ? `<div class="aresp-meta">via ${esc(a.via)}</div>` : ""}
      ${a.instruction ? `<div class="aresp-instr">${esc(a.instruction)}</div>` : ""}
      ${actionsHtml}
    </div>
  </div>`;
}
function timelineItemsForTeam(teamId){
  const byOwner = data.timelineItems.filter(t=>(t.ownerTeamIds||[]).includes(teamId));
  const byAssignment = assignmentsForTeam(teamId).filter(a=>a.targetType==="timelineItem" && !a.via)
    .map(a=>tlItem(a.targetId)).filter(Boolean);
  const seen = new Set();
  return [...byOwner, ...byAssignment].filter(t=>{
    if(seen.has(t.id)) return false; seen.add(t.id); return true;
  }).sort((a,b)=>new Date(a.time)-new Date(b.time));
}

function briefTimelineSection(allItems, todayItems){
  if(!allItems.length) return `<p class="abrief-empty">Timeline not added yet.</p>`;
  return `<div class="abrief-today-toggle"><span>${state.briefToday ? `${todayItems.length} today` : `${allItems.length} total`}</span><button data-toggle-today>${state.briefToday ? "Show all" : "Today only"}</button></div>` +
    (state.briefToday
      ? (todayItems.length ? chipsFor(todayItems.map(i=>`<span class="chip" data-open-drawer="timelineItem:${i.id}">${esc(i.title)} · ${fmtTime(i.time)}</span>`)) : `<p class="abrief-empty">Nothing today.</p>`)
      : chipsFor(allItems.map(i=>`<span class="chip" data-open-drawer="timelineItem:${i.id}">${esc(i.title)} · ${fmtTime(i.time)}</span>`)));
}
function wireBriefToggle(drawer, rerender){
  const btn = drawer.querySelector("[data-toggle-today]");
  if(!btn) return;
  btn.addEventListener("click", ()=>{
    state.briefToday = !state.briefToday;
    rerender();
  });
}

function drawerVendor(v){
  if(!v) return notFoundDrawer();
  const events = data.events.filter(e=>(e.vendorIds||[]).includes(v.id));
  const nextEvent = events.sort((a,b)=>new Date(a.startTime)-new Date(b.startTime)).find(e=>new Date(e.startTime) >= now()) || events[0];
  const items = data.timelineItems.filter(t=>(t.vendorIds||[]).includes(v.id));
  const workingToday = todaysEvents().some(e=>(e.vendorIds||[]).includes(v.id));
  const liaison = vendorLiaisonOf(v.id);
  const dayOf = operationalControlsActive(); // WEDDING-DAY SAFETY: real controls, gated (see helper)
  const sections = [
    {title:"Current Context", html:
      drawerRow("Working today?", workingToday ? "Yes" : "No") +
      drawerRow("Arrival / setup", v.arrival ? fmtDateTimeShort(v.arrival) : '<span style="color:var(--yellow);">Not confirmed</span>') +
      (dayOf ? drawerRow("Checked in", v.checkedInAt ? fmtTime(v.checkedInAt) : '<span style="color:var(--yellow);">Not yet</span>') : "") +
      drawerRow("Related event", nextEvent ? esc(nextEvent.title) : "—") +
      drawerRow("Point of contact", liaison ? assigneeChip(liaison) : '<span style="color:var(--yellow);">Not named yet</span>')
    },
    {title:"Timeline Responsibilities", html: chipsFor(items.map(i=>`<span class="chip" data-open-drawer="timelineItem:${i.id}">${esc(i.title)} · ${fmtTime(i.time)}</span>`))},
    {title:"Contact", html: drawerRow("Contact", esc(v.contactName||"—")) + (v.phone ? drawerRow("Phone", esc(v.phone)) : "") +
      (v.additionalContacts||[]).map(c=>drawerRow("Contact", esc(c.name||"—")) + (c.phone ? drawerRow("Phone", esc(c.phone)) : "")).join("")},
    {title:"Edit Details", html: `
      <label class="presolve-label">Contract status</label>
      <select class="pinput" id="vendor-edit-status">
        <option value="pending" ${v.status!=="confirmed"?"selected":""}>Contract Pending</option>
        <option value="confirmed" ${v.status==="confirmed"?"selected":""}>Confirmed</option>
      </select>
      <label class="presolve-label" style="margin-top:14px;">Arrival / setup time</label>
      <input class="pinput" id="vendor-edit-arrival" type="datetime-local" value="${toLocalInputValue(v.arrival)}">
      <label class="presolve-label" style="margin-top:14px;">Point of contact (liaison)</label>
      <select class="pinput" id="vendor-edit-liaison">
        <option value="">Not named yet</option>
        ${data.people.map(p=>`<option value="${p.id}" ${liaison && liaison.assigneeId===p.id?"selected":""}>${esc(p.name)}</option>`).join("")}
      </select>
      <button class="btn btn-primary btn-block" id="vendor-edit-save" style="margin-top:14px;">Save Details</button>
    `}
  ];
  const actions = [
    v.phone ? `<button class="btn btn-primary" data-call="${v.phone}">${ICONS.phone} Call ${esc(v.contactName||v.name)}</button>` : `<button class="btn" disabled>No phone on file</button>`,
    ...(v.additionalContacts||[]).filter(c=>c.phone).map(c=>`<button class="btn" data-call="${esc(c.phone)}">${ICONS.phone} Call ${esc(c.name||v.name)}</button>`),
    `<button class="btn" data-drawer-nav="timeline">${ICONS.timeline} View Responsibilities</button>`
  ];
  if(dayOf){
    actions.push(v.checkedInAt
      ? `<button class="btn" id="vendor-unarrive">Undo Check-In</button>`
      : `<button class="btn btn-primary" id="vendor-arrive">Mark Arrived</button>`);
  }
  return drawerShell(TYPE_ICON.vendor, v.name, `${esc(v.type)} · <span class="status-pill ${v.status==='confirmed'?'status-green':'status-red'}"><span class="status-dot"></span>${v.status==='confirmed'?'Confirmed':'Contract Pending'}</span>`,
    sections, actions
  );
}

function drawerPerson(p){
  if(!p) return notFoundDrawer();
  const teams = (p.teamIds||[]).map(team).filter(Boolean);
  const resp = assignmentsForPerson(p.id);
  const dayResponsibilities = dayOfResponsibilitiesForPerson(p.id);
  const items = timelineItemsForPerson(p.id);
  const todayItems = timelineItemsForPersonToday(p.id);
  const vendors = vendorsForPerson(p.id);
  const tasks = hasPlanning() && state.planningMode ? sortTasks(openTasksForPerson(p.id)) : [];
  const nextResp = [...items, ...dayResponsibilities].sort((a,b)=>new Date(a.time)-new Date(b.time)).find(i=>new Date(i.time) >= now());
  const isTbd = (p.teamIds||[]).length===0 && /TBD/i.test(p.notes||"");
  const membershipLabel = teams.length ? teams.map(t=>esc(t.name)).join(", ") : (isTbd ? '<span style="color:var(--yellow);">TBD</span>' : "Not applicable");
  const emergency = contactOf("contact_emergency");
  const dayOf = operationalControlsActive(); // WEDDING-DAY SAFETY: real controls, gated (see helper)

  const sections = [];
  
  if(dayOf && nextResp){
    sections.push({title:"Up Next", html: `<div class="updnext-card">
      <div class="updnext-title">${esc(nextResp.title)}</div>
      <div class="updnext-meta">${fmtTime(nextResp.time)} · ${esc(ev(nextResp.eventId)?.title||"")} · ${countdownLabel(nextResp.time)}</div>
    </div>`});
  }
  sections.push({title:"Current Context", html:
      drawerRow("Next responsibility", nextResp ? esc(nextResp.title)+" · "+fmtTime(nextResp.time) : "None scheduled") +
      drawerRow("Related event", nextResp ? esc(ev(nextResp.eventId)?.title||"—") : "—") +
      drawerRow("Team membership", membershipLabel)
  });
  sections.push({title:"Responsibilities", html: resp.length || dayResponsibilities.length
      ? resp.map(renderResponsibility).join("") + dayResponsibilities.map(r=>`<div class="responsibility-card" data-event-palette="${r.eventId}"><div class="responsibility-time">${fmtDate(r.time,{month:"short",day:"numeric"})}<br>${fmtTime(r.time)}</div><div class="responsibility-copy"><div class="responsibility-title">${esc(r.title)}</div><div class="responsibility-owner"><span>OWNER</span> ${esc(r.owner)}</div><div class="responsibility-detail">${esc(r.detail)}</div></div></div>`).join("")
      : `<p style="color:var(--ink-faint); font-size:13px;">Nothing individually assigned — team ownership covers them for now.</p>`});
  if(dayOf){
    const coord = coordinatesWithFor(p.id);
    sections.push({title:"Coordinate With", html: coord.length
      ? chipsFor(coord.map(c=>`<span class="chip" data-open-drawer="${c.type}:${c.id}">${esc(c.name)}</span>`))
      : `<p style="color:var(--ink-faint); font-size:13px;">Nobody else is tied to the same responsibilities right now.</p>`});
  }
  sections.push({title: "Schedule", html: briefTimelineSection(items, todayItems)});
  sections.push({title:"Related Vendors", html: chipsFor(vendors.map(v=>`<span class="chip" data-open-drawer="vendor:${v.id}">${esc(v.name)}</span>`))});
  if(tasks.length){
    sections.push({title:"Planning Tasks", html: `<div class="pgroup-list">${tasks.map(renderTaskRow).join("")}</div>`});
  }
  sections.push({title:"Hotel", html: drawerRow("Hotel", p.hotel ? esc(p.hotel) : "Not on file")});
  sections.push({title:"Emergency Contact", html: emergency
    ? drawerRow(emergency.role, esc(emergency.name))
    : "—"});
  sections.push({title:"Notes", html: p.notes ? `<p style="font-size:13.5px; color:var(--ink-dim);">${esc(p.notes)}</p>` : `<p style="color:var(--ink-faint); font-size:13.5px;">No notes.</p>`});

  return drawerShell(TYPE_ICON.person, p.name, esc(p.role),
    sections,
    [
      p.phone ? `` : ``,
      p.phone ? `` : `<button class="btn" data-drawer-nav="timeline">${ICONS.timeline} View Timeline</button>`
    ]
  );
}

function drawerTeam(t){
  if(!t) return notFoundDrawer();
  const members = (t.memberIds||[]).map(person).filter(Boolean);
  const items = timelineItemsForTeam(t.id);
  const todayItems = items.filter(i=>isSameDay(new Date(i.time), now()));
  const resp = assignmentsForTeam(t.id);
  const teamOnly = resp.filter(a=>!a.via);
  const viaMembers = resp.filter(a=>a.via);
  const nextResp = items.find(i=>new Date(i.time) >= now());
  return drawerShell(TYPE_ICON.team, t.name, esc(t.mission),
    [
      {title:"Current Context", html:
        drawerRow("Members", members.length ? String(members.length) : '<span style="color:var(--yellow);">0 — empty roster</span>') +
        drawerRow("Next responsibility", nextResp ? esc(nextResp.title)+" · "+fmtTime(nextResp.time) : "None scheduled")
      },
      {title:"Duties", html: `<div class="drawer-chip-row">${(t.duties||[]).map(d=>`<span class="chip">${esc(d)}</span>`).join("")}</div>`},
      {title:"Responsibilities", html:
        (teamOnly.length ? teamOnly.map(renderResponsibility).join("") : "") +
        (viaMembers.length ? `<p style="font-size:11px; color:var(--ink-faint); font-weight:700; text-transform:uppercase; letter-spacing:.06em; margin:${teamOnly.length?'12px':'0'} 0 7px;">Individually, by member</p>${viaMembers.map(renderResponsibility).join("")}` : "") +
        (!teamOnly.length && !viaMembers.length ? `<p style="color:var(--ink-faint); font-size:13px;">Nothing individually assigned yet.</p>` : "")
      },
      {title:"Members", html: chipsFor(members.map(m=>`<span class="chip" data-open-drawer="person:${m.id}">${esc(m.name)}</span>`))},
      {title:"Schedule", html: briefTimelineSection(items, todayItems)}
    ],
    [ members[0] && members[0].phone ? `` : ``,
      `<button class="btn" data-drawer-nav="timeline">${ICONS.timeline} View Timeline</button>` ]
  );
}


function drawerEvent(e){
  if(!e) return notFoundDrawer();
  const venue = venueOf(e.venueId);
  const { items, tasks, decisions, vendors, resp, contacts } = eventHubCounts(e.id);
  const teams = (e.ownerTeamIds||[]).map(team).filter(Boolean);
  const overdueCount = tasks.filter(isOverdue).length;
  const openDecisionCount = decisions.filter(d=>d.status==="open").length;

  const headerFacts = [`${tasks.length} open task${tasks.length===1?'':'s'}`];
  if(overdueCount) headerFacts.push(`${overdueCount} overdue`);
  if(openDecisionCount) headerFacts.push(`${openDecisionCount} open decision${openDecisionCount===1?'':'s'}`);

  const subtitle = `
    ${esc(e.subtitle||"")}
    <div class="drawer-event-meta">
      <span>${fmtDate(e.startTime,{weekday:'long',month:'long',day:'numeric'})}</span>
      <span>${fmtTime(e.startTime)} – ${fmtTime(e.endTime)}</span>
      ${venue ? `<span class="chip" data-open-drawer="venue:${venue.id}" style="padding:3px 9px;">${esc(venue.name)}</span>` : '<span style="color:var(--yellow);">Venue TBD</span>'}
    </div>
    <div class="drawer-fact-row">${headerFacts.map(f=>`<span class="hub-fact">${esc(f)}</span>`).join("")}</div>
  `;

  
  const topActions = [
    ...(state.planningMode ? [`<button class="btn btn-primary" data-drawer-nav="eventHub" data-drawer-nav-event="${e.id}">${ICONS.wrench} Manage This Event</button>`] : []),
    `<button class="btn" data-drawer-nav="timeline" data-drawer-nav-event="${e.id}">${ICONS.timeline} Open Schedule</button>`,
    `<button class="btn" data-open-drawer="newTask:event:${e.id}">${ICONS.clipboard} Add Task</button>`
  ];

  const sections = [];
  if(teams.length || resp.length || vendors.length || contacts.length){
    let html = "";
    if(teams.length) html += `<div class="drawer-subsection-label">Owning Teams</div>` + chipsFor(teams.map(t=>`<span class="chip" data-open-drawer="team:${t.id}">${esc(t.name)}</span>`));
    if(resp.length) html += `<div class="drawer-subsection-label" style="margin-top:${teams.length?'12px':'0'};">Individually Assigned</div>` + resp.map(renderResponsibility).join("");
    if(vendors.length) html += `<div class="drawer-subsection-label" style="margin-top:12px;">Vendors</div>` + chipsFor(vendors.map(v=>`<span class="chip" data-open-drawer="vendor:${v.id}">${esc(v.name)}</span>`));
    if(contacts.length) html += `<div class="drawer-subsection-label" style="margin-top:12px;">Contacts</div>` + chipsFor(contacts.map(c=>`<span class="chip" data-open-drawer="contact:${c.id}">${esc(c.name)}</span>`));
    sections.push({title:"People & Partners", collapsed:true, html});
  }
  if(decisions.length){
    const html = `<div class="drawer-subsection-label">Decisions</div>` + chipsFor(decisions.map(d=>`<span class="chip" data-open-drawer="decision:${d.id}">${esc(d.title)}</span>`));
    sections.push({title:"Decisions", collapsed:true, html});
  }
  if(items.length){
    sections.push({title:"Schedule", collapsed:true, html: chipsFor(items.map(i=>`<span class="chip" data-open-drawer="timelineItem:${i.id}">${esc(i.title)} · ${fmtTime(i.time)}</span>`))});
  }
  sections.push({title:"Edit Details", collapsed:true, html: `
    <div class="drawer-subsection-label">Ops-lead team(s)</div>
    <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">
      ${data.teams.map(t=>`
        <label style="display:flex; align-items:center; gap:8px; font-size:13.5px;">
          <input type="checkbox" class="event-edit-owner-team" value="${t.id}" ${(e.ownerTeamIds||[]).includes(t.id)?"checked":""}>
          ${esc(t.name)}
        </label>
      `).join("")}
    </div>
    <button class="btn btn-primary btn-block" id="event-edit-save" style="margin-top:14px;">Save Details</button>
  `});

  return drawerShell(TYPE_ICON.event, e.title, subtitle, sections, [], {topActions});
}



function renderAudioTracks(t){
  const tracks = Array.isArray(t && t.audioTracks) ? t.audioTracks.filter(tr=>tr && tr.url) : [];
  if(!tracks.length) return "";
  const rows = tracks.map(tr => `
    <div class="timeline-item-audio-track">
      <div class="timeline-item-audio-label">${esc(tr.label || "Track")}</div>
      <audio controls preload="none" style="width:100%;" src="${esc(tr.url)}"></audio>
      <div class="timeline-item-audio-links">
        <a class="timeline-item-audio-openlink" href="${esc(tr.url)}" target="_blank" rel="noopener">${ICONS.music} Open audio</a>
        <a class="timeline-item-audio-openlink" href="${esc(tr.url)}" download>${ICONS.download} Download MP3</a>
      </div>
    </div>
  `).join("");
  return `<div class="timeline-item-audio">${rows}</div>`;
}

function drawerTimelineItem(t){
  if(!t) return notFoundDrawer();
  const eff = effectiveStatus(t);
  const meta = statusMeta(eff);
  const e = ev(t.eventId);
  const owners = (t.ownerTeamIds||[]).map(team).filter(Boolean);
  const vendors = (t.vendorIds||[]).map(vendor).filter(Boolean);
  const kids = childrenOf(t.id);
  const dur = fmtDuration(durationOf(t));
  const spanDur = kids.length ? fmtDuration(durationOf(t, {rollup:true})) : null;
  const resp = assignmentsFor("timelineItem", t.id);
  const primary = resp.find(a=>a.role==="primary");
  const primaryWho = primary ? assigneeOf(primary) : null;
  const linkedTasks = sortTasks(tasksForEntity("timelineItem", t.id));
  const dayOf = operationalControlsActive();

  
  const ownerLine = primaryWho ? `Owner: ${esc(primaryWho.name)}`
    : owners.length ? `Team: ${owners.map(o=>esc(o.name)).join(", ")}`
    : t.requiresAssignment ? `Owner: <span style="color:var(--yellow);">Unassigned</span>`
    : "";
  const subtitle = `
    <div class="drawer-event-meta">
      <strong>${esc(displayTimeLabel(t))}</strong>
      ${dur ? `<span aria-hidden="true">·</span><span>${dur}</span>` : ""}
      ${e ? `<span aria-hidden="true">·</span><span>${esc(e.title)}</span>` : ""}
    </div>
    ${eff !== "upcoming" ? `<div class="drawer-fact-row"><span class="status-pill ${meta.cls}"><span class="status-dot"></span>${meta.label}</span></div>` : ""}
    ${ownerLine ? `<div class="drawer-owner-line">${ownerLine}</div>` : ""}
    ${t.notes ? `<div class="timeline-item-note-preview"><div class="timeline-item-note-label">What to know</div><p>${esc(t.notes)}</p></div>` : ""}
    ${renderAudioTracks(t)}
  `;

  const callAction = primaryWho && primaryWho.type==="person" && primaryWho.phone
    ? ``
    : (owners[0] && person(owners[0].memberIds?.[0])?.phone
        ? ``
        : null);
  const topActions = [
    callAction,
    `<button class="btn btn-sm" data-open-drawer="newTask:timelineItem:${t.id}">${ICONS.clipboard} Add Task</button>`
  ].filter(Boolean);
  if(dayOf){
    if(!t.completedAt && !t.actualStartTime) topActions.push(`<button class="btn" id="tli-start">Mark Started</button>`);
    if(!t.completedAt) topActions.push(`<button class="btn btn-primary" id="tli-complete">Mark Complete</button>`);
    else topActions.push(`<button class="btn" id="tli-reopen">Reopen</button>`);
  }

  
  const moreDetails = [];
  const detailRows =
    (t.venueId ? drawerRow("Venue", esc(venueOf(t.venueId)?.name||"TBD")) : "") +
    (owners.length ? drawerRow("Team", `<span class="drawer-chip-row" style="justify-content:flex-end;">${owners.map(o=>`<span class="chip" data-open-drawer="team:${o.id}">${esc(o.name)}</span>`).join("")}</span>`) : "") +
    (vendors.length ? drawerRow("Vendor", `<span class="drawer-chip-row" style="justify-content:flex-end;">${vendors.map(v=>`<span class="chip" data-open-drawer="vendor:${v.id}">${esc(v.name)}</span>`).join("")}</span>`) : "") +
    (kids.length ? drawerRow("Guest schedule", stepVsGuestDurationHtml(dur, spanDur)) : "") +
    (dayOf ? drawerRow("Started", t.actualStartTime ? fmtTime(t.actualStartTime) : "Not yet") : "") +
    (dayOf ? drawerRow("Completed", t.completedAt ? fmtTime(t.completedAt) : "Not yet") : "");
  if(detailRows){
    moreDetails.push(`<div class="timeline-detail-group"><div class="drawer-subsection-label">Logistics</div>${detailRows}</div>`);
  }
  if(resp.length || t.requiresAssignment){
    moreDetails.push(`<div class="timeline-detail-group"><div class="drawer-subsection-label">Responsibilities</div>${resp.length
      ? resp.map(renderResponsibility).join("")
      : `<p class="timeline-detail-copy attention">A named owner is still needed.</p>`}</div>`);
  }
  if(kids.length){
    moreDetails.push(`<div class="timeline-detail-group"><div class="drawer-subsection-label">Included team steps</div>
      <p class="timeline-detail-copy" style="margin-bottom:10px;">Shown as one moment on the guest schedule.</p>
      ${chipsFor(kids.map(k=>`<span class="chip" data-open-drawer="timelineItem:${k.id}">${esc(k.title)} · ${fmtTime(k.time)}</span>`))}
    </div>`);
  }

  const editRows = [];
  if("songTitle" in t){
    editRows.push(`
      <label class="presolve-label">Entrance / moment song</label>
      <input class="pinput" id="tli-edit-song" type="text" placeholder="Song title" value="${esc(t.songTitle||"")}">
    `);
  }
  if("speakerPersonIds" in t){
    const current = new Set(t.speakerPersonIds||[]);
    editRows.push(`
      <label class="presolve-label" style="margin-top:14px;">Speakers</label>
      <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">
        ${data.people.map(p=>`
          <label style="display:flex; align-items:center; gap:8px; font-size:13.5px;">
            <input type="checkbox" class="tli-edit-speaker" value="${p.id}" ${current.has(p.id)?"checked":""}>
            ${esc(p.name)}
          </label>
        `).join("")}
      </div>
    `);
  }
  if(t.requiresAssignment){
    editRows.push(`
      <label class="presolve-label" style="margin-top:14px;">Primary assignee</label>
      <select class="pinput" id="tli-edit-primary">
        <option value="">Unassigned</option>
        ${data.people.map(p=>`<option value="${p.id}" ${primary && primary.assigneeId===p.id?"selected":""}>${esc(p.name)}</option>`).join("")}
      </select>
    `);
  }
  if(editRows.length){
    moreDetails.push(`<div class="timeline-detail-group"><div class="drawer-subsection-label">Edit details</div>
      ${editRows.join("")}
      <button class="btn btn-primary btn-block" id="tli-edit-save" style="margin-top:14px;">Save Details</button>
    </div>`);
  }

  const dynNotes = notesFor("timelineItem", t.id);
  const noteNeedsFullView = t.notes && (t.notes.length > 180 || t.notes.includes("\n"));
  if(noteNeedsFullView || dynNotes.length || (hasPlanning() && state.planningMode)){
    moreDetails.push(`<div class="timeline-detail-group"><div class="drawer-subsection-label">Notes</div>
      ${noteNeedsFullView ? `<p style="font-size:13.5px; color:var(--ink-dim); margin-bottom:10px; white-space:pre-wrap;">${esc(t.notes)}</p>` : ""}
      ${dynNotes.map(n=>`<div class="pnote"><div class="pnote-body">${esc(n.body)}</div><div class="pnote-meta">${esc(n.createdDate)}</div></div>`).join("")}
      ${hasPlanning() && state.planningMode ? `<div class="pnote-add"><input class="pinput" id="note-input" type="text" placeholder="Add a note…"><button class="btn btn-sm" id="note-save">Add</button></div>` : ""}
    </div>`);
  }

  const sections = [];
  if(linkedTasks.length){
    sections.push({title:`Tasks · ${linkedTasks.length}`, collapsed:true, html:`<div class="pgroup-list">${linkedTasks.map(renderTaskRow).join("")}</div>`});
  }
  if(moreDetails.length){
    sections.push({title:"More details", collapsed:true, html:moreDetails.join("")});
  }

  return drawerShell(TYPE_ICON.timelineItem, t.title, subtitle, sections, [], {topActions, hideIcon:true, compactActions:true});
}

function drawerVenue(v){
  if(!v) return notFoundDrawer();
  const events = (v.eventIds||[]).map(ev).filter(Boolean);
  return drawerShell(TYPE_ICON.venue, v.name, v.address ? esc(v.address) : '<span style="color:var(--yellow);">Address TBD</span>',
    [
      {title:"Current Context", html:
        drawerRow("Contact", v.contactName ? esc(v.contactName) : "—") +
        "" +
        drawerRow("Parking", v.parkingNotes ? esc(v.parkingNotes) : "Not specified")
      },
      {title:"Events Here", html: chipsFor(events.map(e=>`<span class="chip" data-open-drawer="event:${e.id}">${esc(e.title)}</span>`))},
      {title:"Edit Details", html: `
        <label class="presolve-label">Address</label>
        <input class="pinput" id="venue-edit-address" type="text" placeholder="Street address" value="${esc(v.address||"")}">
        <button class="btn btn-primary btn-block" id="venue-edit-save" style="margin-top:14px;">Save Details</button>
      `}
    ],
    [ v.phone ? `` : ``,
      v.address ? `<a class="btn" href="https://maps.google.com/?q=${encodeURIComponent(v.address)}" target="_blank" rel="noopener">${ICONS.map} Navigate</a>` : `<button class="btn" disabled>${ICONS.map} Address TBD</button>` ]
  );
}


function drawerContact(c){
  if(!c) return notFoundDrawer();
  const rows = (c.phone ? drawerRow("Phone", `<a href="${telHref(c.phone)}">${esc(c.phone)}</a>`) : drawerRow("Phone", "Number not yet provided")) +
    (c.email ? drawerRow("Email", esc(c.email)) : "");
  return drawerShell(TYPE_ICON.contact, c.name, esc(c.role),
    [{title:"Contact Info", html:rows}],
    [c.phone ? `<a class="btn btn-primary" href="${telHref(c.phone)}">${ICONS.phone} Call</a>` : "",
     c.phone ? `<a class="btn" href="${smsHref(c.phone)}">${ICONS.message} Text</a>` : "",
     c.email ? `<a class="btn" href="mailto:${esc(c.email)}">${ICONS.mail} Mail</a>` : ""]);
}


function drawerContactPerson(p){
  if(!p) return notFoundDrawer();
  const rows = "" +
    (p.email ? drawerRow("Email", esc(p.email)) : "");
  return drawerShell(TYPE_ICON.person, p.name, esc(p.role||""),
    [ {title:"Contact Info", html: rows} ],
    [ p.phone ? `` : ``,
      p.phone ? `` : "",
      p.email ? `<a class="btn" href="mailto:${p.email}">${ICONS.mail} Mail</a>` : "" ]
  );
}
function drawerContactVendor(v){
  if(!v) return notFoundDrawer();
  
  const rows = drawerRow("Service", esc(v.type||"Vendor")) +
    (v.contactName ? drawerRow("Contact", esc(v.contactName)) : "") +
    (v.phone ? drawerRow("Phone", esc(v.phone)) : "") +
    (v.additionalContacts||[]).map(c=>(c.name ? drawerRow("Contact", esc(c.name)) : "") + (c.phone ? drawerRow("Phone", esc(c.phone)) : "")).join("") +
    (v.email ? drawerRow("Email", esc(v.email)) : "");
  return drawerShell(TYPE_ICON.vendor, v.name, esc(v.type||""),
    [ {title:"Contact Info", html: rows} ],
    [ v.phone ? `<button class="btn btn-primary" data-call="${v.phone}">${ICONS.phone} Call ${esc(v.contactName||v.name)}</button>` : `<button class="btn" disabled>No phone</button>`,
      v.phone ? `<button class="btn" data-text="${v.phone}">${ICONS.message} Text ${esc(v.contactName||v.name)}</button>` : "",
      ...(v.additionalContacts||[]).filter(c=>c.phone).flatMap(c=>[
        `<button class="btn" data-call="${esc(c.phone)}">${ICONS.phone} Call ${esc(c.name||v.name)}</button>`,
        `<button class="btn" data-text="${esc(c.phone)}">${ICONS.message} Text ${esc(c.name||v.name)}</button>`
      ]),
      v.email ? `<a class="btn" href="mailto:${v.email}">${ICONS.mail} Mail</a>` : "" ]
  );
}
function drawerContactVenue(v){
  if(!v) return notFoundDrawer();
  return drawerContact({name:v.name,role:v.contactName||"Venue",phone:v.phone,email:v.email});
}



function ownerName(id){ return id ? (person(id)?.name || null) : null; }

function taskContextLabel(t){
  const eid = taskEventId(t);
  return eid ? (ev(eid)?.title || null) : null;
}

function groupTasksByEvent(list){
  const groups = new Map();
  data.events.forEach(e=>groups.set(e.id, {id:e.id, label:e.title, date:e.date, tasks:[]}));
  const weddingWide = {id:"__wedding_wide", label:"Wedding-wide", date:"9999", tasks:[]};
  list.forEach(t=>{
    const eid = taskEventId(t);
    (eid && groups.has(eid) ? groups.get(eid) : weddingWide).tasks.push(t);
  });
  const out = [...groups.values()].filter(g=>g.tasks.length).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  if(weddingWide.tasks.length) out.push(weddingWide);
  return out;
}

function renderTaskRow(t){
  const owner = ownerName(t.ownerId);
  const blocking = isBlocking(t);
  const done = t.status === "done";
  const dismissed = t.status === "dismissed";
  const overdue = t.dueDate && !done && new Date(t.dueDate+"T23:59:59") < now();
  const moment = t.linkedTimelineItemId ? entityById("timelineItem", t.linkedTimelineItemId) : null;
  return `
    <div class="ptask ${blocking?'is-blocking':''} ${done?'is-done':''} ${dismissed?'is-dismissed':''} clickable" data-open-drawer="task:${t.id}">
      <div class="ptask-mark">${done ? ICONS.checkCircle : (blocking ? ICONS.alertTriangle : ICONS.clipboard)}</div>
      <div class="ptask-body">
        <div class="ptask-title">${esc(t.title)}</div>
        <div class="ptask-meta">
          ${owner ? `<span class="ptask-owner">${esc(owner)}</span>` : `<span class="ptask-owner is-unassigned">Assign owner</span>`}
          ${t.dueDate && !done ? `<span class="${overdue?'ptask-warn':''}">· ${overdue?'Overdue ':'Due '}${fmtDate(t.dueDate+"T12:00:00",{month:'short',day:'numeric'})}</span>` : ""}
          ${moment ? `<span>· ${esc(moment.title)}</span>` : ""}
          ${dismissed ? `<span>· Set aside</span>` : ""}
          ${done && t.completedAt ? `<span>· Closed ${fmtDate(t.completedAt+"T12:00:00",{month:'short',day:'numeric'})}</span>` : ""}
        </div>
      </div>
    </div>
  `;
}


function decisionsForEvent(eventId){
  if(!hasPlanning()) return [];
  const itemIds = new Set(itemsForEvent(eventId).map(i=>i.id));
  return planning.decisions.filter(d=>
    (d.entityType==="event" && d.entityId===eventId) ||
    (d.entityType==="timelineItem" && itemIds.has(d.entityId))
  );
}
function notesForEvent(eventId){
  if(!hasPlanning()) return [];
  const itemIds = new Set(itemsForEvent(eventId).map(i=>i.id));
  return planning.notes.filter(n=>
    (n.entityType==="event" && n.entityId===eventId) ||
    (n.entityType==="timelineItem" && itemIds.has(n.entityId))
  ).sort((a,b)=>String(b.createdDate||"").localeCompare(String(a.createdDate||"")));
}

function eventContacts(eventId){
  const e = ev(eventId);
  if(!e) return [];
  const out = [];
  const venue = venueOf(e.venueId);
  if(venue && (venue.contactName || venue.phone)) out.push({name: venue.contactName || venue.name, role:"Venue", phone: venue.phone || null});
  const primary = primaryAssignmentOf("event", eventId);
  if(primary){ const who = assigneeOf(primary); if(who) out.push({name: who.name, role:"Primary owner", phone: who.phone || null}); }
  (e.vendorIds||[]).forEach(vid=>{
    const liaison = vendorLiaisonOf(vid);
    if(!liaison) return;
    const who = assigneeOf(liaison);
    const v = vendor(vid);
    if(who) out.push({name: who.name, role:`${v ? v.name : "Vendor"} liaison`, phone: who.phone || v?.phone || null});
  });
  return out;
}

function recentDecisions(limit){
  return decidedDecisions().slice()
    .sort((a,b)=>String(b.decidedDate||"").localeCompare(String(a.decidedDate||"")))
    .slice(0, limit);
}

function recentlyCompleted(limit){
  return allTasks().filter(t=>t.status==="done" && t.completedAt)
    .sort((a,b)=>String(b.completedAt).localeCompare(String(a.completedAt)))
    .slice(0, limit);
}
function upcomingDeadlines(limit){
  return sortTasks(openTasks().filter(t=>t.dueDate))
    .sort((a,b)=>String(a.dueDate).localeCompare(String(b.dueDate)))
    .slice(0, limit);
}



function eventHubCounts(eventId){
  const e = ev(eventId);
  const items = itemsForEvent(eventId);
  const tasks = tasksForEntity("event", eventId);
  const decisions = decisionsForEvent(eventId);
  const vendors = (e.vendorIds||[]).map(vendor).filter(Boolean);
  const resp = [...assignmentsFor("event", e.id), ...items.flatMap(i=>assignmentsFor("timelineItem", i.id))];
  const contacts = eventContacts(eventId);
  const transport = transportationFor(eventId);
  return { items, tasks, decisions, vendors, resp, contacts, transport };
}
function renderEventWorkspace(el, eventId){
  const e = ev(eventId);
  if(!e){ state.missionDrill = null; state.eventHubSection = null; renderManageWedding(); return; }
  if(state.eventHubSection){ renderEventHubSection(el, eventId, state.eventHubSection); return; }

  const { items, decisions, vendors, resp, contacts, transport } = eventHubCounts(eventId);
  const responsibilities = responsibilitiesForEvent(eventId);
  const venue = venueOf(e.venueId);
  const openDecisionCount = decisions.filter(d=>d.status==="open").length;

  
  const headerFacts = [`${responsibilities.length} responsibilit${responsibilities.length===1?'y':'ies'}`];
  if(openDecisionCount) headerFacts.push(`${openDecisionCount} open decision${openDecisionCount===1?'':'s'}`);

  
  const timelineSummary = (()=>{
    if(!items.length) return "Timeline not added yet";
    const live = items.find(i=>effectiveStatus(i)==="current");
    if(live) return `${items.length} moment${items.length===1?'':'s'} · ${esc(live.title)} happening now`;
    const next = items.find(i=>effectiveStatus(i)==="upcoming");
    return next ? `${items.length} moment${items.length===1?'':'s'} · next: ${esc(next.title)} at ${fmtTime(next.time)}` : `${items.length} moment${items.length===1?'':'s'}`;
  })();

  const cards = [
    { key:"tasks", label:"Responsibilities", count:responsibilities.length,
      summary: `${responsibilities.length} important handoff${responsibilities.length===1?'':'s'}`,
      action:"data-hub-tasks" },
    { key:"timeline", label:"Schedule", count:items.length, summary:timelineSummary, action:"data-hub-timeline" },
    { key:"people", label:"People & Partners", count: resp.length+vendors.length+contacts.length,
      summary: `${resp.length} assigned · ${vendors.length} vendor${vendors.length===1?'':'s'} · ${contacts.length} contact${contacts.length===1?'':'s'}`,
      action:"data-hub-section", section:"people" },
    { key:"plans", label:"Plans & Notes", count: decisions.length,
      summary: `${decisions.length} decision${decisions.length===1?'':'s'}`,
      action:"data-hub-section", section:"plans" }
  ];
  
  if(transport.length){
    cards.push({ key:"transport", label:"Transportation", count:transport.length,
      summary: `${transport.length} leg${transport.length===1?'':'s'}`,
      action:"data-hub-section", section:"transport" });
  }

  el.innerHTML = `
    <button class="studio-back" data-mission-back>${ICONS.chevron} Manage Wedding</button>
    <div class="studio-event-head">
      <div class="studio-event-head-eyebrow">${fmtDate(e.startTime,{weekday:'long', month:'long', day:'numeric'})}</div>
      <h1 class="studio-event-head-title">${esc(e.title)}</h1>
      <div class="studio-event-head-meta">
        <span>${venue ? esc(venue.name) : "Venue TBD"}</span>
        <span>${fmtTime(e.startTime)} – ${fmtTime(e.endTime)}</span>
      </div>
      <div class="studio-event-head-facts">${headerFacts.map(f=>`<span class="hub-fact">${esc(f)}</span>`).join("")}</div>
    </div>

    ${liveEventPhotoHtml(eventId, true)}

    <div class="hub-primary-actions">
      <button class="btn btn-primary" data-hub-tasks>${ICONS.clipboard} View Responsibilities</button>
      <button class="btn" data-hub-timeline>${ICONS.timeline} Open Schedule</button>
      <button class="btn-text" data-hub-add-note>+ Add note</button>
    </div>

    <div class="hub-dest-grid">
      ${cards.map(c=>`
        <div class="hub-dest-card clickable" ${c.action}="${c.section||''}" data-hub-card="${c.key}">
          <div class="hub-dest-card-top">
            <span class="hub-dest-card-label">${esc(c.label)}</span>
            <span class="studio-card-count">${c.count}</span>
          </div>
          <div class="hub-dest-card-summary">${esc(c.summary)}</div>
        </div>
      `).join("")}
    </div>
  `;

  el.querySelector("[data-mission-back]").addEventListener("click", ()=>{
    state.missionDrill = null; state.eventHubSection = null; renderManageWedding();
  });
  el.querySelectorAll("[data-hub-timeline]").forEach(b=>b.addEventListener("click", ()=>{
    state.timelineEventId = eventId; state.eventHubSection = null; state.view = "timeline";
    renderShell(); renderActiveView();
  }));
  el.querySelectorAll("[data-hub-tasks]").forEach(tasksCard=>tasksCard.addEventListener("click", ()=>{
    state.view = "tasks"; state.taskScopeId = eventId; state.taskScopeReturnsToHub = true;
    renderShell(); renderActiveView();
  }));
  el.querySelectorAll("[data-hub-section]").forEach(b=>b.addEventListener("click", ()=>{
    state.eventHubSection = b.getAttribute("data-hub-section");
    renderEventWorkspace(el, eventId);
  }));
  
  const addNoteBtn = el.querySelector("[data-hub-add-note]");
  if(addNoteBtn) addNoteBtn.addEventListener("click", ()=>{
    state.eventHubSection = "plans";
    renderEventWorkspace(el, eventId);
  });
  wireDrawerTriggers(el);
}


function renderEventHubSection(el, eventId, section){
  const e = ev(eventId);
  if(!e){ state.missionDrill = null; state.eventHubSection = null; renderManageWedding(); return; }
  const { items, vendors, resp, contacts, decisions, transport } = eventHubCounts(eventId);
  const notes = notesForEvent(eventId);
  const musicVendors = vendors.filter(v=>/dj|music|entertain/i.test(v.type||""));
  const photoVendors = vendors.filter(v=>/photo|video/i.test(v.type||""));
  const otherVendors = vendors.filter(v=>!musicVendors.includes(v) && !photoVendors.includes(v));

  let title, bodyHtml;
  if(section === "people"){
    title = "People & Partners";
    const groups = [];
    groups.push({ h:"Assignments", body: resp.length ? resp.map(renderResponsibility).join("") : `<p class="studio-empty">No named individual yet — team ownership only.</p>` });
    if(vendors.length) groups.push({ h:"Vendors", body: chipsFor(vendors.map(v=>`<span class="chip" data-open-drawer="vendor:${v.id}">${esc(v.name)}${v.checkedInAt?" ✓":""}</span>`)) });
    if(contacts.length) groups.push({ h:"Contacts", body: contacts.map(c=>`
        <div class="studio-contact-row">
          <div><div class="studio-contact-name">${esc(c.name)}</div><div class="studio-contact-role">${esc(c.role)}</div></div>
          ${c.phone ? `<a class="btn btn-sm" href="${telHref(c.phone)}" aria-label="Call ${esc(c.name)}">${ICONS.phone} ${esc(c.phone)}</a>` : `<span class="vcard-meta">Number not yet provided</span>`}
        </div>`).join("") });
    bodyHtml = groups.map(g=>`<div class="studio-card"><div class="studio-card-title">${esc(g.h)}</div>${g.body}</div>`).join("");
    if(!bodyHtml) bodyHtml = `<p class="studio-empty">Nothing on file for this event yet.</p>`;
  } else if(section === "plans"){
    title = "Plans & Notes";
    const groups = [];
    if(decisions.length) groups.push({ h:"Decisions", body: decisions.map(d=>`
        <div class="card clickable pdecision" data-open-drawer="decision:${d.id}">
          <div class="pdecision-title">${esc(d.title)}${d.status==='decided'?` · ${esc(d.chosenOption||"")}`:""}</div>
          <div class="pdecision-q">${esc(d.status==='open' ? (d.question||"") : (d.rationale||""))}</div>
        </div>`).join("") });
    if(musicVendors.length) groups.push({ h:"Music", body:
        chipsFor(musicVendors.map(v=>`<span class="chip" data-open-drawer="vendor:${v.id}">${esc(v.name)}</span>`)) });
    if(photoVendors.length) groups.push({ h:"Photo Plans", body:
        chipsFor(photoVendors.map(v=>`<span class="chip" data-open-drawer="vendor:${v.id}">${esc(v.name)}</span>`)) });
    groups.push({ h:"Notes", body:
        (notes.length ? notes.map(n=>`<div class="pnote"><div class="pnote-body">${esc(n.body)}</div><div class="pnote-meta">${esc(n.createdDate)}</div></div>`).join("") : `<p class="studio-empty">No notes yet.</p>`) +
        `<div class="pnote-add"><input class="pinput" id="ws-note-input" type="text" placeholder="Add a note…"><button class="btn btn-sm" id="ws-note-save">Add</button></div>` });
    bodyHtml = groups.map(g=>`<div class="studio-card"><div class="studio-card-title">${esc(g.h)}</div>${g.body}</div>`).join("");
  } else if(section === "transport"){
    title = "Transportation";
    bodyHtml = transport.length ? `
      <div class="studio-card">
        <div class="studio-card-title-row">
          <div class="studio-card-title" style="margin-bottom:0;">${ICONS.shuttle} Legs<span class="studio-card-count">${transport.length}</span></div>
          <button class="studio-card-add" data-open-drawer="newTransportation:${e.id}">+ Add</button>
        </div>
        ${transport.map(t=>{
          const lm = TRANSPORT_LIFECYCLE_META[t.lifecycle] || TRANSPORT_LIFECYCLE_META.draft;
          return `<div class="card clickable pdecision" data-open-drawer="transportation:${t.id}">
            <div class="pdecision-title">${esc(transportationLabel(t))}</div>
            <div class="pdecision-q">${fmtTime(t.departureTime)}${t.arrivalTime ? " – " + fmtTime(t.arrivalTime) : ""} · <span class="status-pill ${lm.cls}" style="padding:1px 7px; font-size:10.5px;"><span class="status-dot"></span>${lm.label}</span></div>
          </div>`;
        }).join("")}
      </div>` : `<p class="studio-empty">No transportation on file for this event.</p>`;
  } else {
    state.eventHubSection = null; renderEventWorkspace(el, eventId); return;
  }

  el.innerHTML = `
    <button class="studio-back" data-hub-back>${ICONS.chevron} Back to ${esc(e.title)}</button>
    <div class="section-head">
      <span class="section-title">${esc(title)}</span>
    </div>
    <div class="studio-grid">${bodyHtml}</div>
  `;
  el.querySelector("[data-hub-back]").addEventListener("click", ()=>{
    state.eventHubSection = null; renderEventWorkspace(el, eventId);
  });
  el.querySelectorAll("[data-call]").forEach(b=>b.addEventListener("click", ()=>window.location.href=telHref(b.getAttribute("data-call"))));
  const wsNoteSave = el.querySelector("#ws-note-save");
  if(wsNoteSave) wsNoteSave.addEventListener("click", ()=>{
    const inp = el.querySelector("#ws-note-input");
    if(!inp.value.trim()) return;
    addNote("event", eventId, inp.value);
    toast("Note added");
    renderEventHubSection(el, eventId, section);
  });
  wireDrawerTriggers(el);
}


function taskCountsForScope(scopeId){
  const isWeddingWide = scopeId === "__wedding_wide";
  const inScope = t => isWeddingWide ? taskScope(t).type === "wedding" : taskEventId(t) === scopeId;
  const open = openTasks().filter(inScope);
  return { open: open.length, overdue: open.filter(isOverdue).length, completed: doneTasks().filter(inScope).length };
}

function renderTasksControl(){
  const el = document.getElementById("view-tasks");
  if(state.taskScopeId && ev(state.taskScopeId)){
    renderResponsibilityDetail(el, state.taskScopeId);
  } else {
    state.taskScopeId = null;
    renderResponsibilityPicker(el);
  }
}
function renderResponsibilityPicker(el){
  const sortedEvents = [...data.events].sort((a,b)=>new Date(a.startTime)-new Date(b.startTime));
  const cards = sortedEvents.filter(e=>responsibilitiesForEvent(e.id).length).map(e=>({id:e.id, label:e.title, date:e.date}));

  el.innerHTML = `
    <div class="section-head">
      <span class="section-title">Responsibilities</span>
      <span class="section-sub">Important day-of handoffs and who owns them</span>
    </div>
    <div class="studio-events-grid timeline-event-grid task-scope-grid">
      ${cards.map(c=>{
        const list = responsibilitiesForEvent(c.id);
        const unassigned = list.filter(r=>r.owner==="TBD").length;
        return `<button type="button" class="studio-event-card timeline-event-card task-scope-card clickable" data-event-palette="${c.id}" data-task-scope="${c.id}">
          <div class="event-card-kicker">${fmtDate(c.date+"T00:00:00",{month:'short',day:'numeric'})}</div>
          <div class="studio-event-card-title">${esc(c.label)}</div>
          <div class="timeline-event-card-sub">${list.length} handoff${list.length===1?'':'s'}${unassigned?` · ${unassigned} need${unassigned===1?'s':''} an owner`:''}</div>
          <div class="event-card-footer">View responsibilities <span aria-hidden="true">↗</span></div>
        </button>`;
      }).join("")}
    </div>
  `;

  el.querySelectorAll("[data-task-scope]").forEach(c=>c.addEventListener("click", ()=>{
    state.taskScopeId = c.getAttribute("data-task-scope");
    state.taskScopeReturnsToHub = false;
    renderTasksControl();
    window.scrollTo(0,0);
  }));
}

function renderResponsibilityDetail(el, scopeId){
  const scopeEvent = ev(scopeId);
  const label = scopeEvent.title;
  const list = responsibilitiesForEvent(scopeId);
  const returnsToHub = state.taskScopeReturnsToHub;
  const backLabel = returnsToHub ? `Back to ${esc(label)}` : "All Events";

  el.innerHTML = `
    <button class="studio-back" data-tasks-scope-back>${ICONS.chevron} ${backLabel}</button>
    <div class="task-detail-toolbar">
      <div class="section-head task-detail-title">
        <span class="section-title">${esc(label)}</span>
        <span class="section-sub">${list.length} important handoff${list.length===1?"":"s"}</span>
      </div>
    </div>
    <div class="responsibility-list">
      ${list.map(r=>`<article class="responsibility-card ${r.owner==='TBD'?'is-unassigned':''}" data-event-palette="${r.eventId}">
        <div class="responsibility-time">${fmtTime(r.time)}</div>
        <div class="responsibility-copy">
          <div class="responsibility-title">${esc(r.title)}</div>
          <div class="responsibility-owner"><span>OWNER</span> ${esc(r.owner)}</div>
          <div class="responsibility-detail">${esc(r.detail)}</div>
        </div>
      </article>`).join("")}
    </div>
  `;

  el.querySelector("[data-tasks-scope-back]").addEventListener("click", ()=>{
    if(returnsToHub){
      state.taskScopeId = null; state.taskScopeReturnsToHub = false;
      state.missionDrill = "event"; state.missionEventId = scopeId; state.eventHubSection = null;
      state.view = "manage";
      renderShell(); renderActiveView();
      return;
    }
    state.taskScopeId = null; renderTasksControl();
  });
}





function drawerTask(t){
  if(!t) return notFoundDrawer();
  const done = t.status === "done";
  const owner = ownerName(t.ownerId);
  const eventScopeId = taskEventId(t);
  const notes = notesFor("task", t.id);
  const pill = done ? `<span class="status-pill status-green"><span class="status-dot"></span>Closed</span>`
            : isBlocking(t) ? `<span class="status-pill status-red"><span class="status-dot"></span>Holding something up</span>`
            : `<span class="status-pill status-gray"><span class="status-dot"></span>Open</span>`;

  
  const ownerFieldHtml = `<div class="task-owner-control"><select class="pinput" id="task-owner-edit">
        <option value="">Needs an owner</option>
        ${data.people.map(p=>`<option value="${p.id}" ${t.ownerId===p.id?"selected":""}>${esc(p.name)}</option>`).join("")}
        <option value="__new__">+ Add a new owner…</option>
      </select><button class="btn btn-sm task-new-owner-button" id="task-owner-new-toggle" type="button">+ New owner</button></div>
      <input class="pinput task-new-owner-input" id="task-owner-new-edit" type="text" placeholder="Enter the new owner's name" style="display:none; margin-top:8px;">`;
  const dueFieldHtml = `<input class="pinput" id="task-due-edit" type="date" value="${esc(t.dueDate||"")}" style="max-width:180px;">`;
  const scopeFieldHtml = `<div class="passignee-row" style="gap:8px; flex-wrap:wrap;">
        <label style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:500;"><input type="radio" name="task-scope-edit" id="task-scope-wedding-radio" value="wedding" ${!eventScopeId?"checked":""}> Wedding-wide</label>
        <label style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:500;"><input type="radio" name="task-scope-edit" id="task-scope-event-radio" value="event" ${eventScopeId?"checked":""}> One event</label>
      </div>
      <select class="pinput" id="task-scope-event-edit" style="margin-top:8px; ${eventScopeId?"":"display:none;"}">
        <option value="">Choose an event…</option>
        ${data.events.map(e=>`<option value="${e.id}" ${eventScopeId===e.id?"selected":""}>${esc(e.title)}</option>`).join("")}
      </select>
      <details class="drawer-disclosure" style="margin-top:8px;">
        <summary class="drawer-section-title">More options — link to a specific schedule moment</summary>
        <div class="drawer-disclosure-body">
          <select class="pinput" id="task-moment-edit" style="${eventScopeId?"":"display:none;"}">
            <option value="">No specific schedule moment</option>
            ${eventScopeId ? itemsForEvent(eventScopeId).map(i=>`<option value="${i.id}" ${t.linkedTimelineItemId===i.id?"selected":""}>${esc(i.title)} · ${fmtTime(i.time)}</option>`).join("") : ""}
          </select>
        </div>
      </details>`;

  const sections = [
    {title:"What this is", html:
      `<p style="font-size:13.5px; color:var(--ink-dim); line-height:1.55;">${esc(t.detail||"")}</p>`},
    {title:"Details", html:
      drawerRow("Owner", ownerFieldHtml) +
      drawerRow("Scope", scopeFieldHtml) +
      (t.entityType && t.entityId && entityLabel(t.entityType,t.entityId) && !(t.entityType==="event" && t.entityId===eventScopeId)
        ? drawerRow("About", `<span class="chip" data-open-drawer="${t.entityType}:${t.entityId}" style="padding:4px 9px;">${esc(entityLabel(t.entityType,t.entityId))}</span>`) : "") +
      drawerRow("Due", dueFieldHtml) +
      (t.group ? drawerRow("Area", esc(t.group)) : "") +
      `<button class="btn btn-sm" id="task-details-save" style="margin-top:10px;">Save changes</button>`}
  ];

  sections.push({title:"How this closes", html:
    `<p class="phowclose">You wrote this one, so you close it. Nothing in the wedding data can tell whether it is done.</p>`});

  sections.push({title:"Notes", html:
    (notes.length ? notes.map(n=>`<div class="pnote"><div class="pnote-body">${esc(n.body)}</div><div class="pnote-meta">${esc(n.createdDate)}</div></div>`).join("")
                  : `<p style="color:var(--ink-faint); font-size:13px;">No notes yet.</p>`) +
    `<div class="pnote-add"><input class="pinput" id="note-input" type="text" placeholder="Add a note…"><button class="btn btn-sm" id="note-save">Add</button></div>`});

  const actions = [
    done ? `<button class="btn btn-block" id="task-reopen">Reopen</button>`
         : `<button class="btn btn-primary btn-block" id="task-done">Mark as done</button>`
  ];

  return drawerShell(TYPE_ICON.task, t.title, pill, sections, actions);
}


const NEW_TASK_ENTITY_TYPES = [
  {value:"vendor", label:"Vendor"},
  {value:"venue", label:"Venue"},
  {value:"team", label:"Team"},
  {value:"person", label:"Person"}
];
function entityOptionsFor(type){
  const list = ENTITY_COLLECTIONS[type] ? ENTITY_COLLECTIONS[type]() : [];
  return list.map(o=>`<option value="${o.id}">${esc(o.title||o.name||o.id)}</option>`).join("");
}




function taskScopeFieldsHtml(fixedEventId, fixedItemId){
  if(fixedEventId){
    return `
      <input type="hidden" id="nt-scope-event" value="${esc(fixedEventId)}">
      <input type="hidden" id="nt-timeline-item" value="${esc(fixedItemId||"")}">
    `;
  }
  const eventOpts = data.events.map(e=>`<option value="${e.id}">${esc(e.title)}</option>`).join("");
  return `
    <label class="presolve-label" style="margin-top:14px;">Scope</label>
    <div class="passignee-row" style="gap:8px;">
      <label style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:500;"><input type="radio" name="nt-scope" id="nt-scope-wedding" value="wedding" checked> Wedding-wide</label>
      <label style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:500;"><input type="radio" name="nt-scope" id="nt-scope-event-radio" value="event"> One event</label>
    </div>
    <select class="pinput" id="nt-scope-event" style="margin-top:8px; display:none;">
      <option value="">Choose an event…</option>
      ${eventOpts}
    </select>
    <input type="hidden" id="nt-timeline-item" value="">
  `;
}

function drawerNewTask(prefill){
  
  const raw = prefill || "";
  const viewOrigin = raw.startsWith("view:");
  const rest = viewOrigin ? raw.slice(5) : raw;
  const cut = rest.indexOf(":");
  const preType = cut > -1 ? rest.slice(0, cut) : "";
  const preId = cut > -1 ? rest.slice(cut+1) : "";
  const peopleOpts = data.people.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("");

  
  let fixedEventId = null, fixedItemId = null, connectPreType = preType, connectPreId = preId;
  if(preType === "event"){ fixedEventId = preId; connectPreType = null; connectPreId = null; }
  else if(preType === "timelineItem"){
    const item = entityById("timelineItem", preId);
    if(item){ fixedEventId = item.eventId; fixedItemId = preId; }
    connectPreType = null; connectPreId = null;
  }
  const preLabel = connectPreType && connectPreId ? entityLabel(connectPreType, connectPreId) : null;

  
  const contextBanner = fixedEventId ? `
    <div class="nt-context">
      For: <span class="chip" style="padding:3px 9px;">${esc(ev(fixedEventId)?.title || "Event")}</span>${fixedItemId ? ` → <span class="chip" style="padding:3px 9px;">${esc(entityById("timelineItem", fixedItemId)?.title || "Moment")}</span>` : ""}
    </div>
  ` : "";

  
  const connectHtml = preLabel ? `
    <label class="presolve-label" style="margin-top:14px;">About</label>
    <div><span class="chip">${esc(preLabel)}</span></div>
    <input type="hidden" id="nt-entity-type" value="${esc(connectPreType)}">
    <input type="hidden" id="nt-entity-id" value="${esc(connectPreId)}">
  ` : "";

  return `
    <div class="drawer-close-row"><button class="icon-btn" data-drawer-close aria-label="Close">${ICONS.close}</button></div>
    <div class="drawer-hero-icon">${ICONS.clipboard}</div>
    <div class="drawer-title">New Task</div>
    <div class="drawer-subtitle">Capture something that needs doing.</div>
    ${contextBanner}

    <div class="drawer-section">
      <label class="presolve-label">What needs to happen?</label>
      <input class="pinput" id="nt-title" type="text" placeholder="What needs to happen">

      <label class="presolve-label" style="margin-top:14px;">Owner</label>
      <select class="pinput" id="nt-owner">
        <option value="">Choose an owner…</option>
        ${peopleOpts}
        <option value="__new__">+ Add a new owner…</option>
      </select>
      <button class="btn btn-sm task-new-owner-button" id="nt-owner-new-toggle" type="button" style="margin-top:8px;">+ Add a new owner</button>
      <input class="pinput task-new-owner-input" id="nt-owner-new" type="text" placeholder="Enter the new owner's name" style="display:none; margin-top:8px;">

      <label class="presolve-label" style="margin-top:14px;">Due date <span style="font-weight:400; text-transform:none; letter-spacing:0;">— optional</span></label>
      <input class="pinput" id="nt-due" type="date">

      ${taskScopeFieldsHtml(fixedEventId, fixedItemId)}

      <label class="presolve-label" style="margin-top:14px;">Notes <span style="font-weight:400; text-transform:none; letter-spacing:0;">— optional</span></label>
      <textarea class="pinput" id="nt-detail" rows="3" placeholder="Any context worth capturing"></textarea>

      ${connectHtml}
    </div>

    <div class="drawer-actions">
      <button class="btn btn-primary btn-block" id="nt-save" data-nt-return="${connectPreType && connectPreId && !viewOrigin ? esc(connectPreType+":"+connectPreId) : ""}">Save Task</button>
    </div>
  `;
}

function drawerDecision(d){
  if(!d) return notFoundDrawer();
  const open = d.status === "open";
  const sections = [
    {title:"The question", html:`<p style="font-size:13.5px; color:var(--ink-dim); line-height:1.55;">${esc(d.question||"")}</p>`},
    {title: open ? "Options" : "Options considered", html:
      (d.options||[]).map(o=>`
        <div class="poption ${!open && d.chosenOption===o.label ? 'chosen':''}" data-option="${esc(o.label)}">
          <div class="poption-label">${esc(o.label)}${!open && d.chosenOption===o.label?' · chosen':''}</div>
          ${o.note?`<div class="poption-note">${esc(o.note)}</div>`:""}
        </div>`).join("")}
  ];
  if(open){
    sections.push({title:"Make the call", html:
      `<label class="presolve-label">Why</label>
       <input class="pinput" id="decision-rationale" type="text" placeholder="The reason, in one line — this is the part people forget">
       <p style="font-size:12px; color:var(--ink-faint); margin-top:8px;">Pick an option above, then record it.</p>`});
  } else {
    sections.push({title:"Why", html:`<p style="font-size:13.5px; color:var(--ink-dim); line-height:1.55;">${esc(d.rationale||"")}</p>`
      + (d.decidedDate ? drawerRow("Decided", fmtDate(d.decidedDate+"T12:00:00",{month:'long',day:'numeric',year:'numeric'})) : "")});
  }
  const actions = open ? [`<button class="btn btn-primary btn-block" id="decision-save">Record the decision</button>`] : [];
  return drawerShell(TYPE_ICON.decision, d.title,
    open ? `<span class="status-pill status-yellow"><span class="status-dot"></span>Still open</span>`
         : `<span class="status-pill status-green"><span class="status-dot"></span>${esc(d.chosenOption||"Decided")}</span>`,
    sections, actions);
}


function drawerEmergencyContacts(){
  const list = [contactOf("contact_coordinator"), contactOf("contact_venue_manager"), contactOf("contact_emergency")].filter(Boolean);
  const rowsHtml = list.length ? list.map(c=>`
    <div class="card clickable vcard" data-open-drawer="contact:${c.id}">
      <div class="avatar">${initials(c.name)}</div>
      <div class="vcard-body"><div class="vcard-name">${esc(c.name)}</div><div class="vcard-role">${esc(c.role)}</div></div>
      <div class="vcard-actions">
        ${c.phone ? `<a class="btn btn-sm" href="${telHref(c.phone)}" aria-label="Call ${esc(c.name)}">${ICONS.phone} ${esc(c.phone)}</a>` : `<span class="vcard-meta">Number not yet provided</span>`}
      </div>
    </div>
  `).join("") : `<div class="card empty-state"><div class="empty-state-icon">${ICONS.siren}</div><p>No emergency contacts on file.</p></div>`;
  return `
    <div class="drawer-close-row"><button class="icon-btn" data-drawer-close aria-label="Close">${ICONS.close}</button></div>
    <div class="drawer-hero-icon">${ICONS.siren}</div>
    <div class="drawer-title">Emergency Contacts</div>
    <div class="drawer-subtitle">Call the wedding coordinator or venue. For a medical or safety emergency, call 911.</div>
    <div class="drawer-section" style="display:flex; flex-direction:column; gap:8px;">${rowsHtml}</div>
    <div class="drawer-actions">
      <button class="btn btn-block" data-drawer-nav="directory" data-drawer-nav-section="emergency">${ICONS.users} View All Contacts</button>
    </div>
  `;
}


function wirePhotoGroupSearch(drawer){
  const input = drawer.querySelector("#photo-group-search");
  if(!input) return;
  input.addEventListener("input", ()=>{
    const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let matches = 0;
    drawer.querySelectorAll("[data-photo-search]").forEach(group=>{
      group.hidden = !terms.every(term=>group.getAttribute("data-photo-search").includes(term));
      group.open = terms.length > 0 && !group.hidden;
      if(!group.hidden) matches++;
    });
    const status = drawer.querySelector("[data-photo-search-status]");
    status.hidden = !terms.length;
    status.textContent = matches ? `${matches} matching ${matches === 1 ? "group" : "groups"}` : "No matching groups. Try another name or group number.";
  });
}

function drawerPhotoGroups(){
  const groups = COMBINED_PHOTO_GROUPS.filter(g=>g.count>0);
  const totalPeople = groups.reduce((sum,g)=>sum+g.count, 0);
  return `
    <div class="drawer-close-row"><button class="icon-btn" data-drawer-close aria-label="Close">${ICONS.close}</button></div>
    <div class="drawer-hero-icon">${ICONS.camera}</div>
    <div class="drawer-title">Photo Groups</div>
    <div class="drawer-subtitle">${groups.length} groups · ${totalPeople} people. Tap a group to see who's in it.</div>
    <div class="drawer-section">
      <label for="photo-group-search">Find your photo group</label>
      <input id="photo-group-search" class="photo-group-search" type="search" placeholder="Search by name or group number" autocomplete="off">
      <p data-photo-search-status role="status" aria-live="polite" hidden></p>
      <div class="photo-group-grid">
        ${groups.map(g=>`<details class="photo-group-card" data-photo-search="${esc([g.title, ...g.names].join(" ").toLowerCase())}">
          <summary><span>${esc(photoGroupDisplayTitle(g.title))}</span><span class="photo-group-count">${g.count}</span></summary>
          ${/^Group\s+\d+\s+—\s+/.test(g.title) ? `<p class="photo-group-family"><strong>${esc(g.title.replace(/^Group\s+\d+\s+—\s+/, ""))}</strong></p>` : ""}
          <div class="photo-group-names">${g.names.map(n=>`<span>${esc(n)}</span>`).join("")}</div>
        </details>`).join("")}
      </div>
    </div>
  `;
}


function seatingGuestIndex(){
  const idx = [];
  RECEPTION_SEATING_TABLES.forEach(t=>{
    (t.guests||[]).forEach(name=> idx.push({ name, table: t.number }));
  });
  return idx;
}
function openSeatingDirectory(){
  const overlay = document.getElementById("seating-overlay");
  if(!overlay) return;
  overlay.classList.add("open");
  overlay.removeAttribute("aria-hidden");
  const input = document.getElementById("seating-search-input");
  if(input) input.value = "";
  renderSeatingMatch("");
  renderSeatingTables();
  setTimeout(()=>{ if(input) input.focus(); }, 30);
}
function closeSeatingDirectory(){
  const overlay = document.getElementById("seating-overlay");
  if(!overlay) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  if(document.activeElement && overlay.contains(document.activeElement)) document.activeElement.blur();
}
function renderSeatingMatch(query){
  const el = document.getElementById("seating-match");
  if(!el) return;
  const q = (query||"").trim().toLowerCase();
  if(!q){ el.hidden = true; el.innerHTML = ""; return; }
  el.hidden = false;
  if(!RECEPTION_SEATING_LOADED){
    el.innerHTML = `<div class="seating-match-empty">The seating chart hasn't been loaded into Event Ops Event Operations yet — see the Table list below.</div>`;
    return;
  }
  const matches = seatingGuestIndex().filter(g=>g.name.toLowerCase().includes(q));
  if(!matches.length){
    el.innerHTML = `<div class="seating-match-empty">No guest named "${esc(query)}" found.</div>`;
    return;
  }
  el.innerHTML = matches.slice(0,8).map(m=>`
    <div class="seating-match-row"><span>${esc(m.name)}</span><span class="seating-match-table">Table ${m.table}</span></div>
  `).join("");
}
function receptionFloorPlanHtml(){
  return `<details class="reception-floor-plan"><summary>Reception Table Layout</summary>
    <p>Table locations only. Guest assignments and counts below follow the reception spreadsheet.</p>
    <a href="assets/reception-floor-plan.svg" target="_blank" rel="noopener" aria-label="Open reception table layout full size"><img src="assets/reception-floor-plan.svg" alt="Example Pavilion Ballroom reception floor plan: numbered tables around the central dance floor, with stage and entrances." loading="lazy"></a>
    <a class="btn btn-sm" href="assets/reception-floor-plan.svg" target="_blank" rel="noopener">Open Full-Size Layout</a>
  </details>`;
}

function renderSeatingTables(){
  const container = document.getElementById("seating-tables");
  if(!container) return;
  if(!RECEPTION_SEATING_LOADED){
    container.innerHTML = receptionFloorPlanHtml() + `<div class="seating-empty">The reception seating chart hasn't been loaded into Event Ops Event Operations yet. Once it is, every table will be searchable and browsable right here — no spreadsheet needed.</div>`;
    return;
  }
  
  const tables = RECEPTION_SEATING_TABLES.filter(t=>t.guests.length>0);
  if(!tables.length){
    container.innerHTML = receptionFloorPlanHtml() + `<div class="seating-empty">No tables have guests assigned yet.</div>`;
    return;
  }
  const cards = tables.map(t=>`
    <div class="seating-table-card">
      <div class="seating-table-head"><span class="seating-table-number">Table ${t.number}</span><span class="seating-table-count">${t.guests.length} guest${t.guests.length===1?'':'s'}</span></div>
      <div class="seating-table-guests">
        ${t.guests.map(n=>`<span>${esc(n)}</span>`).join("")}
      </div>
    </div>
  `).join("");
  
  container.innerHTML = receptionFloorPlanHtml() + `<div class="seating-table-grid">${cards}</div>`;
}


function transportDriverFieldsHtml(t){
  const t2 = t || {};
  const vendorOpts = data.vendors.map(v=>`<option value="${v.id}" ${t2.vendorId===v.id?'selected':''}>${esc(v.name)}</option>`).join("");
  const current = t2.vendorId ? "vendor" : (t2.driverName ? "driver" : "");
  return `
    <label class="presolve-label" style="margin-top:14px;">Vendor or driver <span style="font-weight:400; text-transform:none; letter-spacing:0;">— optional</span></label>
    <select class="pinput" id="tr-driver-type">
      <option value="" ${!current?'selected':''}>None</option>
      <option value="vendor" ${current==='vendor'?'selected':''}>Vendor</option>
      <option value="driver" ${current==='driver'?'selected':''}>Driver</option>
    </select>
    <select class="pinput" id="tr-vendor" style="margin-top:8px; display:${current==='vendor'?'':'none'};">${vendorOpts}</select>
    <div id="tr-driver-fields" style="display:${current==='driver'?'flex':'none'}; margin-top:8px; flex-direction:column; gap:8px;">
      <input class="pinput" id="tr-driver-name" type="text" placeholder="Driver name" value="${esc(t2.driverName||"")}">

    </div>
  `;
}
function wireTransportDriverToggle(drawer){
  const sel = drawer.querySelector("#tr-driver-type");
  if(!sel) return;
  sel.addEventListener("change", ()=>{
    drawer.querySelector("#tr-vendor").style.display = sel.value === "vendor" ? "" : "none";
    drawer.querySelector("#tr-driver-fields").style.display = sel.value === "driver" ? "flex" : "none";
  });
}
function readTransportDriverFields(drawer){
  const type = drawer.querySelector("#tr-driver-type").value;
  if(type === "vendor") return { vendorId: drawer.querySelector("#tr-vendor").value, driverName:null, driverPhone:null };
  if(type === "driver") return { vendorId:null, driverName: drawer.querySelector("#tr-driver-name").value||null, driverPhone:null };
  return { vendorId:null, driverName:null, driverPhone:null };
}
function toLocalInputValue(iso){
  if(!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,16);
}


function drawerNewTimelineItem(eventId){
  const e = ev(eventId);
  if(!e) return notFoundDrawer();
  const kindOptions = Object.keys(KIND_META).map(k=>`<option value="${k}">${esc(KIND_META[k].label)}</option>`).join("");
  return `
    <div class="drawer-close-row"><button class="icon-btn" data-drawer-close aria-label="Close">${ICONS.close}</button></div>
    <div class="drawer-hero-icon">${ICONS.timeline}</div>
    <div class="drawer-title">New Timeline Item</div>
    <div class="drawer-subtitle">For ${esc(e.title)}</div>

    <div class="drawer-section">
      <label class="presolve-label">Title</label>
      <input class="pinput" id="nti-title" type="text" placeholder="What's happening">

      <label class="presolve-label" style="margin-top:14px;">Time</label>
      <input class="pinput" id="nti-time" type="datetime-local">

      <label class="presolve-label" style="margin-top:14px;">Kind</label>
      <select class="pinput" id="nti-kind">${kindOptions}</select>

      <label class="presolve-label" style="margin-top:14px;">Who can see this</label>
      <select class="pinput" id="nti-audience">
        <option value="public">Guests</option>
        <option value="internal" selected>Wedding Team</option>
        <option value="ops">Coordinators only</option>
      </select>
    </div>

    <div class="drawer-actions">
      <button class="btn btn-primary btn-block" id="nti-save" data-nti-event="${esc(eventId)}">Add to Timeline</button>
    </div>
  `;
}


function drawerNewTransportation(eventId){
  const e = ev(eventId);
  if(!e) return notFoundDrawer();
  const hotel = data.venues.find(v=>v.kind==="hotel");
  return `
    <div class="drawer-close-row"><button class="icon-btn" data-drawer-close aria-label="Close">${ICONS.close}</button></div>
    <div class="drawer-hero-icon">${ICONS.shuttle}</div>
    <div class="drawer-title">New Shuttle</div>
    <div class="drawer-subtitle">For ${esc(e.title)}${hotel ? " · " + esc(hotel.name) : ""}</div>

    <div class="drawer-section">
      <label class="presolve-label">Direction</label>
      <select class="pinput" id="tr-direction">
        <option value="hotel_to_venue">${hotel ? esc(hotel.name) : "Hotel"} → ${esc(e.title)} (pickup)</option>
        <option value="venue_to_hotel">${esc(e.title)} → ${hotel ? esc(hotel.name) : "Hotel"} (return)</option>
      </select>

      <label class="presolve-label" style="margin-top:14px;">Departure</label>
      <input class="pinput" id="tr-departure" type="datetime-local">

      <label class="presolve-label" style="margin-top:14px;">Expected arrival <span style="font-weight:400; text-transform:none; letter-spacing:0;">— optional</span></label>
      <input class="pinput" id="tr-arrival" type="datetime-local">

      ${transportDriverFieldsHtml(null)}

      <label class="presolve-label" style="margin-top:14px;">Capacity <span style="font-weight:400; text-transform:none; letter-spacing:0;">— optional</span></label>
      <input class="pinput" id="tr-capacity" type="number" min="1" placeholder="Seats">

      <label class="presolve-label" style="margin-top:14px;">Who can see this</label>
      <select class="pinput" id="tr-audience">
        <option value="public">Guests</option>
        <option value="internal">Wedding Team</option>
        <option value="ops">Coordinators only</option>
      </select>

      <label class="presolve-label" style="margin-top:14px;">Guest instructions <span style="font-weight:400; text-transform:none; letter-spacing:0;">— optional</span></label>
      <textarea class="pinput" id="tr-instructions" rows="3" placeholder="Where to gather, what to look for"></textarea>

      <p style="font-size:12px; color:var(--ink-faint); margin-top:10px;">Saves as a draft. Confirm it once the schedule is locked — drafts never show to guests.</p>
    </div>

    <div class="drawer-actions">
      <button class="btn btn-primary btn-block" id="tr-save" data-tr-event="${esc(eventId)}">Save Draft</button>
    </div>
  `;
}


function drawerTransportation(t){
  if(!t) return notFoundDrawer();
  const e = ev(t.eventId);
  const lm = TRANSPORT_LIFECYCLE_META[t.lifecycle] || TRANSPORT_LIFECYCLE_META.draft;
  const sections = [
    {title:"Route", html:
      drawerRow("From", esc(venueOf(t.pickupVenueId)?.name||"TBD")) +
      drawerRow("To", esc(venueOf(t.destinationVenueId)?.name||"TBD")) +
      (e ? drawerRow("Event", `<span class="chip" data-open-drawer="event:${e.id}" style="padding:4px 9px;">${esc(e.title)}</span>`) : "")
    },
    {title:"Schedule", html:
      `<label class="presolve-label">Departure</label>
       <input class="pinput" id="tr-departure" type="datetime-local" value="${toLocalInputValue(t.departureTime)}">
       <label class="presolve-label" style="margin-top:14px;">Expected arrival</label>
       <input class="pinput" id="tr-arrival" type="datetime-local" value="${toLocalInputValue(t.arrivalTime)}">
       ${transportDriverFieldsHtml(t)}
       <label class="presolve-label" style="margin-top:14px;">Capacity</label>
       <input class="pinput" id="tr-capacity" type="number" min="1" value="${t.capacity||""}">
       <label class="presolve-label" style="margin-top:14px;">Who can see this</label>
       <select class="pinput" id="tr-audience">
         <option value="public" ${t.audience==='public'?'selected':''}>Guests</option>
         <option value="internal" ${t.audience==='internal'?'selected':''}>Wedding Team</option>
         <option value="ops" ${t.audience==='ops'?'selected':''}>Coordinators only</option>
       </select>
       <label class="presolve-label" style="margin-top:14px;">Guest instructions</label>
       <textarea class="pinput" id="tr-instructions" rows="3">${esc(t.guestInstructions||"")}</textarea>
       <button class="btn btn-primary btn-block" id="tr-save-edit" style="margin-top:14px;" data-tr-id="${t.id}">Save Changes</button>`
    }
  ];
  const actions = t.lifecycle === "draft"
    ? [`<button class="btn btn-primary btn-block" id="tr-confirm" data-tr-id="${t.id}">Mark Confirmed</button>`]
    : [`<button class="btn btn-block" id="tr-unconfirm" data-tr-id="${t.id}">Revert to Draft</button>`];
  return drawerShell(TYPE_ICON.transportation, transportationLabel(t),
    `<span class="status-pill ${lm.cls}"><span class="status-dot"></span>${lm.label}</span> <span class="drawer-src">${AUDIENCE_META[t.audience]?.label||t.audience}</span>`,
    sections, actions);
}

function drawerNote(id){
  const n = hasPlanning() ? byId(planning.notes, id) : null;
  if(!n) return notFoundDrawer();
  const label = entityLabel(n.entityType, n.entityId);
  return drawerShell(TYPE_ICON.note, "Note", esc(n.createdDate),
    [{title:"Note", html:`<p style="font-size:13.5px; color:var(--ink-dim); line-height:1.55;">${esc(n.body)}</p>`},
     {title:"About", html: label ? `<span class="chip" data-open-drawer="${n.entityType}:${n.entityId}">${esc(label)}</span>` : "—"}], []);
}


function refreshPlanning(reopen){
  renderShell(); renderActiveView();
  if(reopen) openDrawer(reopen.type, reopen.id); else closeDrawer();
}


function wireDayOfDrawer(drawer, type, id){
  if(getPhase() !== "week") return;

  drawer.querySelectorAll("[data-ack-assignment]").forEach(b=>b.addEventListener("click", ()=>{
    acknowledgeAssignment(b.getAttribute("data-ack-assignment"));
    toast("Acknowledged");
    refreshPlanning({type, id});
  }));
  drawer.querySelectorAll("[data-complete-assignment]").forEach(b=>b.addEventListener("click", ()=>{
    completeAssignment(b.getAttribute("data-complete-assignment"));
    toast("Marked done");
    refreshPlanning({type, id});
  }));
  drawer.querySelectorAll("[data-reopen-assignment]").forEach(b=>b.addEventListener("click", ()=>{
    reopenAssignment(b.getAttribute("data-reopen-assignment"));
    toast("Reopened");
    refreshPlanning({type, id});
  }));

  if(type === "vendor"){
    const arrive = drawer.querySelector("#vendor-arrive");
    if(arrive) arrive.addEventListener("click", ()=>{
      markVendorArrived(id); toast("Marked arrived"); refreshPlanning({type, id});
    });
    const unarrive = drawer.querySelector("#vendor-unarrive");
    if(unarrive) unarrive.addEventListener("click", ()=>{
      unmarkVendorArrived(id); toast("Check-in undone"); refreshPlanning({type, id});
    });
  }

  if(type === "timelineItem"){
    const start = drawer.querySelector("#tli-start");
    if(start) start.addEventListener("click", ()=>{
      markItemStarted(id); toast("Marked started"); refreshPlanning({type, id});
    });
    const complete = drawer.querySelector("#tli-complete");
    if(complete) complete.addEventListener("click", ()=>{
      markItemComplete(id); toast("Marked complete"); refreshPlanning({type, id});
    });
    const reopen = drawer.querySelector("#tli-reopen");
    if(reopen) reopen.addEventListener("click", ()=>{
      reopenItem(id); toast("Reopened"); refreshPlanning({type, id});
    });
  }
}

function wirePlanningDrawer(drawer, type, id){
  
  const noteSave = drawer.querySelector("#note-save");
  if(noteSave) noteSave.addEventListener("click", ()=>{
    const inp = drawer.querySelector("#note-input");
    if(!inp.value.trim()) return;
    addNote(type, id, inp.value);
    toast("Note added");
    refreshPlanning({type, id});
  });

  
  if(type === "vendor"){
    const save = drawer.querySelector("#vendor-edit-save");
    if(save) save.addEventListener("click", ()=>{
      setVendorStatus(id, drawer.querySelector("#vendor-edit-status").value);
      setVendorArrival(id, drawer.querySelector("#vendor-edit-arrival").value);
      setVendorLiaison(id, drawer.querySelector("#vendor-edit-liaison").value || null);
      toast("Details saved");
      refreshPlanning({type, id});
    });
  }
  if(type === "venue"){
    const save = drawer.querySelector("#venue-edit-save");
    if(save) save.addEventListener("click", ()=>{
      setVenueAddress(id, drawer.querySelector("#venue-edit-address").value);
      toast("Details saved");
      refreshPlanning({type, id});
    });
  }
  if(type === "event"){
    const save = drawer.querySelector("#event-edit-save");
    if(save) save.addEventListener("click", ()=>{
      const teamIds = [...drawer.querySelectorAll(".event-edit-owner-team:checked")].map(cb=>cb.value);
      setEventOwnerTeams(id, teamIds);
      toast("Details saved");
      refreshPlanning({type, id});
    });
  }
  if(type === "timelineItem"){
    const save = drawer.querySelector("#tli-edit-save");
    if(save) save.addEventListener("click", ()=>{
      const songInput = drawer.querySelector("#tli-edit-song");
      if(songInput) setTimelineItemSong(id, songInput.value);
      const speakerBoxes = drawer.querySelectorAll(".tli-edit-speaker:checked");
      if(speakerBoxes.length || drawer.querySelector(".tli-edit-speaker")){
        setTimelineItemSpeakers(id, [...speakerBoxes].map(cb=>cb.value));
      }
      const primarySel = drawer.querySelector("#tli-edit-primary");
      if(primarySel) setTimelineItemPrimaryAssignee(id, primarySel.value || null);
      toast("Details saved");
      refreshPlanning({type, id});
    });
  }

  if(type === "newTask"){
    const newOwnerSelect = drawer.querySelector("#nt-owner");
    const newOwnerInput = drawer.querySelector("#nt-owner-new");
    const newOwnerToggle = drawer.querySelector("#nt-owner-new-toggle");
    if(newOwnerSelect && newOwnerInput){
      newOwnerSelect.addEventListener("change", ()=>{
        newOwnerInput.style.display = newOwnerSelect.value === "__new__" ? "" : "none";
        if(newOwnerSelect.value === "__new__") newOwnerInput.focus();
      });
      if(newOwnerToggle) newOwnerToggle.addEventListener("click", ()=>{
        newOwnerSelect.value = "__new__";
        newOwnerInput.style.display = "";
        newOwnerInput.focus();
      });
    }
    const typeSel = drawer.querySelector("#nt-entity-type");
    if(typeSel && typeSel.tagName === "SELECT"){
      typeSel.addEventListener("change", ()=>{
        const idSel = drawer.querySelector("#nt-entity-id");
        idSel.innerHTML = entityOptionsFor(typeSel.value);
        idSel.style.display = typeSel.value ? "" : "none";
      });
    }
    
    const scopeEventSel = drawer.querySelector("select#nt-scope-event");
    const scopeRadios = drawer.querySelectorAll('input[name="nt-scope"]');
    const timelineItemSel = drawer.querySelector("select#nt-timeline-item");
    if(scopeEventSel && scopeRadios.length){
      const syncScopeVisibility = ()=>{
        const isEvent = drawer.querySelector("#nt-scope-event-radio")?.checked;
        scopeEventSel.style.display = isEvent ? "" : "none";
        if(timelineItemSel) timelineItemSel.style.display = (isEvent && scopeEventSel.value) ? "" : "none";
      };
      scopeRadios.forEach(r=>r.addEventListener("change", syncScopeVisibility));
      scopeEventSel.addEventListener("change", ()=>{
        if(timelineItemSel){
          const items = scopeEventSel.value ? itemsForEvent(scopeEventSel.value) : [];
          timelineItemSel.innerHTML = `<option value="">No specific timeline moment</option>` +
            items.map(i=>`<option value="${i.id}">${esc(i.title)} · ${fmtTime(i.time)}</option>`).join("");
        }
        syncScopeVisibility();
      });
      syncScopeVisibility();
    }
    const save = drawer.querySelector("#nt-save");
    if(save) save.addEventListener("click", ()=>{
      const title = drawer.querySelector("#nt-title").value;
      if(!title.trim()){ toast("Give it a title"); return; }
      let ownerId = drawer.querySelector("#nt-owner").value || null;
      if(ownerId === "__new__"){
        ownerId = createTaskOwner(drawer.querySelector("#nt-owner-new")?.value);
        if(!ownerId){ toast("Enter the new owner's name"); return; }
      }
      if(!ownerId){ toast("Choose an owner"); return; }

      
      let scope = null, scopeEventId = null, linkedTimelineItemId = null;
      const fixedScopeEl = drawer.querySelector("#nt-scope-event");
      if(fixedScopeEl && fixedScopeEl.tagName !== "SELECT"){
        scopeEventId = fixedScopeEl.value || null;
        linkedTimelineItemId = drawer.querySelector("#nt-timeline-item")?.value || null;
      } else {
        const isEvent = drawer.querySelector("#nt-scope-event-radio")?.checked;
        if(isEvent){
          scopeEventId = drawer.querySelector("select#nt-scope-event")?.value || null;
          if(!scopeEventId){ toast("Choose which event this belongs to"); return; }
          linkedTimelineItemId = drawer.querySelector("select#nt-timeline-item")?.value || null;
        } else {
          scope = "wedding";
        }
      }

      const etypeEl = drawer.querySelector("#nt-entity-type");
      const eidEl = drawer.querySelector("#nt-entity-id");
      const entityType = etypeEl && etypeEl.value ? etypeEl.value : null;
      const entityId = entityType && eidEl && eidEl.value ? eidEl.value : null;
      const newId = createAuthoredTask({
        title, ownerId, scope, scopeEventId, linkedTimelineItemId,
        entityType: entityId ? entityType : null,
        entityId: entityId || null,
        dueDate: drawer.querySelector("#nt-due").value || null,
        detail: drawer.querySelector("#nt-detail").value || ""
      });
      if(!newId) return;
      toast("Task added");
      const ret = save.getAttribute("data-nt-return");
      if(ret){ const c = ret.indexOf(":"); refreshPlanning({type: ret.slice(0,c), id: ret.slice(c+1)}); }
      else refreshPlanning(null);
    });
    return;
  }
  if(type === "newTransportation"){
    wireTransportDriverToggle(drawer);
    const save = drawer.querySelector("#tr-save");
    if(save) save.addEventListener("click", ()=>{
      const departure = drawer.querySelector("#tr-departure").value;
      if(!departure){ toast("Set a departure time"); return; }
      const eventId = save.getAttribute("data-tr-event");
      const e = ev(eventId);
      const hotel = data.venues.find(v=>v.kind==="hotel");
      const direction = drawer.querySelector("#tr-direction").value;
      const pickupVenueId = direction === "hotel_to_venue" ? (hotel && hotel.id) : (e && e.venueId);
      const destinationVenueId = direction === "hotel_to_venue" ? (e && e.venueId) : (hotel && hotel.id);
      const driverFields = readTransportDriverFields(drawer);
      const arrival = drawer.querySelector("#tr-arrival").value;
      createTransportation({
        direction, eventId, pickupVenueId, destinationVenueId,
        departureTime: new Date(departure).toISOString(),
        arrivalTime: arrival ? new Date(arrival).toISOString() : null,
        ...driverFields,
        capacity: drawer.querySelector("#tr-capacity").value || null,
        audience: drawer.querySelector("#tr-audience").value,
        guestInstructions: drawer.querySelector("#tr-instructions").value || null
      });
      toast("Draft saved");
      refreshPlanning(null);
    });
    return;
  }
  if(type === "newTimelineItem"){
    const save = drawer.querySelector("#nti-save");
    if(save) save.addEventListener("click", ()=>{
      const title = drawer.querySelector("#nti-title").value.trim();
      const timeVal = drawer.querySelector("#nti-time").value;
      if(!title){ toast("Give it a title"); return; }
      if(!timeVal){ toast("Set a time"); return; }
      const eventId = save.getAttribute("data-nti-event");
      const newId = createTimelineItem({
        eventId, title,
        time: new Date(timeVal).toISOString(),
        kind: drawer.querySelector("#nti-kind").value,
        audience: drawer.querySelector("#nti-audience").value
      });
      if(!newId) return;
      toast("Added to timeline");
      refreshPlanning(null);
    });
    return;
  }
  if(type === "transportation"){
    wireTransportDriverToggle(drawer);
    const saveEdit = drawer.querySelector("#tr-save-edit");
    if(saveEdit) saveEdit.addEventListener("click", ()=>{
      const departure = drawer.querySelector("#tr-departure").value;
      if(!departure){ toast("Set a departure time"); return; }
      const arrival = drawer.querySelector("#tr-arrival").value;
      const capVal = drawer.querySelector("#tr-capacity").value;
      updateTransportation(id, {
        departureTime: new Date(departure).toISOString(),
        arrivalTime: arrival ? new Date(arrival).toISOString() : null,
        ...readTransportDriverFields(drawer),
        capacity: capVal ? Number(capVal) : null,
        audience: drawer.querySelector("#tr-audience").value,
        guestInstructions: drawer.querySelector("#tr-instructions").value || null
      });
      toast("Saved");
      refreshPlanning({type:"transportation", id});
    });
    const confirmBtn = drawer.querySelector("#tr-confirm");
    if(confirmBtn) confirmBtn.addEventListener("click", ()=>{
      setTransportationLifecycle(id, "confirmed"); toast("Confirmed"); refreshPlanning({type:"transportation", id});
    });
    const unconfirmBtn = drawer.querySelector("#tr-unconfirm");
    if(unconfirmBtn) unconfirmBtn.addEventListener("click", ()=>{
      setTransportationLifecycle(id, "draft"); toast("Reverted to draft"); refreshPlanning({type:"transportation", id});
    });
    return;
  }
  if(type === "task"){
    const t = taskById(id);
    if(!t) return;
    const done = drawer.querySelector("#task-done");
    if(done) done.addEventListener("click", ()=>{
      setAuthoredTaskStatus(id, "done"); toast("Closed"); refreshPlanning(null);
    });
    const reopen = drawer.querySelector("#task-reopen");
    if(reopen) reopen.addEventListener("click", ()=>{
      setAuthoredTaskStatus(id, "open"); toast("Reopened"); refreshPlanning({type:"task", id});
    });
    
    const scopeEventEditSel = drawer.querySelector("#task-scope-event-edit");
    const scopeEditRadios = drawer.querySelectorAll('input[name="task-scope-edit"]');
    const momentEditSel = drawer.querySelector("#task-moment-edit");
    if(scopeEventEditSel && scopeEditRadios.length){
      const syncScopeEditVisibility = ()=>{
        const isEvent = drawer.querySelector("#task-scope-event-radio")?.checked;
        scopeEventEditSel.style.display = isEvent ? "" : "none";
        if(momentEditSel) momentEditSel.style.display = (isEvent && scopeEventEditSel.value) ? "" : "none";
      };
      scopeEditRadios.forEach(r=>r.addEventListener("change", syncScopeEditVisibility));
      scopeEventEditSel.addEventListener("change", ()=>{
        if(momentEditSel){
          const items = scopeEventEditSel.value ? itemsForEvent(scopeEventEditSel.value) : [];
          momentEditSel.innerHTML = `<option value="">No specific timeline moment</option>` +
            items.map(i=>`<option value="${i.id}">${esc(i.title)} · ${fmtTime(i.time)}</option>`).join("");
        }
        syncScopeEditVisibility();
      });
    }
    const ownerEditSel = drawer.querySelector("#task-owner-edit");
    const ownerEditNew = drawer.querySelector("#task-owner-new-edit");
    const ownerEditToggle = drawer.querySelector("#task-owner-new-toggle");
    if(ownerEditSel && ownerEditNew){
      ownerEditSel.addEventListener("change", ()=>{
        ownerEditNew.style.display = ownerEditSel.value === "__new__" ? "" : "none";
        if(ownerEditSel.value === "__new__") ownerEditNew.focus();
      });
      if(ownerEditToggle) ownerEditToggle.addEventListener("click", ()=>{
        ownerEditSel.value = "__new__";
        ownerEditNew.style.display = "";
        ownerEditNew.focus();
      });
    }
    const detailsSave = drawer.querySelector("#task-details-save");
    if(detailsSave) detailsSave.addEventListener("click", ()=>{
      const ownerSel = drawer.querySelector("#task-owner-edit");
      const dueInput = drawer.querySelector("#task-due-edit");
      const fields = {};
      if(ownerSel){
        fields.ownerId = ownerSel.value || null;
        if(fields.ownerId === "__new__"){
          fields.ownerId = createTaskOwner(ownerEditNew?.value);
          if(!fields.ownerId){ toast("Enter the new owner's name"); return; }
        }
      }
      if(dueInput) fields.dueDate = dueInput.value || null;
      
      const isEventScope = drawer.querySelector("#task-scope-event-radio")?.checked;
      if(isEventScope){
        const chosenEventId = scopeEventEditSel?.value || "";
        if(!chosenEventId){ toast("Choose which event this belongs to"); return; }
        fields.scopeEventId = chosenEventId;
        fields.linkedTimelineItemId = momentEditSel?.value || null;
      } else {
        fields.scopeEventId = null;
        fields.linkedTimelineItemId = null;
      }
      if(updateAuthoredTaskDetails(id, fields)){
        toast("Saved");
        refreshPlanning({type:"task", id});
      }
    });
  }
  if(type === "decision"){
    const d = decisionOf(id);
    if(!d || d.status !== "open") return;
    let chosen = null;
    drawer.querySelectorAll("[data-option]").forEach(o=>o.addEventListener("click", ()=>{
      drawer.querySelectorAll("[data-option]").forEach(x=>x.classList.remove("picked"));
      o.classList.add("picked");
      chosen = o.getAttribute("data-option");
    }));
    const save = drawer.querySelector("#decision-save");
    if(save) save.addEventListener("click", ()=>{
      if(!chosen){ toast("Pick an option first"); return; }
      const why = drawer.querySelector("#decision-rationale").value;
      if(!why.trim()){ toast("Record why — that is the point"); return; }
      decideDecision(id, chosen, why.trim());
      toast("Decision recorded");
      refreshPlanning(null);
    });
  }
}

function notFoundDrawer(){
  return `<div class="drawer-close-row"><button class="icon-btn" data-drawer-close>${ICONS.close}</button></div><p style="margin-top:20px; color:var(--ink-faint);">This item couldn't be found.</p>`;
}


function enterTeamApp(){
  renderShell();
  renderActiveView();
}



function wireGlobalEvents(){
  document.getElementById("search-close-btn").addEventListener("click", closeSearch);
  document.getElementById("search-overlay").addEventListener("click", (e)=>{ if(e.target.id === "search-overlay") closeSearch(); });
  document.getElementById("search-input").addEventListener("input", (e)=>{
    state.searchQuery = e.target.value;
    renderSearchResults(state.searchQuery);
  });
  document.getElementById("drawer-overlay").addEventListener("click", closeDrawer);
  
  const seatingOverlay = document.getElementById("seating-overlay");
  if(seatingOverlay){
    const seatingClose = document.getElementById("seating-close-btn");
    if(seatingClose) seatingClose.addEventListener("click", closeSeatingDirectory);
    seatingOverlay.addEventListener("click", (e)=>{ if(e.target.id === "seating-overlay") closeSeatingDirectory(); });
    const seatingInput = document.getElementById("seating-search-input");
    if(seatingInput) seatingInput.addEventListener("input", (e)=> renderSeatingMatch(e.target.value));
  }
  document.addEventListener("click", (e)=>{
    const trigger = e.target.closest && e.target.closest("[data-open-seating]");
    if(!trigger) return;
    e.stopPropagation();
    closeDrawer();
    closeSearch();
    openSeatingDirectory();
  });
  document.addEventListener("keydown", (e)=>{
    const isK = (e.key === "k" || e.key === "K");
    if((e.metaKey || e.ctrlKey) && isK){
      e.preventDefault();
      const searchOpen = document.getElementById("search-overlay").classList.contains("open");
      if(searchOpen) closeSearch(); else openSearch();
    }
    if(e.key === "Escape"){
      closeSearch();
      closeDrawer();
      closeSeatingDirectory();
    }
  });
}


function boot(){
  loadPersisted();
  wireGlobalEvents();
  enterTeamApp();


  setInterval(()=>{

    applyOpsTheme();
    if(document.getElementById("drawer").classList.contains("open") ||
       document.getElementById("search-overlay").classList.contains("open") ||
       document.getElementById("seating-overlay")?.classList.contains("open")) return;
    if(state.planningMode && state.view === "mission") renderMissionControl();
    if(state.planningMode && state.view === "timeline"){
      const pane = document.getElementById("view-timeline");
      if(!pane || pane.querySelector("input:focus,textarea:focus,select:focus")) return;
      const controls = [...pane.querySelectorAll("button,a,summary")];
      const focusedIndex = controls.indexOf(document.activeElement);
      const openPhases = [...pane.querySelectorAll("details")].map(d=>d.open);
      renderTimeline();
      pane.querySelectorAll("details").forEach((d,i)=>{ if(i < openPhases.length) d.open = openPhases[i]; });
      if(focusedIndex >= 0) pane.querySelectorAll("button,a,summary")[focusedIndex]?.focus({preventScroll:true});
    }
  }, 30000);
}

document.addEventListener("DOMContentLoaded", boot);
})();
