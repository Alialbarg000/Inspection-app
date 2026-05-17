/* ================================================================
   MARINE SURVEY PRO v2 — script.js
   Full data-driven inspection app with auto-focus note tray,
   accordion subcategory layout, and 3-state pill cycling.
   ================================================================ */
'use strict';

// ───────────────────────────────────────────────────────────────
// SECTION 1  ·  COMPLETE CHECKLIST DATABASE
// 21 categories, 60+ subcategories, 400+ inspection points.
// Structure: { id, label, icon, subcategories: [{ id, label, items: [{ id, label }] }] }
// ───────────────────────────────────────────────────────────────
const DB = [
  // ── 1 ─────────────────────────────────────────────────────────
  {
    id:'vessel-id', label:'Vessel ID & Documentation', icon:'📋',
    subcategories:[
      { id:'vid-reg', label:'Registration & Documentation', items:[
        {id:'vd01',label:'Hull Identification Number (HIN) — present, legible, matches title'},
        {id:'vd02',label:'State registration or USCG documentation number displayed correctly'},
        {id:'vd03',label:'Builder\'s plate — present, legible, data consistent with vessel'},
        {id:'vd04',label:'Certificate of documentation or state title — on board, unencumbered'},
        {id:'vd05',label:'Year of manufacture confirmed consistent across all documentation'},
        {id:'vd06',label:'LOA, beam, and draft confirmed consistent with listed specifications'},
        {id:'vd07',label:'Insurance certificate — current, adequate coverage, on board'},
        {id:'vd08',label:'MARPOL placard — posted if vessel is 26 ft or longer'},
        {id:'vd09',label:'Sewage discharge placard — posted in head compartment'},
        {id:'vd10',label:'Capacity plate (USCG) — present, legible, not exceeded'},
      ]},
      { id:'vid-survey', label:'Survey Context', items:[
        {id:'vs01',label:'Sea trial conducted — speed, maneuverability, steering response recorded'},
        {id:'vs02',label:'Vessel afloat or on the hard — noted in report with inspection limitations'},
        {id:'vs03',label:'Engine(s) operated under load — RPM, temperature, and duration recorded'},
        {id:'vs04',label:'Moisture meter readings taken — reference readings logged by location'},
        {id:'vs05',label:'Sounding hammer used throughout hull, deck, and structural members'},
      ]},
    ]
  },

  // ── 2 ─────────────────────────────────────────────────────────
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
        {id:'hx11',label:'Keel — attachment, garboard seam condition, weepin bolt holes, no offset'},
        {id:'hx12',label:'Keel fairing compound — condition, cracks, disbondment'},
        {id:'hx13',label:'Rub rails and fendering — secured, undamaged, end caps present'},
      ]},
      { id:'hx-thru', label:'Through-Hull Fittings (Below Waterline)', items:[
        {id:'ht01',label:'All through-hull fittings identified, counted, and charted'},
        {id:'ht02',label:'Through-hull material — bronze or Marelon (no plastic, no gate valves)'},
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

  // ── 3 ─────────────────────────────────────────────────────────
  {
    id:'deck-structure', label:'Deck & Superstructure', icon:'🏗️',
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
        {id:'dh01',label:'Cleats — backing plates present, fasteners tight, no gelcoat cracking'},
        {id:'dh02',label:'Chocks and fairleads — condition, no sharp edges, secure to deck'},
        {id:'dh03',label:'Stanchion bases — tight, no coring soft spots, backing plates verified'},
        {id:'dh04',label:'Lifelines — wire diameter, swage integrity, pelican hooks, sag check'},
        {id:'dh05',label:'Bow pulpit — fasteners, no cracks at base, height compliant'},
        {id:'dh06',label:'Stern pulpit — fasteners, no cracks at base, gate operation'},
        {id:'dh07',label:'Hatches — seals, hinges, dogs, plexiglass condition, drainage channels'},
        {id:'dh08',label:'Portlights and opening windows — seals, scratches, crazing, operation'},
        {id:'dh09',label:'Dorade vents — drain function, screens present, cowl condition'},
        {id:'dh10',label:'Compass — mounting secure, deviation card present, lighting operational'},
        {id:'dh11',label:'Windlass/capstan — motor, clutch, chain counter, breaker/fuse, deck plate'},
        {id:'dh12',label:'Winches — operation, self-tailer, service interval, pawl function'},
        {id:'dh13',label:'Mast boot and deck plate — sealant condition, no cracking'},
        {id:'dh14',label:'Bimini/dodger — frame condition, fabric UV degradation, zipper function'},
        {id:'dh15',label:'Boarding ladder — condition, security, deployment mechanism, drain'},
      ]},
    ]
  },

  // ── 4 ─────────────────────────────────────────────────────────
  {
    id:'rig-spars', label:'Rig, Spars & Sails', icon:'⛵',
    subcategories:[
      { id:'rg-standing', label:'Standing Rigging', items:[
        {id:'rg01',label:'Wire rigging age — date stamps checked, flag if >10 years or unknown'},
        {id:'rg02',label:'Wire condition — broken strands, kinks, fishhooks, corrosion pitting'},
        {id:'rg03',label:'Swage terminals — cracking, corrosion staining, pull test resistance'},
        {id:'rg04',label:'Toggle fittings — toggle pins, cotter pins or rings present and spread'},
        {id:'rg05',label:'Turnbuckles — condition, thread engagement, locking mechanisms'},
        {id:'rg06',label:'Chainplates — visible section condition, backing plates, sealant at deck'},
        {id:'rg07',label:'Chainplate area (interior) — staining, corrosion weeping, sealant failure'},
        {id:'rg08',label:'Forestay and furler — wire condition, drum bearing, foil alignment'},
        {id:'rg09',label:'Backstay — wire, tensioner or adjuster, terminal fittings'},
        {id:'rg10',label:'Spreaders — angle, condition, boots/covers, attachment hardware'},
        {id:'rg11',label:'Shroud angles — appropriate for mast and chainplate geometry'},
      ]},
      { id:'rg-spars', label:'Spars & Running Rigging', items:[
        {id:'rs01',label:'Mast extrusion — corrosion, dents, alignment, exit box condition'},
        {id:'rs02',label:'Mast sheaves — condition, lubrication, cheek blocks at exits'},
        {id:'rs03',label:'Masthead — crane, sheaves, anchor light, wind instrument mount'},
        {id:'rs04',label:'Boom — extrusion condition, vang attachment, outhaul, reefing hardware'},
        {id:'rs05',label:'Halyards — condition, clutch/jamcleat function, dead end securing'},
        {id:'rs06',label:'Sheets — diameter, condition, chafe at fairleads, stopper knots'},
        {id:'rs07',label:'Boom vang/kicker — operation, end fittings, load capacity'},
        {id:'rs08',label:'Reefing system — lines, hooks or slab points, clewring condition'},
        {id:'rs09',label:'Traveler and mainsheet — car, control lines, blocks, cleats'},
      ]},
      { id:'rg-sails', label:'Sails & Canvas', items:[
        {id:'sl01',label:'Mainsail — leech and luff condition, UV degradation, batten pockets'},
        {id:'sl02',label:'Headsail — luff tape, hanks or furling foil fit, clew patch condition'},
        {id:'sl03',label:'Spinnaker/Code Zero — if present, condition, halyard, pole fitting'},
        {id:'sl04',label:'UV covers on furled headsail — stitching, coverage, fading'},
        {id:'sl05',label:'Sail bag stowage — accessible, properly labeled, no mold/mildew'},
      ]},
    ]
  },

  // ── 5 ─────────────────────────────────────────────────────────
  {
    id:'cabin-interior', label:'Cabin & Interior', icon:'🛖',
    subcategories:[
      { id:'ci-structure', label:'Structural Elements', items:[
        {id:'ci01',label:'Main structural bulkheads — tabbing, no delamination, crack propagation'},
        {id:'ci02',label:'Partial bulkheads and furniture structures — fastening, moisture staining'},
        {id:'ci03',label:'Cabin sole condition — water damage, rot, soft areas, panel fit'},
        {id:'ci04',label:'Cabin sole hatches — fit, fasteners, labels, access clearance'},
        {id:'ci05',label:'Keel bolts (interior) — nut/washer condition, staining, corrosion'},
        {id:'ci06',label:'Structural floors — tabbing to hull, no cracking or disbonding'},
        {id:'ci07',label:'Chainplate knees (interior side) — condition, staining, weeping'},
      ]},
      { id:'ci-accommodation', label:'Accommodation & Finish', items:[
        {id:'ca01',label:'Headliner — condition, staining as leak evidence, fasteners secure'},
        {id:'ca02',label:'Cabinetry — hardware, latches adequate for seaway use'},
        {id:'ca03',label:'Joinery varnish/oil finish — condition, swelling, delamination'},
        {id:'ca04',label:'Cushions/upholstery — mildew, foam condition, cover integrity'},
        {id:'ca05',label:'Berths — structure, lee cloths or boards present and rated'},
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

  // ── 6 ─────────────────────────────────────────────────────────
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

  // ── 7 ─────────────────────────────────────────────────────────
  {
    id:'engine-main', label:'Engine & Propulsion', icon:'⚙️',
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
        {id:'ea10',label:'Motor mounts — no oil saturation on rubber, no cracking'},
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
        {id:'dr10',label:'Outboard motor (if applicable) — cowl, tilt/trim, fuel connector, water pump'},
      ]},
    ]
  },

  // ── 8 ─────────────────────────────────────────────────────────
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
        {id:'ss05',label:'Tiller (if applicable) — condition, security, emergency extension present'},
        {id:'ss06',label:'Emergency steering provision — accessible, functional, helmsman familiar'},
      ]},
    ]
  },

  // ── 9 ─────────────────────────────────────────────────────────
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

  // ── 10 ────────────────────────────────────────────────────────
  {
    id:'lpg-system', label:'LPG / CNG Cooking Fuel', icon:'🔥',
    subcategories:[
      { id:'lp-locker', label:'LPG Locker & Supply', items:[
        {id:'lp01',label:'LPG locker — overboard drain only (no through-connections to interior)'},
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
        {id:'ls05',label:'Stove mounting — secure, no movement, no exposed wiring nearby'},
      ]},
    ]
  },

  // ── 11 ────────────────────────────────────────────────────────
  {
    id:'dc-electrical', label:'DC Electrical System', icon:'⚡',
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
        {id:'dc09',label:'Wind generator (if fitted) — blade condition, regulator, dump load'},
      ]},
      { id:'dc-panel', label:'DC Panel & Wiring', items:[
        {id:'dp01',label:'Main DC panel — all circuits labeled, breaker condition, bus bars secure'},
        {id:'dp02',label:'DC fuses/breakers — appropriate sizing for wire gauge and load'},
        {id:'dp03',label:'Wire type — marine-grade tinned copper throughout (ABYC E-11)'},
        {id:'dp04',label:'Wire sizing — appropriate for circuit ampacity and total length of run'},
        {id:'dp05',label:'Wire routing — secured every 18", away from heat, no chafe points'},
        {id:'dp06',label:'Connections — proper marine terminals, no twist-and-tape splices'},
        {id:'dp07',label:'Bilge wiring — elevated above normal water level throughout'},
        {id:'dp08',label:'Engine compartment wiring — heat-rated, secured, clear of moving parts'},
        {id:'dp09',label:'Wire labeling — circuits labeled at both ends or per ABYC color code'},
      ]},
    ]
  },

  // ── 12 ────────────────────────────────────────────────────────
  {
    id:'ac-electrical', label:'AC Shore Power & Inverter', icon:'🔌',
    subcategories:[
      { id:'ac-shore', label:'Shore Power System', items:[
        {id:'ac01',label:'Shore power inlet — connector type (30A/50A), condition, corrosion'},
        {id:'ac02',label:'Reverse polarity indicator — present, tested, prominent location'},
        {id:'ac03',label:'Main AC panel — breaker condition, GFCI protection on wet area circuits'},
        {id:'ac04',label:'AC wiring — routing, insulation condition, no exposed conductors'},
        {id:'ac05',label:'Galvanic isolator or isolation transformer — present, tested with meter'},
        {id:'ac06',label:'AC outlets — GFCI protected in heads, cockpit, galley; condition'},
        {id:'ac07',label:'Shore cord — type, condition, appropriate ampacity, storage method'},
      ]},
      { id:'ac-gen', label:'Generator & Inverter', items:[
        {id:'ag01',label:'Generator (if fitted) — hours, operation, exhaust routing, seacock'},
        {id:'ag02',label:'Generator raw water cooling — impeller history, seacock, strainer'},
        {id:'ag03',label:'Inverter (if fitted) — capacity, mounting, connections, ventilation'},
        {id:'ag04',label:'Inverter/charger combination — programmable settings, battery type match'},
      ]},
    ]
  },

  // ── 13 ────────────────────────────────────────────────────────
  {
    id:'bonding', label:'Bonding & Corrosion Protection', icon:'🛡️',
    subcategories:[
      { id:'bn-system', label:'Bonding System', items:[
        {id:'bn01',label:'Bonding conductor — green wire, continuous through all underwater metals'},
        {id:'bn02',label:'Bonding continuity — resistance <1 ohm between bonded components'},
        {id:'bn03',label:'All underwater metals bonded — engine, shaft, seacocks, keel, struts'},
        {id:'bn04',label:'Bonding connections — secure, no corrosion at lugs, correct crimps'},
      ]},
      { id:'bn-zincs', label:'Zinc Anodes & Stray Current', items:[
        {id:'bz01',label:'Hull zinc anodes — consumption level, bonding wire integrity'},
        {id:'bz02',label:'Shaft zinc — consumption level, contact pressure, zinc type (zinc not aluminum)'},
        {id:'bz03',label:'Trim tab/rudder zincs (if fitted) — condition, fastening'},
        {id:'bz04',label:'Impressed current cathodic protection (if fitted) — operation, reference cell'},
        {id:'bz05',label:'Stray current test — DC measured in bilge water (corrosion risk indicator)'},
        {id:'bz06',label:'Electrolysis damage — propeller, shaft, thru-hulls inspected for pitting'},
      ]},
    ]
  },

  // ── 14 ────────────────────────────────────────────────────────
  {
    id:'nav-electronics', label:'Navigation Electronics', icon:'📡',
    subcategories:[
      { id:'ne-comm', label:'Communications', items:[
        {id:'ne01',label:'VHF radio — DSC equipped, MMSI programmed, antenna, squelch, channel 16'},
        {id:'ne02',label:'SSB/HF radio (if fitted) — operation, tuner, antenna, ground plate'},
        {id:'ne03',label:'Satellite phone or Iridium (if fitted) — coverage plan, operation'},
        {id:'ne04',label:'EPIRB — 406 MHz, NOAA registered, battery/hydrostatic release dates'},
        {id:'ne05',label:'PLB (if carried) — NOAA registered, battery expiry date'},
      ]},
      { id:'ne-nav', label:'Navigation Instruments', items:[
        {id:'nn01',label:'GPS/chartplotter — operation, chart currency, antenna, waypoint test'},
        {id:'nn02',label:'Depth sounder — operation, calibration offset, display'},
        {id:'nn03',label:'Wind instruments (if fitted) — masthead unit, calibration, display'},
        {id:'nn04',label:'AIS transponder (if fitted) — MMSI, operation, receive verified'},
        {id:'nn05',label:'Radar (if fitted) — dome condition, operation, range test'},
        {id:'nn06',label:'Autopilot — control head, compass, drive operation, mode selection'},
        {id:'nn07',label:'Log/knotmeter — paddlewheel or Doppler, calibration, display'},
      ]},
    ]
  },

  // ── 15 ────────────────────────────────────────────────────────
  {
    id:'fresh-water', label:'Fresh Water & Plumbing', icon:'🚿',
    subcategories:[
      { id:'fw-supply', label:'Fresh Water Supply', items:[
        {id:'fw01',label:'Fresh water tank(s) — material, capacity, condition, inspection port'},
        {id:'fw02',label:'Pressure pump — operation, cycling (no rapid on/off), inlet filter'},
        {id:'fw03',label:'Accumulator tank — pressure, condition, bladder integrity'},
        {id:'fw04',label:'Hot water heater — capacity, condition, pressure relief valve, anode'},
        {id:'fw05',label:'Fresh water hoses — condition, clamps, no mold, no leaks'},
        {id:'fw06',label:'Deck fill — labeled "WATER", cap condition, O-ring seal'},
        {id:'fw07',label:'Watermaker (if fitted) — hours, membrane age, operation, flush log'},
      ]},
      { id:'fw-heads', label:'Heads & Holding Tank', items:[
        {id:'hd01',label:'Toilet — operation (manual/electric), seals, hose condition, flange'},
        {id:'hd02',label:'Holding tank — capacity, condition, venting with carbon filter'},
        {id:'hd03',label:'Y-valve — function, placard (closed in restricted waters)'},
        {id:'hd04',label:'Discharge hose — odor permeation test, double-clamps, condition'},
        {id:'hd05',label:'Macerator pump (if fitted) — operation, wiring, check valve'},
        {id:'hd06',label:'Head seacock — operation, condition, labeled, accessible'},
        {id:'hd07',label:'Shower sump — pump operation, check valve, strainer, switch'},
      ]},
    ]
  },

  // ── 16 ────────────────────────────────────────────────────────
  {
    id:'safety-lifesaving', label:'Safety & Life-Saving Equipment', icon:'🆘',
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
        {id:'ds02',label:'Electronic flare / SOS device (if substituting) — battery, registration'},
        {id:'ds03',label:'SOLAS-grade signals — required if >3 nautical miles offshore'},
        {id:'ds04',label:'Liferaft (if carried) — service date, capacity, hydrostatic release date'},
        {id:'ds05',label:'Liferaft mounting — pelican hook, painter length, HRU condition'},
        {id:'ds06',label:'Horseshoe buoy — condition, drogue attached, self-activating light'},
        {id:'ds07',label:'Man-overboard pole — light operational, drogue, condition, mounting'},
        {id:'ds08',label:'First aid kit — contents adequate, expiry dates checked, manual present'},
      ]},
    ]
  },

  // ── 17 ────────────────────────────────────────────────────────
  {
    id:'fire-safety', label:'Fire Safety', icon:'🧯',
    subcategories:[
      { id:'ff-extinguishers', label:'Fire Extinguishers', items:[
        {id:'ff01',label:'Portable extinguishers — quantity meets USCG requirement for vessel size'},
        {id:'ff02',label:'Extinguisher type — B-I or B-II rating, current hydrostatic test date'},
        {id:'ff03',label:'Extinguisher mounting — quick-release brackets, accessible locations'},
        {id:'ff04',label:'Extinguisher condition — pressure in green zone, no corrosion, pin present'},
        {id:'ff05',label:'Engine room fixed suppression — type, cable pull or auto trigger, service date'},
        {id:'ff06',label:'Engine room fire port — clear, labeled, extinguisher nozzle accessible'},
      ]},
      { id:'ff-detectors', label:'Detectors & Alarms', items:[
        {id:'fd01',label:'Smoke detector — present in accommodation, functional, battery fresh'},
        {id:'fd02',label:'CO detector — present in sleeping areas, functional, battery fresh'},
        {id:'fd03',label:'LPG/CNG detector — sensor at lowest point in bilge, function tested'},
        {id:'fd04',label:'Fire blanket — present in galley, accessible, condition'},
      ]},
    ]
  },

  // ── 18 ────────────────────────────────────────────────────────
  {
    id:'nav-lights', label:'Navigation Lights & Sound', icon:'🔦',
    subcategories:[
      { id:'nl-lights', label:'Navigation Lights', items:[
        {id:'nl01',label:'Port and starboard sidelights — LED or bulb, correct arc (112.5°), function'},
        {id:'nl02',label:'Stern light — condition, correct arc (135°), function'},
        {id:'nl03',label:'Masthead light (power) or tricolor (sailing) — condition, function, arc'},
        {id:'nl04',label:'Anchor light — function, 360° arc, location visibility'},
        {id:'nl05',label:'Steaming light (sailboats) — separate from tricolor, function'},
        {id:'nl06',label:'Deck floodlights — condition, operation, switch location'},
        {id:'nl07',label:'Navigation light panel — individual circuit breakers or fuses'},
        {id:'nl08',label:'Day shapes — ball, cone, diamond, cylinder — present as required by vessel type'},
      ]},
      { id:'nl-sound', label:'Sound Signals', items:[
        {id:'ns01',label:'Electric horn — tested, audible at required distance, weatherproof'},
        {id:'ns02',label:'Backup horn (compressed air or mouth) — present, condition'},
        {id:'ns03',label:'Bell — present for vessels >12 meters, condition, accessible'},
        {id:'ns04',label:'Foghorn protocol knowledge — operating instructions available on board'},
      ]},
    ]
  },

  // ── 19 ────────────────────────────────────────────────────────
  {
    id:'anchoring-ground', label:'Ground Tackle & Docking', icon:'🪝',
    subcategories:[
      { id:'an-tackle', label:'Anchor Systems', items:[
        {id:'an01',label:'Primary anchor — type, weight appropriate for vessel displacement and use'},
        {id:'an02',label:'Anchor chain — size (3/8" min for 40ft), condition, length (marked every 25ft)'},
        {id:'an03',label:'Anchor rode (rope) — diameter, nylon, length (5:1 scope + chain), condition'},
        {id:'an04',label:'Chain-to-rode splice or shackle — moused, condition'},
        {id:'an05',label:'Anchor chain shackle — moused with seizing wire, correct size'},
        {id:'an06',label:'Secondary anchor — type, weight, accessible, rode attached'},
        {id:'an07',label:'Anchor stowage — secured on bow roller, no chafe on deck fittings'},
      ]},
      { id:'an-docking', label:'Docking & Mooring', items:[
        {id:'dk01x',label:'Dock lines — minimum 4 lines, diameter, length, condition, chafe gear'},
        {id:'dk02x',label:'Fenders — quantity (minimum 4), size appropriate for vessel, condition'},
        {id:'dk03x',label:'Mooring gear — bridle, pennant, chain snubber if applicable'},
        {id:'dk04x',label:'Boathook — present, functional, length appropriate'},
        {id:'dk05x',label:'Heaving line — present, condition, monkey fist or throw bag'},
      ]},
    ]
  },

  // ── 20 ────────────────────────────────────────────────────────
  {
    id:'dinghy-outboard', label:'Dinghy & Outboard', icon:'🚣',
    subcategories:[
      { id:'dy-dinghy', label:'Tender / Dinghy', items:[
        {id:'dy01',label:'Dinghy hull — condition, inflation (inflatable), structural integrity'},
        {id:'dy02',label:'Dinghy registration — documentation, numbers displayed'},
        {id:'dy03',label:'Dinghy oars — pair present, oarlocks, stowage method'},
        {id:'dy04',label:'Dinghy painter — length adequate, cleat, chafe protection'},
        {id:'dy05',label:'Dinghy davits (if fitted) — condition, capacity, falls, chocks'},
      ]},
      { id:'dy-outboard', label:'Dinghy Outboard', items:[
        {id:'do01',label:'Outboard make, model, horsepower — recorded'},
        {id:'do02',label:'Outboard condition — cowl, tilt/trim, water pump tell-tale'},
        {id:'do03',label:'Outboard fuel tank — type, portable, condition, primer bulb'},
        {id:'do04',label:'Outboard kill switch — lanyard present, operation tested'},
        {id:'do05',label:'Outboard bracket or mount — condition, locking mechanism, zincs'},
      ]},
    ]
  },

  // ── 21 ────────────────────────────────────────────────────────
  {
    id:'misc-systems', label:'Miscellaneous Systems', icon:'🔩',
    subcategories:[
      { id:'ms-mechanical', label:'Additional Mechanical', items:[
        {id:'ms01',label:'Windlass — operation, clutch, chain counter, circuit breaker, deck plate seal'},
        {id:'ms02',label:'Watermaker (detailed) — hours, membrane service, brine discharge, pre-filters'},
        {id:'ms03',label:'Air conditioning (if fitted) — seacock, raw water pump, thermostat, drain'},
        {id:'ms04',label:'Heating system (if fitted) — fuel type, combustion air, CO risk, condition'},
        {id:'ms05',label:'Davit system (if fitted) — load rating, sheaves, falls, securing to deck'},
        {id:'ms06',label:'Swim ladder — deployment, securing, non-skid, drain'},
      ]},
      { id:'ms-misc', label:'General & Tools', items:[
        {id:'gn01',label:'Tool kit on board — appropriate for offshore self-sufficiency'},
        {id:'gn02',label:'Spare parts inventory — impeller, filters, belts, bulbs, fuses'},
        {id:'gn03',label:'Damage control equipment — softwood plugs at all through-hulls, taped'},
        {id:'gn04',label:'Charts and pilot books — current edition, coverage for cruising area'},
        {id:'gn05',label:'Operator manuals — engine, electronics, safety equipment on board'},
        {id:'gn06',label:'Float plan system — procedure in place, emergency contacts listed'},
        {id:'gn07',label:'Vessel logbook — maintained, records up to date'},
      ]},
    ]
  },
];

