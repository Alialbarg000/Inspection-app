/* ================================================================
   SANSOON YACHT SERVICES — Marine Survey Pro v5
   script.js  |  Mobile Search Toggle · Color Swatch Markup · 3-Tier Layout
================================================================ */
'use strict';

// ── COMPANY LOGO — paste your real Base64 string here ─────────
const COMPANY_LOGO_BASE64 = 'PLACEHOLDER_LOGO_BASE64';

const COMPANY_NAME     = "SANSOON YACHT SERVICES";
const LEGAL_DISCLAIMER = "IMPORTANT — LIABILITY DISCLAIMER: This report has been prepared solely for the use of the client named herein and is based on the surveyor's visual examination of the vessel at the time and place indicated. This survey is not a guarantee or warranty of the vessel's condition, seaworthiness, or fitness for any particular purpose. The surveyor's findings are the professional opinion of the surveyor based on conditions observed and accessible at the time of inspection. Sansoon Yacht Services and its surveyors shall not be liable for any loss, damage, or injury arising from reliance on this report beyond the survey fee paid. © " + new Date().getFullYear() + " Sansoon Yacht Services. All rights reserved.";

// ── QUICK INSERT ──────────────────────────────────────────────
const LS_KEY = 'sansoon_quick_insert_v1';
let quickInsertLibrary = [];

function loadQuickInsert() {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) quickInsertLibrary = JSON.parse(raw); }
  catch(e) { quickInsertLibrary = []; }
}
function saveQuickInsert() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(quickInsertLibrary)); } catch(e) {}
}
function addToQuickInsert(phrase) {
  const trimmed = phrase.trim();
  if (!trimmed || quickInsertLibrary.includes(trimmed)) return false;
  quickInsertLibrary.unshift(trimmed);
  if (quickInsertLibrary.length > 80) quickInsertLibrary.length = 80;
  saveQuickInsert(); return true;
}
function deleteQuickInsert(idx) {
  quickInsertLibrary.splice(idx, 1);
  saveQuickInsert(); renderQuickInsertList();
}

