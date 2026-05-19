/* ================================================================
   SANSOON YACHT SERVICES — Marine Survey Pro v4
   script.js  |  Complete production build
   Features: Quick Insert library · 4-state cycle · Photo uploads
             TOC report · Logo embed · Nav stack · localStorage
================================================================ */
'use strict';

// ── COMPANY LOGO (Base64) ─────────────────────────────────────
// Replace this string with your own Base64 JPG/PNG if needed.
const COMPANY_LOGO_BASE64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAEsAZADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7LooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArP8Qa3o/h/S5dU1zU7PTbGIZkuLqZY0X8SevtXk/wAUPjXNa+JW+H/ww0Y+LvGjfLKkZ/0TTuxaeQHGR3XIx3IPB4bX/AHhTQI4vHH7TPj9fEWqHL2+mNKy2UJ5OyG3TDS49gB6g9aAOr1H9pbw9f6g+l/Dnwr4k8e3qNtLadaMlup95GGQPfbj3psfiv8AaZ1pQ+nfDfwl4cik5U6vqbTOo7ZEbA/pXj/i/wDbEsNHtP7G+FngezsbGEFYZr5BGgHT5YIiAPxb8K8g1/8AaY+M+rylm8YzWMZ6RWNvFCF/ELu/M0AfYKwftWgb/tvwtY/3PLusfnimt4s/aX0QGTVPhp4U8RxIfn/sfVDC5HsJCSfyr4cb4yfFiSXf/wALF8Ulz6anKP0zXZ3vxt+Pnw78RyaLrHiy9a9to4nntNQWO62+ZGsiqxYEg7XGRnIOR2oA+t9M/aS8N2d/HpvxD8M+JPAV67bVOqWbNbsf9mVRyPcqB717FoWs6Tr2mxanompWepWUozHcWsyyxt/wJSRXxn4O/bEt9Utho3xS8E2Wo2EoCzTWKB1I9WglJVvwYfSu68P+APCPiKOXxz+zR4+Xw5qow9xpqSM1nKeDsnt3y0WfoV9B3oA+oaK8Y+GPxpuLjxMngD4o6L/wiPjMcQq7f6HqI6BoJCSMn+7k56Ak8D2egAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK8F+MXjvxL4v8aN8HfhTdCDU9mfEOurymkwHgopH/AC1PTjkZwMHJXp/2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JXTruHSk826t5Isrhc4JZgcHvjBHUV6H4D0b49+L/iBoXjXR/COl+G9E0+TyBFqN6JrqcOhVv3YRlyQzdyBkV5t4w+Hv7T1l+0rqepxReM4rXXNXhfTNakspFihtHkQbVnIAjA3H5kbPfFfqTYxx2tlBbW7KYoo1RSqlQQBjgHkfSgCWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z";

const COMPANY_NAME    = "SANSOON YACHT SERVICES";
const LEGAL_DISCLAIMER = "IMPORTANT — LIABILITY DISCLAIMER: This report has been prepared solely for the use of the client named herein and is based on the surveyor's visual examination of the vessel at the time and place indicated. This survey is not a guarantee or warranty of the vessel's condition, seaworthiness, or fitness for any particular purpose. The surveyor's findings are the professional opinion of the surveyor based on conditions observed and accessible at the time of inspection. Sansoon Yacht Services and its surveyors shall not be liable for any loss, damage, or injury arising from reliance on this report beyond the survey fee paid. © " + new Date().getFullYear() + " Sansoon Yacht Services. All rights reserved.";

// ── QUICK INSERT — localStorage key ──────────────────────────
const LS_KEY = 'sansoon_quick_insert_v1';

let quickInsertLibrary = [];

function loadQuickInsert() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) quickInsertLibrary = JSON.parse(raw);
  } catch(e) { quickInsertLibrary = []; }
}

function saveQuickInsert() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(quickInsertLibrary)); } catch(e) {}
}

function addToQuickInsert(phrase) {
  const trimmed = phrase.trim();
  if (!trimmed || quickInsertLibrary.includes(trimmed)) return false;
  quickInsertLibrary.unshift(trimmed);          // newest first
  if (quickInsertLibrary.length > 80) quickInsertLibrary.length = 80;
  saveQuickInsert();
  return true;
}

