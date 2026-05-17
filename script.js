/* ============================================================
   MARINE SURVEY PRO — script.js
   Data-driven marine inspection application
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────────────────────
// SECTION 1 · COMPLETE CHECKLIST DATABASE
// Edit items here. Structure: Category → SubCategory → items[]
// Each item: { id, label, note? }
// ─────────────────────────────────────────────────────────────
const CHECKLIST_DB = [
  {
    id: "hull-deck",
    label: "Vessel Information & Hull / Deck",
    icon: "⚓",
    color: "#0ea5e9",
    subcategories: [
      {
        id: "vessel-id",
        label: "Vessel Identification",
        items: [
          { id: "vi-01", label: "HIN (Hull Identification Number) – present, legible, matches documentation" },
          { id: "vi-02", label: "State/USCG registration numbers displayed correctly" },
          { id: "vi-03", label: "Builder's plate – present, legible, data consistent" },
          { id: "vi-04", label: "Documentation / registration papers inspected and on board" },
          { id: "vi-05", label: "LOA, beam, draft confirmed consistent with specs" },
          { id: "vi-06", label: "Year of manufacture consistent across documentation" },
        ]
      },
      {
        id: "hull-exterior",
        label: "Hull Exterior",
        items: [
          { id: "he-01", label: "Hull bottom – overall condition, antifouling paint coverage" },
          { id: "he-02", label: "Osmotic blistering – presence, severity, distribution (spot/widespread)" },
          { id: "he-03", label: "Gelcoat / paint – crazing, star cracking, delamination, impact damage" },
          { id: "he-04", label: "Hull-to-deck joint – sealant integrity, fastener condition, no separation" },
          { id: "he-05", label: "Waterline – fairness, no hard spots or unfair sections" },
          { id: "he-06", label: "Bow section – impact damage, abrasion, structural integrity" },
          { id: "he-07", label: "Stern section – impact damage, transom integrity, no softness" },
          { id: "he-08", label: "Keel attachment (if applicable) – fasteners, garboard seam, no weeping" },
          { id: "he-09", label: "Hull sides – fairness, impact damage, stress cracks" },
          { id: "he-10", label: "Rub rails / fendering – secure, undamaged, end caps intact" },
          { id: "he-11", label: "Boot stripe / waterline tape – condition and adhesion" },
          { id: "he-12", label: "Depth sounder transducer – condition, fairing, sealant" },
          { id: "he-13", label: "Speed/temp transducers – condition, fairing, sealant" },
          { id: "he-14", label: "Through-hull fittings (below waterline) – condition, corrosion, sealant" },
          { id: "he-15", label: "Zinc anodes (hull) – consumption level (<50% remaining flag)" },
        ]
      },
      {
        id: "deck-structure",
        label: "Deck & Structural",
        items: [
          { id: "ds-01", label: "Deck surface – non-skid condition, delamination, soft spots" },
          { id: "ds-02", label: "Deck coring – tap test for delamination around fittings and high-load areas" },
          { id: "ds-03", label: "Cockpit – drainage, sole condition, seat integrity" },
          { id: "ds-04", label: "Cockpit sole – structural integrity, no softness underfoot" },
          { id: "ds-05", label: "Transom – structural firmness, no softness, gelcoat/paint condition" },
          { id: "ds-06", label: "Swim platform – attachment, structural integrity, non-skid" },
          { id: "ds-07", label: "Stringers – visible sections, no delamination, tabbing intact" },
          { id: "ds-08", label: "Bulkheads (hull connection) – tabbing integrity, no delamination" },
          { id: "ds-09", label: "Frames / floors – condition and attachment" },
        ]
      },
      {
        id: "deck-fittings",
        label: "Deck Fittings & Hardware",
        items: [
          { id: "df-01", label: "Cleats – backing plates, fastener tightness, no cracks" },
          { id: "df-02", label: "Chocks / fairleads – condition, no sharp edges, secure" },
          { id: "df-03", label: "Stanchion bases – tight, no deck coring soft spots, backing plates" },
          { id: "df-04", label: "Lifelines – wire condition, swage fittings, pelican hooks, tension" },
          { id: "df-05", label: "Bow pulpit / stern pulpit – fastener integrity, no cracks" },
          { id: "df-06", label: "Hatches – seals, hinges, dogs, drainage channels, plexiglass" },
          { id: "df-07", label: "Portlights / windows – seals, scratching, crazing, no leaks" },
          { id: "df-08", label: "Dorade vents – condition, drain function, covers" },
          { id: "df-09", label: "Compass – mounting, deviation, lighting" },
          { id: "df-10", label: "Windlass / capstan – operation, motor, breaker/fuse, chain counter" },
          { id: "df-11", label: "Winches – operation, self-tailer condition, service interval" },
          { id: "df-12", label: "Traveler / mainsheet system – blocks, cars, cleats, condition" },
          { id: "df-13", label: "Mast boot / deck plate – sealant, condition" },
          { id: "df-14", label: "Boarding ladder – condition, security, drain" },
          { id: "df-15", label: "Bimini / dodger – fabric, frame, zippers, support, UV degradation" },
        ]
      },
      {
        id: "rig-spars",
        label: "Rig & Spars (Sailing Vessels)",
        items: [
          { id: "rs-01", label: "Mast – extrusion condition, exits, sheaves, masthead condition" },
          { id: "rs-02", label: "Boom – extrusion, vang attachment, outhaul, reefing hardware" },
          { id: "rs-03", label: "Standing rigging – wire condition, swage integrity, corrosion, age" },
          { id: "rs-04", label: "Turnbuckles / toggle fittings – toggle pins, cotter pins, corrosion" },
          { id: "rs-05", label: "Chainplates – backing, sealant, corrosion staining on deck/liner" },
          { id: "rs-06", label: "Forestay / backstay – condition, furler drum, swivels" },
          { id: "rs-07", label: "Running rigging – halyards, sheets, leads, clutches, condition" },
          { id: "rs-08", label: "Furling systems – drum, foil, bearing, function" },
          { id: "rs-09", label: "Sails – overall condition, UV covers, batten pockets, stitching" },
        ]
      }
    ]
  },

  {
    id: "cabin-interior",
    label: "Cabin & Interior",
    icon: "🛖",
    color: "#a78bfa",
    subcategories: [
      {
        id: "bilge",
        label: "Bilge Spaces",
        items: [
          { id: "bi-01", label: "Bilge – cleanliness, absence of fuel odour, oil/water mixture" },
          { id: "bi-02", label: "Bilge water – colour, smell (fuel/raw sewage contamination)" },
          { id: "bi-03", label: "Bilge pump (electric) – operation, switch function, strum box clear" },
          { id: "bi-04", label: "Bilge pump (manual) – operation, hose condition, flap valves" },
          { id: "bi-05", label: "Float switch – operation, mounting height, corrosion" },
          { id: "bi-06", label: "Bilge high-water alarm – tested and functional" },
          { id: "bi-07", label: "Limber holes – clear of debris, flow path unobstructed" },
          { id: "bi-08", label: "Engine bilge pan / drip tray – condition, drainage, no oil accumulation" },
        ]
      },
      {
        id: "structural-interior",
        label: "Structural Bulkheads & Sole",
        items: [
          { id: "si-01", label: "Main structural bulkheads – tabbing, delamination, crack propagation" },
          { id: "si-02", label: "Partial bulkheads / furniture – fastening, condition" },
          { id: "si-03", label: "Cabin sole – condition, water damage, rot, soft areas" },
          { id: "si-04", label: "Cabin sole access panels – fit, fasteners, labels" },
          { id: "si-05", label: "Keel bolts (interior) – nut/washer condition, staining, corrosion" },
          { id: "si-06", label: "Floors (structural) – tabbing to hull, condition" },
          { id: "si-07", label: "Chainplate knees / brackets (interior side) – condition" },
        ]
      },
      {
        id: "woodwork-finish",
        label: "Woodwork & Finishes",
        items: [
          { id: "wf-01", label: "Cabinetry – condition, hardware, latches for seaway" },
          { id: "wf-02", label: "Joinery – varnish/oil finish condition, swelling, delamination" },
          { id: "wf-03", label: "Headliner – condition, staining (leak evidence), fasteners" },
          { id: "wf-04", label: "Cushions / upholstery – mildew, structural foam, cover condition" },
          { id: "wf-05", label: "Berths – structure, lee cloths / boards present" },
          { id: "wf-06", label: "Galley – structure, stove mounting, fiddles, drainage" },
          { id: "wf-07", label: "Nav station – structure, seating, chart table" },
        ]
      },
      {
        id: "ventilation",
        label: "Ventilation & Escape",
        items: [
          { id: "ve-01", label: "Opening hatches – operation, seals, safety wire/safety straps" },
          { id: "ve-02", label: "Fixed ventilation – Dorades/cowls functioning, screen present" },
          { id: "ve-03", label: "Companionway – drop boards secure, washboards condition" },
          { id: "ve-04", label: "Emergency escape hatch – operable from interior, labelled" },
          { id: "ve-05", label: "Engine room ventilation – intake/exhaust sizing, screens" },
          { id: "ve-06", label: "LPG/CNG locker ventilation – drain to cockpit/overboard, sealed from interior" },
        ]
      },
      {
        id: "heads",
        label: "Heads & Holding",
        items: [
          { id: "hd-01", label: "Toilet – operation (manual/electric), seals, hose condition" },
          { id: "hd-02", label: "Holding tank – capacity, condition, venting (carbon filter)" },
          { id: "hd-03", label: "Y-valve – function, placard (closed in restricted waters)" },
          { id: "hd-04", label: "Discharge hose – odour permeation, clamp condition" },
          { id: "hd-05", label: "Macerator pump (if fitted) – operation, wiring" },
          { id: "hd-06", label: "Head seacock – operation, condition, labelled" },
          { id: "hd-07", label: "Shower sump – pump operation, switch, check valve" },
        ]
      }
    ]
  },

  {
    id: "propulsion",
    label: "Propulsion & Mechanical",
    icon: "⚙️",
    color: "#f97316",
    subcategories: [
      {
        id: "engine-general",
        label: "Engine – General Condition",
        items: [
          { id: "eg-01", label: "Engine make/model/serial – recorded, matches documentation" },
          { id: "eg-02", label: "Engine hours – recorded from meter" },
          { id: "eg-03", label: "Engine mounts – condition, corrosion, alignment witness marks" },
          { id: "eg-04", label: "Engine oil – level, colour, condition (no milky contamination)" },
          { id: "eg-05", label: "Coolant – level, colour, no oil contamination" },
          { id: "eg-06", label: "Raw water impeller – service history, condition if inspected" },
          { id: "eg-07", label: "Heat exchanger – corrosion, zincs present and functional" },
          { id: "eg-08", label: "Transmission oil – level, condition" },
          { id: "eg-09", label: "Engine-room cleanliness – oil accumulation, fuel residue" },
        ]
      },
      {
        id: "engine-systems",
        label: "Engine Ancillary Systems",
        items: [
          { id: "es-01", label: "Belts (alternator/raw water) – tension, cracking, fraying" },
          { id: "es-02", label: "Hoses – cooling, exhaust elbow, clamps (double-clamp below waterline)" },
          { id: "es-03", label: "Exhaust system – water-lift muffler, thru-hull, no burn marks" },
          { id: "es-04", label: "Sea strainer – condition, clear, seacock upstream" },
          { id: "es-05", label: "Raw water seacock (engine) – operation, condition, labelled" },
          { id: "es-06", label: "Air intake / flame arrester – screen clean, no restriction" },
          { id: "es-07", label: "Engine controls – throttle, shift cables, smooth operation" },
          { id: "es-08", label: "Engine instrumentation – oil pressure, temp, volts, RPM" },
          { id: "es-09", label: "Engine start/stop – reliable, no excessive cranking" },
          { id: "es-10", label: "Engine operation under load – no smoke, overheating, vibration" },
          { id: "es-11", label: "Engine zincs – present, consumption level" },
          { id: "es-12", label: "Motor mounts / isolation – no oil saturation, condition" },
        ]
      },
      {
        id: "drivetrain",
        label: "Drivetrain & Running Gear",
        items: [
          { id: "dt-01", label: "Propeller shaft – straightness, corrosion, coupling bolts" },
          { id: "dt-02", label: "Shaft seal / packing gland – drip rate (1 drop/min acceptable), no over-tightening" },
          { id: "dt-03", label: "Cutless bearing – wear (play test), condition" },
          { id: "dt-04", label: "Struts – condition, fastening, no cracks at base" },
          { id: "dt-05", label: "Propeller – blade condition, pitch consistency, cavitation erosion, electrolysis" },
          { id: "dt-06", label: "Prop nut / tab washer – present, secure" },
          { id: "dt-07", label: "Shaft zinc – present, consumption level" },
          { id: "dt-08", label: "Shaft coupling – alignment, fastener torque, flexible element condition" },
          { id: "dt-09", label: "Saildrive (if applicable) – bellows condition, diaphragm integrity" },
          { id: "dt-10", label: "Outboard (if applicable) – motor condition, cowl, tilt/trim, fuel connection" },
        ]
      },
      {
        id: "steering",
        label: "Steering & Rudder",
        items: [
          { id: "st-01", label: "Rudder – full range of movement, no excessive play" },
          { id: "st-02", label: "Rudder bearings – play (fore/aft and lateral), condition" },
          { id: "st-03", label: "Rudder post seal – condition, no excessive weeping" },
          { id: "st-04", label: "Steering cable / rod/chain – tension, wear, sheaves" },
          { id: "st-05", label: "Steering wheel – condition, play in system, lock function" },
          { id: "st-06", label: "Autopilot (if fitted) – drive unit, ram, controller, function test" },
          { id: "st-07", label: "Tiller (if applicable) – condition, security, emergency extension" },
          { id: "st-08", label: "Hydraulic steering (if fitted) – fluid level, hose condition, no leaks" },
          { id: "st-09", label: "Emergency steering provision – accessible, operational" },
        ]
      },
      {
        id: "thru-hulls",
        label: "Seacocks & Through-Hulls",
        items: [
          { id: "th-01", label: "All seacocks – identified, labelled, operational (full open/close)" },
          { id: "th-02", label: "Seacock material – bronze/Marelon (no gate valves below waterline)" },
          { id: "th-03", label: "Seacock backing plates – present, appropriate material" },
          { id: "th-04", label: "Cockpit drains – seacocks, hose condition, double-clamps" },
          { id: "th-05", label: "Exhaust thru-hull – condition, sealant, no erosion" },
          { id: "th-06", label: "Bilge pump discharge – one-way valve, hose condition" },
          { id: "th-07", label: "AC discharge – condition, seacock" },
          { id: "th-08", label: "Depth sounder / transducer fitting – condition, seacock or plug" },
          { id: "th-09", label: "Boarding/swim ladder drain – check valve, hose" },
        ]
      }
    ]
  },

  {
    id: "electrical",
    label: "Electrical Systems",
    icon: "⚡",
    color: "#eab308",
    subcategories: [
      {
        id: "dc-system",
        label: "DC Electrical System",
        items: [
          { id: "dc-01", label: "Battery bank(s) – type, age, capacity, state of charge" },
          { id: "dc-02", label: "Battery condition – load test, specific gravity (wet cells), no sulfation" },
          { id: "dc-03", label: "Battery terminals – corrosion, tightness, heat discolouration" },
          { id: "dc-04", label: "Battery boxes / securing – vented, no movement" },
          { id: "dc-05", label: "Main DC panel – circuit labels, breaker condition, bus bars" },
          { id: "dc-06", label: "DC fusing/breakers – appropriate sizing for wire gauge" },
          { id: "dc-07", label: "Battery switch – type, operation, 'combine' function" },
          { id: "dc-08", label: "Alternator output – charging voltage (13.8-14.4V under load)" },
          { id: "dc-09", label: "Battery charger – type, operation, shore power dependent" },
          { id: "dc-10", label: "Solar panels (if fitted) – output, mounting, controller" },
          { id: "dc-11", label: "Wind generator (if fitted) – blade condition, operation, regulator" },
        ]
      },
      {
        id: "wiring",
        label: "Wiring & Routing",
        items: [
          { id: "wi-01", label: "Wiring – marine-grade tinned copper throughout (ABYC compliant)" },
          { id: "wi-02", label: "Wire sizing – appropriate for circuit ampacity and length" },
          { id: "wi-03", label: "Wire routing – away from heat sources, no chafe points, secured" },
          { id: "wi-04", label: "Connections – proper marine terminals, no twist-and-tape splices" },
          { id: "wi-05", label: "Bilge wiring – elevated above normal water level" },
          { id: "wi-06", label: "Engine compartment wiring – heat-rated, secured, no chafe on moving parts" },
          { id: "wi-07", label: "Wire labelling – circuits labelled at both ends" },
        ]
      },
      {
        id: "ac-shore-power",
        label: "AC Shore Power & Inverter",
        items: [
          { id: "ac-01", label: "Shore power inlet – connector type, condition, corrosion" },
          { id: "ac-02", label: "Reverse polarity indicator – present and tested" },
          { id: "ac-03", label: "Main AC panel – breaker condition, GFCI protection where required" },
          { id: "ac-04", label: "AC wiring – routing, insulation, connections" },
          { id: "ac-05", label: "Galvanic isolator / isolation transformer – present, tested" },
          { id: "ac-06", label: "Inverter (if fitted) – capacity, condition, connections" },
          { id: "ac-07", label: "Generator (if fitted) – hours, operation, exhaust, seacock" },
          { id: "ac-08", label: "AC outlets – GFCI protected in wet areas, condition" },
        ]
      },
      {
        id: "bonding-corrosion",
        label: "Bonding & Corrosion Protection",
        items: [
          { id: "bc-01", label: "Bonding system – all underwater metals bonded (continuity check)" },
          { id: "bc-02", label: "Bonding conductor – green wire, condition, connections" },
          { id: "bc-03", label: "Hull zinc anodes – consumption level, connection integrity" },
          { id: "bc-04", label: "Shaft zinc – consumption level, contact" },
          { id: "bc-05", label: "Trim tab zincs (if fitted) – condition" },
          { id: "bc-06", label: "Impressed current cathodic protection (if fitted) – operation" },
          { id: "bc-07", label: "Stray current – test for DC in bilge water (galvanic corrosion risk)" },
          { id: "bc-08", label: "Electrolysis damage – propeller, shaft, thru-hulls inspection" },
        ]
      },
      {
        id: "electronics",
        label: "Navigation Electronics",
        items: [
          { id: "el-01", label: "VHF radio – DSC equipped, MMSI programmed, operation, antenna" },
          { id: "el-02", label: "GPS / chartplotter – operation, chart currency, antenna" },
          { id: "el-03", label: "Depth sounder – operation, calibration, display" },
          { id: "el-04", label: "Wind instruments (if fitted) – masthead unit, display, calibration" },
          { id: "el-05", label: "AIS (if fitted) – transponder type, MMSI, operation" },
          { id: "el-06", label: "Radar (if fitted) – dome/open array condition, operation" },
          { id: "el-07", label: "EPIRB – registration, battery expiry, hydrostatic release" },
          { id: "el-08", label: "PLB (if carried) – registration, battery expiry" },
          { id: "el-09", label: "Autopilot electronics – control head, compass, operation" },
          { id: "el-10", label: "Stereo / entertainment – condition, speaker locations" },
        ]
      }
    ]
  },

  {
    id: "fuel-plumbing",
    label: "Fuel & Plumbing Systems",
    icon: "🛢️",
    color: "#22c55e",
    subcategories: [
      {
        id: "fuel-system",
        label: "Fuel System",
        items: [
          { id: "fs-01", label: "Fuel tank(s) – material, age, baffles (where inspectable)" },
          { id: "fs-02", label: "Tank mounting / securing – straps, condition, no movement" },
          { id: "fs-03", label: "Fuel fill deck fitting – condition, label (Diesel/Gas), tether" },
          { id: "fs-04", label: "Fill hose – type (Coast Guard approved), clamps, no kinks" },
          { id: "fs-05", label: "Vent lines – size, routing, no restriction, overboard termination" },
          { id: "fs-06", label: "Fuel supply lines – type, routing, clamps, anti-chafe" },
          { id: "fs-07", label: "Fuel return lines – condition, routing, connections" },
          { id: "fs-08", label: "Primary fuel filter/water separator – condition, bowl clarity" },
          { id: "fs-09", label: "Secondary (engine-mounted) filter – service status" },
          { id: "fs-10", label: "Fuel shut-off valve – at tank, operational, labelled" },
          { id: "fs-11", label: "Fuel tank condition – inspection port, sample taken for contamination" },
          { id: "fs-12", label: "Fuel odour – none detectable in engine room or bilge" },
        ]
      },
      {
        id: "lpg-system",
        label: "LPG / CNG Cooking Fuel",
        items: [
          { id: "lp-01", label: "LPG locker – overboard drain, no through-connections to interior" },
          { id: "lp-02", label: "Cylinder – type, date, pressure relief, vented" },
          { id: "lp-03", label: "Solenoid shut-off – operation, panel switch, labelled" },
          { id: "lp-04", label: "Regulator – date, condition" },
          { id: "lp-05", label: "LPG hose – age, condition, approved marine type" },
          { id: "lp-06", label: "Stove – fiddles, gimballing, oven condition, burner function" },
          { id: "lp-07", label: "LPG detector/alarm – sensor location, test function" },
        ]
      },
      {
        id: "fresh-water",
        label: "Fresh Water System",
        items: [
          { id: "fw-01", label: "Fresh water tank(s) – material, capacity, condition, access" },
          { id: "fw-02", label: "Water pressure pump – operation, cycling (no rapid on/off), filter" },
          { id: "fw-03", label: "Fresh water accumulator – pressure, condition" },
          { id: "fw-04", label: "Hot water heater – capacity, condition, pressure relief valve" },
          { id: "fw-05", label: "Fresh water hoses – condition, clamps, no leaks" },
          { id: "fw-06", label: "Faucets / taps – operation, no drips" },
          { id: "fw-07", label: "Watermaker (if fitted) – hours, membrane age, operation" },
          { id: "fw-08", label: "Deck fill – label, cap condition, O-ring" },
        ]
      },
      {
        id: "cooling-exhaust",
        label: "Engine Cooling & Exhaust",
        items: [
          { id: "ce-01", label: "Freshwater cooling system – expansion tank level, hose condition" },
          { id: "ce-02", label: "Thermostat – operating temp consistent with spec" },
          { id: "ce-03", label: "Raw water cooling – impeller service record, strainer" },
          { id: "ce-04", label: "Exhaust manifold / elbow – condition, no burn marks, no rust weeping" },
          { id: "ce-05", label: "Wet exhaust hose – condition, above waterline rise, no soft spots" },
          { id: "ce-06", label: "Exhaust thru-hull – no back-flooding, flapper valve if below waterline" },
          { id: "ce-07", label: "Engine water temperature – within normal operating range under load" },
        ]
      }
    ]
  },

  {
    id: "safety-compliance",
    label: "Safety & Compliance",
    icon: "🛡️",
    color: "#ef4444",
    subcategories: [
      {
        id: "life-safety",
        label: "Life Safety Equipment",
        items: [
          { id: "ls-01", label: "PFDs (Type I/II/III) – quantity for all on board, condition, accessible" },
          { id: "ls-02", label: "PFD inflator status – armed, CO2 cylinder not punctured" },
          { id: "ls-03", label: "Throwable device (Type IV) – on deck, accessible, condition" },
          { id: "ls-04", label: "Flares – current unexpired date, quantity, type (day/night)" },
          { id: "ls-05", label: "Distress signals – SOLAS-grade if offshore, in date" },
          { id: "ls-06", label: "EPIRB – 406 MHz, registered, battery/hydrostatic release dates" },
          { id: "ls-07", label: "Liferaft (if carried) – service date, capacity, mounting/hydrostatic" },
          { id: "ls-08", label: "Horseshoe buoy / life ring – condition, location, drogue/light attached" },
          { id: "ls-09", label: "Man overboard pole – condition, light, drogue, mounting" },
          { id: "ls-10", label: "Tethers / jacklines – condition, load rating, harness points" },
          { id: "ls-11", label: "Safety harnesses – quantity, condition, adjustment" },
          { id: "ls-12", label: "First aid kit – contents, expiry dates, manual on board" },
        ]
      },
      {
        id: "fire-safety",
        label: "Fire Safety",
        items: [
          { id: "ff-01", label: "Fire extinguishers – quantity, type (BC/ABC), current hydro/service" },
          { id: "ff-02", label: "Engine room fixed suppression – type, cable pull/auto trigger" },
          { id: "ff-03", label: "Smoke detector – present in accommodation, functional" },
          { id: "ff-04", label: "CO detector – present in sleeping areas, functional" },
          { id: "ff-05", label: "LPG detector – present, sensor at low point, functional" },
          { id: "ff-06", label: "Engine room fire port – access for extinguisher, no blockage" },
          { id: "ff-07", label: "Fuel system – no leaks, no fuel-soaked bilge rags" },
        ]
      },
      {
        id: "navigation-lights",
        label: "Navigation Lights & Sound Signals",
        items: [
          { id: "nl-01", label: "Running lights (port/starboard) – LED/bulb condition, arc, function" },
          { id: "nl-02", label: "Stern light – condition, arc, function" },
          { id: "nl-03", label: "Masthead light (power) / tricolor (sail) – condition, function" },
          { id: "nl-04", label: "Anchor light – function, 360° arc" },
          { id: "nl-05", label: "Steaming light (sailboats) – condition, function" },
          { id: "nl-06", label: "Horn / whistle – electric horn tested, backup whistle on board" },
          { id: "nl-07", label: "Bell (vessels >12m) – if required, present" },
          { id: "nl-08", label: "Day shapes – ball, cone, cylinder on board if required" },
        ]
      },
      {
        id: "anchoring-docking",
        label: "Anchoring & Docking",
        items: [
          { id: "ad-01", label: "Primary anchor – type, weight appropriate for vessel, condition" },
          { id: "ad-02", label: "Anchor chain – size, condition, length, shackle moused" },
          { id: "ad-03", label: "Anchor rode (rope) – diameter, length, condition" },
          { id: "ad-04", label: "Chain/rode swivel – condition, pin moused" },
          { id: "ad-05", label: "Secondary anchor – present, appropriate, accessible" },
          { id: "ad-06", label: "Dock lines – quantity (minimum 4), diameter, condition, chafe gear" },
          { id: "ad-07", label: "Fenders – quantity, condition, appropriate size" },
          { id: "ad-08", label: "Boathook – present, condition" },
        ]
      },
      {
        id: "regulatory",
        label: "Regulatory & Documentation",
        items: [
          { id: "rg-01", label: "Certificate of Documentation / State Title – on board, clear title" },
          { id: "rg-02", label: "Vessel registration stickers – current year displayed" },
          { id: "rg-03", label: "Insurance certificate – current, adequate coverage" },
          { id: "rg-04", label: "MARPOL placard – present if applicable" },
          { id: "rg-05", label: "Discharge placard (sewage) – posted" },
          { id: "rg-06", label: "Capacity plate (if required) – present, legible" },
          { id: "rg-07", label: "Float plan system – practice or log evidence" },
          { id: "rg-08", label: "Charts – current, coverage for cruising area" },
          { id: "rg-09", label: "Pilot books / cruising guides – appropriate for area" },
        ]
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// SECTION 2 · APPLICATION STATE
// ─────────────────────────────────────────────────────────────
// Status cycle: null → 'in-progress' → 'completed' → null
// Finding: { active: bool, note: '', priority: 'A'|'B'|'C'|null }
const AppState = {
  // Per-item state
  items: {},         // { [itemId]: { status: null|'in-progress'|'completed', finding: { active, note, priority } } }
  // Active navigation
  activeCategoryId: null,
  activeSubId: null,
  // Filter mode
  filterMode: 'all', // 'all' | 'remaining' | 'findings'
  // Intake data (populated on report generation)
  intake: {}
};

// Build initial item state from DB
function initState() {
  CHECKLIST_DB.forEach(cat => {
    cat.subcategories.forEach(sub => {
      sub.items.forEach(item => {
        AppState.items[item.id] = {
          status: null,
          finding: { active: false, note: '', priority: null }
        };
      });
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SECTION 3 · DOM HELPERS
// ─────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};

// ─────────────────────────────────────────────────────────────
// SECTION 4 · PROGRESS COMPUTATIONS
// ─────────────────────────────────────────────────────────────
function getCatStats(cat) {
  let total = 0, completed = 0, inProgress = 0, findings = 0;
  cat.subcategories.forEach(sub => {
    sub.items.forEach(item => {
      total++;
      const s = AppState.items[item.id];
      if (s.status === 'completed') completed++;
      if (s.status === 'in-progress') inProgress++;
      if (s.finding.active) findings++;
    });
  });
  return { total, completed, inProgress, findings, remaining: total - completed };
}

function getSubStats(sub) {
  let total = 0, completed = 0, inProgress = 0, findings = 0;
  sub.items.forEach(item => {
    total++;
    const s = AppState.items[item.id];
    if (s.status === 'completed') completed++;
    if (s.status === 'in-progress') inProgress++;
    if (s.finding.active) findings++;
  });
  return { total, completed, inProgress, findings };
}

function getGlobalStats() {
  let total = 0, completed = 0, inProgress = 0, findings = 0;
  CHECKLIST_DB.forEach(cat => {
    const s = getCatStats(cat);
    total += s.total; completed += s.completed;
    inProgress += s.inProgress; findings += s.findings;
  });
  return { total, completed, inProgress, findings };
}

// ─────────────────────────────────────────────────────────────
// SECTION 5 · RENDER
// ─────────────────────────────────────────────────────────────

// ── 5a: Sidebar category list ──
function renderSidebar() {
  const nav = $('cat-nav');
  nav.innerHTML = '';
  CHECKLIST_DB.forEach(cat => {
    const stats = getCatStats(cat);
    const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
    const isActive = AppState.activeCategoryId === cat.id;
    const hasFinding = stats.findings > 0;

    const div = el('div', `cat-nav-item${isActive ? ' active' : ''}`);
    div.dataset.catId = cat.id;
    div.innerHTML = `
      <div class="cat-nav-icon">${cat.icon}</div>
      <div class="cat-nav-body">
        <div class="cat-nav-label">${cat.label}</div>
        <div class="cat-nav-bar"><div class="cat-nav-fill" style="width:${pct}%;background:${cat.color}"></div></div>
      </div>
      <div class="cat-nav-meta">
        ${hasFinding ? `<span class="finding-badge">${stats.findings}</span>` : ''}
        <span class="pct-badge">${pct}%</span>
      </div>`;
    div.addEventListener('click', () => selectCategory(cat.id));
    nav.appendChild(div);
  });
}

// ── 5b: Sub-category tabs ──
function renderSubTabs(cat) {
  const tabs = $('sub-tabs');
  tabs.innerHTML = '';
  cat.subcategories.forEach(sub => {
    const stats = getSubStats(sub);
    const isActive = AppState.activeSubId === sub.id;
    const btn = el('button', `sub-tab${isActive ? ' active' : ''}`);
    btn.innerHTML = `${sub.label} <span class="sub-tab-count">${stats.completed}/${stats.total}</span>
      ${stats.findings > 0 ? `<span class="sub-finding-dot" title="${stats.findings} finding(s)"></span>` : ''}`;
    btn.addEventListener('click', () => selectSub(cat.id, sub.id));
    tabs.appendChild(btn);
  });
}

// ── 5c: Checklist items ──
function renderItems(sub) {
  const list = $('item-list');
  list.innerHTML = '';

  const filter = AppState.filterMode;
  let visibleCount = 0;

  sub.items.forEach((item, idx) => {
    const s = AppState.items[item.id];

    // Filtering
    if (filter === 'remaining' && s.status === 'completed') return;
    if (filter === 'findings' && !s.finding.active) return;

    visibleCount++;

    const card = el('div', `item-card status-${s.status || 'none'}${s.finding.active ? ' has-finding' : ''}`);
    card.dataset.itemId = item.id;

    // Priority label styling
    const pClass = s.finding.priority ? `pri-${s.finding.priority.toLowerCase()}` : '';
    const pLabel = s.finding.priority ? `Priority ${s.finding.priority}` : 'Set Priority';

    card.innerHTML = `
      <div class="item-top">
        <span class="item-num">${String(idx + 1).padStart(2, '0')}</span>
        <span class="item-label">${item.label}</span>
        <div class="item-actions">
          <button class="finding-toggle ${s.finding.active ? 'active' : ''}" title="Flag Finding/Deficiency" data-id="${item.id}">
            <svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          </button>
          <button class="cycle-btn ${s.status || ''}" title="Cycle status" data-id="${item.id}">
            ${statusIcon(s.status)}
          </button>
        </div>
      </div>
      ${s.finding.active ? `
      <div class="finding-panel">
        <div class="finding-panel-top">
          <label class="finding-note-label">Finding / Deficiency Notes</label>
          <div class="priority-btns">
            <button class="pri-btn pri-a ${s.finding.priority === 'A' ? 'active' : ''}" data-id="${item.id}" data-pri="A">A · Safety</button>
            <button class="pri-btn pri-b ${s.finding.priority === 'B' ? 'active' : ''}" data-id="${item.id}" data-pri="B">B · Maintenance</button>
            <button class="pri-btn pri-c ${s.finding.priority === 'C' ? 'active' : ''}" data-id="${item.id}" data-pri="C">C · Minor</button>
          </div>
        </div>
        <textarea class="finding-textarea" data-id="${item.id}" placeholder="Describe the finding, location, severity…">${s.finding.note}</textarea>
      </div>` : ''}
    `;

    list.appendChild(card);
  });

  if (visibleCount === 0) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-icon">✓</div>
      <div>No items match the current filter.</div>
    </div>`;
  }

  // Attach events
  list.querySelectorAll('.cycle-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); cycleStatus(btn.dataset.id); });
  });
  list.querySelectorAll('.finding-toggle').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); toggleFinding(btn.dataset.id); });
  });
  list.querySelectorAll('.finding-textarea').forEach(ta => {
    ta.addEventListener('input', () => {
      AppState.items[ta.dataset.id].finding.note = ta.value;
    });
  });
  list.querySelectorAll('.pri-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); setPriority(btn.dataset.id, btn.dataset.pri); });
  });
}

function statusIcon(status) {
  if (status === 'completed')  return `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
  if (status === 'in-progress') return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg>`;
  return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>`;
}

// ── 5d: Section header (breadcrumb + stats strip) ──
function renderSectionHeader(cat, sub) {
  $('section-breadcrumb').innerHTML = `<span class="bc-cat" style="color:${cat.color}">${cat.icon} ${cat.label}</span>
    <span class="bc-sep">›</span> ${sub.label}`;

  const stats = getSubStats(sub);
  const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  $('section-stats').innerHTML = `
    <span class="stat-chip completed">${stats.completed} Completed</span>
    <span class="stat-chip in-progress">${stats.inProgress} In Progress</span>
    <span class="stat-chip remaining">${stats.total - stats.completed} Remaining</span>
    ${stats.findings ? `<span class="stat-chip finding">${stats.findings} Finding${stats.findings > 1 ? 's' : ''}</span>` : ''}
    <span class="stat-pct" style="color:${cat.color}">${pct}%</span>
  `;
}

// ── 5e: Global progress bar ──
function renderGlobalProgress() {
  const g = getGlobalStats();
  const pct = g.total ? Math.round((g.completed / g.total) * 100) : 0;
  $('global-fill').style.width = pct + '%';
  $('global-label').textContent = `${g.completed} / ${g.total} completed`;
  $('global-findings').textContent = g.findings ? `${g.findings} finding${g.findings > 1 ? 's' : ''}` : '';
}

// ─────────────────────────────────────────────────────────────
// SECTION 6 · NAVIGATION
// ─────────────────────────────────────────────────────────────
function selectCategory(catId) {
  const cat = CHECKLIST_DB.find(c => c.id === catId);
  if (!cat) return;
  AppState.activeCategoryId = catId;
  AppState.activeSubId = cat.subcategories[0].id;
  showInspectionPanel();
  fullRender();
}

function selectSub(catId, subId) {
  AppState.activeCategoryId = catId;
  AppState.activeSubId = subId;
  fullRender();
}

function showInspectionPanel() {
  $('welcome-panel').style.display = 'none';
  $('report-panel').style.display = 'none';
  $('inspection-panel').style.display = 'flex';
}

function fullRender() {
  const cat = CHECKLIST_DB.find(c => c.id === AppState.activeCategoryId);
  if (!cat) return;
  const sub = cat.subcategories.find(s => s.id === AppState.activeSubId);
  if (!sub) return;
  renderSidebar();
  renderSubTabs(cat);
  renderSectionHeader(cat, sub);
  renderItems(sub);
  renderGlobalProgress();
}

// ─────────────────────────────────────────────────────────────
// SECTION 7 · ITEM INTERACTIONS
// ─────────────────────────────────────────────────────────────
function cycleStatus(itemId) {
  const s = AppState.items[itemId];
  const cycle = [null, 'in-progress', 'completed'];
  const idx = cycle.indexOf(s.status);
  s.status = cycle[(idx + 1) % cycle.length];
  fullRender();
}

function toggleFinding(itemId) {
  const f = AppState.items[itemId].finding;
  f.active = !f.active;
  if (!f.active) { f.note = ''; f.priority = null; }
  fullRender();
}

function setPriority(itemId, pri) {
  const f = AppState.items[itemId].finding;
  f.priority = (f.priority === pri) ? null : pri;
  fullRender();
}

// ─────────────────────────────────────────────────────────────
// SECTION 8 · FILTER
// ─────────────────────────────────────────────────────────────
function setFilter(mode) {
  AppState.filterMode = mode;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === mode));
  if (AppState.activeCategoryId) fullRender();
}

// ─────────────────────────────────────────────────────────────
// SECTION 9 · REPORT GENERATION
// ─────────────────────────────────────────────────────────────
function openReport() {
  $('welcome-panel').style.display = 'none';
  $('inspection-panel').style.display = 'none';
  $('report-panel').style.display = 'block';
  buildReportDOM();
}

function buildReportDOM() {
  // Gather intake
  const intake = {
    vesselName: $('v-name').value || 'Unnamed Vessel',
    hullId:     $('v-hull').value || '—',
    surveyorName: $('v-surveyor').value || '—',
    clientName:   $('v-client').value || '—',
    surveyDate:   $('v-date').value || new Date().toISOString().split('T')[0],
    surveyType:   $('v-type').value || 'Pre-Purchase Survey',
    location:     $('v-location').value || '—',
    weather:      $('v-weather').value || '—',
    refNum:       $('v-ref').value || '—',
    purpose:      $('v-purpose').value || '',
  };
  AppState.intake = intake;

  const g = getGlobalStats();
  const pct = g.total ? Math.round((g.completed / g.total) * 100) : 0;
  const fmtDate = new Date(intake.surveyDate + 'T12:00:00').toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // Collect all findings grouped by priority
  const findings = { A: [], B: [], C: [] };
  CHECKLIST_DB.forEach(cat => {
    cat.subcategories.forEach(sub => {
      sub.items.forEach(item => {
        const s = AppState.items[item.id];
        if (s.finding.active) {
          const pri = s.finding.priority || 'C';
          findings[pri].push({ cat: cat.label, sub: sub.label, item: item.label, note: s.finding.note });
        }
      });
    });
  });

  const findingsHTML = ['A', 'B', 'C'].map(pri => {
    if (!findings[pri].length) return '';
    const priMeta = {
      A: { label: 'Priority A — Safety / Critical', cls: 'pri-a-block', icon: '🔴' },
      B: { label: 'Priority B — Maintenance / Potential Hazard', cls: 'pri-b-block', icon: '🟡' },
      C: { label: 'Priority C — Minor / Observations', cls: 'pri-c-block', icon: '🔵' },
    }[pri];
    const rows = findings[pri].map((f, i) => `
      <div class="rpt-finding-row">
        <div class="rpt-finding-num">${i + 1}</div>
        <div class="rpt-finding-body">
          <div class="rpt-finding-breadcrumb">${f.cat} › ${f.sub}</div>
          <div class="rpt-finding-item">${f.item}</div>
          ${f.note ? `<div class="rpt-finding-note">${f.note}</div>` : ''}
        </div>
      </div>`).join('');
    return `<div class="rpt-finding-group ${priMeta.cls}">
      <div class="rpt-finding-group-header">${priMeta.icon} ${priMeta.label} (${findings[pri].length})</div>
      ${rows}
    </div>`;
  }).join('');

  // Per-category breakdown
  const catBreakdown = CHECKLIST_DB.map(cat => {
    const stats = getCatStats(cat);
    const catPct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
    const subRows = cat.subcategories.map(sub => {
      const ss = getSubStats(sub);
      const itemRows = sub.items.map(item => {
        const s = AppState.items[item.id];
        const statusLabel = { null: 'Not Inspected', 'in-progress': 'In Progress', 'completed': 'Completed' }[s.status] || 'Not Inspected';
        const statusCls = { null: 'rpt-status-none', 'in-progress': 'rpt-status-ip', 'completed': 'rpt-status-ok' }[s.status] || 'rpt-status-none';
        const findTag = s.finding.active ? `<span class="rpt-find-tag pri-tag-${(s.finding.priority || 'c').toLowerCase()}">Pri ${s.finding.priority || 'C'}</span>` : '';
        return `<tr>
          <td class="rpt-item-cell">${item.label}</td>
          <td><span class="rpt-status-tag ${statusCls}">${statusLabel}</span></td>
          <td>${findTag}</td>
          <td class="rpt-note-cell">${s.finding.active && s.finding.note ? s.finding.note : ''}</td>
        </tr>`;
      }).join('');
      return `<div class="rpt-sub-block">
        <div class="rpt-sub-heading">${sub.label} — ${ss.completed}/${ss.total}</div>
        <table class="rpt-table"><thead><tr><th>Item</th><th>Status</th><th>Finding</th><th>Notes</th></tr></thead>
        <tbody>${itemRows}</tbody></table>
      </div>`;
    }).join('');

    return `<div class="rpt-cat-block">
      <div class="rpt-cat-header" style="border-left: 4px solid ${cat.color}">
        <span>${cat.icon} ${cat.label}</span>
        <div style="display:flex;align-items:center;gap:12px;">
          ${stats.findings ? `<span class="rpt-badge-finding">${stats.findings} Findings</span>` : ''}
          <span class="rpt-badge-pct" style="color:${cat.color}">${catPct}%</span>
        </div>
      </div>
      ${subRows}
    </div>`;
  }).join('');

  $('report-output').innerHTML = `
    <div class="rpt-cover">
      <div class="rpt-cover-top">
        <div class="rpt-logo-mark">⚓</div>
        <div class="rpt-cover-title">Marine Survey Report</div>
        <div class="rpt-cover-vessel">${intake.vesselName}</div>
        <div class="rpt-cover-meta">${fmtDate} &nbsp;·&nbsp; ${intake.surveyType}</div>
      </div>
      <div class="rpt-info-grid">
        ${[
          ['Vessel', intake.vesselName],
          ['HIN / Hull ID', intake.hullId],
          ['Surveyor', intake.surveyorName],
          ['Client', intake.clientName],
          ['Date', fmtDate],
          ['Survey Type', intake.surveyType],
          ['Location', intake.location],
          ['Weather / Sea State', intake.weather],
          ['Reference #', intake.refNum],
        ].map(([k,v]) => `<div class="rpt-info-row"><span class="rpt-info-key">${k}</span><span class="rpt-info-val">${v}</span></div>`).join('')}
        ${intake.purpose ? `<div class="rpt-info-row full"><span class="rpt-info-key">Purpose / Scope</span><span class="rpt-info-val">${intake.purpose}</span></div>` : ''}
      </div>
    </div>

    <div class="rpt-summary-stats">
      <div class="rpt-stat"><div class="val">${pct}%</div><div class="lbl">Inspection Complete</div></div>
      <div class="rpt-stat find-a"><div class="val">${findings.A.length}</div><div class="lbl">Priority A (Safety)</div></div>
      <div class="rpt-stat find-b"><div class="val">${findings.B.length}</div><div class="lbl">Priority B (Maintenance)</div></div>
      <div class="rpt-stat find-c"><div class="val">${findings.C.length}</div><div class="lbl">Priority C (Minor)</div></div>
      <div class="rpt-stat"><div class="val">${g.completed}</div><div class="lbl">Items Completed</div></div>
      <div class="rpt-stat"><div class="val">${g.total - g.completed}</div><div class="lbl">Items Remaining</div></div>
    </div>

    ${(findings.A.length || findings.B.length || findings.C.length) ? `
    <div class="rpt-section-heading">⚑ Findings & Deficiencies Summary</div>
    ${findingsHTML}` : `
    <div class="rpt-no-findings">✓ No findings or deficiencies were flagged during this inspection.</div>`}

    <div class="rpt-section-heading">📋 Detailed Inspection Results</div>
    ${catBreakdown}

    <div class="rpt-footer">
      Report generated by Marine Survey Pro &nbsp;·&nbsp; ${new Date().toLocaleDateString()}
      &nbsp;·&nbsp; ${intake.surveyorName}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// SECTION 10 · PDF EXPORT
// ─────────────────────────────────────────────────────────────
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, M = 15, CW = W - M * 2;
  const intake = AppState.intake;
  const g = getGlobalStats();
  const pct = g.total ? Math.round((g.completed / g.total) * 100) : 0;

  const fmtDate = intake.surveyDate
    ? new Date(intake.surveyDate + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString();

  const findings = { A: [], B: [], C: [] };
  CHECKLIST_DB.forEach(cat => {
    cat.subcategories.forEach(sub => {
      sub.items.forEach(item => {
        const s = AppState.items[item.id];
        if (s.finding.active) {
          const pri = s.finding.priority || 'C';
          findings[pri].push({ cat: cat.label, sub: sub.label, item: item.label, note: s.finding.note });
        }
      });
    });
  });

  let y = 0;
  const newPage = () => { doc.addPage(); y = 20; };
  const checkY = (needed = 12) => { if (y + needed > 282) newPage(); };

  // ── Cover ──
  doc.setFillColor(10, 16, 28);
  doc.rect(0, 0, 210, 50, 'F');
  doc.setFontSize(22); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold');
  doc.text('MARINE SURVEY REPORT', M, 22);
  doc.setFontSize(13); doc.setTextColor(14, 165, 233);
  doc.text(intake.vesselName || 'Unnamed Vessel', M, 33);
  doc.setFontSize(9); doc.setTextColor(160,180,200); doc.setFont('helvetica','normal');
  doc.text(`${fmtDate}  ·  ${intake.surveyType || ''}  ·  ${intake.surveyorName || ''}`, M, 43);
  y = 60;

  // ── Info grid ──
  const infoRows = [
    ['HIN / Hull ID', intake.hullId], ['Surveyor', intake.surveyorName],
    ['Client', intake.clientName], ['Location', intake.location],
    ['Weather', intake.weather], ['Reference #', intake.refNum],
  ];
  infoRows.forEach(([k, v]) => {
    checkY(7);
    doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(100,120,140);
    doc.text(k.toUpperCase(), M, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(30,30,40);
    doc.text(String(v || '—'), M + 40, y);
    y += 6;
  });
  y += 4;

  // ── Stats bar ──
  doc.setFillColor(240,248,255);
  doc.roundedRect(M, y, CW, 18, 2, 2, 'F');
  const statItems = [
    [`${pct}%`, 'Complete'], [`${findings.A.length}`, 'Prio A'], [`${findings.B.length}`, 'Prio B'],
    [`${findings.C.length}`, 'Prio C'], [`${g.completed}`, 'Done'],
  ];
  const colW = CW / statItems.length;
  statItems.forEach(([val, lbl], i) => {
    const x = M + i * colW + colW / 2;
    doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(10,16,28);
    doc.text(val, x, y + 9, { align: 'center' });
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(100,120,140);
    doc.text(lbl, x, y + 15, { align: 'center' });
  });
  y += 26;

  // ── Findings Summary ──
  const allFindings = [...findings.A.map(f => ({ ...f, pri: 'A' })),
    ...findings.B.map(f => ({ ...f, pri: 'B' })),
    ...findings.C.map(f => ({ ...f, pri: 'C' }))];
  if (allFindings.length) {
    checkY(10);
    doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(10,16,28);
    doc.text('FINDINGS & DEFICIENCIES', M, y); y += 6;
    doc.setDrawColor(14, 165, 233); doc.line(M, y, M + CW, y); y += 5;

    const priColors = { A: [220,38,38], B: [217,119,6], C: [59,130,246] };
    allFindings.forEach((f, i) => {
      checkY(16);
      doc.setFillColor(...priColors[f.pri]);
      doc.rect(M, y, 2, 10, 'F');
      doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(...priColors[f.pri]);
      doc.text(`PRI ${f.pri}`, M + 4, y + 4);
      doc.setFontSize(8.5); doc.setFont('helvetica','bold'); doc.setTextColor(20,20,30);
      const itemLines = doc.splitTextToSize(f.item, CW - 28);
      doc.text(itemLines, M + 22, y + 4);
      doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(80,80,100);
      doc.text(`${f.cat} › ${f.sub}`, M + 22, y + 4 + itemLines.length * 4.5);
      if (f.note) {
        const noteY = y + 4 + itemLines.length * 4.5 + 4;
        const noteLines = doc.splitTextToSize(`Note: ${f.note}`, CW - 28);
        doc.setTextColor(120,100,50); doc.text(noteLines, M + 22, noteY);
        y += noteLines.length * 3.5;
      }
      doc.setDrawColor(220,220,230); doc.line(M, y + 12, M + CW, y + 12);
      y += 15;
    });
    y += 4;
  }

  // ── Detailed breakdown ──
  CHECKLIST_DB.forEach(cat => {
    checkY(14);
    doc.setFillColor(10,16,28);
    doc.rect(M, y, CW, 9, 'F');
    doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(255,255,255);
    doc.text(`${cat.icon}  ${cat.label.toUpperCase()}`, M + 4, y + 6);
    y += 13;

    cat.subcategories.forEach(sub => {
      checkY(10);
      doc.setFillColor(240,244,250);
      doc.rect(M, y, CW, 7, 'F');
      doc.setFontSize(8.5); doc.setFont('helvetica','bold'); doc.setTextColor(40,60,90);
      doc.text(sub.label, M + 3, y + 5);
      y += 10;

      sub.items.forEach(item => {
        checkY(8);
        const s = AppState.items[item.id];
        const statusLabel = { null: '—', 'in-progress': 'In Progress', 'completed': '✓' }[s.status] || '—';
        const statusColors = { null: [160,160,170], 'in-progress': [217,119,6], 'completed': [22,163,74] };
        const col = statusColors[s.status] || [160,160,170];

        doc.setFontSize(7.5); doc.setFont('helvetica','bold'); doc.setTextColor(...col);
        doc.text(statusLabel, M + 2, y + 4);
        doc.setFont('helvetica','normal'); doc.setTextColor(30,30,40);
        const labelLines = doc.splitTextToSize(item.label, CW - 28);
        doc.text(labelLines, M + 14, y + 4);

        if (s.finding.active) {
          const priCol = { A: [220,38,38], B: [217,119,6], C: [59,130,246] }[s.finding.priority || 'C'];
          doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor(...priCol);
          doc.text(`[PRI ${s.finding.priority || 'C'}]`, W - M - 2, y + 4, { align: 'right' });
        }

        y += labelLines.length * 4 + 2;

        if (s.finding.active && s.finding.note) {
          checkY(6);
          doc.setFont('helvetica','italic'); doc.setFontSize(7); doc.setTextColor(100,80,40);
          const noteLines = doc.splitTextToSize(`↳ ${s.finding.note}`, CW - 18);
          doc.text(noteLines, M + 14, y);
          y += noteLines.length * 3.5 + 2;
        }

        doc.setDrawColor(230,232,238); doc.line(M + 12, y, M + CW, y); y += 2;
      });
      y += 4;
    });
    y += 4;
  });

  // Footers
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5); doc.setTextColor(150,160,170); doc.setFont('helvetica','normal');
    doc.text(`Marine Survey Pro  ·  ${intake.vesselName}  ·  ${fmtDate}`, M, 292);
    doc.text(`Page ${i} of ${pages}`, W - M, 292, { align: 'right' });
  }

  const filename = `survey-${(intake.vesselName || 'vessel').replace(/\s+/g,'-').toLowerCase()}-${intake.surveyDate || 'report'}.pdf`;
  doc.save(filename);
  showToast('PDF saved — ' + filename);
}

// ─────────────────────────────────────────────────────────────
// SECTION 11 · UTILITIES
// ─────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = $('toast');
  $('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

function resetAll() {
  if (!confirm('Reset all inspection data? This cannot be undone.')) return;
  initState();
  AppState.activeCategoryId = null;
  AppState.activeSubId = null;
  AppState.filterMode = 'all';
  $('inspection-panel').style.display = 'none';
  $('report-panel').style.display = 'none';
  $('welcome-panel').style.display = 'flex';
  renderGlobalProgress();
  renderSidebar();
  showToast('Inspection reset');
}

// ─────────────────────────────────────────────────────────────
// SECTION 12 · BOOTSTRAP
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initState();
  $('v-date').valueAsDate = new Date();

  renderSidebar();
  renderGlobalProgress();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  // Mobile sidebar toggle
  $('sidebar-toggle').addEventListener('click', () => {
    $('sidebar').classList.toggle('open');
  });

  // Click outside sidebar on mobile
  $('main-area').addEventListener('click', () => {
    $('sidebar').classList.remove('open');
  });
});