// ───────────────────────────────────────────────────────────────
// SECTION 2  ·  APPLICATION STATE
// status cycle: null → 'progress' → 'done' → null
// finding: { active, note, priority: 'A'|'B'|'C'|null }
// ───────────────────────────────────────────────────────────────
const State = {
  items: {},          // keyed by item id
  activeCategory: null,
  openAccordion: null,
  noteTrayItemId: null,
  filterMode: 'all',
};

function initState() {
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    State.items[item.id] = { status: null, finding: { active: false, note: '', priority: null } };
  })));
}

// ───────────────────────────────────────────────────────────────
// SECTION 3  ·  HELPERS
// ───────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const allItems = () => DB.flatMap(c => c.subcategories.flatMap(s => s.items));

function getStats(items) {
  let done = 0, prog = 0, findings = 0;
  items.forEach(it => {
    const s = State.items[it.id];
    if (s.status === 'done') done++;
    else if (s.status === 'progress') prog++;
    if (s.finding.active) findings++;
  });
  return { total: items.length, done, prog, findings, rem: items.length - done };
}

function catItems(cat)  { return cat.subcategories.flatMap(s => s.items); }
function subItems(sub)  { return sub.items; }

// ───────────────────────────────────────────────────────────────
// SECTION 4  ·  STATS CALCULATIONS
// ───────────────────────────────────────────────────────────────
function globalStats() { return getStats(allItems()); }