function deleteQuickInsert(idx) {
  quickInsertLibrary.splice(idx, 1);
  saveQuickInsert();
  renderQuickInsertList();
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
        {id:'cv06',label:'Engine room ventilation — intake/exhaust sizing, screens, no restriction'},
      ]},
    ]
  },
  {
    id:'bilge', label:'Bilge & Drainage', icon:'💧',
    subcategories:[
      { id:'bg-condition', label:'Bilge Condition', items:[
        {id:'bg01',label:'Bilge cleanliness — no oil accumulation, fuel sheen, or raw sewage'},
        {id:'bg02',label:'Bilge water color and smell — fuel/oil contamination, discoloration noted'},
        {id:'bg03',label:'Limber holes — clear of debris, flow path fully unobstructed'},
        {id:'bg04',label:'Engine bilge pan/drip tray — no oil accumulation, drainage free'},
        {id:'bg05',label:'Bilge wiring elevation — all wiring mounted above normal bilge water level'},
      ]},
      { id:'bg-pumps', label:'Bilge Pumps & Alarms', items:[
        {id:'bp01',label:'Electric bilge pump — operation, switch function, strum box clear of debris'},
        {id:'bp02',label:'Manual bilge pump — operation, hose condition, flap valve function'},
        {id:'bp03',label:'Float switch — operation, mounting height, no corrosion on contacts'},
        {id:'bp04',label:'Bilge high-water alarm — tested functional, audible from helm'},
        {id:'bp05',label:'Secondary/emergency pump — present, capacity appropriate for vessel'},
        {id:'bp06',label:'Pump discharge hose — above waterline run, no siphon risk'},
      ]},
    ]
  },
  {
    id:'engine-main', label:'Engine & Drive', icon:'⚙️',
    subcategories:[
      { id:'en-general', label:'Engine — General Condition', items:[
        {id:'en01',label:'Engine make, model, serial number — recorded, matches documentation'},
        {id:'en02',label:'Engine hours — recorded from Hobbs meter or digital display'},
        {id:'en03',label:'Engine mounts — condition, corrosion, alignment witness marks checked'},
        {id:'en04',label:'Engine oil — level, color, no milky contamination indicating coolant intrusion'},
        {id:'en05',label:'Transmission oil — level, color, no contamination'},
        {id:'en06',label:'Coolant — level, color, no oil sheen, correct antifreeze ratio'},
        {id:'en07',label:'Raw water impeller — service history, replaced if >2 seasons or unknown'},
        {id:'en08',label:'Heat exchanger — zinc anodes present, no external corrosion'},
        {id:'en09',label:'Engine room cleanliness — no oil-soaked rags, no fuel residue accumulation'},
        {id:'en10',label:'Engine start and stop — reliable, no excessive cranking, idle smooth'},
        {id:'en11',label:'Engine operation under load — RPM range, no smoke, temp stable'},
        {id:'en12',label:'Engine instrumentation — oil pressure, coolant temp, RPM, voltmeter functional'},
      ]},
      { id:'en-ancillary', label:'Engine Ancillary Systems', items:[
        {id:'ea01',label:'Drive belts (alternator, raw water pump) — tension, no cracking or glazing'},
        {id:'ea02',label:'Cooling hoses — condition, no soft spots, double-clamps below waterline'},
        {id:'ea03',label:'Exhaust water-lift muffler — condition, no cracking, proper mounting'},
        {id:'ea04',label:'Exhaust elbow — no rust weeping, no burn marks, no salt buildup'},
        {id:'ea05',label:'Sea strainer — clear, seacock upstream, lid seal condition'},
        {id:'ea06',label:'Raw water seacock (engine) — operation, condition, labeled'},
        {id:'ea07',label:'Air intake and flame arrester — screen clean, no restriction'},
        {id:'ea08',label:'Engine controls — throttle and shift cables smooth, no sticking or slop'},
        {id:'ea09',label:'Engine zincs — present, consumption level, bonding wire intact'},
      ]},
      { id:'en-drivetrain', label:'Drivetrain & Running Gear', items:[
        {id:'dr01',label:'Propeller shaft — straightness, corrosion, coupling bolt torque'},
        {id:'dr02',label:'Shaft seal/packing gland — drip rate (~1 drop per minute), no over-tightening'},
        {id:'dr03',label:'Cutless bearing — wear (lateral play test), condition'},
        {id:'dr04',label:'Shaft struts — condition, fastening, no base cracks, zinc anode'},
        {id:'dr05',label:'Propeller — blade condition, pitch consistency, cavitation erosion, electrolysis'},
        {id:'dr06',label:'Propeller nut and tab washer — present, secure, properly staked'},
        {id:'dr07',label:'Shaft zinc — present, consumption level, interference fit'},
        {id:'dr08',label:'Shaft coupling — alignment, fastener torque, flexible element condition'},
        {id:'dr09',label:'Saildrive bellows (if applicable) — condition, no cracking, diaphragm integrity'},
      ]},
    ]
  },
  {
    id:'steering', label:'Steering & Rudder', icon:'🔁',
    subcategories:[
      { id:'st-rudder', label:'Rudder & Bearings', items:[
        {id:'st01',label:'Rudder — full range of movement, no excessive play in any direction'},
        {id:'st02',label:'Rudder bearings — fore/aft and lateral play, condition'},
        {id:'st03',label:'Rudder post seal — condition, no excessive weeping at deck'},
        {id:'st04',label:'Rudder construction — solid, foam-cored, or hollow — moisture reading'},
        {id:'st05',label:'Rudder attachment — pintles and gudgeons (outboard) or bearing housing'},
      ]},
      { id:'st-system', label:'Steering System', items:[
        {id:'ss01',label:'Steering cable/rod/chain — tension, wear, sheave condition and lubrication'},
        {id:'ss02',label:'Steering wheel — condition, play in system, lock or brake function'},
        {id:'ss03',label:'Hydraulic steering — fluid level, hose condition, no leaks, helm pump'},
        {id:'ss04',label:'Autopilot drive unit — ram condition, controller operation, compass'},
        {id:'ss05',label:'Emergency steering provision — accessible, functional, helmsman familiar'},
      ]},
    ]
  },
  {
    id:'fuel-system', label:'Fuel System', icon:'🛢️',
    subcategories:[
      { id:'fs-tanks', label:'Fuel Tanks & Fill', items:[
        {id:'fs01',label:'Fuel tank material — aluminum, steel, or fiberglass — age, condition'},
        {id:'fs02',label:'Tank mounting/securing — straps, isolation pads, no movement under load'},
        {id:'fs03',label:'Fuel fill deck fitting — label (DIESEL/GAS), tether, cap O-ring'},
        {id:'fs04',label:'Fill hose — USCG Type A1 or A2, clamps, no kinks or abrasion'},
        {id:'fs05',label:'Vent lines — 5/8" minimum, routing, overboard termination, anti-siphon'},
        {id:'fs06',label:'Tank inspection port — condition, accessible, sample taken'},
        {id:'fs07',label:'Tank fuel sample — clarity, no water, no biological contamination'},
      ]},
      { id:'fs-lines', label:'Fuel Lines & Filters', items:[
        {id:'fl01',label:'Fuel supply lines — USCG type A1/B1, routing, anti-chafe protection'},
        {id:'fl02',label:'Fuel return lines — condition, routing, correct termination'},
        {id:'fl03',label:'Primary filter/water separator — element condition, bowl clarity, drain'},
        {id:'fl04',label:'Secondary (engine-mounted) filter — service status, condition'},
        {id:'fl05',label:'Fuel shut-off valve at tank — operational, labeled, accessible in emergency'},
        {id:'fl06',label:'Fuel odor check — none detectable in engine room, bilge, or accommodation'},
      ]},
    ]
  },
  {
    id:'dc-electrical', label:'DC Electrical', icon:'⚡',
    subcategories:[
      { id:'dc-batteries', label:'Battery Banks', items:[
        {id:'dc01',label:'Battery bank(s) — type (AGM/flooded/lithium), age, capacity listed'},
        {id:'dc02',label:'Battery condition — load test, specific gravity (wet cell), no sulfation'},
        {id:'dc03',label:'Battery terminals — corrosion, tightness, heat discoloration'},
        {id:'dc04',label:'Battery boxes/securing — strapped, vented per type, no movement'},
        {id:'dc05',label:'Battery switch — type (1/2/Both/Off), operation, combine function'},
        {id:'dc06',label:'Alternator output — charging voltage 13.8–14.4V under load verified'},
        {id:'dc07',label:'Battery charger — type, operation, correct for battery chemistry'},
        {id:'dc08',label:'Solar panels (if fitted) — output, mounting, controller type, connections'},
      ]},
      { id:'dc-panel', label:'DC Panel & Wiring', items:[
        {id:'dp01',label:'Main DC panel — all circuits labeled, breaker condition, bus bars secure'},
        {id:'dp02',label:'DC fuses/breakers — appropriate sizing for wire gauge and load'},
        {id:'dp03',label:'Wire type — marine-grade tinned copper throughout (ABYC E-11)'},
        {id:'dp04',label:'Wire sizing — appropriate for circuit ampacity and total length of run'},
        {id:'dp05',label:'Wire routing — secured every 18 inches, away from heat, no chafe points'},
        {id:'dp06',label:'Connections — proper marine terminals, no twist-and-tape splices'},
        {id:'dp07',label:'Bilge wiring — elevated above normal water level throughout'},
        {id:'dp08',label:'Engine compartment wiring — heat-rated, secured, clear of moving parts'},
      ]},
    ]
  },
  {
    id:'ac-electrical', label:'AC Shore Power', icon:'🔌',
    subcategories:[
      { id:'ac-shore', label:'Shore Power System', items:[
        {id:'ac01',label:'Shore power inlet — connector type (30A/50A), condition, corrosion'},
        {id:'ac02',label:'Reverse polarity indicator — present, tested, prominent location'},
        {id:'ac03',label:'Main AC panel — breaker condition, GFCI protection on wet area circuits'},
        {id:'ac04',label:'AC wiring — routing, insulation condition, no exposed conductors'},
        {id:'ac05',label:'Galvanic isolator or isolation transformer — present, tested with meter'},
        {id:'ac06',label:'AC outlets — GFCI protected in heads, cockpit, galley; condition'},
      ]},
      { id:'ac-gen', label:'Generator & Inverter', items:[
        {id:'ag01',label:'Generator (if fitted) — hours, operation, exhaust routing, seacock'},
        {id:'ag02',label:'Generator raw water cooling — impeller history, seacock, strainer'},
        {id:'ag03',label:'Inverter (if fitted) — capacity, mounting, connections, ventilation'},
      ]},
    ]
  },
  {
    id:'bonding', label:'Bonding & Zincs', icon:'🛡️',
    subcategories:[
      { id:'bn-system', label:'Bonding System', items:[
        {id:'bn01',label:'Bonding conductor — green wire, continuous through all underwater metals'},
        {id:'bn02',label:'Bonding continuity — resistance <1 ohm between bonded components'},
        {id:'bn03',label:'All underwater metals bonded — engine, shaft, seacocks, keel, struts'},
      ]},
      { id:'bn-zincs', label:'Zinc Anodes', items:[
        {id:'bz01',label:'Hull zinc anodes — consumption level, bonding wire integrity'},
        {id:'bz02',label:'Shaft zinc — consumption level, contact pressure, zinc not aluminum'},
        {id:'bz03',label:'Trim tab/rudder zincs (if fitted) — condition, fastening'},
        {id:'bz04',label:'Stray current test — DC measured in bilge water (corrosion risk indicator)'},
        {id:'bz05',label:'Electrolysis damage — propeller, shaft, thru-hulls inspected for pitting'},
      ]},
    ]
  },
  {
    id:'nav-electronics', label:'Nav Electronics', icon:'📡',
    subcategories:[
      { id:'ne-comm', label:'Communications', items:[
        {id:'ne01',label:'VHF radio — DSC equipped, MMSI programmed, antenna, squelch, channel 16'},
        {id:'ne02',label:'EPIRB — 406 MHz, NOAA registered, battery/hydrostatic release dates'},
        {id:'ne03',label:'PLB (if carried) — NOAA registered, battery expiry date'},
      ]},
      { id:'ne-nav', label:'Navigation Instruments', items:[
        {id:'nn01',label:'GPS/chartplotter — operation, chart currency, antenna, waypoint test'},
        {id:'nn02',label:'Depth sounder — operation, calibration offset, display'},
        {id:'nn03',label:'Wind instruments (if fitted) — masthead unit, calibration, display'},
        {id:'nn04',label:'AIS transponder (if fitted) — MMSI, operation, receive verified'},
        {id:'nn05',label:'Radar (if fitted) — dome condition, operation, range test'},
        {id:'nn06',label:'Autopilot — control head, compass, drive operation, mode selection'},
      ]},
    ]
  },
  {
    id:'fresh-water', label:'Fresh Water', icon:'🚿',
    subcategories:[
      { id:'fw-supply', label:'Fresh Water Supply', items:[
        {id:'fw01',label:'Fresh water tank(s) — material, capacity, condition, inspection port'},
        {id:'fw02',label:'Pressure pump — operation, cycling (no rapid on/off), inlet filter'},
        {id:'fw03',label:'Hot water heater — capacity, condition, pressure relief valve, anode'},
        {id:'fw04',label:'Fresh water hoses — condition, clamps, no mold, no leaks'},
        {id:'fw05',label:'Deck fill — labeled WATER, cap condition, O-ring seal'},
        {id:'fw06',label:'Watermaker (if fitted) — hours, membrane age, operation, flush log'},
      ]},
      { id:'fw-heads', label:'Heads & Holding Tank', items:[
        {id:'hd01',label:'Toilet — operation (manual/electric), seals, hose condition, flange'},
        {id:'hd02',label:'Holding tank — capacity, condition, venting with carbon filter'},
        {id:'hd03',label:'Y-valve — function, placard (closed in restricted waters)'},
        {id:'hd04',label:'Discharge hose — odor permeation test, double-clamps, condition'},
        {id:'hd05',label:'Head seacock — operation, condition, labeled, accessible'},
        {id:'hd06',label:'Shower sump — pump operation, check valve, strainer, switch'},
      ]},
    ]
  },
  {
    id:'safety-lifesaving', label:'Life Safety', icon:'🆘',
    subcategories:[
      { id:'sf-pfds', label:'Personal Flotation Devices', items:[
        {id:'pf01',label:'Type I/II/III PFDs — quantity for all on board, USCG-approved, accessible'},
        {id:'pf02',label:'Inflatable PFD arming — CO₂ cylinder intact, armed, not punctured'},
        {id:'pf03',label:'Inflatable PFD service — inspection within 1 year, logbook entry'},
        {id:'pf04',label:'Throwable device (Type IV) — on open deck, accessible at helm'},
        {id:'pf05',label:'Safety harnesses — quantity, condition, adjustment range'},
        {id:'pf06',label:'Tethers and jacklines — rated, condition, attachment points inspected'},
      ]},
      { id:'sf-distress', label:'Distress Signals & Rescue', items:[
        {id:'ds01',label:'Pyrotechnic flares — current unexpired date, type (day/night), quantity'},
        {id:'ds02',label:'SOLAS-grade signals — required if >3 nautical miles offshore'},
        {id:'ds03',label:'Liferaft (if carried) — service date, capacity, hydrostatic release date'},
        {id:'ds04',label:'Horseshoe buoy — condition, drogue attached, self-activating light'},
        {id:'ds05',label:'Man-overboard pole — light operational, drogue, condition, mounting'},
        {id:'ds06',label:'First aid kit — contents adequate, expiry dates checked, manual present'},
      ]},
    ]
  },
  {
    id:'fire-safety', label:'Fire Safety', icon:'🧯',
    subcategories:[
      { id:'ff-extinguishers', label:'Fire Extinguishers', items:[
        {id:'ff01',label:'Portable extinguishers — quantity meets USCG requirement for vessel size'},
        {id:'ff02',label:'Extinguisher type — B-I or B-II rating, current hydrostatic test date'},
        {id:'ff03',label:'Extinguisher condition — pressure in green zone, no corrosion, pin present'},
        {id:'ff04',label:'Engine room fixed suppression — type, cable pull or auto trigger, service date'},
      ]},
      { id:'ff-detectors', label:'Detectors & Alarms', items:[
        {id:'fd01',label:'Smoke detector — present in accommodation, functional, battery fresh'},
        {id:'fd02',label:'CO detector — present in sleeping areas, functional, battery fresh'},
        {id:'fd03',label:'LPG/CNG detector — sensor at lowest point in bilge, function tested'},
        {id:'fd04',label:'Fire blanket — present in galley, accessible, condition'},
      ]},
    ]
  },
  {
    id:'nav-lights', label:'Lights & Sound', icon:'🔦',
    subcategories:[
      { id:'nl-lights', label:'Navigation Lights', items:[
        {id:'nl01',label:'Port and starboard sidelights — LED or bulb, correct arc (112.5°), function'},
        {id:'nl02',label:'Stern light — condition, correct arc (135°), function'},
        {id:'nl03',label:'Masthead light (power) or tricolor (sailing) — condition, function, arc'},
        {id:'nl04',label:'Anchor light — function, 360° arc, location visibility'},
        {id:'nl05',label:'Deck floodlights — condition, operation, switch location'},
        {id:'nl06',label:'Navigation light panel — individual circuit breakers or fuses'},
        {id:'nl07',label:'Day shapes — ball, cone, diamond, cylinder — present as required'},
      ]},
      { id:'nl-sound', label:'Sound Signals', items:[
        {id:'ns01',label:'Electric horn — tested, audible at required distance, weatherproof'},
        {id:'ns02',label:'Backup horn (compressed air or mouth) — present, condition'},
        {id:'ns03',label:'Bell — present for vessels >12 meters, condition, accessible'},
      ]},
    ]
  },
  {
    id:'anchoring-ground', label:'Ground Tackle', icon:'🪝',
    subcategories:[
      { id:'an-tackle', label:'Anchor Systems', items:[
        {id:'an01',label:'Primary anchor — type, weight appropriate for vessel displacement and use'},
        {id:'an02',label:'Anchor chain — size, condition, length (marked every 25ft)'},
        {id:'an03',label:'Anchor rode (rope) — diameter, nylon, length, condition'},
        {id:'an04',label:'Chain-to-rode splice or shackle — moused, condition'},
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
// Levels: 'splash' | 'category' | 'report'
// Sub-state: activeCategory, openAccordion, noteTrayOpen
// ───────────────────────────────────────────────────────────────
const Nav = {
  stack: ['splash'],
  activeCategory: null,
  openAccordion: null,
  noteTrayOpen: false,

  push(level) {
    this.stack.push(level);
    updateBackBtn();
    _historyPush();
  },
  back() {
    if (this.noteTrayOpen)  { closeNoteTray(); return; }
    if (this.openAccordion) {
      this.openAccordion = null;
      renderAccordion(); renderContextBar(); updateBackBtn();
      return;
    }
    // If we're in a category view, go back to hub
    if (this.current() === 'category') {
      this.stack.pop();
      showView(this.stack[this.stack.length - 1]);
      return;
    }
    // If we're on the hub, confirm before returning to client setup (splash)
    if (this.current() === 'hub') {
      showBackToSplashConfirm();
      return;
    }
    // Report -> go back to wherever we came from
    if (this.stack.length > 1) this.stack.pop();
    showView(this.stack[this.stack.length - 1]);
  },
  current() { return this.stack[this.stack.length - 1]; }
};

// ── HISTORY API: keep browser/phone back inside the app ───────
function _historyPush() {
  history.pushState({ appNav: true, depth: Nav.stack.length }, '');
}

window.addEventListener('popstate', e => {
  // Always push a fresh state so the browser always has "somewhere to go back to"
  // then let Nav.back() decide what to do inside the app.
  history.pushState({ appNav: true, depth: Nav.stack.length }, '');
  Nav.back();
});

// ── CONFIRM OVERLAY: "Return to client setup?" ────────────────
function showBackToSplashConfirm() {
  // Remove any existing overlay
  const old = document.getElementById('nav-confirm-overlay');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'nav-confirm-overlay';
  overlay.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:center;' +
    'justify-content:center;z-index:9999;';

  const box = document.createElement('div');
  box.style.cssText =
    'background:var(--surface,#101a2b);border:1px solid var(--border,#1e2f48);border-radius:12px;' +
    'padding:32px 28px;max-width:360px;width:90%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.6);';

  box.innerHTML =
    '<div style="font-size:28px;margin-bottom:12px">⚓</div>' +
    '<div style="font-size:16px;font-weight:600;color:var(--text,#d8e6f4);margin-bottom:8px">' +
      'Return to Client Setup?' +
    '</div>' +
    '<div style="font-size:13px;color:var(--text-dim,#637a96);margin-bottom:24px">' +
      'Your inspection progress is saved. You can return to the survey at any time.' +
    '</div>' +
    '<div style="display:flex;gap:12px;justify-content:center;">' +
      '<button id="nav-confirm-cancel" style="flex:1;padding:10px 0;border-radius:8px;border:1px solid var(--border,#1e2f48);' +
        'background:transparent;color:var(--text,#d8e6f4);cursor:pointer;font-size:14px;">Stay Here</button>' +
      '<button id="nav-confirm-yes"    style="flex:1;padding:10px 0;border-radius:8px;border:none;' +
        'background:var(--accent,#c0192c);color:#fff;cursor:pointer;font-size:14px;font-weight:600;">Yes, Go Back</button>' +
    '</div>';

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById('nav-confirm-yes').addEventListener('click', () => {
    overlay.remove();
    // Pop back to splash
    while (Nav.stack.length > 1) Nav.stack.pop();
    showView('splash');
  });
  document.getElementById('nav-confirm-cancel').addEventListener('click', () => {
    overlay.remove();
  });
  // Dismiss on backdrop click
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  // Escape also dismisses
  const esc = e => { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); } };
  document.addEventListener('keydown', esc);
}


function updateBackBtn() {
  const btn = document.getElementById('back-btn');
  if (!btn) return;
  const show = Nav.stack.length > 1 || Nav.noteTrayOpen || Nav.openAccordion !== null;
  btn.style.display = show ? 'inline-flex' : 'none';
  // Hub button: visible only when inside a category checklist, gives one-tap return to hub grid
  const hubBtn = document.getElementById('hub-btn');
  if (hubBtn) hubBtn.style.display = (Nav.current() === 'category') ? 'inline-flex' : 'none';
}

function showView(view) {
  document.getElementById('splash').style.display       = view === 'splash'   ? 'flex'  : 'none';
  const hub = document.getElementById('hub-panel'); if(hub) hub.style.display = view === 'hub' ? 'block' : 'none';
  document.getElementById('work-area').style.display    = view === 'category' ? 'flex'  : 'none';
  document.getElementById('report-panel').style.display = view === 'report'   ? 'block' : 'none';
  updateBackBtn();
  // Always ensure there is a history entry so browser/phone back is intercepted
  if (history.state === null || !history.state.appNav) {
    history.replaceState({ appNav: true, depth: Nav.stack.length }, '');
  }
}

// ───────────────────────────────────────────────────────────────
// §3  APP STATE
// 4-state status cycle: null → 'progress' → 'done' → 'na' → null
// ───────────────────────────────────────────────────────────────
const State = {
  items: {},
  filterMode: 'all',
  vesselPhoto: null,   // base64 cover photo
};

function initState() {
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(it => {
    State.items[it.id] = {
      status: null,
      finding: { active: false, note: '', priority: null, photo: null, cost: '' }
    };
  })));
}