// ───────────────────────────────────────────────────────────────
// §1  CHECKLIST DATABASE
// ───────────────────────────────────────────────────────────────
const DB = [
  {
    id:'vessel-id', label:'Vessel ID & Docs', icon:'📋',
    subcategories:[
      { id:'vid-reg', label:'Registration & Documentation', items:[
        {id:'vd01',label:'Hull Identification Number (HIN) — present, legible, matches title'},
        {id:'vd02',label:'State registration or USCG documentation number displayed correctly'},
        {id:'vd03',label:'Builder\'s plate — present, legible, data consistent with vessel'},
        {id:'vd04',label:'Certificate of documentation or state title — on board, unencumbered'},
        {id:'vd05',label:'Year of manufacture confirmed consistent across all documentation'},
        {id:'vd06',label:'LOA, beam, and draft confirmed consistent with listed specifications'},
        {id:'vd07',label:'Insurance certificate — current, adequate coverage, on board'},
        {id:'vd08',label:'MARPOL placard — posted if vessel 26 ft or longer'},
        {id:'vd09',label:'Sewage discharge placard — posted in head compartment'},
        {id:'vd10',label:'Capacity plate (USCG) — present, legible, not exceeded'},
      ]},
      { id:'vid-survey', label:'Survey Conditions', items:[
        {id:'vs01',label:'Sea trial conducted — speed, maneuverability, steering response recorded'},
        {id:'vs02',label:'Vessel afloat or on the hard — noted in report with inspection limitations'},
        {id:'vs03',label:'Engine(s) operated under load — RPM, temperature, and duration recorded'},
        {id:'vs04',label:'Moisture meter readings taken — reference readings logged by location'},
        {id:'vs05',label:'Sounding hammer used throughout hull, deck, and structural members'},
      ]},
    ]
  },
  {
    id:'hull-exterior', label:'Hull Exterior', icon:'⚓',
    subcategories:[
      { id:'hx-bottom', label:'Bottom & Topsides', items:[
        {id:'hx01',label:'Antifouling paint — coverage, condition, appropriate type for use'},
        {id:'hx02',label:'Osmotic blistering — pattern (isolated/widespread), depth, moisture content'},
        {id:'hx03',label:'Gelcoat — crazing, star cracking, impact damage, stress fractures'},
        {id:'hx04',label:'Hull laminate — delamination detected by tap test, moisture meter readings'},
        {id:'hx05',label:'Hull fairness — hard spots, unfair sections, repaired areas visible'},
        {id:'hx06',label:'Boot stripe and waterline tape — adhesion, condition, alignment'},
        {id:'hx07',label:'Topsides paint or gelcoat — oxidation, scratches, patches, fading'},
        {id:'hx08',label:'Hull-to-deck joint — sealant integrity, fastener condition, no separation'},
        {id:'hx09',label:'Bow section — impact damage, abrasion, laminate condition'},
        {id:'hx10',label:'Stern section — impact damage, transom firmness, no delamination'},
        {id:'hx11',label:'Keel — attachment, garboard seam condition, weeping bolt holes, no offset'},
        {id:'hx12',label:'Keel fairing compound — condition, cracks, disbondment'},
        {id:'hx13',label:'Rub rails and fendering — secured, undamaged, end caps present'},
      ]},
      { id:'hx-thru', label:'Through-Hull Fittings', items:[
        {id:'ht01',label:'All through-hull fittings identified, counted, and charted on plan'},
        {id:'ht02',label:'Through-hull material — bronze or Marelon (no plastic, no gate valves below waterline)'},
        {id:'ht03',label:'Seacock operation — full open/close cycle completed without excessive force'},
        {id:'ht04',label:'Seacock backing plates — present, correct material, bedded properly'},
        {id:'ht05',label:'Depth sounder / speed transducer fittings — condition, fairing, sealant'},
        {id:'ht06',label:'Exhaust through-hull — no erosion, no discoloration, flapper valve present'},
        {id:'ht07',label:'Cockpit drain through-hulls — seacocks present, double-clamped hoses'},
        {id:'ht08',label:'AC discharge — seacock, hose condition, no chafe'},
        {id:'ht09',label:'Bilge pump discharge — one-way flap valve present, hose condition'},
        {id:'ht10',label:'Hull zinc anodes — consumption level (flag if >50% consumed), bonding wire'},
      ]},
    ]
  },
  {
    id:'deck-structure', label:'Deck & Hardware', icon:'🏗️',
    subcategories:[
      { id:'dk-surface', label:'Deck Surface & Coring', items:[
        {id:'dk01',label:'Non-skid surface — condition, wear, cracking, tripping hazards'},
        {id:'dk02',label:'Deck coring — delamination by tap test around all high-load fittings'},
        {id:'dk03',label:'Deck moisture readings — elevated readings logged with location'},
        {id:'dk04',label:'Cockpit sole — firmness, drainage, no soft spots underfoot'},
        {id:'dk05',label:'Cockpit drainage — drain rate, no pooling, seacocks present'},
        {id:'dk06',label:'Cockpit seat lids — hinges, seals, drainage, structural integrity'},
        {id:'dk07',label:'Swim platform — attachment bolts, structural integrity, non-skid'},
        {id:'dk08',label:'Transom firmness — tap test, moisture readings, no soft spots'},
        {id:'dk09',label:'Anchor locker — condition, drainage, structural integrity'},
      ]},
      { id:'dk-hardware', label:'Deck Hardware & Fittings', items:[
        {id:'dh01',label:'Cleats — backing plates present, fasteners tight, no gelcoat cracking at base'},
        {id:'dh02',label:'Chocks and fairleads — condition, no sharp edges, secure to deck'},
        {id:'dh03',label:'Stanchion bases — tight, no coring soft spots, backing plates verified'},
        {id:'dh04',label:'Lifelines — wire diameter, swage integrity, pelican hooks, sag check'},
        {id:'dh05',label:'Bow pulpit — fasteners, no cracks at base, height code compliant'},
        {id:'dh06',label:'Stern pulpit — fasteners, no cracks at base, gate operation functional'},
        {id:'dh07',label:'Hatches — seals, hinges, dogs, plexiglass condition, drainage channels'},
        {id:'dh08',label:'Portlights and opening windows — seals, scratches, crazing, operation'},
        {id:'dh09',label:'Dorade vents — drain function, screens present, cowl condition'},
        {id:'dh10',label:'Compass — mounting secure, deviation card present, lighting operational'},
        {id:'dh11',label:'Windlass/capstan — motor, clutch, chain counter, breaker/fuse, deck plate'},
        {id:'dh12',label:'Winches — operation, self-tailer function, service interval, pawl function'},
        {id:'dh13',label:'Mast boot and deck plate — sealant condition, no cracking or lifting'},
        {id:'dh14',label:'Bimini/dodger — frame condition, fabric UV degradation, zipper function'},
        {id:'dh15',label:'Boarding ladder — condition, security, deployment mechanism, drain'},
      ]},
    ]
  },
  {
    id:'rig-spars', label:'Rig & Sails', icon:'⛵',
    subcategories:[
      { id:'rg-standing', label:'Standing Rigging', items:[
        {id:'rg01',label:'Wire rigging age — date stamps checked, flag if >10 years or unknown'},
        {id:'rg02',label:'Wire condition — broken strands, kinks, fishhooks, corrosion pitting'},
        {id:'rg03',label:'Swage terminals — cracking, corrosion staining, pull test resistance'},
        {id:'rg04',label:'Toggle fittings — toggle pins, cotter pins or rings present and spread'},
        {id:'rg05',label:'Turnbuckles — condition, thread engagement, locking mechanisms secure'},
        {id:'rg06',label:'Chainplates — visible section condition, backing plates, sealant at deck'},
        {id:'rg07',label:'Chainplate area (interior) — staining, corrosion weeping, sealant failure'},
        {id:'rg08',label:'Forestay and furler — wire condition, drum bearing, foil alignment'},
        {id:'rg09',label:'Backstay — wire, tensioner or adjuster, terminal fittings'},
        {id:'rg10',label:'Spreaders — angle, condition, boots/covers, attachment hardware'},
      ]},
      { id:'rg-running', label:'Spars & Running Rigging', items:[
        {id:'rs01',label:'Mast extrusion — corrosion, dents, alignment, exit box condition'},
        {id:'rs02',label:'Mast sheaves — condition, lubrication, cheek blocks at exits'},
        {id:'rs03',label:'Masthead — crane, sheaves, anchor light, wind instrument mount'},
        {id:'rs04',label:'Boom — extrusion condition, vang attachment, outhaul, reefing hardware'},
        {id:'rs05',label:'Halyards — condition, clutch/jamcleat function, dead end securing'},
        {id:'rs06',label:'Sheets — diameter, condition, chafe at fairleads, stopper knots'},
        {id:'rs07',label:'Reefing system — lines, hooks or slab points, clewring condition'},
      ]},
      { id:'rg-sails', label:'Sails & Canvas', items:[
        {id:'sl01',label:'Mainsail — leech and luff condition, UV degradation, batten pockets'},
        {id:'sl02',label:'Headsail — luff tape, hanks or furling foil fit, clew patch condition'},
        {id:'sl03',label:'UV covers on furled headsail — stitching, coverage, fading'},
        {id:'sl04',label:'Sail bag stowage — accessible, properly labeled, no mold/mildew'},
      ]},
    ]
  },
  {
    id:'cabin-interior', label:'Cabin & Interior', icon:'🛖',
    subcategories:[
      { id:'ci-structure', label:'Structural Elements', items:[
        {id:'ci01',label:'Main structural bulkheads — tabbing intact, no delamination, no crack propagation'},
        {id:'ci02',label:'Partial bulkheads and furniture structures — fastening, moisture staining'},
        {id:'ci03',label:'Cabin sole condition — water damage, rot, soft areas, panel fit'},
        {id:'ci04',label:'Cabin sole hatches — fit, fasteners, labels, access clearance'},
        {id:'ci05',label:'Keel bolts (interior) — nut/washer condition, staining, corrosion'},
        {id:'ci06',label:'Structural floors — tabbing to hull, no cracking or disbonding'},
        {id:'ci07',label:'Chainplate knees (interior side) — condition, staining, weeping'},
      ]},
      { id:'ci-accommodation', label:'Accommodation & Finish', items:[
        {id:'ca01',label:'Headliner — condition, staining as leak evidence, fasteners secure'},
        {id:'ca02',label:'Cabinetry — hardware, latches adequate for seaway use, doors secure'},
        {id:'ca03',label:'Joinery varnish/oil finish — condition, swelling, delamination'},
        {id:'ca04',label:'Cushions/upholstery — mildew, foam condition, cover integrity'},
        {id:'ca05',label:'Berths — structure, lee cloths or boards present and load-rated'},
        {id:'ca06',label:'Navigation station — structure, chart table, instrument visibility'},
        {id:'ca07',label:'Galley — stove mounting, fiddle rails, drainage, counter condition'},
        {id:'ca08',label:'Ice box/refrigeration — insulation, drain, compressor or holding plate'},
      ]},
      { id:'ci-ventilation', label:'Ventilation & Access', items:[
        {id:'cv01',label:'Opening hatches — operation, seals, safety straps or wire lanyards'},
        {id:'cv02',label:'Dorade/fixed ventilation — cowls operational, screens present'},
        {id:'cv03',label:'Companionway — drop boards secure, washboard condition'},
        {id:'cv04',label:'Emergency escape hatch — operable from interior, labeled, unobstructed'},
        {id:'cv05',label:'LPG locker ventilation — drain to cockpit, sealed from interior'},
      ]},
    ]
  },
  {
    id:'engine-mechanical', label:'Engine & Mechanical', icon:'⚙️',
    subcategories:[
      { id:'en-engine', label:'Main Engine', items:[
        {id:'en01',label:'Engine make, model, hours — recorded from hour meter'},
        {id:'en02',label:'Engine mounts — condition, alignment, no excessive vibration'},
        {id:'en03',label:'Raw water cooling — impeller interval, strainer, hose condition'},
        {id:'en04',label:'Freshwater cooling — level, hose condition, clamps, thermostat'},
        {id:'en05',label:'Oil level and condition — color, level, no milky appearance'},
        {id:'en06',label:'Transmission fluid — level, condition, shifting action'},
        {id:'en07',label:'Fuel system — tank, lines, filters, water separator, shutoff'},
        {id:'en08',label:'Exhaust system — wet exhaust hose, waterlock, no leaks or burns'},
        {id:'en09',label:'Zincs on shaft and prop — consumption level, bonding continuity'},
        {id:'en10',label:'Shaft seal — dripless or stuffing box, condition, adjustment'},
      ]},
      { id:'en-drive', label:'Drive & Controls', items:[
        {id:'ed01',label:'Propeller — blade condition, pitch, hub zinc, no cavitation damage'},
        {id:'ed02',label:'Shaft — straightness, cutlass bearing condition, no vibration'},
        {id:'ed03',label:'Engine controls — throttle and shift cables, no binding or slack'},
        {id:'ed04',label:'Steering system — play, cable/hydraulic condition, rudder free movement'},
        {id:'ed05',label:'Emergency tiller — present, accessible, fits rudder head'},
      ]},
    ]
  },
  {
    id:'electrical', label:'Electrical Systems', icon:'⚡',
    subcategories:[
      { id:'el-dc', label:'DC Systems', items:[
        {id:'el01',label:'Battery bank — age, state of charge, terminal condition, secure'},
        {id:'el02',label:'Battery switches — type, labeling, accessible, all positions functional'},
        {id:'el03',label:'Shore power inlet — condition, polarity indicator, ELCI breaker'},
        {id:'el04',label:'DC panel — breakers labeled, no corrosion, cover secure'},
        {id:'el05',label:'Bilge pump — automatic float switch, manual override, fuse/breaker'},
        {id:'el06',label:'Running lights — port, starboard, stern, masthead all functional'},
        {id:'el07',label:'Anchor light — functional, visible 360°'},
        {id:'el08',label:'Wiring — marine grade, no automotive wire, no splices under water line'},
        {id:'el09',label:'Bonding system — continuity, zincs connected, no stray current path'},
      ]},
      { id:'el-ac', label:'AC & Charging', items:[
        {id:'ea01',label:'Shore power cord — condition, plug type, amperage rating'},
        {id:'ea02',label:'AC panel — breakers labeled, GFCI protection in wet areas'},
        {id:'ea03',label:'Battery charger — output, connection, ventilation'},
        {id:'ea04',label:'Inverter — rating, DC disconnect, ventilation, fusing'},
        {id:'ea05',label:'Generator (if fitted) — hours, exhaust routing, CO risk assessment'},
        {id:'ea06',label:'Solar panels (if fitted) — mounting, wiring, controller condition'},
        {id:'ea07',label:'Wind generator (if fitted) — blades, furling, wiring, mounting'},
      ]},
    ]
  },
  {
    id:'safety-equipment', label:'Safety & Gear', icon:'🦺',
    subcategories:[
      { id:'sf-personal', label:'Personal Safety', items:[
        {id:'sf01',label:'PFDs — one per person, USCG-approved type, condition, accessible'},
        {id:'sf02',label:'Throwable device (Type IV) — present, accessible, line attached'},
        {id:'sf03',label:'Harnesses and tethers — quantity, condition, adjustment, clips'},
        {id:'sf04',label:'EPIRB — registration current, battery expiry date, bracket type'},
        {id:'sf05',label:'Personal AIS/PLB — present, registered, battery date'},
      ]},
      { id:'sf-distress', label:'Distress & Fire', items:[
        {id:'sd01',label:'Visual distress signals — USCG-approved, quantity, not expired'},
        {id:'sd02',label:'VHF radio — DSC-capable, MMSI programmed, DSC distress tested'},
        {id:'sd03',label:'Fire extinguishers — quantity, rating, service date, accessible'},
        {id:'sd04',label:'Fixed fire suppression (engine room) — type, service date, indicator'},
        {id:'sd05',label:'Smoke/CO detectors — present, tested, battery check'},
        {id:'sd06',label:'Life raft — type, capacity, service date, hydrostatic release'},
        {id:'sd07',label:'Emergency bag / ditch bag — contents, accessibility, floatability'},
        {id:'sd08',label:'Flare kit — quantity, type, expiry date, accessible and labeled'},
      ]},
    ]
  },
  {
    id:'plumbing', label:'Plumbing & Bilge', icon:'🚿',
    subcategories:[
      { id:'pl-fresh', label:'Fresh Water System', items:[
        {id:'pl01',label:'Fresh water tank — capacity, fill deck fitting, vent, material'},
        {id:'pl02',label:'Pressure pump — operation, pressure switch, accumulator tank'},
        {id:'pl03',label:'Hot water heater — type (engine/electric/both), anode condition, pressure relief'},
        {id:'pl04',label:'Watermaker (if fitted) — membrane, filters, flushing protocol'},
        {id:'pl05',label:'Faucets and fixtures — operation, hot/cold, drain condition'},
      ]},
      { id:'pl-waste', label:'Waste & Bilge', items:[
        {id:'pw01',label:'Holding tank — capacity, vent, deck pumpout fitting, macerator'},
        {id:'pw02',label:'Head — operation, hoses (no-stink type), Y-valve in correct position'},
        {id:'pw03',label:'Bilge — water present (record depth), odor, staining evidence'},
        {id:'pw04',label:'Bilge pump (manual) — present, functional, accessible'},
        {id:'pw05',label:'Bilge alarm — tested, sensor position at correct height'},
        {id:'pw06',label:'Fuel in bilge — presence, odor, source investigation'},
      ]},
    ]
  },
  {
    id:'nav-electronics', label:'Nav & Electronics', icon:'🧭',
    subcategories:[
      { id:'nv-instruments', label:'Navigation Instruments', items:[
        {id:'nv01',label:'GPS/Chartplotter — function, charts current, transducer'},
        {id:'nv02',label:'Depth sounder — function, calibration offset'},
        {id:'nv03',label:'Knotmeter/log — function, impeller clean'},
        {id:'nv04',label:'Wind instruments — function, masthead unit secure'},
        {id:'nv05',label:'Compass — deviation card, lighting, mounting secure'},
        {id:'nv06',label:'Radar (if fitted) — function, mount condition, power draw'},
        {id:'nv07',label:'AIS transponder — Class B, MMSI, antenna, function test'},
        {id:'nv08',label:'Autopilot — drive unit, controller, hydraulic or mechanical condition'},
      ]},
      { id:'nv-comm', label:'Communications', items:[
        {id:'nc01',label:'VHF fixed mount — DSC, MMSI, antenna, wiring'},
        {id:'nc02',label:'SSB/HAM radio (if fitted) — condition, ground plate, tuner'},
        {id:'nc03',label:'Satellite phone/communicator — subscription current, antenna'},
        {id:'nc04',label:'NOAA weather radio — reception, alarm function'},
      ]},
    ]
  },
  {
    id:'anchoring', label:'Anchoring & Docking', icon:'⚓',
    subcategories:[
      { id:'an-ground', label:'Ground Tackle', items:[
        {id:'an01',label:'Primary anchor — type, weight, appropriate for vessel size'},
        {id:'an02',label:'Anchor chain — length, size, condition, galvanizing, marked at intervals'},
        {id:'an03',label:'Anchor rode — length, diameter, condition, secured to bow cleat'},
        {id:'an04',label:'Windlass — operation, chain counter, manual override, deck wash'},
        {id:'an05',label:'Secondary anchor — type, weight, accessible, rode attached'},
        {id:'an06',label:'Anchor stowage — secured on bow roller, no chafe on deck fittings'},
      ]},
      { id:'an-docking', label:'Docking & Mooring', items:[
        {id:'dk01x',label:'Dock lines — minimum 4 lines, diameter, length, condition, chafe gear'},
        {id:'dk02x',label:'Fenders — quantity (minimum 4), size appropriate for vessel, condition'},
        {id:'dk03x',label:'Boathook — present, functional, length appropriate'},
      ]},
    ]
  },
  {
    id:'misc-systems', label:'Misc & Spares', icon:'🔩',
    subcategories:[
      { id:'ms-mechanical', label:'Additional Mechanical', items:[
        {id:'ms01',label:'Air conditioning (if fitted) — seacock, raw water pump, thermostat, drain'},
        {id:'ms02',label:'Heating system (if fitted) — fuel type, combustion air, CO risk, condition'},
        {id:'ms03',label:'Swim ladder — deployment, securing, non-skid, drain'},
        {id:'ms04',label:'Dinghy/tender — condition, registration, painter, oars'},
      ]},
      { id:'ms-misc', label:'Tools, Spares & Documentation', items:[
        {id:'gn01',label:'Tool kit on board — appropriate for offshore self-sufficiency'},
        {id:'gn02',label:'Spare parts inventory — impeller, filters, belts, bulbs, fuses'},
        {id:'gn03',label:'Damage control equipment — softwood plugs at all through-hulls, taped'},
        {id:'gn04',label:'Charts and pilot books — current edition, coverage for cruising area'},
        {id:'gn05',label:'Operator manuals — engine, electronics, safety equipment on board'},
        {id:'gn06',label:'Vessel logbook — maintained, records up to date'},
      ]},
    ]
  },
  {
    id:'lpg-system', label:'LPG / Cooking', icon:'🔥',
    subcategories:[
      { id:'lp-locker', label:'LPG Locker & Supply', items:[
        {id:'lp01',label:'LPG locker — overboard drain only, no through-connections to interior'},
        {id:'lp02',label:'Cylinder — type, date stamp, pressure relief valve present'},
        {id:'lp03',label:'Regulator — date of manufacture, condition, rated for installed system'},
        {id:'lp04',label:'LPG hose — age, approved marine type, no kinks or abrasion'},
        {id:'lp05',label:'Solenoid shut-off valve — operation, panel switch labeled, fails-closed'},
        {id:'lp06',label:'LPG detector/alarm — sensor at low point in bilge, test functional'},
      ]},
      { id:'lp-stove', label:'Cooking Appliance', items:[
        {id:'ls01',label:'Stove gimbaling — free movement, safety pin, range of swing adequate'},
        {id:'ls02',label:'Stove fiddle rails — present, adequate height for seaway cooking'},
        {id:'ls03',label:'Burner function — ignition, flame color, no yellow tipping'},
        {id:'ls04',label:'Oven — operation, seal, temperature consistency'},
      ]},
    ]
  },
  {
    id:'dinghy-outboard', label:'Dinghy & Tender', icon:'🚣',
    subcategories:[
      { id:'dy-dinghy', label:'Tender / Dinghy', items:[
        {id:'dy01',label:'Dinghy hull — condition, inflation (inflatable), structural integrity'},
        {id:'dy02',label:'Dinghy registration — documentation, numbers displayed'},
        {id:'dy03',label:'Dinghy oars — pair present, oarlocks, stowage method'},
        {id:'dy04',label:'Dinghy painter — length adequate, cleat, chafe protection'},
      ]},
      { id:'dy-outboard', label:'Dinghy Outboard', items:[
        {id:'do01',label:'Outboard make, model, horsepower — recorded'},
        {id:'do02',label:'Outboard condition — cowl, tilt/trim, water pump tell-tale operational'},
        {id:'do03',label:'Outboard fuel tank — type, portable, condition, primer bulb'},
        {id:'do04',label:'Outboard kill switch — lanyard present, operation tested'},
        {id:'do05',label:'Outboard bracket or mount — condition, locking mechanism, zincs'},
      ]},
    ]
  },
];