// ───────────────────────────────────────────────────────────────
// SECTION 5  ·  CATEGORY CAPSULE BAR
// ───────────────────────────────────────────────────────────────
function renderCategoryBar() {
  const bar = $('cat-bar');
  bar.innerHTML = '';
  DB.forEach(cat => {
    const items = catItems(cat);
    const st = getStats(items);
    const pct = st.total ? Math.round((st.done / st.total) * 100) : 0;
    const isActive = State.activeCategory === cat.id;
    const hasFinding = st.findings > 0;

    const btn = document.createElement('button');
    btn.className = 'cat-cap' + (isActive ? ' active' : '') + (hasFinding ? ' has-finding' : '');
    btn.dataset.catId = cat.id;
    btn.innerHTML = `
      <span class="cap-icon">${cat.icon}</span>
      <span class="cap-label">${cat.label}</span>
      <span class="cap-pct">${pct}%</span>
      ${hasFinding ? `<span class="cap-flag">⚑${st.findings}</span>` : ''}
    `;
    btn.addEventListener('click', () => selectCategory(cat.id));
    bar.appendChild(btn);
  });
}

// ───────────────────────────────────────────────────────────────
// SECTION 6  ·  ACCORDION RENDER
// ───────────────────────────────────────────────────────────────
function renderAccordion() {
  const cat = DB.find(c => c.id === State.activeCategory);
  if (!cat) { $('accordion').innerHTML = ''; return; }

  const acc = $('accordion');
  acc.innerHTML = '';

  cat.subcategories.forEach((sub, idx) => {
    const items = subItems(sub);
    const st = getStats(items);
    const isOpen = State.openAccordion === sub.id ||
                   (State.openAccordion === null && idx === 0);
    if (State.openAccordion === null && idx === 0) State.openAccordion = sub.id;

    const pct = st.total ? Math.round((st.done / st.total) * 100) : 0;

    const section = document.createElement('div');
    section.className = 'acc-section' + (isOpen ? ' open' : '');
    section.dataset.subId = sub.id;

    // Header
    const hdr = document.createElement('div');
    hdr.className = 'acc-header';
    hdr.innerHTML = `
      <div class="acc-hdr-left">
        <span class="acc-chevron">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </span>
        <span class="acc-title">${sub.label}</span>
      </div>
      <div class="acc-hdr-right">
        ${st.findings ? `<span class="acc-flag">⚑ ${st.findings}</span>` : ''}
        <span class="acc-count">${st.done}/${st.total}</span>
        <div class="acc-minibar"><div class="acc-minifill" style="width:${pct}%"></div></div>
      </div>
    `;
    hdr.addEventListener('click', () => toggleAccordion(sub.id));

    // Body
    const body = document.createElement('div');
    body.className = 'acc-body';

    // Filter & build items
    const filteredItems = filterItems(items);
    if (filteredItems.length === 0 && items.length > 0) {
      body.innerHTML = `<div class="empty-filter">No items match the current filter.</div>`;
    } else {
      filteredItems.forEach((item, i) => {
        body.appendChild(buildItemRow(item, i + 1));
      });
    }

    section.appendChild(hdr);
    section.appendChild(body);
    acc.appendChild(section);
  });
}