// ───────────────────────────────────────────────────────────────
// §4  HELPERS & STATS
// ───────────────────────────────────────────────────────────────
const $  = id => document.getElementById(id);
const allItems = () => DB.flatMap(c => c.subcategories.flatMap(s => s.items));

function getStats(items) {
  let done=0, prog=0, na=0, findings=0;
  items.forEach(it => {
    const s = State.items[it.id];
    if (s.status === 'done')     done++;
    else if (s.status === 'progress') prog++;
    else if (s.status === 'na')  na++;
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

// Drag-to-scroll catbar on desktop
function enableDragScroll(el) {
  let down=false, startX, scrollLeft;
  el.addEventListener('mousedown', e => {
    if (e.button !== 0 || e.target.closest('.cat-cap')) return;
    down=true; el.classList.add('dragging');
    startX=e.pageX - el.offsetLeft; scrollLeft=el.scrollLeft;
    e.preventDefault();
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
    // Display logic: open the matched section, or the first one when no section is selected.
    // NOTE: We do NOT write back to Nav.openAccordion here — that would break Nav.back().
    // The initial value is set once in selectCategory().
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
  if (f === 'remaining') return items.filter(it => !['done','na'].includes(State.items[it.id].status));
  if (f === 'findings')  return items.filter(it => State.items[it.id].finding.active);
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
      <button class="edit-label-btn" title="Rename item" onclick="enableInlineEdit('${item.id}',document.getElementById('il-${item.id}'))">✏️</button>
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
// null → progress (opens tray) → done → na → null
// ───────────────────────────────────────────────────────────────
const CYCLE = { null:'progress', progress:'done', done:'na', na:null };

function cycleStatus(itemId) {
  const s       = State.items[itemId];
  const newSt   = CYCLE[s.status];
  s.status      = newSt;

  if (newSt === 'progress') {
    s.finding.active = true;
    openNoteTray(itemId);
  } else if ((newSt === 'done' || newSt === 'na' || newSt === null)) {
    if (Nav.noteTrayOpen && _currentTrayId === itemId) closeNoteTray();
  }
  refreshAll();
}

function toggleFinding(itemId) {
  const f = State.items[itemId].finding;
  if (f.active) {
    f.active=false; f.note=''; f.priority=null; f.photo=null;
    if (Nav.noteTrayOpen && _currentTrayId === itemId) closeNoteTray();
  } else {
    f.active=true;
    openNoteTray(itemId);
  }
  refreshAll();
}

// ───────────────────────────────────────────────────────────────
// §9  NOTE TRAY  (auto-focus, photo, quick insert)
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

// ── Photo ─────────────────────────────────────────────────────
function renderTrayPhoto(data) {
  const c = $('tray-photo-preview');
  if (!data) { c.innerHTML=''; c.style.display='none'; return; }
  c.style.display='block';
  const img = document.createElement('img');
  img.src = data;
  img.className = 'tray-photo-img';
  img.style.cursor = 'pointer';
  img.title = 'Click to mark up';
  img.addEventListener('click', () => openMarkupCanvas(data, _currentTrayId));
  const markupBtn = document.createElement('button');
  markupBtn.className = 'tray-markup-btn';
  markupBtn.textContent = '✏️ Mark up';
  markupBtn.addEventListener('click', () => openMarkupCanvas(img.src, _currentTrayId));
  const removeBtn = document.createElement('button');
  removeBtn.className = 'tray-photo-remove';
  removeBtn.textContent = '✕';
  removeBtn.addEventListener('click', removePhoto);
  const wrap = document.createElement('div');
  wrap.className = 'tray-photo-wrap';
  wrap.style.position = 'relative';
  wrap.append(img, markupBtn, removeBtn);
  c.innerHTML = '';
  c.appendChild(wrap);
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
      let w=img.width, h=img.height;
      const max=1200;
      if (w>max||h>max){ const r=Math.min(max/w,max/h); w=Math.round(w*r); h=Math.round(h*r); }
      const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
      cv.getContext('2d').drawImage(img,0,0,w,h);
      const url=cv.toDataURL('image/jpeg',0.78);
      State.items[_currentTrayId].finding.photo=url;
      renderTrayPhoto(url); refreshAll();
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
  input.value='';
}

// ── Quick Insert ──────────────────────────────────────────────
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
      let w=img.width, h=img.height;
      const maxW=1400, maxH=900;
      if(w>maxW||h>maxH){ const r=Math.min(maxW/w,maxH/h); w=Math.round(w*r); h=Math.round(h*r); }
      const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
      cv.getContext('2d').drawImage(img,0,0,w,h);
      State.vesselPhoto = cv.toDataURL('image/jpeg',0.82);
      updateVesselPhotoPreview();
      showToast('Vessel photo saved');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  input.value='';
}

function updateVesselPhotoPreview() {
  const prev = $('vessel-photo-preview');
  if (!prev) return;
  if (State.vesselPhoto) {
    prev.style.display='block';
    prev.innerHTML=`<div class="vp-wrap">
      <img src="${State.vesselPhoto}" class="vp-img" alt="Vessel photo">
      <button class="vp-remove" onclick="removeVesselPhoto()">✕ Remove</button>
    </div>`;
  } else {
    prev.style.display='none'; prev.innerHTML='';
  }
}

function removeVesselPhoto() {
  State.vesselPhoto = null;
  updateVesselPhotoPreview();
}

// ───────────────────────────────────────────────────────────────
// §10  NAVIGATION
// ───────────────────────────────────────────────────────────────
function selectCategory(catId) {
  Nav.activeCategory = catId;
  // Initialize openAccordion to the first subcategory so it opens on entry.
  // This is the ONLY place this assignment belongs — NOT inside renderAccordion(),
  // because that would counteract Nav.back() which deliberately sets it to null.
  const _entryCat = DB.find(c => c.id === catId);
  Nav.openAccordion = (_entryCat && _entryCat.subcategories.length)
    ? _entryCat.subcategories[0].id
    : null;
  if (Nav.current() !== 'category') Nav.push('category');
  showView('category');
  refreshAll();
  window.scrollTo(0, 0);
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
// §11  PROGRESS & CONTEXT
// ───────────────────────────────────────────────────────────────
function renderProgress() {
  const g   = globalStats();
  const pct = g.total ? Math.round(((g.done + g.na) / g.total) * 100) : 0;
  $('gp-fill').style.width  = pct + '%';
  $('gp-label').textContent = `${g.done + g.na} / ${g.total}`;
  $('gp-pct').textContent   = pct + '%';
  const fEl = $('gp-findings');
  if (g.findings) { fEl.textContent = `${g.findings} finding${g.findings!==1?'s':''}`; fEl.style.display='inline'; }
  else fEl.style.display='none';
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
  renderCategoryBar();
  renderProgress();
  if (Nav.activeCategory && Nav.current() === 'category') {
    renderContextBar();
    renderAccordion();
    appendAddItemButton(Nav.activeCategory);
  }
  if (Nav.current() === 'hub') renderHub();
}

// ───────────────────────────────────────────────────────────────
// §12  KEYBOARD
// ───────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    // If the confirm overlay is open, let its own handler deal with it
    if (document.getElementById('nav-confirm-overlay')) return;
    e.preventDefault();
    Nav.back();
  }
});

// ───────────────────────────────────────────────────────────────
// §13  REPORT
// ───────────────────────────────────────────────────────────────
function openReport() {
  Nav.push('report');
  showView('report');
  buildReport();
}

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

  // Collect findings
  const F = {A:[],B:[],C:[]};
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    const s=State.items[item.id];
    if(s.finding.active){const p=s.finding.priority||'C';F[p].push({cat:cat.label,sub:sub.label,item:item.label,note:s.finding.note,photo:s.finding.photo});}
  })));

  const findHTML = () => {
    const tot=F.A.length+F.B.length+F.C.length;
    if(!tot) return `<div class="rpt-no-findings">✓ No findings or deficiencies flagged during this inspection.</div>`;
    return ['A','B','C'].map(p => {
      if(!F[p].length) return '';
      const m={A:{label:'Priority A — Safety / Critical',cls:'pri-a',icon:'🔴'},B:{label:'Priority B — Maintenance / Hazard',cls:'pri-b',icon:'🟡'},C:{label:'Priority C — Minor / Observations',cls:'pri-c',icon:'🔵'}}[p];
      return `<div class="rpt-find-group ${m.cls}">
        <div class="rpt-find-hdr">${m.icon} ${m.label} (${F[p].length})</div>
        ${F[p].map((f,i)=>`
          <div class="rpt-find-row">
            <span class="rpt-find-n">${i+1}</span>
            <div class="rpt-find-body">
              <div class="rpt-find-path">${f.cat} › ${f.sub}</div>
              <div class="rpt-find-item">${f.item}</div>
              ${f.note?`<div class="rpt-find-note">"${f.note}"</div>`:''}
              ${f.photo?`<div class="rpt-find-photo"><img src="${f.photo}" class="rpt-photo-img" alt="Finding photo"></div>`:''}
            </div>
          </div>`).join('')}
      </div>`;
    }).join('');
  };

  // TOC
  const tocRows = DB.map(cat => {
    const st  = getStats(catItems(cat));
    const pct2 = st.total ? Math.round(((st.done+st.na)/st.total)*100) : 0;
    return `<div class="toc-row">
      <span class="toc-icon">${cat.icon}</span>
      <span class="toc-label">${cat.label}</span>
      <span class="toc-dots"></span>
      <span class="toc-meta">${st.done+st.na}/${st.total} &nbsp; <strong>${pct2}%</strong>${st.findings?` &nbsp; <span class="toc-flag">⚑${st.findings}</span>`:''}</span>
    </div>`;
  }).join('');

  // Detail
  const detail = DB.map(cat => {
    const cst=getStats(catItems(cat));
    const cp=cst.total?Math.round(((cst.done+cst.na)/cst.total)*100):0;
    return `<div class="rpt-cat">
      <div class="rpt-cat-hdr" style="border-left:4px solid var(--accent)">
        <span>${cat.icon} ${cat.label}</span>
        <div>${cst.findings?`<span class="rpt-fflag">${cst.findings} Findings</span>`:''}<span class="rpt-cpct">${cp}%</span></div>
      </div>
      ${cat.subcategories.map(sub=>`
        <div class="rpt-sub">
          <div class="rpt-sub-hdr">${sub.label}</div>
          <table class="rpt-tbl">
            <thead><tr><th>Inspection Item</th><th>Status</th><th>Finding</th><th>Notes</th></tr></thead>
            <tbody>${sub.items.map(item=>{
              const s=State.items[item.id];
              const sl={null:'—',progress:'In Progress',done:'Completed',na:'N/A'}[s.status]||'—';
              const sc={null:'rpt-s-none',progress:'rpt-s-prog',done:'rpt-s-done',na:'rpt-s-na'}[s.status]||'rpt-s-none';
              const ft=s.finding.active?`<span class="rpt-ftag p${(s.finding.priority||'C').toLowerCase()}">Pri ${s.finding.priority||'C'}</span>`:'';
              const ph=s.finding.active&&s.finding.photo?`<br><img src="${s.finding.photo}" class="rpt-inline-thumb" alt="photo">`:'';
              return `<tr><td>${item.label}</td><td><span class="rpt-stag ${sc}">${sl}</span></td><td>${ft}</td><td class="rpt-note-cell">${s.finding.active&&s.finding.note?s.finding.note:''}${ph}</td></tr>`;
            }).join('')}</tbody>
          </table>
        </div>`).join('')}
    </div>`;
  }).join('');

  $('report-body').innerHTML = `
    <!-- COVER -->
    <div class="rpt-cover">
      <div class="rpt-cvr-top">
        ${COMPANY_LOGO_BASE64
          ? `<img src="data:image/jpeg;base64,${COMPANY_LOGO_BASE64}" class="rpt-logo-img" alt="${COMPANY_NAME}">`
          : `<div class="rpt-logo-fallback">${COMPANY_NAME}</div>`}
        <div class="rpt-doc-label">MARINE SURVEY REPORT</div>
        <div class="rpt-vessel-name">${I.vessel}</div>
        <div class="rpt-cvr-meta">${fmtDate} &nbsp;·&nbsp; ${I.type}</div>
      </div>
      ${State.vesselPhoto ? `<div class="rpt-vessel-photo"><img src="${State.vesselPhoto}" alt="Vessel" class="rpt-vessel-photo-img"></div>` : ''}
      <div class="rpt-info-grid">
        ${[['Vessel',I.vessel],['HIN',I.hin],['Surveyor',I.surveyor],['Client',I.client],
           ['Date',fmtDate],['Type',I.type],['Location',I.location],['Weather',I.weather],['Ref #',I.ref]]
          .map(([k,v])=>`<div class="rpt-irow"><span class="rpt-ikey">${k}</span><span class="rpt-ival">${v}</span></div>`).join('')}
        ${I.scope?`<div class="rpt-irow full"><span class="rpt-ikey">Scope</span><span class="rpt-ival">${I.scope}</span></div>`:''}
      </div>
    </div>

    <!-- SUMMARY STATS -->
    <div class="rpt-stat-bar">
      <div class="rpt-stat"><div class="v">${pct}%</div><div class="l">Complete</div></div>
      <div class="rpt-stat pa"><div class="v">${F.A.length}</div><div class="l">Priority A</div></div>
      <div class="rpt-stat pb"><div class="v">${F.B.length}</div><div class="l">Priority B</div></div>
      <div class="rpt-stat pc"><div class="v">${F.C.length}</div><div class="l">Priority C</div></div>
      <div class="rpt-stat"><div class="v">${g.done}</div><div class="l">Completed</div></div>
      <div class="rpt-stat na"><div class="v">${g.na}</div><div class="l">N / A</div></div>
    </div>

    <!-- TABLE OF CONTENTS -->
    <div class="rpt-sec-title">📑 Table of Contents</div>
    <div class="rpt-toc">${tocRows}</div>

    <!-- FINDINGS -->
    <div class="rpt-sec-title">⚑ Findings &amp; Deficiencies</div>
    ${findHTML()}

    <!-- DETAIL -->
    <div class="rpt-sec-title">📋 Detailed Inspection Results</div>
    ${detail}

    <!-- DISCLAIMER -->
    ${buildCostPage()}
    <div class="rpt-disclaimer">${LEGAL_DISCLAIMER}</div>
    <div class="rpt-footer">${COMPANY_NAME} &nbsp;·&nbsp; ${I.surveyor} &nbsp;·&nbsp; ${fmtDate} &nbsp;·&nbsp; ${I.vessel}</div>`;
}