// ───────────────────────────────────────────────────────────────
// §2  NAV STACK
// ───────────────────────────────────────────────────────────────
const Nav = {
  stack: ['splash'],
  activeCategory: null,
  lastVisitedSection: null,
  openAccordion: null,
  noteTrayOpen: false,

  push(level) { this.stack.push(level); updateBackBtn(); _historyPush(); },
  back() {
    if (this.noteTrayOpen)  { closeNoteTray(); return; }
    if (this.openAccordion) {
      this.openAccordion = null;
      renderAccordion(); renderContextBar(); updateBackBtn(); return;
    }
    if (this.current() === 'category') {
      this.lastVisitedSection = this.activeCategory;
      this.stack.pop();
      showView(this.stack[this.stack.length - 1]);
      refreshAll(); return;
    }
    if (this.current() === 'hub') { showBackToSplashConfirm(); return; }
    if (this.stack.length > 1) this.stack.pop();
    showView(this.stack[this.stack.length - 1]);
  },
  current() { return this.stack[this.stack.length - 1]; }
};

function _historyPush() {
  history.pushState({ appNav: true, depth: Nav.stack.length }, '');
}

window.addEventListener('popstate', () => {
  history.pushState({ appNav: true, depth: Nav.stack.length }, '');
  Nav.back();
});

function showBackToSplashConfirm() {
  const old = document.getElementById('nav-confirm-overlay');
  if (old) old.remove();
  const overlay = document.createElement('div');
  overlay.id = 'nav-confirm-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;z-index:9999;';
  const box = document.createElement('div');
  box.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:32px 28px;max-width:360px;width:90%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.6);';
  box.innerHTML =
    '<div style="font-size:28px;margin-bottom:12px">⚓</div>' +
    '<div style="font-size:16px;font-weight:600;color:var(--text);margin-bottom:8px">Return to Client Setup?</div>' +
    '<div style="font-size:13px;color:var(--text-dim);margin-bottom:24px">Your inspection progress is saved. You can return to the survey at any time.</div>' +
    '<div style="display:flex;gap:12px;justify-content:center;">' +
      '<button id="nav-confirm-cancel" style="flex:1;padding:10px 0;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;font-size:14px;">Stay Here</button>' +
      '<button id="nav-confirm-yes"    style="flex:1;padding:10px 0;border-radius:8px;border:none;background:var(--accent);color:#fff;cursor:pointer;font-size:14px;font-weight:600;">Yes, Go Back</button>' +
    '</div>';
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  document.getElementById('nav-confirm-yes').addEventListener('click', () => {
    overlay.remove();
    while (Nav.stack.length > 1) Nav.stack.pop();
    showView('splash');
  });
  document.getElementById('nav-confirm-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  const esc = e => { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); } };
  document.addEventListener('keydown', esc);
}

function updateBackBtn() {
  const btn = document.getElementById('back-btn');
  if (!btn) return;
  const show = Nav.stack.length > 1 || Nav.noteTrayOpen || Nav.openAccordion !== null;
  btn.style.display = show ? 'inline-flex' : 'none';
  const hubBtn = document.getElementById('hub-btn');
  if (hubBtn) hubBtn.style.display = (Nav.current() === 'category') ? 'inline-flex' : 'none';
}

function showView(view) {
  document.getElementById('splash').style.display       = view === 'splash'   ? 'flex'  : 'none';
  const hub = document.getElementById('hub-panel');
  if (hub) hub.style.display = view === 'hub' ? 'block' : 'none';
  document.getElementById('work-area').style.display    = view === 'category' ? 'flex'  : 'none';
  document.getElementById('report-panel').style.display = view === 'report'   ? 'block' : 'none';
  updateBackBtn();
  if (history.state === null || !history.state.appNav)
    history.replaceState({ appNav: true, depth: Nav.stack.length }, '');
}

// ───────────────────────────────────────────────────────────────
// §3  APP STATE
// ───────────────────────────────────────────────────────────────
const State = { items: {}, filterMode: 'all', vesselPhoto: null };

function initState() {
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(it => {
    State.items[it.id] = { status: null, finding: { active: false, note: '', priority: null, photo: null, cost: '' } };
  })));
}

// ───────────────────────────────────────────────────────────────
// §4  HELPERS & STATS
// ───────────────────────────────────────────────────────────────
const $        = id => document.getElementById(id);
const allItems = () => DB.flatMap(c => c.subcategories.flatMap(s => s.items));

function getStats(items) {
  let done=0, prog=0, na=0, findings=0;
  items.forEach(it => {
    const s = State.items[it.id];
    if (!s) return;
    if (s.status === 'done')          done++;
    else if (s.status === 'progress') prog++;
    else if (s.status === 'na')       na++;
    if (s.finding.active) findings++;
  });
  return { total: items.length, done, prog, na, findings, rem: items.length - done - na };
}

function catItems(cat) { return cat.subcategories.flatMap(s => s.items); }
function globalStats() { return getStats(allItems()); }

// ───────────────────────────────────────────────────────────────
// §5  CATEGORY BAR  (with drag-scroll)
// ───────────────────────────────────────────────────────────────
function renderCategoryBar() {
  const bar = $('cat-bar');
  bar.innerHTML = '';
  DB.forEach(cat => {
    const st  = getStats(catItems(cat));
    const pct = st.total ? Math.round(((st.done + st.na) / st.total) * 100) : 0;
    const isActive = Nav.activeCategory === cat.id;
    const btn = document.createElement('button');
    btn.className = 'cat-cap' + (isActive ? ' active' : '') + (st.findings ? ' has-finding' : '');
    btn.dataset.catId = cat.id;
    btn.innerHTML = `<span class="cap-icon">${cat.icon}</span>
      <span class="cap-label">${cat.label}</span>
      <span class="cap-pct">${pct}%</span>
      ${st.findings ? `<span class="cap-flag">⚑${st.findings}</span>` : ''}`;
    btn.addEventListener('click', () => selectCategory(cat.id));
    bar.appendChild(btn);
  });
}

function enableDragScroll(el) {
  let down=false, startX, scrollLeft;
  el.addEventListener('mousedown', e => {
    if (e.button !== 0 || e.target.closest('.cat-cap')) return;
    down=true; el.classList.add('dragging');
    startX=e.pageX - el.offsetLeft; scrollLeft=el.scrollLeft; e.preventDefault();
  });
  ['mouseleave','mouseup'].forEach(ev => el.addEventListener(ev, () => { down=false; el.classList.remove('dragging'); }));
  el.addEventListener('mousemove', e => {
    if (!down) return;
    el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.5;
  });
}

// ───────────────────────────────────────────────────────────────
// §6  ACCORDION
// ───────────────────────────────────────────────────────────────
function renderAccordion() {
  const cat = DB.find(c => c.id === Nav.activeCategory);
  if (!cat) return;
  const acc = $('accordion');
  acc.innerHTML = '';

  cat.subcategories.forEach((sub, idx) => {
    const st    = getStats(sub.items);
    const isOpen = Nav.openAccordion === sub.id || (Nav.openAccordion === null && idx === 0);
    const pct = st.total ? Math.round(((st.done + st.na) / st.total) * 100) : 0;

    const section = document.createElement('div');
    section.className = 'acc-section' + (isOpen ? ' open' : '');
    section.dataset.subId = sub.id;

    const hdr = document.createElement('div');
    hdr.className = 'acc-header';
    hdr.innerHTML = `
      <div class="acc-hdr-left">
        <span class="acc-chevron"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></span>
        <span class="acc-title">${sub.label}</span>
      </div>
      <div class="acc-hdr-right">
        ${st.findings ? `<span class="acc-flag">⚑${st.findings}</span>` : ''}
        <span class="acc-count">${st.done+st.na}/${st.total}</span>
        <div class="acc-minibar"><div class="acc-minifill" style="width:${pct}%"></div></div>
      </div>`;
    hdr.addEventListener('click', () => {
      Nav.openAccordion = Nav.openAccordion === sub.id ? null : sub.id;
      renderAccordion(); renderContextBar(); updateBackBtn();
    });

    const body = document.createElement('div');
    body.className = 'acc-body';
    const filtered = filterItems(sub.items);
    if (!filtered.length && sub.items.length) {
      body.innerHTML = `<div class="empty-filter">No items match the current filter.</div>`;
    } else {
      filtered.forEach((item, i) => body.appendChild(buildItemRow(item, i + 1)));
    }

    section.appendChild(hdr);
    section.appendChild(body);
    acc.appendChild(section);
  });
}

function filterItems(items) {
  const f = State.filterMode;
  if (f === 'remaining') return items.filter(it => !['done','na'].includes(State.items[it.id]?.status));
  if (f === 'findings')  return items.filter(it => State.items[it.id]?.finding.active);
  return items;
}

// ───────────────────────────────────────────────────────────────
// §7  ITEM ROW  (4-state pill)
// ───────────────────────────────────────────────────────────────
const STATUS_LABELS = { null:'Not Started', progress:'In Progress', done:'Completed', na:'N / A' };
const STATUS_CLASS  = { null:'status-none', progress:'status-progress', done:'status-done', na:'status-na' };