function filterItems(items) {
  const f = State.filterMode;
  if (f === 'all') return items;
  if (f === 'remaining') return items.filter(it => State.items[it.id].status !== 'done');
  if (f === 'findings')  return items.filter(it => State.items[it.id].finding.active);
  return items;
}

function toggleAccordion(subId) {
  State.openAccordion = (State.openAccordion === subId) ? null : subId;
  renderAccordion();
}

// ───────────────────────────────────────────────────────────────
// SECTION 7  ·  ITEM ROW BUILDER
// ───────────────────────────────────────────────────────────────
function buildItemRow(item, num) {
  const s = State.items[item.id];
  const row = document.createElement('div');
  row.className = 'item-row' + (s.finding.active ? ' has-finding' : '');
  row.dataset.itemId = item.id;

  const statusLabels = { null: 'Not Started', progress: 'In Progress', done: 'Completed' };

  row.innerHTML = `
    <span class="item-num">${String(num).padStart(2,'0')}</span>
    <span class="item-label">${item.label}</span>
    <div class="item-controls">
      <button class="pill-btn status-${s.status || 'none'}"
              data-id="${item.id}"
              title="${statusLabels[s.status]}">
        ${pillIcon(s.status)}
        <span>${statusLabels[s.status]}</span>
      </button>
      <button class="flag-btn ${s.finding.active ? 'active' : ''}"
              data-id="${item.id}"
              title="Flag finding / deficiency">
        <svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
      </button>
    </div>
  `;

  // Pill cycle click
  row.querySelector('.pill-btn').addEventListener('click', e => {
    e.stopPropagation();
    cycleStatus(item.id);
  });

  // Flag button click
  row.querySelector('.flag-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleFinding(item.id);
  });

  return row;
}