// ───────────────────────────────────────────────────────────────
// §14  PDF EXPORT  (logo, vessel photo, embedded finding photos)
// ───────────────────────────────────────────────────────────────
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const W=210, M=15, CW=W-M*2;
  let y=0;

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
  DB.forEach(cat=>cat.subcategories.forEach(sub=>sub.items.forEach(item=>{
    const s=State.items[item.id];
    if(s.finding.active){const p=s.finding.priority||'C';F[p].push({cat:cat.label,sub:sub.label,item:item.label,note:s.finding.note,photo:s.finding.photo});}
  })));

  const chk = (n=10) => { if(y+n>284){doc.addPage();y=22;} };
  const drawFooter = () => {
    const pages=doc.getNumberOfPages();
    for(let i=1;i<=pages;i++){
      doc.setPage(i);
      doc.setFontSize(6); doc.setFont('helvetica','normal'); doc.setTextColor(90,105,120);
      const disc=doc.splitTextToSize(LEGAL_DISCLAIMER, CW);
      // footer rule
      doc.setDrawColor(192,25,44); doc.setLineWidth(0.3); doc.line(M,286,W-M,286);
      doc.setLineWidth(0.2);
      doc.text(COMPANY_NAME, M, 290);
      doc.text(`Page ${i} of ${pages}`, W-M, 290, {align:'right'});
    }
  };

  // ── PAGE 1: COVER ────────────────────────────────────────────
  doc.setFillColor(8,15,28); doc.rect(0,0,210,297,'F');

  // Logo
  let logoBottom = 18;
  if (COMPANY_LOGO_BASE64) {
    try {
      doc.addImage('data:image/jpeg;base64,'+COMPANY_LOGO_BASE64,'JPEG', W/2-28, 14, 56, 42);
      logoBottom = 58;
    } catch(e) {}
  }
  // Company name
  doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(192,25,44);
  doc.text(COMPANY_NAME, W/2, logoBottom+6, {align:'center'});
  // Crimson rule
  doc.setFillColor(192,25,44); doc.rect(M, logoBottom+10, CW, 1.5, 'F');

  doc.setFontSize(22); doc.setFont('helvetica','bold'); doc.setTextColor(235,242,250);
  doc.text(I.vessel, W/2, logoBottom+24, {align:'center'});
  doc.setFontSize(10); doc.setFont('helvetica','normal'); doc.setTextColor(130,155,185);
  doc.text(I.type, W/2, logoBottom+33, {align:'center'});
  doc.setFontSize(9); doc.setTextColor(100,120,150);
  doc.text(fmtDate, W/2, logoBottom+40, {align:'center'});

  // Vessel photo on cover
  let photoBottom = logoBottom + 48;
  if (State.vesselPhoto) {
    try {
      const ph=State.vesselPhoto;
      doc.addImage(ph,'JPEG',M,photoBottom,CW,62,undefined,'FAST');
      photoBottom += 66;
    } catch(e) {}
  }

  // Info table on cover
  const infoRows=[['Surveyor',I.surveyor],['Client',I.client],['HIN / Hull ID',I.hin],
                  ['Location',I.location],['Weather',I.weather],['Reference',I.ref]];
  let iy=photoBottom+4;
  infoRows.forEach(([k,v])=>{
    doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(100,125,160);
    doc.text(k.toUpperCase(),M,iy);
    doc.setFont('helvetica','normal');doc.setTextColor(210,225,240);
    doc.text(String(v),M+36,iy); iy+=7;
  });

  // Stats band
  iy+=5;
  doc.setFillColor(18,28,46);doc.roundedRect(M,iy,CW,18,2,2,'F');
  doc.setFillColor(192,25,44);doc.rect(M,iy,2.5,18,'F');
  const sts=[`${pct}%`,`${F.A.length}`,`${F.B.length}`,`${F.C.length}`,`${g.done}`,`${g.na}`];
  const stl=['Complete','Pri A','Pri B','Pri C','Done','N/A'];
  const sw=CW/sts.length;
  sts.forEach((v,i)=>{const x=M+i*sw+sw/2;doc.setFontSize(10);doc.setFont('helvetica','bold');doc.setTextColor(220,230,245);doc.text(v,x,iy+9,{align:'center'});doc.setFontSize(6);doc.setFont('helvetica','normal');doc.setTextColor(100,120,155);doc.text(stl[i],x,iy+14.5,{align:'center'});});

  // ── PAGE 2: TABLE OF CONTENTS ────────────────────────────────
  doc.addPage();
  y=22;
  doc.setFontSize(14);doc.setFont('helvetica','bold');doc.setTextColor(220,230,245);
  doc.text('TABLE OF CONTENTS',M,y); y+=6;
  doc.setFillColor(192,25,44);doc.rect(M,y,CW,1,'F'); y+=7;

  DB.forEach(cat=>{
    chk(9);
    const st=getStats(catItems(cat));
    const cp=st.total?Math.round(((st.done+st.na)/st.total)*100):0;
    doc.setFontSize(8.5);doc.setFont('helvetica','normal');doc.setTextColor(200,215,235);
    doc.text(`${cat.icon}  ${cat.label}`,M,y);
    doc.setFont('helvetica','bold');doc.setTextColor(cp>=80?[13,148,84]:cp>=40?[215,115,5]:[192,25,44]);
    doc.text(`${st.done+st.na}/${st.total}  ${cp}%`,W-M,y,{align:'right'});
    doc.setDrawColor(30,45,65);doc.setLineWidth(0.2);doc.line(M+3,y+1,W-M-18,y+1);
    y+=8;
  });

  // ── FINDINGS ─────────────────────────────────────────────────
  doc.addPage(); y=22;
  doc.setFontSize(12);doc.setFont('helvetica','bold');doc.setTextColor(220,230,245);
  doc.text('FINDINGS & DEFICIENCIES',M,y); y+=5;
  doc.setFillColor(192,25,44);doc.rect(M,y,CW,1.2,'F'); y+=7;

  const allF=[...F.A.map(f=>({...f,p:'A'})),...F.B.map(f=>({...f,p:'B'})),...F.C.map(f=>({...f,p:'C'}))];
  if(!allF.length){
    doc.setFontSize(9);doc.setFont('helvetica','normal');doc.setTextColor(13,148,84);
    doc.text('No findings or deficiencies were flagged during this inspection.',M,y); y+=10;
  } else {
    const pc={A:[220,38,38],B:[215,115,5],C:[59,130,200]};
    for(const f of allF){
      const ph=f.photo; chk(ph?28:20);
      const col=pc[f.p];
      doc.setFillColor(...col);doc.rect(M,y,2.5,14,'F');
      doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(...col);
      doc.text(`PRIORITY ${f.p}`,M+5,y+5);
      doc.setFontSize(7);doc.setFont('helvetica','normal');doc.setTextColor(100,120,155);
      doc.text(`${f.cat}  ›  ${f.sub}`,M+5,y+10);
      doc.setFontSize(9);doc.setFont('helvetica','bold');doc.setTextColor(220,230,245);
      const il=doc.splitTextToSize(f.item,CW-8);doc.text(il,M+5,y+15);
      y+=15+il.length*4.5;
      if(f.note){chk(8);const nl=doc.splitTextToSize(`"${f.note}"`,CW-8);doc.setFontSize(8);doc.setFont('helvetica','italic');doc.setTextColor(175,185,200);doc.text(nl,M+5,y);y+=nl.length*4.5+2;}
      if(ph){chk(58);try{doc.setFillColor(20,32,52);doc.rect(M,y,CW,54,'F');doc.addImage(ph,'JPEG',M+1,y+1,CW-2,52,undefined,'FAST');y+=56;}catch(e){}}
      doc.setDrawColor(30,45,65);doc.line(M+3,y+2,M+CW,y+2);y+=7;
    }
  }

  // ── DETAILED BREAKDOWN ────────────────────────────────────────
  for(const cat of DB){
    chk(14);
    doc.setFillColor(8,15,28);doc.rect(M,y,CW,9,'F');
    doc.setFillColor(192,25,44);doc.rect(M,y,2.5,9,'F');
    doc.setFontSize(9);doc.setFont('helvetica','bold');doc.setTextColor(235,242,250);
    doc.text(`${cat.icon}  ${cat.label.toUpperCase()}`,M+5,y+6);y+=12;
    for(const sub of cat.subcategories){
      chk(9);
      doc.setFillColor(15,24,40);doc.rect(M,y,CW,7,'F');
      doc.setFontSize(8);doc.setFont('helvetica','bold');doc.setTextColor(100,140,185);
      doc.text(sub.label,M+4,y+5);y+=9;
      for(const item of sub.items){
        chk(7);
        const s=State.items[item.id];
        const sl={null:'—',progress:'In Progress',done:'✓',na:'N/A'}[s.status]||'—';
        const sc={null:[55,75,100],progress:[215,115,5],done:[13,148,84],na:[80,100,180]}[s.status]||[55,75,100];
        doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(...sc);doc.text(sl,M+2,y+4);
        doc.setFont('helvetica','normal');doc.setTextColor(200,215,235);
        const ll=doc.splitTextToSize(item.label,CW-28);doc.text(ll,M+14,y+4);
        if(s.finding.active){const fc={A:[220,38,38],B:[215,115,5],C:[59,130,200]}[s.finding.priority||'C'];doc.setFont('helvetica','bold');doc.setFontSize(7);doc.setTextColor(...fc);doc.text(`[PRI ${s.finding.priority||'C'}]`,W-M-2,y+4,{align:'right'});}
        y+=ll.length*4+1;
        if(s.finding.active&&s.finding.note){chk(6);const nl=doc.splitTextToSize(`↳ ${s.finding.note}`,CW-18);doc.setFont('helvetica','italic');doc.setFontSize(7);doc.setTextColor(140,115,50);doc.text(nl,M+14,y);y+=nl.length*3.5+1;}
        doc.setDrawColor(22,35,55);doc.line(M+12,y,M+CW,y);y+=2;
      }y+=3;
    }y+=4;
  }

  drawFooter();
  const fname=`survey-${(I.vessel||'vessel').replace(/\s+/g,'-').toLowerCase()}-${I.date||'report'}.pdf`;
  doc.save(fname);
  showToast('PDF saved — '+fname);
}