function pillIcon(s) {
  if (s === 'done')     return `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
  if (s === 'progress') return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>`;
  if (s === 'na')       return `<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" stroke-width="3"/></svg>`;
  return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>`;
}

function buildItemRow(item, num) {
  const s   = State.items[item.id];
  const row = document.createElement('div');
  row.className = 'item-row' + (s.finding.active ? ' has-finding' : '');
  row.dataset.itemId = item.id;
  const hasPhoto = !!s.finding.photo;

  row.innerHTML = `
    <span class="item-num">${String(num).padStart(2,'0')}</span>
    <span class="item-label" id="il-${item.id}">${item.label}</span>
    <button class="edit-label-btn" title="Rename item"
      onclick="enableInlineEdit('${item.id}',document.getElementById('il-${item.id}'))">✏️</button>
    <div class="item-controls">
      ${hasPhoto ? `<span class="photo-indicator" title="Photo attached">📷</span>` : ''}
      <button class="pill-btn ${STATUS_CLASS[s.status]}" data-id="${item.id}">
        ${pillIcon(s.status)}<span>${STATUS_LABELS[s.status]}</span>
      </button>
      <button class="flag-btn ${s.finding.active ? 'active' : ''}" data-id="${item.id}" title="Flag finding">
        <svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
      </button>
    </div>`;

  row.querySelector('.pill-btn').addEventListener('click', e => { e.stopPropagation(); cycleStatus(item.id); });
  row.querySelector('.flag-btn').addEventListener('click', e => { e.stopPropagation(); toggleFinding(item.id); });
  return row;
}

// ───────────────────────────────────────────────────────────────
// §8  4-STATE STATUS CYCLE
// ───────────────────────────────────────────────────────────────
const CYCLE = { null:'progress', progress:'done', done:'na', na:null };

function cycleStatus(itemId) {
  const s     = State.items[itemId];
  const newSt = CYCLE[s.status];
  s.status    = newSt;
  if (newSt === 'progress') { s.finding.active = true; openNoteTray(itemId); }
  else if (Nav.noteTrayOpen && _currentTrayId === itemId) closeNoteTray();
  refreshAll();
}

function toggleFinding(itemId) {
  const f = State.items[itemId].finding;
  if (f.active) {
    f.active=false; f.note=''; f.priority=null; f.photo=null;
    if (Nav.noteTrayOpen && _currentTrayId === itemId) closeNoteTray();
  } else {
    f.active=true; openNoteTray(itemId);
  }
  refreshAll();
}

// ───────────────────────────────────────────────────────────────
// §9  NOTE TRAY
// ───────────────────────────────────────────────────────────────
let _currentTrayId = null;

function openNoteTray(itemId) {
  const item = allItems().find(it => it.id === itemId);
  if (!item) return;
  const s = State.items[itemId];
  _currentTrayId = itemId;
  Nav.noteTrayOpen = true;

  $('tray-item-label').textContent = item.label;
  $('tray-note').value = s.finding.note;
  document.querySelectorAll('.tray-pri-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.pri === s.finding.priority));
  renderTrayPhoto(s.finding.photo);
  renderQuickInsertList();
  renderChipSuggestion(State.items[itemId].status || 'progress');
  renderCostField(itemId);

  $('note-tray').classList.add('open');
  $('tray-overlay').classList.add('visible');
  updateBackBtn();
  requestAnimationFrame(() => {
    $('tray-note').focus();
    const len = $('tray-note').value.length;
    $('tray-note').setSelectionRange(len, len);
  });
}

function closeNoteTray() {
  saveTray();
  $('note-tray').classList.remove('open');
  $('tray-overlay').classList.remove('visible');
  Nav.noteTrayOpen = false;
  _currentTrayId = null;
  updateBackBtn();
}

function saveTray() {
  if (!_currentTrayId) return;
  State.items[_currentTrayId].finding.note = $('tray-note').value;
}

function setTrayPriority(pri) {
  if (!_currentTrayId) return;
  const f = State.items[_currentTrayId].finding;
  f.priority = f.priority === pri ? null : pri;
  document.querySelectorAll('.tray-pri-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.pri === f.priority));
}

// ── Photo ──────────────────────────────────────────────────────
function renderTrayPhoto(data) {
  const c = $('tray-photo-preview');
  if (!data) { c.innerHTML=''; c.style.display='none'; return; }
  c.style.display = 'block';
  const img = document.createElement('img');
  img.src = data; img.className = 'tray-photo-img';
  img.style.cursor = 'pointer'; img.title = 'Click to mark up';
  img.addEventListener('click', () => openMarkupCanvas(data, _currentTrayId));
  const markupBtn = document.createElement('button');
  markupBtn.className = 'tray-markup-btn'; markupBtn.textContent = '✏️ Mark up';
  markupBtn.addEventListener('click', () => openMarkupCanvas(img.src, _currentTrayId));
  const removeBtn = document.createElement('button');
  removeBtn.className = 'tray-photo-remove'; removeBtn.textContent = '✕';
  removeBtn.addEventListener('click', removePhoto);
  const wrap = document.createElement('div');
  wrap.className = 'tray-photo-wrap'; wrap.style.position = 'relative';
  wrap.append(img, markupBtn, removeBtn);
  c.innerHTML = ''; c.appendChild(wrap);
}

function removePhoto() {
  if (!_currentTrayId) return;
  State.items[_currentTrayId].finding.photo = null;
  renderTrayPhoto(null); refreshAll();
}

function triggerPhotoUpload() { $('photo-file-input').click(); }

function handlePhotoInput(input) {
  const file = input.files && input.files[0];
  if (!file || !_currentTrayId) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      let w=img.width, h=img.height; const max=1200;
      if (w>max||h>max) { const r=Math.min(max/w,max/h); w=Math.round(w*r); h=Math.round(h*r); }
      const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
      cv.getContext('2d').drawImage(img,0,0,w,h);
      const url = cv.toDataURL('image/jpeg',0.78);
      State.items[_currentTrayId].finding.photo = url;
      renderTrayPhoto(url); refreshAll();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file); input.value='';
}

// ── Quick Insert ───────────────────────────────────────────────
function renderQuickInsertList() {
  const list = $('qi-list');
  list.innerHTML = '';
  if (!quickInsertLibrary.length) {
    list.innerHTML = '<div class="qi-empty">No saved phrases yet. Type a note and click 💾 to save it here.</div>';
    return;
  }
  quickInsertLibrary.forEach((phrase, idx) => {
    const row = document.createElement('div');
    row.className = 'qi-row';
    row.innerHTML = `
      <span class="qi-text" title="${phrase}">${phrase}</span>
      <button class="qi-del" title="Remove" onclick="deleteQuickInsert(${idx})">✕</button>`;
    row.querySelector('.qi-text').addEventListener('click', () => insertQuickPhrase(phrase));
    list.appendChild(row);
  });
}

function insertQuickPhrase(phrase) {
  if (!_currentTrayId) return;
  $('tray-note').value = phrase;
  State.items[_currentTrayId].finding.note = phrase;
  $('tray-note').focus();
}

function handleSaveToQuickInsert() {
  const text = $('tray-note').value.trim();
  if (!text) { showToast('Type a note first'); return; }
  const added = addToQuickInsert(text);
  if (added) { renderQuickInsertList(); showToast('Saved to Quick Insert'); }
  else showToast('Already in Quick Insert');
}

// ── Vessel Cover Photo ─────────────────────────────────────────
function handleVesselPhoto(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      let w=img.width, h=img.height; const maxW=1400, maxH=900;
      if(w>maxW||h>maxH){ const r=Math.min(maxW/w,maxH/h); w=Math.round(w*r); h=Math.round(h*r); }
      const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
      cv.getContext('2d').drawImage(img,0,0,w,h);
      State.vesselPhoto = cv.toDataURL('image/jpeg',0.82);
      updateVesselPhotoPreview(); showToast('Vessel photo saved');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file); input.value='';
}

function updateVesselPhotoPreview() {
  const prev = $('vessel-photo-preview');
  if (!prev) return;
  if (State.vesselPhoto) {
    prev.style.display = 'block';
    prev.innerHTML = `<div class="vp-wrap">
      <img src="${State.vesselPhoto}" class="vp-img" alt="Vessel photo">
      <button class="vp-remove" onclick="removeVesselPhoto()">✕ Remove</button>
    </div>`;
  } else { prev.style.display='none'; prev.innerHTML=''; }
}

function removeVesselPhoto() { State.vesselPhoto = null; updateVesselPhotoPreview(); }

// ───────────────────────────────────────────────────────────────
// §10  NAVIGATION
// ───────────────────────────────────────────────────────────────
function selectCategory(catId) {
  Nav.activeCategory = catId; Nav.lastVisitedSection = null;
  const _entryCat = DB.find(c => c.id === catId);
  Nav.openAccordion = (_entryCat && _entryCat.subcategories.length)
    ? _entryCat.subcategories[0].id : null;
  if (Nav.current() !== 'category') Nav.push('category');
  showView('category'); refreshAll(); window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    const a = document.querySelector('.cat-cap.active');
    if (a) a.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
  });
}

function setFilter(mode) {
  State.filterMode = mode;
  document.querySelectorAll('.filter-pill').forEach(b =>
    b.classList.toggle('active', b.dataset.filter === mode));
  if (Nav.current() === 'category') renderAccordion();
}

// ───────────────────────────────────────────────────────────────
// §11  PROGRESS & CONTEXT BAR
// ───────────────────────────────────────────────────────────────
function renderProgress() {
  const g   = globalStats();
  const pct = g.total ? Math.round(((g.done + g.na) / g.total) * 100) : 0;
  $('gp-fill').style.width  = pct + '%';
  $('gp-label').textContent = `${g.done + g.na} / ${g.total}`;
  $('gp-pct').textContent   = pct + '%';
  const fEl = $('gp-findings');
  if (g.findings) { fEl.textContent = `${g.findings} finding${g.findings!==1?'s':''}`; fEl.style.display='inline'; }
  else fEl.style.display = 'none';
}

function renderContextBar() {
  const cat = DB.find(c => c.id === Nav.activeCategory);
  if (!cat) return;
  const st  = getStats(catItems(cat));
  const pct = st.total ? Math.round(((st.done + st.na) / st.total) * 100) : 0;
  $('ctx-title').textContent = `${cat.icon}  ${cat.label}`;
  $('ctx-stats').innerHTML = `
    <span class="ctx-chip done">${st.done} done</span>
    <span class="ctx-chip prog">${st.prog} in progress</span>
    <span class="ctx-chip na">${st.na} N/A</span>
    <span class="ctx-chip rem">${st.rem} remaining</span>
    ${st.findings ? `<span class="ctx-chip flag">${st.findings} finding${st.findings>1?'s':''}</span>` : ''}
    <span class="ctx-pct" style="color:var(--accent)">${pct}%</span>`;
}

function refreshAll() {
  renderCategoryBar(); renderProgress();
  if (Nav.activeCategory && Nav.current() === 'category') {
    renderContextBar(); renderAccordion(); appendAddItemButton(Nav.activeCategory);
  }
  const hubPanel = document.getElementById('hub-panel');
  if (hubPanel) renderHub();
}

// ───────────────────────────────────────────────────────────────
// §12  KEYBOARD
// ───────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('nav-confirm-overlay')) return;
    e.preventDefault(); Nav.back();
  }
});

// ───────────────────────────────────────────────────────────────
// §13  REPORT
// ───────────────────────────────────────────────────────────────
function openReport() { Nav.push('report'); showView('report'); buildReport(); }

function buildReport() {
  const I = {
    vessel:   $('v-name').value    || 'Unnamed Vessel',
    hin:      $('v-hin').value     || '—',
    surveyor: $('v-surveyor').value|| '—',
    client:   $('v-client').value  || '—',
    date:     $('v-date').value    || '',
    type:     $('v-type').value    || 'Pre-Purchase Survey',
    location: $('v-location').value|| '—',
    weather:  $('v-weather').value || '—',
    ref:      $('v-ref').value     || '—',
    scope:    $('v-scope').value   || '',
  };
  const fmtDate = I.date
    ? new Date(I.date+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})
    : new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const g   = globalStats();
  const pct = g.total ? Math.round(((g.done+g.na)/g.total)*100) : 0;

  const F = {A:[],B:[],C:[]};
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    const s = State.items[item.id];
    if (s.finding.active) {
      const p = s.finding.priority||'C';
      F[p].push({ cat:cat.label, sub:sub.label, item:item.label,
                  note:s.finding.note, photo:s.finding.photo,
                  cost:parseFloat(s.finding.cost)||0 });
    }
  })));

  const findHTML = () => {
    const tot = F.A.length+F.B.length+F.C.length;
    if (!tot) return `<div class="rpt-no-findings">✓ No findings or deficiencies flagged during this inspection.</div>`;
    return ['A','B','C'].map(p => {
      if (!F[p].length) return '';
      const m = {
        A:{label:'Priority A — Safety / Critical',cls:'pri-a',icon:'🔴'},
        B:{label:'Priority B — Maintenance / Hazard',cls:'pri-b',icon:'🟡'},
        C:{label:'Priority C — Minor / Observations',cls:'pri-c',icon:'🔵'}
      }[p];
      return `<div class="rpt-find-group ${m.cls}">
        <div class="rpt-find-hdr">${m.icon} ${m.label} (${F[p].length})</div>
        ${F[p].map((f,i) => `
          <div class="rpt-find-row">
            <span class="rpt-find-n">${i+1}</span>
            <div class="rpt-find-body">
              <div class="rpt-find-path">${f.cat} › ${f.sub}
                ${f.cost>0 ? `<span class="rpt-find-cost">$${f.cost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',')}</span>` : ''}
              </div>
              <div class="rpt-find-item">${f.item}</div>
              ${f.note  ? `<div class="rpt-find-note">"${f.note}"</div>` : ''}
              ${f.photo ? `<div class="rpt-find-photo"><img src="${f.photo}" class="rpt-photo-img" alt="Finding photo"></div>` : ''}
            </div>
          </div>`).join('')}
      </div>`;
    }).join('');
  };

  const tocRows = DB.map(cat => {
    const st   = getStats(catItems(cat));
    const pct2 = st.total ? Math.round(((st.done+st.na)/st.total)*100) : 0;
    return `<div class="toc-row">
      <span class="toc-icon">${cat.icon}</span>
      <span class="toc-label">${cat.label}</span>
      <span class="toc-dots"></span>
      <span class="toc-meta">${st.done+st.na}/${st.total} &nbsp; <strong>${pct2}%</strong>
        ${st.findings ? ` &nbsp; <span class="toc-flag">⚑${st.findings}</span>` : ''}
      </span>
    </div>`;
  }).join('');

  const detail = DB.map(cat => {
    const cst = getStats(catItems(cat));
    const cp  = cst.total ? Math.round(((cst.done+cst.na)/cst.total)*100) : 0;
    return `<div class="rpt-cat">
      <div class="rpt-cat-hdr" style="border-left:4px solid var(--accent)">
        <span>${cat.icon} ${cat.label}</span>
        <div>
          ${cst.findings ? `<span class="rpt-fflag">${cst.findings} Findings</span>` : ''}
          <span class="rpt-cpct">${cp}%</span>
        </div>
      </div>
      ${cat.subcategories.map(sub => `
        <div class="rpt-sub">
          <div class="rpt-sub-hdr">${sub.label}</div>
          <table class="rpt-tbl">
            <thead><tr><th>Inspection Item</th><th>Status</th><th>Finding</th><th>Notes</th></tr></thead>
            <tbody>${sub.items.map(item => {
              const s  = State.items[item.id];
              const sl = {null:'—',progress:'In Progress',done:'Completed',na:'N/A'}[s.status]||'—';
              const sc = {null:'rpt-s-none',progress:'rpt-s-prog',done:'rpt-s-done',na:'rpt-s-na'}[s.status]||'rpt-s-none';
              const ft = s.finding.active ? `<span class="rpt-ftag p${(s.finding.priority||'C').toLowerCase()}">Pri ${s.finding.priority||'C'}</span>` : '';
              const ph = s.finding.active && s.finding.photo ? `<br><img src="${s.finding.photo}" class="rpt-inline-thumb" alt="photo">` : '';
              return `<tr>
                <td>${item.label}</td>
                <td><span class="rpt-stag ${sc}">${sl}</span></td>
                <td>${ft}</td>
                <td class="rpt-note-cell">${s.finding.active && s.finding.note ? s.finding.note : ''}${ph}</td>
              </tr>`;
            }).join('')}</tbody>
          </table>
        </div>`).join('')}
    </div>`;
  }).join('');

  const logoSrc = (COMPANY_LOGO_BASE64 && COMPANY_LOGO_BASE64 !== 'PLACEHOLDER_LOGO_BASE64')
    ? `<img src="data:image/jpeg;base64,${COMPANY_LOGO_BASE64}" class="rpt-logo-img" alt="${COMPANY_NAME}">`
    : `<div class="rpt-logo-fallback">${COMPANY_NAME}</div>`;

  $('report-body').innerHTML = `
    <div class="rpt-cover">
      <div class="rpt-cvr-top">
        ${logoSrc}
        <div class="rpt-doc-label">MARINE SURVEY REPORT</div>
        <div class="rpt-vessel-name">${I.vessel}</div>
        <div class="rpt-cvr-meta">${fmtDate} &nbsp;·&nbsp; ${I.type}</div>
      </div>
      ${State.vesselPhoto ? `<div class="rpt-vessel-photo"><img src="${State.vesselPhoto}" alt="Vessel" class="rpt-vessel-photo-img"></div>` : ''}
      <div class="rpt-info-grid">
        ${[['Vessel',I.vessel],['HIN',I.hin],['Surveyor',I.surveyor],['Client',I.client],
           ['Date',fmtDate],['Type',I.type],['Location',I.location],['Weather',I.weather],['Ref #',I.ref]]
          .map(([k,v]) => `<div class="rpt-irow"><span class="rpt-ikey">${k}</span><span class="rpt-ival">${v}</span></div>`).join('')}
        ${I.scope ? `<div class="rpt-irow full"><span class="rpt-ikey">Scope</span><span class="rpt-ival">${I.scope}</span></div>` : ''}
      </div>
    </div>

    <div class="rpt-stat-bar">
      <div class="rpt-stat"><div class="v">${pct}%</div><div class="l">Complete</div></div>
      <div class="rpt-stat pa"><div class="v">${F.A.length}</div><div class="l">Priority A</div></div>
      <div class="rpt-stat pb"><div class="v">${F.B.length}</div><div class="l">Priority B</div></div>
      <div class="rpt-stat pc"><div class="v">${F.C.length}</div><div class="l">Priority C</div></div>
      <div class="rpt-stat"><div class="v">${g.done}</div><div class="l">Completed</div></div>
      <div class="rpt-stat na"><div class="v">${g.na}</div><div class="l">N / A</div></div>
    </div>

    <div class="rpt-sec-title">📑 Table of Contents</div>
    <div class="rpt-toc">${tocRows}</div>

    <div class="rpt-sec-title">⚑ Findings &amp; Deficiencies</div>
    ${findHTML()}

    <div class="rpt-sec-title">📋 Detailed Inspection Results</div>
    ${detail}

    ${buildCostPage()}
    <div class="rpt-disclaimer">${LEGAL_DISCLAIMER}</div>
    <div class="rpt-footer">${COMPANY_NAME} &nbsp;·&nbsp; ${I.surveyor} &nbsp;·&nbsp; ${fmtDate} &nbsp;·&nbsp; ${I.vessel}</div>`;
}

// ───────────────────────────────────────────────────────────────
// §14  PDF EXPORT
// ───────────────────────────────────────────────────────────────
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const W=210, M=15, CW=W-M*2;
  let y=0;

  const setF = (sz, style) => { doc.setFontSize(sz); doc.setFont('helvetica', style||'normal'); };
  const clr  = (r,g,b) => doc.setTextColor(r,g,b);
  const fill = (r,g,b) => doc.setFillColor(r,g,b);
  const draw = (r,g,b) => doc.setDrawColor(r,g,b);
  const fmt$ = n => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const I = {
    vessel:   $('v-name').value    || 'Unnamed Vessel',
    hin:      $('v-hin').value     || '—',
    surveyor: $('v-surveyor').value|| '—',
    client:   $('v-client').value  || '—',
    date:     $('v-date').value    || '',
    type:     $('v-type').value    || 'Pre-Purchase Survey',
    location: $('v-location').value|| '—',
    weather:  $('v-weather').value || '—',
    ref:      $('v-ref').value     || '—',
  };
  const fmtDate = I.date
    ? new Date(I.date+'T12:00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})
    : new Date().toLocaleDateString();
  const g   = globalStats();
  const pct = g.total ? Math.round(((g.done+g.na)/g.total)*100) : 0;

  const F={A:[],B:[],C:[]};
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    const s=State.items[item.id];
    if (s.finding.active) {
      const p=s.finding.priority||'C';
      F[p].push({ cat:cat.label, sub:sub.label, item:item.label,
                  note:s.finding.note, photo:s.finding.photo,
                  cost:parseFloat(s.finding.cost)||0 });
    }
  })));

  const chk = (n=10) => { if(y+n>284){ doc.addPage(); y=22; } };

  const drawFooter = () => {
    const pages = doc.getNumberOfPages();
    for (let i=1; i<=pages; i++) {
      doc.setPage(i);
      draw(192,25,44); doc.setLineWidth(0.3); doc.line(M,286,W-M,286);
      setF(6,'normal'); clr(90,105,120);
      doc.text(COMPANY_NAME, M, 290);
      doc.text(`Page ${i} of ${pages}`, W-M, 290, {align:'right'});
    }
  };

  // ── Cover ────────────────────────────────────────────────────
  fill(8,15,28); doc.rect(0,0,210,297,'F');
  let logoBottom = 18;
  const hasLogo = COMPANY_LOGO_BASE64 && COMPANY_LOGO_BASE64 !== 'PLACEHOLDER_LOGO_BASE64';
  if (hasLogo) {
    try { doc.addImage('data:image/jpeg;base64,'+COMPANY_LOGO_BASE64,'JPEG',W/2-28,14,56,42); logoBottom=58; } catch(e) {}
  }
  setF(8,'bold'); clr(192,25,44); doc.text(COMPANY_NAME, W/2, logoBottom+7, {align:'center'});
  fill(192,25,44); doc.rect(M, logoBottom+11, CW, 1.5, 'F');
  setF(22,'bold'); clr(235,242,250); doc.text(I.vessel, W/2, logoBottom+26, {align:'center'});
  setF(10,'normal'); clr(150,175,205); doc.text(I.type, W/2, logoBottom+36, {align:'center'});
  setF(9,'normal');  clr(120,145,175); doc.text(fmtDate, W/2, logoBottom+44, {align:'center'});

  let photoBottom = logoBottom + 52;
  if (State.vesselPhoto) {
    try { doc.addImage(State.vesselPhoto,'JPEG',M,photoBottom,CW,62,undefined,'FAST'); photoBottom += 66; } catch(e) {}
  }

  const ROW_H=8, TEXT_OFFSET=5, COL_KEY_W=44, COL_VAL_X=M+COL_KEY_W+2;
  const infoRows=[
    ['VESSEL',I.vessel],['HIN / HULL ID',I.hin],['SURVEYOR',I.surveyor],
    ['CLIENT',I.client],['LOCATION',I.location],['WEATHER',I.weather],['REFERENCE',I.ref],
  ];
  let iy = photoBottom + 5;
  infoRows.forEach(([k,v], rowIdx) => {
    const rowTop = iy;
    if (rowIdx%2===0) { fill(14,24,40); doc.rect(M,rowTop,CW,ROW_H,'F'); }
    setF(7,'bold'); clr(110,135,165); doc.text(k, M+3, rowTop+TEXT_OFFSET);
    setF(7.5,'normal'); clr(220,232,248);
    const valLines = doc.splitTextToSize(String(v), CW-COL_KEY_W-6);
    doc.text(valLines, COL_VAL_X, rowTop+TEXT_OFFSET);
    draw(28,42,62); doc.setLineWidth(0.2); doc.line(M,rowTop+ROW_H,M+CW,rowTop+ROW_H);
    iy += Math.max(ROW_H, valLines.length*ROW_H);
  });

  iy += 7;
  const STATS_COLS=3, STATS_ROWS=2, CARD_W=CW/STATS_COLS, CARD_H=18, statsBandH=STATS_ROWS*CARD_H+4;
  fill(18,28,46); doc.roundedRect(M,iy,CW,statsBandH,2,2,'F');
  fill(192,25,44); doc.rect(M,iy,2.5,statsBandH,'F');
  const sts  = [`${pct}%`,`${F.A.length}`,`${F.B.length}`,`${F.C.length}`,`${g.done}`,`${g.na}`];
  const stl  = ['Complete','Pri A','Pri B','Pri C','Done','N/A'];
  const stcl = [[220,230,245],[220,38,38],[215,115,5],[59,130,200],[13,148,84],[100,140,195]];
  sts.forEach((v,i) => {
    const col=i%STATS_COLS, row=Math.floor(i/STATS_COLS);
    const cx=M+col*CARD_W+CARD_W/2, cy=iy+row*CARD_H+CARD_H*0.52;
    if (col>0) { draw(30,45,65); doc.setLineWidth(0.3); doc.line(M+col*CARD_W,iy+2,M+col*CARD_W,iy+statsBandH-2); }
    if (row===1&&col===0) { draw(30,45,65); doc.setLineWidth(0.3); doc.line(M+3,iy+CARD_H,M+CW,iy+CARD_H); }
    setF(10,'bold');  clr(...stcl[i]); doc.text(v, cx, cy, {align:'center'});
    setF(6,'normal'); clr(110,130,160); doc.text(stl[i], cx, cy+4.5, {align:'center'});
  });

  const allCostItems = getAllCostItems();
  if (allCostItems.length) {
    iy += statsBandH + 7;
    const subtotal=allCostItems.reduce((a,r)=>a+r.cost,0);
    const taxAmt=taxSettings.enabled ? subtotal*taxSettings.rate/100 : 0;
    const total=subtotal+taxAmt, COST_H=taxSettings.enabled?28:22;
    fill(10,18,32); doc.roundedRect(M,iy,CW,COST_H,2,2,'F');
    fill(13,148,84); doc.rect(M,iy,2.5,COST_H,'F');
    setF(7,'bold'); clr(100,170,120); doc.text('ESTIMATED REPAIR COSTS', M+6, iy+6);
    setF(7,'normal'); clr(130,160,145);
    doc.text(`${allCostItems.length} item${allCostItems.length!==1?'s':''} flagged`, M+6, iy+12);
    if (taxSettings.enabled) {
      doc.text(`Subtotal: ${fmt$(subtotal)}`, M+6, iy+17);
      doc.text(`HST ${taxSettings.rate}%: ${fmt$(taxAmt)}`, M+6, iy+22);
    }
    setF(9,'bold'); clr(61,219,145);
    doc.text(fmt$(total), W-M-3, iy+(taxSettings.enabled?20:12), {align:'right'});
    setF(6,'normal'); clr(80,120,100);
    doc.text(taxSettings.enabled?'TOTAL INC. TAX':'SUBTOTAL', W-M-3, iy+(taxSettings.enabled?25:17), {align:'right'});
  }

  // ── Page 2: TOC ───────────────────────────────────────────────
  doc.addPage(); y=22;
  setF(14,'bold'); clr(220,232,248); doc.text('TABLE OF CONTENTS', M, y); y+=6;
  fill(192,25,44); doc.rect(M,y,CW,1,'F'); y+=8;
  DB.forEach(cat => {
    chk(9);
    const st=getStats(catItems(cat));
    const cp=st.total?Math.round(((st.done+st.na)/st.total)*100):0;
    const cpClr = cp>=80?[13,148,84]:cp>=40?[215,115,5]:[192,25,44];
    setF(8.5,'normal'); clr(205,218,238); doc.text(`${cat.icon}  ${cat.label}`, M, y);
    setF(8.5,'bold'); clr(...cpClr); doc.text(`${st.done+st.na}/${st.total}  ${cp}%`, W-M, y, {align:'right'});
    draw(30,45,65); doc.setLineWidth(0.2); doc.line(M+3,y+1,W-M-22,y+1);
    y+=8;
  });

  // ── Page 3: Findings ──────────────────────────────────────────
  doc.addPage(); y=22;
  setF(12,'bold'); clr(220,232,248); doc.text('FINDINGS & DEFICIENCIES', M, y); y+=5;
  fill(192,25,44); doc.rect(M,y,CW,1.2,'F'); y+=8;
  const allF=[...F.A.map(f=>({...f,p:'A'})),...F.B.map(f=>({...f,p:'B'})),...F.C.map(f=>({...f,p:'C'}))];
  if (!allF.length) {
    setF(9,'normal'); clr(13,148,84);
    doc.text('No findings or deficiencies were flagged during this inspection.', M, y); y+=10;
  } else {
    const F_COST_X=W-M-2, F_COST_W=24, F_TEXT_W=CW-8-F_COST_W-2;
    const pc={A:[220,38,38],B:[215,115,5],C:[59,130,200]};
    for (const f of allF) {
      const hasCost = f.cost > 0;
      chk(f.photo ? 28 : 22);
      const col=pc[f.p];
      fill(...col); doc.rect(M,y,2.5,16,'F');
      setF(7,'bold'); clr(...col); doc.text(`PRIORITY ${f.p}`, M+5, y+5);
      if (hasCost) { setF(8,'bold'); clr(61,219,145); doc.text(fmt$(f.cost), F_COST_X, y+5, {align:'right'}); }
      setF(7,'normal'); clr(100,120,155); doc.text(`${f.cat}  >  ${f.sub}`, M+5, y+11);
      setF(9,'bold'); clr(220,232,248);
      const il = doc.splitTextToSize(f.item, hasCost ? F_TEXT_W : CW-8);
      doc.text(il, M+5, y+17); y += 17 + il.length*4.5;
      if (f.note) {
        chk(8);
        const nl=doc.splitTextToSize(`"${f.note}"`, CW-10);
        setF(8,'italic'); clr(175,188,205); doc.text(nl, M+5, y); y+=nl.length*4.5+2;
      }
      if (f.photo) {
        chk(58);
        try { fill(20,32,52); doc.rect(M,y,CW,54,'F'); doc.addImage(f.photo,'JPEG',M+1,y+1,CW-2,52,undefined,'FAST'); y+=56; } catch(e) {}
      }
      draw(30,45,65); doc.line(M+3,y+2,M+CW,y+2); y+=7;
    }
  }

  // ── Detail breakdown ──────────────────────────────────────────
  for (const cat of DB) {
    chk(14);
    fill(8,15,28); doc.rect(M,y,CW,9,'F');
    fill(192,25,44); doc.rect(M,y,2.5,9,'F');
    setF(9,'bold'); clr(235,242,250); doc.text(`${cat.icon}  ${cat.label.toUpperCase()}`, M+5, y+6); y+=12;
    for (const sub of cat.subcategories) {
      chk(9);
      fill(15,24,40); doc.rect(M,y,CW,7,'F');
      setF(8,'bold'); clr(100,140,185); doc.text(sub.label, M+4, y+5); y+=9;
      for (const item of sub.items) {
        chk(7);
        const s=State.items[item.id];
        const sl={null:'—',progress:'In Progress',done:'PASS',na:'N/A'}[s.status]||'—';
        const sc={null:[55,75,100],progress:[215,115,5],done:[13,148,84],na:[80,100,180]}[s.status]||[55,75,100];
        setF(7,'bold'); clr(...sc); doc.text(sl, M+2, y+4.5);
        setF(7,'normal'); clr(205,218,238);
        const ll=doc.splitTextToSize(item.label, CW-36); doc.text(ll, M+14, y+4.5);
        if (s.finding.active) {
          const fc={A:[220,38,38],B:[215,115,5],C:[59,130,200]}[s.finding.priority||'C'];
          const hasCost2 = s.finding.cost && parseFloat(s.finding.cost)>0;
          if (hasCost2) {
            setF(7,'bold'); clr(61,219,145); doc.text(fmt$(parseFloat(s.finding.cost)), W-M-2, y+4.5, {align:'right'});
            setF(7,'bold'); clr(...fc); doc.text(`[P${s.finding.priority||'C'}]`, W-M-2-18, y+4.5, {align:'right'});
          } else { setF(7,'bold'); clr(...fc); doc.text(`[PRI ${s.finding.priority||'C'}]`, W-M-2, y+4.5, {align:'right'}); }
        }
        y += ll.length*4+1;
        if (s.finding.active && s.finding.note) {
          chk(6);
          const nl=doc.splitTextToSize(`  > ${s.finding.note}`, CW-20);
          setF(7,'italic'); clr(150,130,70); doc.text(nl, M+14, y); y+=nl.length*3.5+1;
        }
        draw(22,35,55); doc.line(M+12,y,M+CW,y); y+=2;
      }
      y+=3;
    }
    y+=4;
  }

  // ── Repair cost estimate page ─────────────────────────────────
  if (allCostItems.length) {
    doc.addPage(); y=22;
    setF(12,'bold'); clr(220,232,248); doc.text('REPAIR COST ESTIMATE', M, y); y+=5;
    fill(192,25,44); doc.rect(M,y,CW,1.2,'F'); y+=8;
    const TH=7;
    fill(12,22,38); doc.rect(M,y,CW,TH,'F');
    setF(7,'bold'); clr(100,125,160);
    doc.text('#', M+3, y+5); doc.text('ITEM / DESCRIPTION', M+10, y+5);
    doc.text('PRI', M+CW-36, y+5); doc.text('EST. COST', W-M-2, y+5, {align:'right'});
    draw(192,25,44); doc.setLineWidth(0.4); doc.line(M,y+TH,M+CW,y+TH); y+=TH+2;

    allCostItems.forEach((r,i) => {
      const rowLines=doc.splitTextToSize(r.item, CW-56);
      const rowH=Math.max(9, rowLines.length*4.5+4); chk(rowH+2);
      if (i%2===0) { fill(10,18,32); doc.rect(M,y,CW,rowH,'F'); }
      setF(7,'bold'); clr(80,100,140); doc.text(String(i+1), M+3, y+5.5);
      setF(7.5,'bold'); clr(210,225,245); doc.text(rowLines, M+10, y+5.5);
      if (r.note) { const noteY=y+5.5+rowLines.length*4.5; setF(7,'italic'); clr(140,155,175); doc.text(doc.splitTextToSize(r.note,CW-56), M+10, noteY); }
      if (r.priority) { const priClr={A:[220,38,38],B:[215,115,5],C:[59,130,200]}[r.priority]||[100,130,180]; setF(7,'bold'); clr(...priClr); doc.text(`P${r.priority}`, M+CW-34, y+5.5); }
      setF(8,'bold'); clr(61,219,145); doc.text(fmt$(r.cost), W-M-2, y+5.5, {align:'right'});
      draw(22,35,55); doc.setLineWidth(0.15); doc.line(M,y+rowH,M+CW,y+rowH); y+=rowH;
    });

    y+=4;
    const subtotal2=allCostItems.reduce((a,r)=>a+r.cost,0);
    const taxAmt2=taxSettings.enabled?subtotal2*taxSettings.rate/100:0;
    const total2=subtotal2+taxAmt2;
    chk(9); fill(12,22,38); doc.rect(M,y,CW,8,'F');
    setF(8,'bold'); clr(150,165,185); doc.text('SUBTOTAL', M+4, y+5.5);
    setF(8,'bold'); clr(200,215,235); doc.text(fmt$(subtotal2), W-M-2, y+5.5, {align:'right'}); y+=8;
    if (taxSettings.enabled) {
      chk(9); fill(12,22,38); doc.rect(M,y,CW,8,'F');
      setF(8,'normal'); clr(150,165,185); doc.text(`HST / TAX (${taxSettings.rate}%)`, M+4, y+5.5);
      setF(8,'normal'); clr(180,195,215); doc.text(fmt$(taxAmt2), W-M-2, y+5.5, {align:'right'}); y+=8;
    }
    chk(11); fill(8,32,22); doc.rect(M,y,CW,10,'F');
    fill(13,148,84); doc.rect(M,y,2.5,10,'F');
    draw(13,148,84); doc.setLineWidth(0.4); doc.line(M,y,M+CW,y);
    setF(9,'bold'); clr(61,219,145); doc.text('TOTAL ESTIMATED REPAIR COST', M+6, y+7);
    setF(10,'bold'); clr(61,219,145); doc.text(fmt$(total2), W-M-2, y+7, {align:'right'}); y+=14;
    setF(7,'normal'); clr(80,100,90);
    doc.text(taxSettings.enabled
      ? `Tax calculated at ${taxSettings.rate}% (HST/GST). Toggle in report view to recalculate.`
      : `Tax not included. Toggle the tax option in the report view to add HST/GST.`, M, y);
  }

  drawFooter();
  const fname = `survey-${(I.vessel||'vessel').replace(/\s+/g,'-').toLowerCase()}-${I.date||'report'}.pdf`;
  doc.save(fname); showToast('PDF saved — '+fname);
}

// ───────────────────────────────────────────────────────────────
// §15  RESET
// ───────────────────────────────────────────────────────────────
function resetAll() {
  if (!confirm('Reset all inspection data? This cannot be undone.')) return;
  initState(); State.vesselPhoto = null;
  Nav.stack=['splash']; Nav.activeCategory=null; Nav.lastVisitedSection=null;
  Nav.openAccordion=null; Nav.noteTrayOpen=false; _currentTrayId=null;
  State.filterMode='all';
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.toggle('active', b.dataset.filter==='all'));
  $('note-tray').classList.remove('open'); $('tray-overlay').classList.remove('visible');
  updateVesselPhotoPreview();
  showView('splash'); renderCategoryBar(); renderProgress();
  showToast('Inspection reset');
}

// ───────────────────────────────────────────────────────────────
// §16  TOAST
// ───────────────────────────────────────────────────────────────
let _tt;
function showToast(msg) {
  const t=$('toast'); $('toast-msg').textContent=msg;
  t.classList.add('show'); clearTimeout(_tt);
  _tt = setTimeout(() => t.classList.remove('show'), 3200);
}

// ───────────────────────────────────────────────────────────────
// §17  HUB PANEL
// ───────────────────────────────────────────────────────────────
function renderHub() {
  const grid = $('hub-grid');
  if (!grid) return;
  grid.innerHTML = '';

  DB.forEach(cat => {
    const items    = catItems(cat);
    const st       = getStats(items);
    const completed= st.done + st.na;
    const pct      = st.total > 0 ? Math.round((completed / st.total) * 100) : 0;
    const badgeBg  = pct===100 ? '#0d9450' : pct>=50 ? '#c58a00' : 'var(--accent,#c0192c)';

    const card = document.createElement('div');
    card.className = 'hub-card' +
      (st.findings ? ' hub-has-finding' : '') +
      (Nav.lastVisitedSection === cat.id ? ' hub-last-visited' : '');

    card.innerHTML =
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:6px;">' +
        '<div class="hub-card-icon">' + cat.icon + '</div>' +
        '<span class="hub-pct-badge" style="' +
          'display:inline-flex;align-items:center;justify-content:center;' +
          'min-width:44px;height:24px;padding:0 8px;border-radius:12px;' +
          'background:' + badgeBg + ';color:#fff;font-size:12px;font-weight:700;' +
          'font-family:\'IBM Plex Mono\',monospace;letter-spacing:0.02em;' +
          'flex-shrink:0;margin-top:2px;box-shadow:0 1px 4px rgba(0,0,0,.35);' +
        '">' + pct + '%</span>' +
      '</div>' +
      '<div class="hub-card-label">' + cat.label + '</div>' +
      '<div class="hub-progress-bar">' +
        '<div class="hub-progress-fill" style="width:' + pct + '%"></div>' +
      '</div>' +
      '<div class="hub-card-meta">' +
        '<span class="hub-done-count">✅ ' + completed + ' / ' + st.total + '</span>' +
        (st.findings ? '<span class="hub-finding-dot">⚑' + st.findings + '</span>' : '') +
      '</div>';

    card.addEventListener('click', () => selectCategory(cat.id));
    grid.appendChild(card);
  });

  // Add custom section card
  const addCard = document.createElement('div');
  addCard.className = 'hub-card hub-add-card';
  addCard.innerHTML =
    '<div class="hub-card-icon">➕</div>' +
    '<div class="hub-card-label">Create Custom Section</div>' +
    '<div style="font-size:12px;color:var(--text-dim);margin-top:4px">Add your own inspection category</div>';
  addCard.addEventListener('click', () => {
    const label = prompt('Enter new section name:');
    if (!label) return;
    addCustomSection(label); buildSearchIndex(); renderHub(); showToast('Custom section added');
  });
  grid.appendChild(addCard);
}

// ───────────────────────────────────────────────────────────────
// §18  SEARCH
// ───────────────────────────────────────────────────────────────
let _searchIndex = null;

function buildSearchIndex() {
  _searchIndex = [];
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    _searchIndex.push({
      catId:cat.id, catLabel:cat.label, subLabel:sub.label,
      itemId:item.id, label:item.label, lower:item.label.toLowerCase()
    });
  })));
}

function searchItems(query) {
  if (!_searchIndex) buildSearchIndex();
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return _searchIndex.filter(r => r.lower.includes(q)).slice(0,10);
}

function highlightMatch(label, q) {
  const idx = label.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return label;
  return label.slice(0,idx) +
    '<mark class="search-mark">' + label.slice(idx, idx+q.length) + '</mark>' +
    label.slice(idx+q.length);
}

function jumpToItem(itemId) {
  const entry = (_searchIndex||[]).find(r => r.itemId === itemId);
  if (!entry) return;
  selectCategory(entry.catId);
  setTimeout(() => {
    const cat = DB.find(c => c.id === entry.catId);
    if (cat) {
      const sub = cat.subcategories.find(s => s.items.some(i => i.id === itemId));
      if (sub) { Nav.openAccordion=sub.id; renderAccordion(); renderContextBar(); appendAddItemButton(entry.catId); updateBackBtn(); }
    }
    setTimeout(() => {
      const row = document.querySelector('.item-row[data-item-id="'+itemId+'"]');
      if (row) { row.scrollIntoView({behavior:'smooth',block:'center'}); row.classList.add('search-highlight'); setTimeout(()=>row.classList.remove('search-highlight'),2200); }
      openNoteTray(itemId);
    }, 160);
  }, 80);
}

function initSearchBar() {
  const input   = $('global-search-input');
  const results = $('global-search-results');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q) { results.style.display='none'; return; }
    const hits = searchItems(q);
    if (!hits.length) { results.style.display='none'; return; }
    results.innerHTML = hits.map(h =>
      '<div class="search-result-row" data-item-id="'+h.itemId+'">' +
        '<span class="sr-cat">'+h.catLabel+' › '+h.subLabel+'</span>' +
        '<span class="sr-label">'+highlightMatch(h.label,q)+'</span>' +
      '</div>'
    ).join('');
    results.style.display = 'block';
    results.querySelectorAll('.search-result-row').forEach(row => {
      row.addEventListener('click', () => {
        input.value=''; results.style.display='none'; jumpToItem(row.dataset.itemId);
      });
    });
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !results.contains(e.target))
      results.style.display='none';
  });

  input.addEventListener('keydown', e => {
    if (e.key==='Escape') { input.value=''; results.style.display='none'; }
  });
}

// ── Mobile search expand/collapse ─────────────────────────────
// On ≤600px the search bar is hidden. Tapping the magnifier icon
// adds .expanded to #search-wrap to reveal it, then removes it
// when the user blurs or clears the input.
function initMobileSearch() {
  const btn   = $('mobile-search-btn');
  const wrap  = $('search-wrap');
  const input = $('global-search-input');
  if (!btn || !wrap || !input) return;

  btn.addEventListener('click', () => {
    wrap.classList.add('expanded');
    btn.classList.add('active');
    requestAnimationFrame(() => input.focus());
  });

  input.addEventListener('blur', () => {
    // Only collapse when the field is empty
    if (!input.value.trim()) {
      wrap.classList.remove('expanded');
      btn.classList.remove('active');
    }
  });

  input.addEventListener('input', () => {
    // If user clears the field, collapse after a short delay
    if (!input.value.trim()) {
      setTimeout(() => {
        if (!input.value.trim()) {
          wrap.classList.remove('expanded');
          btn.classList.remove('active');
        }
      }, 200);
    }
  });
}

// ───────────────────────────────────────────────────────────────
// §19  IMAGE MARKUP CANVAS  (with color swatches)
// ───────────────────────────────────────────────────────────────
// Available brush colors. Red is the default.
const MARKUP_COLORS = [
  { hex:'#e53535', label:'Red'    },
  { hex:'#f5c518', label:'Yellow' },
  { hex:'#f97316', label:'Orange' },
  { hex:'#22c55e', label:'Green'  },
];

function openMarkupCanvas(dataUrl, itemId) {
  const old = $('markup-modal');
  if (old) old.remove();

  // Track active color across this canvas session
  let activeColor = MARKUP_COLORS[0].hex;

  // Build color swatch HTML
  const swatchHTML = MARKUP_COLORS.map(c =>
    `<button class="markup-swatch${c.hex === activeColor ? ' active' : ''}"
       data-color="${c.hex}" title="${c.label}"
       style="background:${c.hex};" aria-label="${c.label}"></button>`
  ).join('');

  const modal = document.createElement('div');
  modal.id        = 'markup-modal';
  modal.className = 'markup-modal';
  modal.innerHTML =
    '<div class="markup-inner">' +
      '<div class="markup-toolbar">' +
        '<span class="markup-title">✏️ Mark Up Photo</span>' +
        '<div class="markup-color-palette">' +
          '<span class="markup-color-label">Brush</span>' +
          '<div class="markup-swatch-row">' + swatchHTML + '</div>' +
        '</div>' +
        '<div class="markup-actions">' +
          '<button id="markup-undo"   class="tb-btn">↩️ Undo</button>' +
          '<button id="markup-save"   class="tb-btn primary">💾 Save Markup</button>' +
          '<button id="markup-cancel" class="tb-btn danger">✕ Cancel</button>' +
        '</div>' +
      '</div>' +
      '<canvas id="markup-canvas" class="markup-canvas"></canvas>' +
    '</div>';
  document.body.appendChild(modal);

  // Wire up color swatches
  modal.querySelectorAll('.markup-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      activeColor = btn.dataset.color;
      modal.querySelectorAll('.markup-swatch').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  const canvas  = $('markup-canvas');
  const ctx     = canvas.getContext('2d');
  const history = [];
  let drawing=false, lx=0, ly=0;

  const img = new Image();
  img.onload = () => {
    const maxW = Math.min(img.width, window.innerWidth - 56);
    const scale = maxW / img.width;
    canvas.width  = Math.round(img.width  * scale);
    canvas.height = Math.round(img.height * scale);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };
  img.src = dataUrl;

  function getPos(e) {
    const r  = canvas.getBoundingClientRect();
    const cx = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    const cy = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
    return [(cx-r.left)*(canvas.width/r.width), (cy-r.top)*(canvas.height/r.height)];
  }

  function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = activeColor;   // uses the currently selected swatch color
    ctx.lineWidth   = 4;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }

  canvas.addEventListener('mousedown',  e => { drawing=true; [lx,ly]=getPos(e); history.push(ctx.getImageData(0,0,canvas.width,canvas.height)); });
  canvas.addEventListener('mousemove',  e => { if(!drawing)return; const [x,y]=getPos(e); drawLine(lx,ly,x,y); [lx,ly]=[x,y]; });
  canvas.addEventListener('mouseup',    () => { drawing=false; });
  canvas.addEventListener('mouseleave', () => { drawing=false; });
  canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing=true; [lx,ly]=getPos(e); history.push(ctx.getImageData(0,0,canvas.width,canvas.height)); }, {passive:false});
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); if(!drawing)return; const [x,y]=getPos(e); drawLine(lx,ly,x,y); [lx,ly]=[x,y]; }, {passive:false});
  canvas.addEventListener('touchend',   () => { drawing=false; });

  $('markup-undo').addEventListener('click', () => {
    if (history.length > 1) { history.pop(); ctx.putImageData(history[history.length-1],0,0); }
  });
  $('markup-save').addEventListener('click', () => {
    const newData = canvas.toDataURL('image/jpeg', 0.88);
    if (itemId && State.items[itemId]) {
      State.items[itemId].finding.photo = newData;
      renderTrayPhoto(newData); refreshAll();
    }
    modal.remove(); showToast('Markup saved');
  });
  $('markup-cancel').addEventListener('click', () => modal.remove());
}

// ───────────────────────────────────────────────────────────────
// §20  COST FIELD
// ───────────────────────────────────────────────────────────────
const TAX_LS_KEY = 'sansoon_tax_settings_v1';
let taxSettings = { enabled: false, rate: 13 };

function loadTaxSettings() {
  try { const r=localStorage.getItem(TAX_LS_KEY); if(r) taxSettings=JSON.parse(r); } catch(e) {}
}
function saveTaxSettings() {
  try { localStorage.setItem(TAX_LS_KEY, JSON.stringify(taxSettings)); } catch(e) {}
}
function setItemCost(itemId, val) {
  if (State.items[itemId]) State.items[itemId].finding.cost = val;
}

function renderCostField(itemId) {
  const el = $('tray-cost-field');
  if (!el) return;
  const s   = State.items[itemId];
  const val = (s && s.finding && s.finding.cost) ? s.finding.cost : '';
  el.innerHTML =
    '<label class="tray-field-label">Estimated Repair Cost (CAD $)</label>' +
    '<input type="number" min="0" step="0.01" class="cost-input f-input" id="tray-cost-input"' +
    ' placeholder="0.00" value="' + val + '">';
  const inp = $('tray-cost-input');
  if (inp) inp.addEventListener('input', function() { setItemCost(itemId, this.value); });
}

function getAllCostItems() {
  const rows = [];
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    const s = State.items[item.id];
    if (s && s.finding && s.finding.cost && parseFloat(s.finding.cost)>0) {
      rows.push({ cat:cat.label, sub:sub.label, item:item.label,
                  note:s.finding.note, priority:s.finding.priority,
                  cost:parseFloat(s.finding.cost)||0 });
    }
  })));
  return rows;
}

function buildCostPage() {
  const rows = getAllCostItems();
  if (!rows.length) return '';
  const subtotal = rows.reduce((a,r)=>a+r.cost, 0);
  const taxAmt   = taxSettings.enabled ? subtotal*taxSettings.rate/100 : 0;
  const total    = subtotal + taxAmt;
  const fmt      = n => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rowsHTML = rows.map((r,i) =>
    '<tr>' +
    '<td class="inv-n">' + (i+1) + '</td>' +
    '<td class="inv-item"><strong>' + r.item + '</strong>' +
      '<div class="inv-path">' + r.cat + ' › ' + r.sub + '</div>' +
      (r.note ? '<div class="inv-note">' + r.note + '</div>' : '') + '</td>' +
    '<td class="inv-pri">' + (r.priority ? '<span class="rpt-ftag p'+r.priority.toLowerCase()+'">Pri '+r.priority+'</span>' : '—') + '</td>' +
    '<td class="inv-cost">' + fmt(r.cost) + '</td>' +
    '</tr>'
  ).join('');
  return '<div class="rpt-sec-title">💰 Repair Estimate — Page 4</div>' +
    '<div class="cost-tax-bar">' +
      '<label class="cost-tax-toggle" style="display:flex;align-items:center;gap:8px;cursor:pointer">' +
        '<input type="checkbox" id="rpt-tax-toggle"' + (taxSettings.enabled?' checked':'') +
          ' onchange="toggleReportTax(this.checked)">' +
        (taxSettings.enabled ? '📦 Including Tax' : '❌ No Tax') +
        '<span class="cost-tax-rate-wrap">(Rate: <input type="number" id="rpt-tax-rate"' +
          ' class="cost-rate-input" value="' + taxSettings.rate + '" min="0" max="99"' +
          ' onchange="updateTaxRate(this.value)">%)</span>' +
      '</label>' +
    '</div>' +
    '<table class="inv-table">' +
      '<thead><tr><th>#</th><th>Item Description</th><th>Priority</th><th>Est. Cost</th></tr></thead>' +
      '<tbody>' + rowsHTML + '</tbody>' +
      '<tfoot>' +
        '<tr class="inv-subtotal"><td colspan="3">Subtotal</td><td>' + fmt(subtotal) + '</td></tr>' +
        (taxSettings.enabled ? '<tr class="inv-tax"><td colspan="3">HST / Tax (' + taxSettings.rate + '%)</td><td>' + fmt(taxAmt) + '</td></tr>' : '') +
        '<tr class="inv-total"><td colspan="3"><strong>Total Estimated Repairs</strong></td><td><strong>' + fmt(total) + '</strong></td></tr>' +
      '</tfoot>' +
    '</table>';
}

function toggleReportTax(enabled) { taxSettings.enabled=enabled; saveTaxSettings(); buildReport(); }
function updateTaxRate(val)        { taxSettings.rate=parseFloat(val)||13; saveTaxSettings(); }

// ───────────────────────────────────────────────────────────────
// §21  CUSTOM SECTIONS & ITEMS
// ───────────────────────────────────────────────────────────────
const LS_CUSTOM = 'sansoon_custom_v1';
let customSections = [];

function loadCustomSections() {
  try { const r=localStorage.getItem(LS_CUSTOM); if(r) customSections=JSON.parse(r); } catch(e) {}
}
function saveCustomSections() {
  try { localStorage.setItem(LS_CUSTOM, JSON.stringify(customSections)); } catch(e) {}
}
function injectCustomSectionIntoDB(cs) {
  if (DB.find(c => c.id===cs.id)) return;
  DB.push({ id:cs.id, label:cs.label, icon:'📝',
    subcategories:[{ id:cs.id+'-sub', label:cs.label, items:cs.items }] });
  cs.items.forEach(it => {
    if (!State.items[it.id])
      State.items[it.id]={ status:null, finding:{ active:false, note:'', priority:null, photo:null, cost:'' } };
  });
}
function addCustomSection(label) {
  const id = 'custom-' + Date.now();
  const cs = { id, label: label||'Custom Section', items:[] };
  customSections.push(cs); saveCustomSections(); injectCustomSectionIntoDB(cs);
}
function addCustomItemToSection(catId, label) {
  const itemId = 'ci-' + Date.now();
  const cat = DB.find(c => c.id===catId);
  if (!cat) return;
  let customSub = cat.subcategories.find(s => s.id===catId+'-custom');
  if (!customSub) {
    customSub = { id:catId+'-custom', label:'Custom Items', items:[] };
    cat.subcategories.push(customSub);
  }
  customSub.items.push({ id:itemId, label:label||'Custom item' });
  State.items[itemId]={ status:null, finding:{ active:false, note:'', priority:null, photo:null, cost:'' } };
  const cs = customSections.find(s => s.id===catId);
  if (cs) { cs.items.push({ id:itemId, label:label||'Custom item' }); saveCustomSections(); }
}

function appendAddItemButton(catId) {
  const acc = $('accordion');
  if (!acc) return;
  const existing = $('add-item-btn');
  if (existing) existing.remove();
  const btn = document.createElement('button');
  btn.id='add-item-btn'; btn.className='add-item-btn';
  btn.textContent='➕ Add Custom Item to This Section';
  btn.addEventListener('click', () => {
    const label = prompt('Enter item description:');
    if (!label) return;
    addCustomItemToSection(catId, label);
    buildSearchIndex(); renderAccordion(); appendAddItemButton(catId); showToast('Item added');
  });
  acc.appendChild(btn);
}

// ── Inline label edit ─────────────────────────────────────────
function enableInlineEdit(itemId, labelEl) {
  if (!labelEl) return;
  const current = labelEl.textContent;
  const input = document.createElement('input');
  input.type='text'; input.value=current; input.className='inline-edit-input';
  labelEl.replaceWith(input); input.focus(); input.select();
  const commit = () => {
    const newLabel = input.value.trim() || current;
    DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(it => {
      if (it.id===itemId) it.label=newLabel;
    })));
    buildSearchIndex(); renderAccordion(); appendAddItemButton(Nav.activeCategory);
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key==='Enter') { e.preventDefault(); commit(); }
    if (e.key==='Escape') { input.value=current; input.blur(); }
  });
}

// ───────────────────────────────────────────────────────────────
// §22  REPHRASE & CHIP SUGGESTIONS
// ───────────────────────────────────────────────────────────────
const REPHRASE_MAP = [
  [/\bbad\b/gi,               'deteriorated'],
  [/\bcracked\b/gi,           'exhibits visible cracking'],
  [/\bbroken\b/gi,            'found inoperable'],
  [/\bleaking\b/gi,           'exhibits active fluid ingress'],
  [/\bleak\b/gi,              'fluid seepage observed'],
  [/\brusty\b/gi,             'exhibiting ferrous corrosion'],
  [/\brust\b/gi,              'ferrous corrosion'],
  [/\bcorroded\b/gi,          'exhibiting galvanic corrosion'],
  [/\bworn\b/gi,              'shows significant wear'],
  [/\bwear\b/gi,              'wear and degradation'],
  [/\bmissing\b/gi,           'absent — immediate attention required'],
  [/\bold\b/gi,               'aged beyond recommended service interval'],
  [/\bdirty\b/gi,             'contaminated and requires servicing'],
  [/\bclogged\b/gi,           'obstructed — flow restricted'],
  [/\bloose\b/gi,             'exhibits inadequate fastening'],
  [/\bsoft spot\b/gi,         'delamination suspected — moisture ingress likely'],
  [/\bsoft\b/gi,              'lacks structural rigidity'],
  [/\bwet\b/gi,               'elevated moisture readings noted'],
  [/\bok\b/gi,                'within acceptable survey parameters'],
  [/\bgood\b/gi,              'in satisfactory condition'],
  [/\bfine\b/gi,              'functionally adequate'],
  [/\bcheck\b/gi,             'requires further evaluation'],
  [/\bnot working\b/gi,       'non-functional — recommend immediate attention'],
  [/\bdoesn'?t work\b/gi,     'non-functional — recommend immediate attention'],
  [/\bneeds work\b/gi,        'requires remediation'],
  [/\bfix\b/gi,               'remediate'],
  [/\breplace\b/gi,           'renew or replace at earliest opportunity'],
  [/\bservice\b/gi,           'service at earliest opportunity'],
  [/\bsee photo\b/gi,         'refer to photographic documentation'],
  [/\bpic\b/gi,               'photographic documentation'],
  [/\bbilge\b/gi,             'bilge compartment'],
  [/\bhull\b/gi,              'hull structure'],
  [/\bengine\b/gi,            'propulsion machinery'],
  [/\btransom\b/gi,           'transom assembly'],
  [/\bno seacock\b/gi,        'seacock absent — non-compliant below waterline fitting'],
  [/\bno backing\b/gi,        'backing plate absent — structural risk under load'],
  [/\bdelamination\b/gi,      'delamination of laminate confirmed — structural repair required'],
  [/\bblisters\b/gi,          'osmotic blistering present — severity to be assessed'],
];

function rephraseNote(text) {
  let out = text.trim();
  if (!out) return out;
  REPHRASE_MAP.forEach(([rx,rep]) => { out = out.replace(rx, rep); });
  out = out.charAt(0).toUpperCase() + out.slice(1);
  if (!/[.!?]$/.test(out)) out += '.';
  return out;
}

function handleRephrase() {
  const ta = $('tray-note');
  if (!ta || !ta.value.trim()) { showToast('Type a note first'); return; }
  const rephrased = rephraseNote(ta.value);
  ta.value = rephrased;
  if (_currentTrayId) State.items[_currentTrayId].finding.note = rephrased;
  ta.focus(); showToast('Note rephrased ✨');
}

const CHIP_SUGGESTIONS = {
  progress:[
    'Deficiency noted — recommend specialist evaluation before next voyage.',
    'Active wear observed — service at earliest opportunity.',
    'Moisture readings elevated — further investigation advised.',
    'Requires remediation — noted during survey.',
    'Item observed — condition warrants monitoring and follow-up.',
  ],
  done:[
    'Inspected and found satisfactory at time of survey.',
    'No deficiencies observed — within acceptable parameters.',
    'Functional — no action required at this time.',
    'Condition acceptable — routine maintenance recommended.',
  ],
  na:[
    'Not applicable to this vessel type.',
    'Not fitted — noted in report.',
    'Not accessible during survey — limitation noted in report.',
  ],
};

function renderChipSuggestion(status) {
  const el = $('tray-chip-suggestion');
  if (!el) return;
  const arr  = CHIP_SUGGESTIONS[status] || CHIP_SUGGESTIONS.progress;
  const text = arr[Math.floor(Math.random()*arr.length)];
  el.innerHTML =
    '<span class="chip-prefix">🔍 Suggested:</span>' +
    '<button class="chip-insert" data-text="' + text.replace(/"/g,'&quot;') + '">' + text + '</button>';
  const btn = el.querySelector('.chip-insert');
  if (btn) btn.addEventListener('click', () => {
    const ta = $('tray-note');
    if (!ta) return;
    ta.value = btn.dataset.text;
    if (_currentTrayId) State.items[_currentTrayId].finding.note = btn.dataset.text;
    ta.focus();
  });
}

// ───────────────────────────────────────────────────────────────
// §23  BOOTSTRAP
// ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadQuickInsert();
  loadCustomSections();
  loadTaxSettings();
  customSections.forEach(injectCustomSectionIntoDB);
  buildSearchIndex();
  initState();
  $('v-date').valueAsDate = new Date();

  document.querySelectorAll('.filter-pill').forEach(b =>
    b.addEventListener('click', () => setFilter(b.dataset.filter)));

  $('back-btn').addEventListener('click',    e => { e.stopPropagation(); Nav.back(); });
  $('back-btn').addEventListener('pointerdown', e => e.stopPropagation());

  const _hubBtn = $('hub-btn');
  if (_hubBtn) {
    _hubBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (Nav.current()==='category') Nav.lastVisitedSection = Nav.activeCategory;
      Nav.noteTrayOpen=false; Nav.openAccordion=null;
      if (Nav.current()==='category') Nav.stack.pop();
      showView(Nav.stack[Nav.stack.length-1]); refreshAll();
    });
    _hubBtn.addEventListener('pointerdown', e => e.stopPropagation());
  }

  $('btn-report').addEventListener('click', openReport);
  $('btn-pdf').addEventListener('click', downloadPDF);
  $('btn-refresh-rpt').addEventListener('click', buildReport);
  $('btn-back-survey').addEventListener('click', () => {
    if (Nav.current()==='report' && Nav.stack.length>1) Nav.stack.pop();
    showView(Nav.stack[Nav.stack.length-1]); refreshAll();
  });
  $('btn-reset').addEventListener('click', resetAll);

  $('btn-start').addEventListener('click', () => {
    const name=$('v-name').value.trim(), surv=$('v-surveyor').value.trim();
    if (!name||!surv) { showToast('⚠️  Enter Vessel Name and Surveyor Name'); return; }
    Nav.push('hub'); showView('hub'); renderHub(); renderProgress();
  });

  // Tray events
  $('tray-note').addEventListener('keydown', e => {
    if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); closeNoteTray(); refreshAll(); }
  });
  $('tray-save-btn').addEventListener('click',  () => { closeNoteTray(); refreshAll(); });
  $('tray-close-btn').addEventListener('click', () => { closeNoteTray(); refreshAll(); });
  $('tray-overlay').addEventListener('click',   () => { closeNoteTray(); refreshAll(); });
  document.querySelectorAll('.tray-pri-btn').forEach(b =>
    b.addEventListener('click', () => setTrayPriority(b.dataset.pri)));
  $('photo-add-btn').addEventListener('click', triggerPhotoUpload);
  $('photo-file-input').addEventListener('change', function() { handlePhotoInput(this); });
  const rpBtn = $('rephrase-btn');
  if (rpBtn) rpBtn.addEventListener('click', handleRephrase);
  $('qi-save-btn').addEventListener('click', handleSaveToQuickInsert);
  $('vessel-photo-input').addEventListener('change', function() { handleVesselPhoto(this); });

  // Drag scroll on catbar
  enableDragScroll(document.querySelector('.catbar'));

  // Search
  initSearchBar();
  initMobileSearch();

  // Prevent search results from blocking back btn
  const _sr = $('global-search-results');
  if (_sr) _sr.addEventListener('pointerdown', e => e.stopPropagation());

  showView('splash');
  renderCategoryBar();
  renderProgress();
  history.replaceState({ appNav: true, depth: 1 }, '');
});