function pillIcon(status) {
  if (status === 'done')     return `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
  if (status === 'progress') return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>`;
  return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>`;
}

// ───────────────────────────────────────────────────────────────
// SECTION 8  ·  STATUS CYCLING
// ───────────────────────────────────────────────────────────────
function cycleStatus(itemId) {
  const s = State.items[itemId];
  const cycle = { null: 'progress', progress: 'done', done: null };
  const newStatus = cycle[s.status];
  s.status = newStatus;

  // Auto-open note tray when item becomes 'progress' (finding mode)
  if (newStatus === 'progress') {
    s.finding.active = true;
    openNoteTray(itemId);
  } else if (newStatus === 'done') {
    closeNoteTray();
  } else {
    // cycled back to null - close tray
    closeNoteTray();
  }

  refreshAll();
}

// ───────────────────────────────────────────────────────────────
// SECTION 9  ·  NOTE TRAY
// ───────────────────────────────────────────────────────────────
function openNoteTray(itemId) {
  const item = allItems().find(it => it.id === itemId);
  if (!item) return;
  const s = State.items[itemId];
  State.noteTrayItemId = itemId;

  $('tray-item-label').textContent = item.label;
  $('tray-note').value = s.finding.note;

  // Set priority buttons
  document.querySelectorAll('.tray-pri-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pri === s.finding.priority);
  });

  $('note-tray').classList.add('open');

  // Auto-focus cursor in textarea
  requestAnimationFrame(() => {
    $('tray-note').focus();
    $('tray-note').selectionStart = $('tray-note').value.length;
  });
}

function closeNoteTray() {
  // Save before closing
  saveTray();
  $('note-tray').classList.remove('open');
  State.noteTrayItemId = null;
}

function saveTray() {
  const id = State.noteTrayItemId;
  if (!id) return;
  State.items[id].finding.note = $('tray-note').value;
}

function toggleFinding(itemId) {
  const s = State.items[itemId];
  if (s.finding.active) {
    s.finding.active = false;
    s.finding.note = '';
    s.finding.priority = null;
    closeNoteTray();
  } else {
    s.finding.active = true;
    openNoteTray(itemId);
  }
  refreshAll();
}

function setTrayPriority(pri) {
  const id = State.noteTrayItemId;
  if (!id) return;
  const f = State.items[id].finding;
  f.priority = (f.priority === pri) ? null : pri;
  document.querySelectorAll('.tray-pri-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pri === f.priority);
  });
}

// Enter key saves tray
function initNoteTray() {
  $('tray-note').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      closeNoteTray();
      refreshAll();
    }
  });

  $('tray-save-btn').addEventListener('click', () => {
    closeNoteTray();
    refreshAll();
  });

  $('tray-close-btn').addEventListener('click', () => {
    closeNoteTray();
    refreshAll();
  });

  document.querySelectorAll('.tray-pri-btn').forEach(btn => {
    btn.addEventListener('click', () => setTrayPriority(btn.dataset.pri));
  });

  // Clicking outside tray closes it
  $('tray-overlay').addEventListener('click', () => {
    closeNoteTray();
    refreshAll();
  });
}

// ───────────────────────────────────────────────────────────────
// SECTION 10  ·  NAVIGATION
// ───────────────────────────────────────────────────────────────
function selectCategory(catId) {
  State.activeCategory = catId;
  State.openAccordion = null;
  $('splash').style.display = 'none';
  $('report-panel').style.display = 'none';
  $('work-area').style.display = 'flex';
  refreshAll();
  window.scrollTo(0, 0);
}

// ───────────────────────────────────────────────────────────────
// SECTION 11  ·  FILTER
// ───────────────────────────────────────────────────────────────
function setFilter(mode) {
  State.filterMode = mode;
  document.querySelectorAll('.filter-pill').forEach(b =>
    b.classList.toggle('active', b.dataset.filter === mode)
  );
  renderAccordion();
}

// ───────────────────────────────────────────────────────────────
// SECTION 12  ·  GLOBAL PROGRESS
// ───────────────────────────────────────────────────────────────
function renderProgress() {
  const g = globalStats();
  const pct = g.total ? Math.round((g.done / g.total) * 100) : 0;
  $('gp-fill').style.width = pct + '%';
  $('gp-label').textContent = `${g.done} / ${g.total}`;
  $('gp-pct').textContent = pct + '%';
  $('gp-findings').textContent = g.findings ? `${g.findings} finding${g.findings !== 1 ? 's' : ''}` : '';
  $('gp-findings').style.display = g.findings ? 'inline' : 'none';
}

// ───────────────────────────────────────────────────────────────
// SECTION 13  ·  SECTION CONTEXT BAR
// ───────────────────────────────────────────────────────────────
function renderContextBar() {
  const cat = DB.find(c => c.id === State.activeCategory);
  if (!cat) return;
  const items = catItems(cat);
  const st = getStats(items);
  const pct = st.total ? Math.round((st.done / st.total) * 100) : 0;

  $('ctx-title').textContent = `${cat.icon}  ${cat.label}`;
  $('ctx-stats').innerHTML = `
    <span class="ctx-chip done">${st.done} done</span>
    <span class="ctx-chip prog">${st.prog} in progress</span>
    <span class="ctx-chip rem">${st.rem} remaining</span>
    ${st.findings ? `<span class="ctx-chip flag">${st.findings} finding${st.findings>1?'s':''}</span>` : ''}
    <span class="ctx-pct" style="color:var(--accent)">${pct}%</span>
  `;
}

// ───────────────────────────────────────────────────────────────
// SECTION 14  ·  FULL REFRESH
// ───────────────────────────────────────────────────────────────
function refreshAll() {
  renderCategoryBar();
  renderProgress();
  if (State.activeCategory) {
    renderContextBar();
    renderAccordion();
  }
}

// ───────────────────────────────────────────────────────────────
// SECTION 15  ·  REPORT GENERATION
// ───────────────────────────────────────────────────────────────
function openReport() {
  $('splash').style.display = 'none';
  $('work-area').style.display = 'none';
  $('report-panel').style.display = 'block';
  buildReport();
}

function buildReport() {
  const intake = {
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

  const fmtDate = intake.date
    ? new Date(intake.date + 'T12:00:00').toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})
    : new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});

  const g = globalStats();
  const pct = g.total ? Math.round((g.done / g.total) * 100) : 0;

  // Collect findings by priority
  const findings = { A:[], B:[], C:[] };
  DB.forEach(cat => cat.subcategories.forEach(sub => sub.items.forEach(item => {
    const s = State.items[item.id];
    if (s.finding.active) {
      const p = s.finding.priority || 'C';
      findings[p].push({ cat: cat.label, sub: sub.label, item: item.label, note: s.finding.note });
    }
  })));

  const findingSection = () => {
    const total = findings.A.length + findings.B.length + findings.C.length;
    if (!total) return `<div class="rpt-no-findings">✓ No findings or deficiencies flagged during this inspection.</div>`;

    return ['A','B','C'].map(p => {
      if (!findings[p].length) return '';
      const meta = {
        A:{ label:'Priority A — Safety / Critical',        cls:'pri-a', icon:'🔴' },
        B:{ label:'Priority B — Maintenance / Hazard',     cls:'pri-b', icon:'🟡' },
        C:{ label:'Priority C — Minor / Observations',     cls:'pri-c', icon:'🔵' },
      }[p];
      const rows = findings[p].map((f,i) => `
        <div class="rpt-find-row">
          <span class="rpt-find-n">${i+1}</span>
          <div class="rpt-find-body">
            <div class="rpt-find-path">${f.cat} › ${f.sub}</div>
            <div class="rpt-find-item">${f.item}</div>
            ${f.note ? `<div class="rpt-find-note">"${f.note}"</div>` : ''}
          </div>
        </div>`).join('');
      return `<div class="rpt-find-group ${meta.cls}">
        <div class="rpt-find-hdr">${meta.icon} ${meta.label} (${findings[p].length})</div>
        ${rows}
      </div>`;
    }).join('');
  };

  const catDetail = DB.map(cat => {
    const cst = getStats(catItems(cat));
    const cpct = cst.total ? Math.round((cst.done/cst.total)*100) : 0;
    const subBlocks = cat.subcategories.map(sub => {
      const rows = sub.items.map(item => {
        const s = State.items[item.id];
        const statusMap = { null:'—', progress:'In Progress', done:'Completed' };
        const sCls = { null:'rpt-s-none', progress:'rpt-s-prog', done:'rpt-s-done' }[s.status] || 'rpt-s-none';
        const fTag = s.finding.active
          ? `<span class="rpt-ftag p${(s.finding.priority||'C').toLowerCase()}">Pri ${s.finding.priority||'C'}</span>` : '';
        return `<tr>
          <td>${item.label}</td>
          <td><span class="rpt-stag ${sCls}">${statusMap[s.status]}</span></td>
          <td>${fTag}</td>
          <td class="rpt-note-cell">${s.finding.active && s.finding.note ? s.finding.note : ''}</td>
        </tr>`;
      }).join('');
      return `<div class="rpt-sub">
        <div class="rpt-sub-hdr">${sub.label}</div>
        <table class="rpt-tbl"><thead><tr><th>Inspection Item</th><th>Status</th><th>Finding</th><th>Notes</th></tr></thead>
        <tbody>${rows}</tbody></table>
      </div>`;
    }).join('');

    return `<div class="rpt-cat">
      <div class="rpt-cat-hdr" style="border-left:4px solid var(--accent)">
        <span>${cat.icon} ${cat.label}</span>
        <div>${cst.findings ? `<span class="rpt-fflag">${cst.findings} Findings</span>` : ''}<span class="rpt-cpct">${cpct}%</span></div>
      </div>${subBlocks}</div>`;
  }).join('');

  $('report-body').innerHTML = `
    <div class="rpt-cover">
      <div class="rpt-cvr-top">
        <div class="rpt-anchor-glyph">⚓</div>
        <div class="rpt-doc-label">MARINE SURVEY REPORT</div>
        <div class="rpt-vessel-name">${intake.vessel}</div>
        <div class="rpt-cvr-meta">${fmtDate} &nbsp;·&nbsp; ${intake.type}</div>
      </div>
      <div class="rpt-info-grid">
        ${[['Vessel',intake.vessel],['HIN / Hull ID',intake.hin],['Surveyor',intake.surveyor],
           ['Client',intake.client],['Date',fmtDate],['Survey Type',intake.type],
           ['Location',intake.location],['Weather / Sea State',intake.weather],['Reference #',intake.ref]]
          .map(([k,v])=>`<div class="rpt-irow"><span class="rpt-ikey">${k}</span><span class="rpt-ival">${v}</span></div>`).join('')}
        ${intake.scope?`<div class="rpt-irow full"><span class="rpt-ikey">Scope / Notes</span><span class="rpt-ival">${intake.scope}</span></div>`:''}
      </div>
    </div>

    <div class="rpt-stat-bar">
      <div class="rpt-stat"><div class="v">${pct}%</div><div class="l">Complete</div></div>
      <div class="rpt-stat pa"><div class="v">${findings.A.length}</div><div class="l">Priority A</div></div>
      <div class="rpt-stat pb"><div class="v">${findings.B.length}</div><div class="l">Priority B</div></div>
      <div class="rpt-stat pc"><div class="v">${findings.C.length}</div><div class="l">Priority C</div></div>
      <div class="rpt-stat"><div class="v">${g.done}</div><div class="l">Items Done</div></div>
      <div class="rpt-stat"><div class="v">${g.total - g.done}</div><div class="l">Remaining</div></div>
    </div>

    <div class="rpt-sec-title">⚑ Findings & Deficiencies</div>
    ${findingSection()}

    <div class="rpt-sec-title">📋 Detailed Inspection Results</div>
    ${catDetail}

    <div class="rpt-footer">Marine Survey Pro &nbsp;·&nbsp; ${intake.surveyor} &nbsp;·&nbsp; ${fmtDate} &nbsp;·&nbsp; ${intake.vessel}</div>
  `;
}

// ───────────────────────────────────────────────────────────────
// SECTION 16  ·  PDF EXPORT
// ───────────────────────────────────────────────────────────────
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const W=210, M=15, CW=W-M*2;
  let y=0;

  const intake = {
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
  const fmtDate = intake.date
    ? new Date(intake.date+'T12:00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})
    : new Date().toLocaleDateString();

  const g = globalStats();
  const pct = g.total ? Math.round((g.done/g.total)*100) : 0;
  const findings = {A:[],B:[],C:[]};
  DB.forEach(cat=>cat.subcategories.forEach(sub=>sub.items.forEach(item=>{
    const s=State.items[item.id];
    if(s.finding.active){ const p=s.finding.priority||'C'; findings[p].push({cat:cat.label,sub:sub.label,item:item.label,note:s.finding.note}); }
  })));

  const chk = (n=10) => { if(y+n>282){doc.addPage();y=20;} };

  // Cover header
  doc.setFillColor(8,15,28); doc.rect(0,0,210,46,'F');
  doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(180,40,40);
  doc.text('MARINE SURVEY REPORT', M, 14);
  doc.setFontSize(18); doc.setTextColor(255,255,255);
  doc.text(intake.vessel, M, 26);
  doc.setFontSize(8.5); doc.setTextColor(140,160,190); doc.setFont('helvetica','normal');
  doc.text(`${intake.type}  ·  ${fmtDate}  ·  ${intake.surveyor}`, M, 36);
  y = 58;

  // Info rows
  const infoRows=[['HIN',intake.hin],['Client',intake.client],['Location',intake.location],['Weather',intake.weather],['Reference',intake.ref]];
  infoRows.forEach(([k,v])=>{
    chk(7); doc.setFontSize(7.5); doc.setFont('helvetica','bold'); doc.setTextColor(100,120,150);
    doc.text(k.toUpperCase(), M, y); doc.setFont('helvetica','normal'); doc.setTextColor(30,35,50);
    doc.text(String(v), M+28, y); y+=6;
  }); y+=4;

  // Stats band
  doc.setFillColor(240,245,252); doc.roundedRect(M,y,CW,16,2,2,'F');
  const sts=[`${pct}%`,`${findings.A.length}`,`${findings.B.length}`,`${findings.C.length}`,`${g.done}/${g.total}`];
  const stl=['Complete','Priority A','Priority B','Priority C','Items Done'];
  const sw=CW/sts.length;
  sts.forEach((v,i)=>{
    const x=M+i*sw+sw/2;
    doc.setFontSize(11);doc.setFont('helvetica','bold');doc.setTextColor(10,16,30);doc.text(v,x,y+8,{align:'center'});
    doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.setTextColor(100,120,150);doc.text(stl[i],x,y+13.5,{align:'center'});
  }); y+=24;

  // Findings
  const allF=[...findings.A.map(f=>({...f,p:'A'})),...findings.B.map(f=>({...f,p:'B'})),...findings.C.map(f=>({...f,p:'C'}))];
  if(allF.length){
    chk(12); doc.setFontSize(10);doc.setFont('helvetica','bold');doc.setTextColor(8,15,28);
    doc.text('FINDINGS & DEFICIENCIES',M,y); y+=5;
    doc.setDrawColor(180,40,40);doc.line(M,y,M+CW,y); y+=5;
    const pc={A:[220,38,38],B:[215,115,5],C:[59,130,246]};
    allF.forEach(f=>{
      chk(16); const col=pc[f.p];
      doc.setFillColor(...col);doc.rect(M,y,2,10,'F');
      doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(...col);
      doc.text(`PRI ${f.p}`,M+4,y+5);
      doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.setTextColor(20,25,40);
      const il=doc.splitTextToSize(f.item,CW-30);doc.text(il,M+20,y+5);
      doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(90,100,120);
      doc.text(`${f.cat} › ${f.sub}`,M+20,y+5+il.length*4.5);
      if(f.note){const nl=doc.splitTextToSize(`Note: ${f.note}`,CW-30);doc.setTextColor(120,90,40);doc.text(nl,M+20,y+5+il.length*4.5+4);y+=nl.length*3.5;}
      doc.setDrawColor(220,225,235);doc.line(M,y+13,M+CW,y+13); y+=16;
    }); y+=4;
  }

  // Detailed
  DB.forEach(cat=>{
    chk(12);
    doc.setFillColor(8,15,28);doc.rect(M,y,CW,8,'F');
    doc.setFontSize(9);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
    doc.text(`${cat.icon}  ${cat.label.toUpperCase()}`,M+4,y+5.5); y+=11;
    cat.subcategories.forEach(sub=>{
      chk(8); doc.setFillColor(240,243,250);doc.rect(M,y,CW,6,'F');
      doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(50,70,100);
      doc.text(sub.label,M+3,y+4.5); y+=9;
      sub.items.forEach(item=>{
        chk(7); const s=State.items[item.id];
        const stlbl={null:'—',progress:'In Progress',done:'✓'}[s.status]||'—';
        const stcol={null:[160,165,175],progress:[215,115,5],done:[22,160,75]}[s.status]||[160,165,175];
        doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(...stcol);
        doc.text(stlbl,M+2,y+4);
        doc.setFont('helvetica','normal');doc.setTextColor(30,35,50);
        const ll=doc.splitTextToSize(item.label,CW-26);doc.text(ll,M+14,y+4);
        if(s.finding.active){
          const pc2={A:[220,38,38],B:[215,115,5],C:[59,130,246]}[s.finding.priority||'C'];
          doc.setFont('helvetica','bold');doc.setFontSize(7);doc.setTextColor(...pc2);
          doc.text(`[PRI ${s.finding.priority||'C'}]`,W-M-2,y+4,{align:'right'});
        }
        y+=ll.length*4+1;
        if(s.finding.active&&s.finding.note){
          chk(5); const nl2=doc.splitTextToSize(`↳ ${s.finding.note}`,CW-18);
          doc.setFont('helvetica','italic');doc.setFontSize(7);doc.setTextColor(110,85,35);
          doc.text(nl2,M+14,y); y+=nl2.length*3.5+1;
        }
        doc.setDrawColor(225,228,235);doc.line(M+12,y,M+CW,y); y+=2;
      }); y+=3;
    }); y+=4;
  });

  // Footers
  const pages=doc.getNumberOfPages();
  for(let i=1;i<=pages;i++){
    doc.setPage(i);
    doc.setFontSize(7);doc.setTextColor(150,155,165);doc.setFont('helvetica','normal');
    doc.text(`Marine Survey Pro  ·  ${intake.vessel}  ·  ${fmtDate}`,M,292);
    doc.text(`Page ${i} of ${pages}`,W-M,292,{align:'right'});
  }

  doc.save(`survey-${(intake.vessel||'vessel').replace(/\s+/g,'-').toLowerCase()}-${intake.date||'report'}.pdf`);
  showToast('PDF downloaded');
}

// ───────────────────────────────────────────────────────────────
// SECTION 17  ·  RESET
// ───────────────────────────────────────────────────────────────
function resetAll() {
  if (!confirm('Reset all inspection data? This cannot be undone.')) return;
  initState();
  State.activeCategory = null;
  State.openAccordion = null;
  State.noteTrayItemId = null;
  State.filterMode = 'all';
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
  $('note-tray').classList.remove('open');
  $('work-area').style.display = 'none';
  $('report-panel').style.display = 'none';
  $('splash').style.display = 'flex';
  renderCategoryBar();
  renderProgress();
  showToast('Inspection reset');
}

// ───────────────────────────────────────────────────────────────
// SECTION 18  ·  TOAST
// ───────────────────────────────────────────────────────────────
let _toastTimer;
function showToast(msg) {
  const t = $('toast'); $('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ───────────────────────────────────────────────────────────────
// SECTION 19  ·  BOOTSTRAP
// ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initState();
  $('v-date').valueAsDate = new Date();

  // Filter pills
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  // Report button
  $('btn-report').addEventListener('click', openReport);
  $('btn-report-2').addEventListener('click', openReport);

  // Back to survey
  $('btn-back-survey').addEventListener('click', () => {
    $('report-panel').style.display = 'none';
    if (State.activeCategory) {
      $('work-area').style.display = 'flex';
    } else {
      $('splash').style.display = 'flex';
    }
  });

  // PDF download
  $('btn-pdf').addEventListener('click', downloadPDF);

  // Refresh report
  $('btn-refresh-rpt').addEventListener('click', buildReport);

  // Reset
  $('btn-reset').addEventListener('click', resetAll);

  // Start survey from splash
  $('btn-start').addEventListener('click', () => {
    const name = $('v-name').value.trim();
    const surv = $('v-surveyor').value.trim();
    if (!name || !surv) { showToast('⚠️  Enter Vessel Name and Surveyor Name'); return; }
    selectCategory('vessel-id');
  });

  initNoteTray();
  renderCategoryBar();
  renderProgress();
});