// ───────────────────────────────────────────────────────────────
// §15  RESET
// ───────────────────────────────────────────────────────────────
function resetAll() {
  if(!confirm('Reset all inspection data? This cannot be undone.')) return;
  initState(); State.vesselPhoto=null;
  Nav.stack=['splash']; Nav.activeCategory=null; Nav.openAccordion=null; Nav.noteTrayOpen=false; _currentTrayId=null;
  State.filterMode='all';
  document.querySelectorAll('.filter-pill').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
  $('note-tray').classList.remove('open'); $('tray-overlay').classList.remove('visible');
  updateVesselPhotoPreview();
  showView('splash'); renderCategoryBar(); renderProgress();
  showToast('Inspection reset');
}

// ───────────────────────────────────────────────────────────────
// §16  TOAST
// ───────────────────────────────────────────────────────────────
let _tt;
function showToast(msg){const t=$('toast');$('toast-msg').textContent=msg;t.classList.add('show');clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('show'),3200);}

// ───────────────────────────────────────────────────────────────
// §17  BOOTSTRAP
// ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  loadQuickInsert();
  loadCustomSections();
  loadTaxSettings();
  customSections.forEach(injectCustomSectionIntoDB);
  buildSearchIndex();
  initState();
  $('v-date').valueAsDate = new Date();

  document.querySelectorAll('.filter-pill').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));
  $('back-btn').addEventListener('click', e => { e.stopPropagation(); Nav.back(); });
  $('back-btn').addEventListener('pointerdown', e => { e.stopPropagation(); });
  // Hub button — jump directly back to the survey hub grid from any checklist
  const _hubBtn = $('hub-btn');
  if (_hubBtn) {
    _hubBtn.addEventListener('click', e => {
      e.stopPropagation();
      // Close any open accordion/tray first, then pop to hub
      Nav.noteTrayOpen = false;
      Nav.openAccordion = null;
      if (Nav.current() === 'category') Nav.stack.pop();
      showView(Nav.stack[Nav.stack.length - 1]);
      refreshAll();
    });
    _hubBtn.addEventListener('pointerdown', e => { e.stopPropagation(); });
  }
  $('btn-report').addEventListener('click',openReport);
  $('btn-pdf').addEventListener('click',downloadPDF);
  $('btn-refresh-rpt').addEventListener('click',buildReport);
  $('btn-back-survey').addEventListener('click', () => {
    // Pop 'report' off the stack and show whatever was before it
    if (Nav.current() === 'report' && Nav.stack.length > 1) Nav.stack.pop();
    showView(Nav.stack[Nav.stack.length - 1]);
    refreshAll();
  });
  $('btn-reset').addEventListener('click',resetAll);

  $('btn-start').addEventListener('click',()=>{
    const name=$('v-name').value.trim(), surv=$('v-surveyor').value.trim();
    if(!name||!surv){showToast('⚠️  Enter Vessel Name and Surveyor Name');return;}
    Nav.push('hub');
    showView('hub');
    renderHub();
    renderProgress();
  });

  // Tray events
  $('tray-note').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();closeNoteTray();refreshAll();}});
  $('tray-save-btn').addEventListener('click',()=>{closeNoteTray();refreshAll();});
  $('tray-close-btn').addEventListener('click',()=>{closeNoteTray();refreshAll();});
  $('tray-overlay').addEventListener('click',()=>{closeNoteTray();refreshAll();});
  document.querySelectorAll('.tray-pri-btn').forEach(b=>b.addEventListener('click',()=>setTrayPriority(b.dataset.pri)));
  $('photo-add-btn').addEventListener('click',triggerPhotoUpload);
  $('photo-file-input').addEventListener('change',function(){handlePhotoInput(this);});
  const rpBtn = document.getElementById('rephrase-btn');
  if (rpBtn) rpBtn.addEventListener('click', handleRephrase);
  $('qi-save-btn').addEventListener('click',handleSaveToQuickInsert);

  // Vessel photo
  $('vessel-photo-input').addEventListener('change',function(){handleVesselPhoto(this);});

  // Drag scroll on catbar
  enableDragScroll(document.querySelector('.catbar'));
  initSearchBar();
  // Prevent search-results overlay from blocking the back button
  const _sr = $('global-search-results');
  if (_sr) _sr.addEventListener('pointerdown', e => e.stopPropagation());

  showView('splash');
  renderCategoryBar();
  renderProgress();
  // Seed history so the browser/phone back button is always intercepted from the start
  history.replaceState({ appNav: true, depth: 1 }, '');
});

// ═══════════════════════════════════════════════════════════════
// PATCH v5 — NEW FUNCTIONS (appended)
// ═══════════════════════════════════════════════════════════════

// ── REPHRASE DICTIONARY ────────────────────────────────────────
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
  REPHRASE_MAP.forEach(([rx, rep]) => { out = out.replace(rx, rep); });
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
  ta.focus();
  showToast('Note rephrased ✨');
}

// ── CHIP SUGGESTIONS ──────────────────────────────────────────
const CHIP_SUGGESTIONS = {
  progress: [
    'Deficiency noted — recommend specialist evaluation before next voyage.',
    'Active wear observed — service at earliest opportunity.',
    'Moisture readings elevated — further investigation advised.',
    'Requires remediation — noted during survey.',
    'Item observed — condition warrants monitoring and follow-up.',
  ],
  done: [
    'Inspected and found satisfactory at time of survey.',
    'No deficiencies observed — within acceptable parameters.',
    'Functional — no action required at this time.',
    'Condition acceptable — routine maintenance recommended.',
  ],
  na: [
    'Not applicable to this vessel type.',
    'Not fitted — noted in report.',
    'Not accessible during survey — limitation noted in report.',
  ],
};

function getChipSuggestion(status) {
  const arr = CHIP_SUGGESTIONS[status] || CHIP_SUGGESTIONS.progress;
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderChipSuggestion(status) {
  const el = $('tray-chip-suggestion');
  if (!el) return;
  const text = getChipSuggestion(status);
  el.innerHTML = '<span class="chip-prefix">🔍 Suggested:</span>' +
    '<button class="chip-insert" data-text="' + text.replace(/"/g,'&quot;') + '">' + text + '</button>';
  const btn = el.querySelector('.chip-insert');
  if (btn) btn.addEventListener('click', () => insertChipSuggestion(btn.dataset.text));
}

function insertChipSuggestion(text) {
  const ta = $('tray-note');
  if (!ta) return;
  ta.value = text;
  if (_currentTrayId) State.items[_currentTrayId].finding.note = text;
  ta.focus();
}

// ── COST FIELD ────────────────────────────────────────────────
const TAX_LS_KEY = 'sansoon_tax_settings_v1';
let taxSettings = { enabled: false, rate: 13 };

function loadTaxSettings() {
  try { const r = localStorage.getItem(TAX_LS_KEY); if (r) taxSettings = JSON.parse(r); } catch(e) {}
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
  const s = State.items[itemId];
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
    if (s && s.finding && s.finding.cost && parseFloat(s.finding.cost) > 0) {
      rows.push({
        cat: cat.label, sub: sub.label, item: item.label,
        note: s.finding.note, priority: s.finding.priority,
        cost: parseFloat(s.finding.cost) || 0,
      });
    }
  })));
  return rows;
}

function buildCostPage() {
  const rows = getAllCostItems();
  if (!rows.length) return '';
  const subtotal = rows.reduce((a, r) => a + r.cost, 0);
  const taxAmt   = taxSettings.enabled ? subtotal * taxSettings.rate / 100 : 0;
  const total    = subtotal + taxAmt;
  const fmt      = n => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const rowsHTML = rows.map((r, i) =>
    '<tr>' +
    '<td class="inv-n">' + (i+1) + '</td>' +
    '<td class="inv-item"><strong>' + r.item + '</strong>' +
      '<div class="inv-path">' + r.cat + ' › ' + r.sub + '</div>' +
      (r.note ? '<div class="inv-note">' + r.note + '</div>' : '') + '</td>' +
    '<td class="inv-pri">' + (r.priority ? '<span class="rpt-ftag p' + r.priority.toLowerCase() + '">Pri ' + r.priority + '</span>' : '—') + '</td>' +
    '<td class="inv-cost">' + fmt(r.cost) + '</td>' +
    '</tr>'
  ).join('');

  return '<div class="rpt-sec-title">💰 Repair Estimate — Page 4</div>' +
    '<div class="cost-tax-bar">' +
      '<label class="cost-tax-toggle" style="display:flex;align-items:center;gap:8px;cursor:pointer">' +
        '<input type="checkbox" id="rpt-tax-toggle"' + (taxSettings.enabled ? ' checked' : '') +
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

function toggleReportTax(enabled) {
  taxSettings.enabled = enabled;
  saveTaxSettings();
  buildReport();
}
function updateTaxRate(val) {
  taxSettings.rate = parseFloat(val) || 13;
  saveTaxSettings();
}

// ── CUSTOM SECTIONS & ITEMS ───────────────────────────────────
const LS_CUSTOM = 'sansoon_custom_v1';
let customSections = [];

function loadCustomSections() {
  try { const r = localStorage.getItem(LS_CUSTOM); if (r) customSections = JSON.parse(r); } catch(e) {}
}
function saveCustomSections() {
  try { localStorage.setItem(LS_CUSTOM, JSON.stringify(customSections)); } catch(e) {}
}
function injectCustomSectionIntoDB(cs) {
  if (DB.find(c => c.id === cs.id)) return;
  DB.push({ id: cs.id, label: cs.label, icon: '📝',
    subcategories: [{ id: cs.id + '-sub', label: cs.label, items: cs.items }] });
  cs.items.forEach(it => {
    if (!State.items[it.id])
      State.items[it.id] = { status: null, finding: { active:false, note:'', priority:null, photo:null, cost:'' } };
  });
}
function addCustomSection(label) {
  const id = 'custom-' + Date.now();
  const cs = { id, label: label || 'Custom Section', items: [] };
  customSections.push(cs);
  saveCustomSections();
  injectCustomSectionIntoDB(cs);
}
function addCustomItemToSection(catId, label) {
  const itemId = 'ci-' + Date.now();
  const cat = DB.find(c => c.id === catId);
  if (!cat) return;
  let customSub = cat.subcategories.find(s => s.id === catId + '-custom');
  if (!customSub) {
    customSub = { id: catId + '-custom', label: 'Custom Items', items: [] };
    cat.subcategories.push(customSub);
  }
  customSub.items.push({ id: itemId, label: label || 'Custom item' });
  State.items[itemId] = { status: null, finding: { active:false, note:'', priority:null, photo:null, cost:'' } };
  const cs = customSections.find(s => s.id === catId);
  if (cs) { cs.items.push({ id: itemId, label: label || 'Custom item' }); saveCustomSections(); }
}

// ── CUSTOM ITEM ADD BUTTON ─────────────────────────────────────
function appendAddItemButton(catId) {
  const acc = $('accordion');
  if (!acc) return;
  const existing = $('add-item-btn');
  if (existing) existing.remove();
  const btn = document.createElement('button');
  btn.id = 'add-item-btn';
  btn.className = 'add-item-btn';
  btn.textContent = '➕ Add Custom Item to This Section';
  btn.addEventListener('click', () => {
    const label = prompt('Enter item description:');
    if (!label) return;
    addCustomItemToSection(catId, label);
    buildSearchIndex();
    renderAccordion();
    appendAddItemButton(catId);
    showToast('Item added');
  });
  acc.appendChild(btn);
}

// ── INLINE EDIT ───────────────────────────────────────────────
function enableInlineEdit(itemId, labelEl) {
  if (!labelEl) return;
  const current = labelEl.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = current;
  input.className = 'inline-edit-input';
  labelEl.replaceWith(input);
  input.focus();
  input.select();
  const commit = () => {
    const newLabel = input.value.trim() || current;
    DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(it => {
      if (it.id === itemId) it.label = newLabel;
    })));
    buildSearchIndex();
    renderAccordion();
    appendAddItemButton(Nav.activeCategory);
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { input.value = current; input.blur(); }
  });
}

// ── HUB PANEL ─────────────────────────────────────────────────
function renderHub() {
  const grid = $('hub-grid');
  if (!grid) return;
  grid.innerHTML = '';
  DB.forEach(cat => {
    const st  = getStats(catItems(cat));
    const pct = st.total ? Math.round(((st.done + st.na) / st.total) * 100) : 0;
    const done = st.done + st.na;
    const card = document.createElement('div');
    card.className = 'hub-card' +
      (st.findings ? ' hub-has-finding' : '') +
      (Nav.activeCategory === cat.id ? ' hub-was-active' : '');
    card.innerHTML =
      '<div class="hub-card-icon">' + cat.icon + '</div>' +
      '<div class="hub-card-label">' + cat.label + '</div>' +
      '<div class="hub-progress-bar"><div class="hub-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="hub-card-meta">' +
        '<span class="hub-done-count">✅ ' + done + ' / ' + st.total + '</span>' +
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
    addCustomSection(label);
    buildSearchIndex();
    renderHub();
    showToast('Custom section added');
  });
  grid.appendChild(addCard);
}

// ── SEARCH ─────────────────────────────────────────────────────
let _searchIndex = null;
function buildSearchIndex() {
  _searchIndex = [];
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    _searchIndex.push({
      catId: cat.id, catLabel: cat.label,
      subLabel: sub.label, itemId: item.id,
      label: item.label, lower: item.label.toLowerCase()
    });
  })));
}
function searchItems(query) {
  if (!_searchIndex) buildSearchIndex();
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return _searchIndex.filter(r => r.lower.includes(q)).slice(0, 10);
}
function highlightMatch(label, q) {
  const idx = label.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return label;
  return label.slice(0, idx) +
    '<mark class="search-mark">' + label.slice(idx, idx + q.length) + '</mark>' +
    label.slice(idx + q.length);
}
function jumpToItem(itemId) {
  const entry = (_searchIndex || []).find(r => r.itemId === itemId);
  if (!entry) return;
  selectCategory(entry.catId);
  setTimeout(() => {
    const cat = DB.find(c => c.id === entry.catId);
    if (cat) {
      const sub = cat.subcategories.find(s => s.items.some(i => i.id === itemId));
      if (sub) { Nav.openAccordion = sub.id; renderAccordion(); renderContextBar(); appendAddItemButton(entry.catId); updateBackBtn(); }
    }
    setTimeout(() => {
      const row = document.querySelector('.item-row[data-item-id="' + itemId + '"]');
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.classList.add('search-highlight');
        setTimeout(() => row.classList.remove('search-highlight'), 2200);
      }
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
    if (!q) { results.style.display = 'none'; return; }
    const hits = searchItems(q);
    if (!hits.length) { results.style.display = 'none'; return; }
    results.innerHTML = hits.map(h =>
      '<div class="search-result-row" data-item-id="' + h.itemId + '">' +
        '<span class="sr-cat">' + h.catLabel + ' › ' + h.subLabel + '</span>' +
        '<span class="sr-label">' + highlightMatch(h.label, q) + '</span>' +
      '</div>'
    ).join('');
    results.style.display = 'block';
    results.querySelectorAll('.search-result-row').forEach(row => {
      row.addEventListener('click', () => {
        input.value = '';
        results.style.display = 'none';
        jumpToItem(row.dataset.itemId);
      });
    });
  });
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !results.contains(e.target))
      results.style.display = 'none';
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { input.value = ''; results.style.display = 'none'; }
  });
}

// ── IMAGE MARKUP CANVAS ────────────────────────────────────────
function openMarkupCanvas(dataUrl, itemId) {
  const old = $('markup-modal');
  if (old) old.remove();
  const modal = document.createElement('div');
  modal.id = 'markup-modal';
  modal.className = 'markup-modal';
  modal.innerHTML =
    '<div class="markup-inner">' +
      '<div class="markup-toolbar">' +
        '<span class="markup-title">✏️ Mark Up Photo</span>' +
        '<div class="markup-actions">' +
          '<button id="markup-undo"  class="tb-btn">↩️ Undo</button>' +
          '<button id="markup-save"  class="tb-btn primary">💾 Save Markup</button>' +
          '<button id="markup-cancel" class="tb-btn danger">✕ Cancel</button>' +
        '</div>' +
      '</div>' +
      '<canvas id="markup-canvas" class="markup-canvas"></canvas>' +
    '</div>';
  document.body.appendChild(modal);

  const canvas = $('markup-canvas');
  const ctx    = canvas.getContext('2d');
  const history = [];
  let drawing = false, lx = 0, ly = 0;

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
    const r = canvas.getBoundingClientRect();
    const cx = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
    const cy = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY);
    return [(cx - r.left) * (canvas.width / r.width),
            (cy - r.top)  * (canvas.height / r.height)];
  }
  function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#e53535';
    ctx.lineWidth   = 4;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
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
      renderTrayPhoto(newData);
      refreshAll();
    }
    modal.remove();
    showToast('Markup saved');
  });
  $('markup-cancel').addEventListener('click', () => modal.remove());
}

