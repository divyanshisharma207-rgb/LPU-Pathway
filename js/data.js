/**
 * data.js – Comprehensive Campus Navigation Data Store
 * Lovely Professional University (LPU) – All Campus Blocks & Buildings
 * Center: 31.2536°N, 75.7037°E
 */

'use strict';

// ── LOCATION NODES (All Campus Points) ───────────────────────
const NODES = {
  /* GATES & OUTDOOR TRANSIT */
  'main-gate': {
    id: 'main-gate',
    label: 'Main Gate 1 (GT Road)',
    type: 'outdoor',
    lat: 31.2536, lng: 75.7037,
    landmark: 'Primary campus entrance on GT Road with security cabin and level accessibility ramp.',
    stepFree: true,
    hasRamp: true,
    floor: null,
    building: null
  },
  'gate-2': {
    id: 'gate-2',
    label: 'Gate 2 (West Gate - Law & Business)',
    type: 'outdoor',
    lat: 31.2548, lng: 75.7075,
    landmark: 'West entrance near Mittal School of Business & Law blocks, ramped security booth.',
    stepFree: true,
    hasRamp: true,
    floor: null,
    building: null
  },
  'gate-3': {
    id: 'gate-3',
    label: 'Gate 3 (South Sports Complex Gate)',
    type: 'outdoor',
    lat: 31.2520, lng: 75.7025,
    landmark: 'South campus gate adjacent to University Hospital & sports grounds.',
    stepFree: true,
    hasRamp: true,
    floor: null,
    building: null
  },

  /* CENTRAL CAMPUS FACILITIES */
  'uni-mall-entrance': {
    id: 'uni-mall-entrance',
    label: 'Uni-Mall Shopping & Food Complex',
    type: 'outdoor',
    lat: 31.2546, lng: 75.7050,
    landmark: 'Uni-Mall shopping center, banks, post office, food court, wide level ramp entry.',
    stepFree: true,
    hasRamp: true,
    floor: null,
    building: 'unimall'
  },
  'food-court': {
    id: 'food-court',
    label: 'Central Food Court & Plaza',
    type: 'outdoor',
    lat: 31.2530, lng: 75.7042,
    landmark: 'Central multi-cuisine open dining plaza with step-free paved pathways.',
    stepFree: true,
    hasRamp: false,
    floor: null,
    building: 'foodcourt'
  },
  'unipolis': {
    id: 'unipolis',
    label: 'Baldev Raj Mittal Unipolis',
    type: 'outdoor',
    lat: 31.2540, lng: 75.7045,
    landmark: 'Mega 15,000-capacity cultural open-air theater & arena with level accessibility ramps.',
    stepFree: true,
    hasRamp: true,
    floor: null,
    building: 'unipolis'
  },
  'uni-hospital': {
    id: 'uni-hospital',
    label: 'Uni-Hospital (24/7 Medical Care)',
    type: 'outdoor',
    lat: 31.2525, lng: 75.7034,
    landmark: 'Full-service campus hospital with 24/7 emergency entrance, emergency ramps & lift.',
    stepFree: true,
    hasRamp: true,
    floor: null,
    building: 'unihospital'
  },
  'indoor-stadium': {
    id: 'indoor-stadium',
    label: 'Shanti Devi Mittal Indoor Sports Complex',
    type: 'outdoor',
    lat: 31.2532, lng: 75.7062,
    landmark: 'Indoor Olympic pool, badminton courts, gym & sports arena with wheelchair access.',
    stepFree: true,
    hasRamp: true,
    floor: null,
    building: 'indoorstadium'
  },

  /* ACADEMIC BLOCKS */
  'b14-ground': {
    id: 'b14-ground',
    label: 'Block 14 – Humanities & Arts',
    type: 'indoor',
    lat: 31.2528, lng: 75.7028,
    landmark: 'Block 14 lobby, School of Humanities & Languages, ramp at east entrance.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b14-lift',
    floor: 0,
    building: 'b14'
  },
  'b25-ground': {
    id: 'b25-ground',
    label: 'Block 25 – Computer Applications & IT',
    type: 'indoor',
    lat: 31.2539, lng: 75.7018,
    landmark: 'Block 25 ground lobby, software labs, level ramped access.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b25-lift',
    floor: 0,
    building: 'b25'
  },
  'b26-ground': {
    id: 'b26-ground',
    label: 'Block 26 – Computer Science & Engineering',
    type: 'indoor',
    lat: 31.2543, lng: 75.7020,
    landmark: 'Block 26 ground floor, School of CSE main entrance, wide ramp & lift access.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b26-lift',
    floor: 0,
    building: 'b26'
  },
  'b27-ground': {
    id: 'b27-ground',
    label: 'Block 27 – Electronics & Communication',
    type: 'indoor',
    lat: 31.2547, lng: 75.7022,
    landmark: 'Block 27 ground floor, ECE laboratories and robotics center, ramp at front.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b27-lift',
    floor: 0,
    building: 'b27'
  },
  'b28-ground': {
    id: 'b28-ground',
    label: 'Block 28 – Mechanical & Aerospace',
    type: 'indoor',
    lat: 31.2551, lng: 75.7024,
    landmark: 'Block 28 main foyer, mechanical workshops and aviation simulators, ramped access.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b28-lift',
    floor: 0,
    building: 'b28'
  },
  'b29-ground': {
    id: 'b29-ground',
    label: 'Block 29 – Civil Engineering & Biotech',
    type: 'indoor',
    lat: 31.2555, lng: 75.7026,
    landmark: 'Block 29 ground floor, civil structures lab and environmental engineering center.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b29-lift',
    floor: 0,
    building: 'b29'
  },
  'b32-ground': {
    id: 'b32-ground',
    label: 'Block 32 – Academic Block (CSE & Tech)',
    type: 'indoor',
    lat: 31.2545, lng: 75.7030,
    landmark: 'Block 32 ground lobby, reception desk straight ahead, ramp at south entrance.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    hasStairs: true,
    lift: 'b32-lift',
    floor: 0,
    building: 'b32'
  },
  'b32-f1': {
    id: 'b32-f1',
    label: 'Block 32 – Floor 1 (Lecture Halls)',
    type: 'indoor',
    lat: 31.2545, lng: 75.7030,
    landmark: 'Block 32 floor 1, lecture halls 101–110 on right, lift access.',
    stepFree: true,
    hasLift: true,
    hasStairs: true,
    lift: 'b32-lift',
    floor: 1,
    building: 'b32'
  },
  'b32-f2': {
    id: 'b32-f2',
    label: 'Block 32 – Floor 2 (Computer Labs)',
    type: 'indoor',
    lat: 31.2545, lng: 75.7030,
    landmark: 'Block 32 floor 2, advanced computing labs, accessible toilet on left.',
    stepFree: true,
    hasLift: true,
    hasStairs: true,
    lift: 'b32-lift',
    floor: 2,
    building: 'b32'
  },
  'b33-ground': {
    id: 'b33-ground',
    label: 'Block 33 – Agriculture & Food Technology',
    type: 'indoor',
    lat: 31.2549, lng: 75.7038,
    landmark: 'Block 33 lobby, agronomy labs, food processing units, level accessible entry.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b33-lift',
    floor: 0,
    building: 'b33'
  },
  'b34-ground': {
    id: 'b34-ground',
    label: 'Block 34 – Shanti Devi Mittal Central Library',
    type: 'indoor',
    lat: 31.2552, lng: 75.7048,
    landmark: 'Block 34 ground floor, central library issue counter, level entry — zero steps.',
    stepFree: true,
    hasRamp: false,
    hasLift: true,
    hasStairs: true,
    lift: 'b34-lift',
    floor: 0,
    building: 'b34'
  },
  'b34-f1': {
    id: 'b34-f1',
    label: 'Block 34 – Floor 1 (Reading Halls)',
    type: 'indoor',
    lat: 31.2552, lng: 75.7048,
    landmark: 'Block 34 floor 1, reading rooms, quiet study zones, lift exit.',
    stepFree: true,
    hasLift: true,
    hasStairs: true,
    lift: 'b34-lift',
    floor: 1,
    building: 'b34'
  },
  'b35-ground': {
    id: 'b35-ground',
    label: 'Block 35 – School of Architecture & Design',
    type: 'indoor',
    lat: 31.2556, lng: 75.7052,
    landmark: 'Block 35 foyer, drafting studios, model making workshop, accessible ramp entry.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b35-lift',
    floor: 0,
    building: 'b35'
  },
  'b36-ground': {
    id: 'b36-ground',
    label: 'Block 36 – Student Centre & Welfare',
    type: 'indoor',
    lat: 31.2538, lng: 75.7055,
    landmark: 'Block 36 ground floor, cafeteria, student services. East ramp entrance.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    hasStairs: true,
    lift: 'b36-lift',
    floor: 0,
    building: 'b36'
  },
  'b36-f1': {
    id: 'b36-f1',
    label: 'Block 36 – Floor 1 (Auditorium & Clubs)',
    type: 'indoor',
    lat: 31.2538, lng: 75.7055,
    landmark: 'Block 36 floor 1, seminar hall, wheelchair seating, club activity rooms.',
    stepFree: true,
    hasLift: true,
    hasStairs: true,
    lift: 'b36-lift',
    floor: 1,
    building: 'b36'
  },
  'b37-ground': {
    id: 'b37-ground',
    label: 'Block 37 – School of Law',
    type: 'indoor',
    lat: 31.2542, lng: 75.7060,
    landmark: 'Block 37 ground floor, moot court hall, legal aid clinic, ramp access.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b37-lift',
    floor: 0,
    building: 'b37'
  },
  'b38-ground': {
    id: 'b38-ground',
    label: 'Block 38 – Mittal School of Business',
    type: 'indoor',
    lat: 31.2546, lng: 75.7065,
    landmark: 'Block 38 atrium, MBA executive lecture theaters, stock exchange trading room.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b38-lift',
    floor: 0,
    building: 'b38'
  },
  'b55-ground': {
    id: 'b55-ground',
    label: 'Block 55 – School of Pharmaceutical Sciences',
    type: 'indoor',
    lat: 31.2560, lng: 75.7040,
    landmark: 'Block 55 lobby, pharmacology research laboratories, level ramped entry.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b55-lift',
    floor: 0,
    building: 'b55'
  },
  'b56-ground': {
    id: 'b56-ground',
    label: 'Block 56 – Bio-Sciences & Applied Tech',
    type: 'indoor',
    lat: 31.2563, lng: 75.7044,
    landmark: 'Block 56 lobby, genetics & microbiology research center, step-free access.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'b56-lift',
    floor: 0,
    building: 'b56'
  },

  /* RESIDENTIAL HOSTELS */
  'bh-south': {
    id: 'bh-south',
    label: 'Boys Hostel Complex (BH 1–4)',
    type: 'indoor',
    lat: 31.2515, lng: 75.7040,
    landmark: 'South residential zone, dining hall, indoor games room, accessible entrance.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'bhs-lift',
    floor: 0,
    building: 'bhsouth'
  },
  'bh-north': {
    id: 'bh-north',
    label: 'Boys Hostel Complex (BH 5–8)',
    type: 'indoor',
    lat: 31.2570, lng: 75.7035,
    landmark: 'North residential zone, modern accommodation blocks, step-free access.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'bhn-lift',
    floor: 0,
    building: 'bhnorth'
  },
  'gh-west': {
    id: 'gh-west',
    label: 'Girls Hostel Complex (GH 1–3)',
    type: 'indoor',
    lat: 31.2520, lng: 75.7060,
    landmark: 'West girls residential area, 24/7 security booth, accessible pathways.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'ghw-lift',
    floor: 0,
    building: 'ghwest'
  },
  'gh-east': {
    id: 'gh-east',
    label: 'Girls Hostel Complex (GH 4–6)',
    type: 'indoor',
    lat: 31.2565, lng: 75.7060,
    landmark: 'East girls residential area, laundry facility, green lawns, level ramp entry.',
    stepFree: true,
    hasRamp: true,
    hasLift: true,
    lift: 'ghe-lift',
    floor: 0,
    building: 'gheast'
  }
};

// ── LIFT STATUS REPOSITORY ──────────────────────────────────
const LIFTS = {
  'b14-lift': { id: 'b14-lift', building: 'b14', label: 'Block 14 Lift', operational: true, floors: [0, 1, 2], location: 'Central lobby' },
  'b25-lift': { id: 'b25-lift', building: 'b25', label: 'Block 25 Lift', operational: true, floors: [0, 1, 2, 3], location: 'Main corridor' },
  'b26-lift': { id: 'b26-lift', building: 'b26', label: 'Block 26 Lift', operational: true, floors: [0, 1, 2, 3, 4], location: 'CSE Atrium' },
  'b27-lift': { id: 'b27-lift', building: 'b27', label: 'Block 27 Lift', operational: true, floors: [0, 1, 2, 3], location: 'ECE foyer' },
  'b28-lift': { id: 'b28-lift', building: 'b28', label: 'Block 28 Lift', operational: true, floors: [0, 1, 2, 3], location: 'Mechanical wing' },
  'b29-lift': { id: 'b29-lift', building: 'b29', label: 'Block 29 Lift', operational: true, floors: [0, 1, 2], location: 'Civil corridor' },
  'b32-lift': { id: 'b32-lift', building: 'b32', label: 'Block 32 Lift', operational: true, floors: [0, 1, 2, 3], location: 'Central corridor next to accessible toilet' },
  'b33-lift': { id: 'b33-lift', building: 'b33', label: 'Block 33 Lift', operational: true, floors: [0, 1, 2], location: 'Agriculture wing' },
  'b34-lift': { id: 'b34-lift', building: 'b34', label: 'Block 34 Central Library Lift', operational: true, floors: [0, 1, 2], location: 'Main atrium, left of entrance' },
  'b35-lift': { id: 'b35-lift', building: 'b35', label: 'Block 35 Lift', operational: true, floors: [0, 1, 2, 3], location: 'Design lobby' },
  'b36-lift': { id: 'b36-lift', building: 'b36', label: 'Block 36 Lift', operational: true, floors: [0, 1, 2], location: 'East wing near accessible ramp' },
  'b37-lift': { id: 'b37-lift', building: 'b37', label: 'Block 37 Lift', operational: true, floors: [0, 1, 2, 3], location: 'Law block foyer' },
  'b38-lift': { id: 'b38-lift', building: 'b38', label: 'Block 38 Business School Lift', operational: true, floors: [0, 1, 2, 3, 4], location: 'MSB main atrium' },
  'b55-lift': { id: 'b55-lift', building: 'b55', label: 'Block 55 Lift', operational: true, floors: [0, 1, 2], location: 'Pharmacy entrance' },
  'b56-lift': { id: 'b56-lift', building: 'b56', label: 'Block 56 Lift', operational: true, floors: [0, 1, 2], location: 'Bio-tech wing' },
  'bhs-lift': { id: 'bhs-lift', building: 'bhsouth', label: 'BH South Lift', operational: true, floors: [0, 1, 2, 3, 4], location: 'BH 1-4 central lobby' },
  'bhn-lift': { id: 'bhn-lift', building: 'bhnorth', label: 'BH North Lift', operational: true, floors: [0, 1, 2, 3, 4], location: 'BH 5-8 central lobby' },
  'ghw-lift': { id: 'ghw-lift', building: 'ghwest', label: 'GH West Lift', operational: true, floors: [0, 1, 2, 3, 4], location: 'GH 1-3 central lobby' },
  'ghe-lift': { id: 'ghe-lift', building: 'gheast', label: 'GH East Lift', operational: true, floors: [0, 1, 2, 3, 4], location: 'GH 4-6 central lobby' },
};

// ── COMPREHENSIVE CAMPUS ROUTE GRAPH ─────────────────────────
// Every node is connected with both step-free and standard paths
const GRAPH = {
  'main-gate': [
    { to: 'uni-mall-entrance', weight: 80, stepFreeWeight: 80, stepFree: true, type: 'outdoor', shaded: true, desc: 'Walk along tree-shaded Central Avenue', landmark: 'Shaded tree canopy along central avenue' },
    { to: 'b32-ground', weight: 110, stepFreeWeight: 120, stepFree: true, type: 'outdoor', desc: 'Walk straight towards Block 32 Academic Block', landmark: 'Follow signage for Academic Block 32' },
    { to: 'food-court', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk south-east towards Central Food Court', landmark: 'Follow path past central fountain' },
    { to: 'unipolis', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk towards Unipolis cultural arena', landmark: 'Unipolis open stage visible on right' },
    { to: 'b14-ground', weight: 90, stepFreeWeight: 95, stepFree: true, type: 'outdoor', desc: 'Walk south-west towards Block 14 (Humanities)', landmark: 'Follow western perimeter avenue' },
    { to: 'uni-hospital', weight: 120, stepFreeWeight: 120, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk via covered medical walkway to Uni-Hospital', landmark: 'Covered patient walkway to hospital' },
    { to: 'bh-south', weight: 190, stepFreeWeight: 200, stepFree: true, type: 'outdoor', desc: 'Walk towards Boys Hostel 1-4 complex', landmark: 'Follow southern avenue towards residential zone' }
  ],

  'uni-mall-entrance': [
    { to: 'main-gate', weight: 80, stepFreeWeight: 80, stepFree: true, type: 'outdoor', shaded: true, desc: 'Walk towards Main Gate via tree-shaded avenue', landmark: 'Tree-lined shaded path to Main Gate' },
    { to: 'b34-ground', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk via covered glass arcade to Block 34', landmark: 'Covered canopy to Library entrance' },
    { to: 'b36-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk via covered promenade to Block 36', landmark: 'Sheltered arcade to Block 36' },
    { to: 'unipolis', weight: 45, stepFreeWeight: 45, stepFree: true, type: 'outdoor', desc: 'Walk to Unipolis arena', landmark: 'Adjacent to Uni-Mall plaza' },
    { to: 'food-court', weight: 50, stepFreeWeight: 50, stepFree: true, type: 'outdoor', desc: 'Walk to Food Court dining area', landmark: 'Food court is next to Uni-Mall' },
    { to: 'b33-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk towards Block 33 Agriculture', landmark: 'Pass between Uni-Mall and Block 32' },
    { to: 'b37-ground', weight: 90, stepFreeWeight: 95, stepFree: true, type: 'outdoor', desc: 'Walk towards Block 37 (School of Law)', landmark: 'Follow eastern path past Block 36' }
  ],

  'food-court': [
    { to: 'main-gate', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk to Main Gate', landmark: 'Follow path past central fountain' },
    { to: 'uni-mall-entrance', weight: 50, stepFreeWeight: 50, stepFree: true, type: 'outdoor', desc: 'Walk to Uni-Mall entrance', landmark: 'Adjacent to dining area' },
    { to: 'unipolis', weight: 40, stepFreeWeight: 40, stepFree: true, type: 'outdoor', desc: 'Walk to Unipolis arena', landmark: 'Follow paved amphitheater promenade' },
    { to: 'b36-ground', weight: 80, stepFreeWeight: 85, stepFree: true, type: 'outdoor', desc: 'Walk to Block 36 Student Centre', landmark: 'Follow path east past Uni-Mall' },
    { to: 'uni-hospital', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk south to Uni-Hospital', landmark: 'Follow medical emergency signs' },
    { to: 'indoor-stadium', weight: 85, stepFreeWeight: 90, stepFree: true, type: 'outdoor', desc: 'Walk towards Indoor Sports Complex', landmark: 'Follow sports arena pathway' }
  ],

  'unipolis': [
    { to: 'main-gate', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk to Main Gate', landmark: 'Central Avenue path straight ahead' },
    { to: 'uni-mall-entrance', weight: 45, stepFreeWeight: 45, stepFree: true, type: 'outdoor', desc: 'Walk to Uni-Mall plaza', landmark: 'Fountain plaza right next to Unipolis' },
    { to: 'food-court', weight: 40, stepFreeWeight: 40, stepFree: true, type: 'outdoor', desc: 'Walk to Food Court', landmark: 'Paved level walk across plaza' },
    { to: 'b32-ground', weight: 55, stepFreeWeight: 60, stepFree: true, type: 'outdoor', desc: 'Walk to Block 32', landmark: 'Block 32 entrance ramp directly northwest' },
    { to: 'b33-ground', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk to Block 33', landmark: 'Follow central promenade north' },
    { to: 'b34-ground', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk to Block 34 Central Library', landmark: 'Library glass dome visible' }
  ],

  'b14-ground': [
    { to: 'main-gate', weight: 90, stepFreeWeight: 95, stepFree: true, type: 'outdoor', desc: 'Walk to Main Gate', landmark: 'Follow tree-lined western path to main gate' },
    { to: 'b25-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk north to Block 25', landmark: 'Follow engineering avenue northward' },
    { to: 'uni-hospital', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk south-east to University Hospital', landmark: 'Level crossway to hospital entrance' },
    { to: 'gate-3', weight: 80, stepFreeWeight: 85, stepFree: true, type: 'outdoor', desc: 'Walk south-west to Gate 3', landmark: 'Follow perimeter road to Gate 3' }
  ],

  'b25-ground': [
    { to: 'b14-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk south to Block 14', landmark: 'Follow western avenue' },
    { to: 'b26-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered engineering corridor to Block 26', landmark: 'Covered interconnecting corridor' },
    { to: 'b32-ground', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Cross walkway east to Block 32', landmark: 'Direct connecting bridge and ramp' }
  ],

  'b26-ground': [
    { to: 'b25-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered engineering corridor to Block 25', landmark: 'Covered interconnecting corridor' },
    { to: 'b27-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered corridor north to Block 27', landmark: 'Continuous sheltered corridor' },
    { to: 'b32-ground', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk east to Block 32', landmark: 'Cross accessible walkway to Block 32 south entrance' }
  ],

  'b27-ground': [
    { to: 'b26-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered corridor south to Block 26', landmark: 'Continuous sheltered corridor' },
    { to: 'b28-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered corridor to Block 28', landmark: 'Covered walkway to Block 28' },
    { to: 'b32-ground', weight: 65, stepFreeWeight: 70, stepFree: true, type: 'outdoor', desc: 'Walk south-east to Block 32', landmark: 'Connecting avenue' },
    { to: 'b33-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk east to Block 33', landmark: 'Paved cross-campus avenue' }
  ],

  'b28-ground': [
    { to: 'b27-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered corridor to Block 27', landmark: 'Covered corridor to Block 27' },
    { to: 'b29-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered corridor to Block 29', landmark: 'Covered civil engineering corridor' },
    { to: 'b33-ground', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk east to Block 33', landmark: 'Cross-pathway towards Agriculture block' },
    { to: 'b55-ground', weight: 90, stepFreeWeight: 95, stepFree: true, type: 'outdoor', desc: 'Walk north-east towards Block 55 Pharmacy', landmark: 'Follow northern research ring road' }
  ],

  'b29-ground': [
    { to: 'b28-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered corridor to Block 28', landmark: 'Covered engineering corridor' },
    { to: 'b55-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk east to Block 55 (Pharmacy)', landmark: 'Northern corridor with gentle ramp' },
    { to: 'bh-north', weight: 85, stepFreeWeight: 90, stepFree: true, type: 'outdoor', desc: 'Walk north to Boys Hostel 5–8', landmark: 'Follow northern residential pathway' }
  ],

  'b32-ground': [
    { to: 'main-gate', weight: 110, stepFreeWeight: 120, stepFree: true, type: 'outdoor', desc: 'Walk south to Main Gate', landmark: 'Central Avenue straight to gate' },
    { to: 'unipolis', weight: 55, stepFreeWeight: 60, stepFree: true, type: 'outdoor', desc: 'Walk south to Unipolis arena', landmark: 'Level paved promenade' },
    { to: 'uni-mall-entrance', weight: 80, stepFreeWeight: 85, stepFree: true, type: 'outdoor', desc: 'Walk east to Uni-Mall', landmark: 'Follow path past water fountain' },
    { to: 'b26-ground', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk west to Block 26 (CSE)', landmark: 'Cross walkway west' },
    { to: 'b33-ground', weight: 50, stepFreeWeight: 55, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered central walkway to Block 33', landmark: 'Covered connecting walkway' },
    { to: 'b34-ground', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk north-east to Block 34 (Library)', landmark: 'Library block is adjacent to the east' },
    { to: 'b32-f1', weight: 35, stepFreeWeight: 50, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take lift up to Floor 1', landmark: 'Central corridor lift' }
  ],

  'b32-f1': [
    { to: 'b32-ground', weight: 35, stepFreeWeight: 50, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take lift down to Ground Floor', landmark: 'Central corridor lift' },
    { to: 'b32-f2', weight: 35, stepFreeWeight: 50, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take lift up to Floor 2', landmark: 'Same central lift' }
  ],

  'b32-f2': [
    { to: 'b32-f1', weight: 35, stepFreeWeight: 50, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take lift down to Floor 1', landmark: 'Central corridor lift' },
    { to: 'b32-ground', weight: 60, stepFreeWeight: 75, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take lift to Ground Floor', landmark: 'Central corridor lift' }
  ],

  'b33-ground': [
    { to: 'b32-ground', weight: 50, stepFreeWeight: 55, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered walkway to Block 32', landmark: 'Covered connecting walkway' },
    { to: 'b34-ground', weight: 50, stepFreeWeight: 55, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered walkway to Central Library', landmark: 'Covered canopy path' },
    { to: 'b27-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk west to Block 27 (ECE)', landmark: 'Crossway to engineering blocks' },
    { to: 'b28-ground', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk west to Block 28 (Mechanical)', landmark: 'Paved western connector' },
    { to: 'b55-ground', weight: 65, stepFreeWeight: 70, stepFree: true, type: 'outdoor', desc: 'Walk north to Block 55 (Pharmacy)', landmark: 'Northern academic pathway' }
  ],

  'b34-ground': [
    { to: 'uni-mall-entrance', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk via covered canopy south to Uni-Mall', landmark: 'Sheltered arcade to Uni-Mall plaza' },
    { to: 'b32-ground', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk southwest to Block 32', landmark: 'Paved campus promenade' },
    { to: 'b33-ground', weight: 50, stepFreeWeight: 55, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered canopy path to Block 33', landmark: 'Covered connecting canopy' },
    { to: 'b35-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered corridor to Block 35', landmark: 'Covered promenade to Architecture' },
    { to: 'b36-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk south-east to Block 36 Student Centre', landmark: 'Paved route with accessible ramps' },
    { to: 'b56-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk north to Block 56 (Bio-Sciences)', landmark: 'Northern garden walk' },
    { to: 'b34-f1', weight: 35, stepFreeWeight: 50, stepFree: true, type: 'lift', lift: 'b34-lift', desc: 'Take library lift up to Floor 1', landmark: 'Main atrium lift' }
  ],

  'b34-f1': [
    { to: 'b34-ground', weight: 35, stepFreeWeight: 50, stepFree: true, type: 'lift', lift: 'b34-lift', desc: 'Take library lift down to Ground Floor', landmark: 'Main atrium lift' }
  ],

  'b35-ground': [
    { to: 'b34-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered corridor to Central Library', landmark: 'Covered walkway to Library' },
    { to: 'b56-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', desc: 'Walk north to Block 56', landmark: 'Bio-Sciences wing' },
    { to: 'b38-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk south-east to Block 38 (Business School)', landmark: 'East campus connection' },
    { to: 'gh-east', weight: 85, stepFreeWeight: 90, stepFree: true, type: 'outdoor', desc: 'Walk east to Girls Hostel 4–6', landmark: 'Residential avenue' }
  ],

  'b36-ground': [
    { to: 'uni-mall-entrance', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk via covered arcade west to Uni-Mall', landmark: 'Sheltered arcade past plaza' },
    { to: 'b34-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk northwest to Block 34 (Library)', landmark: 'Step-free garden path' },
    { to: 'b37-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered colonnade to Block 37 (Law)', landmark: 'Sheltered colonnade arcade' },
    { to: 'indoor-stadium', weight: 65, stepFreeWeight: 70, stepFree: true, type: 'outdoor', desc: 'Walk south to Indoor Sports Complex', landmark: 'Sports stadium promenade' },
    { to: 'gh-west', weight: 80, stepFreeWeight: 85, stepFree: true, type: 'outdoor', desc: 'Walk south to Girls Hostel 1–3', landmark: 'Hostel security checkpost' },
    { to: 'b36-f1', weight: 35, stepFreeWeight: 50, stepFree: true, type: 'lift', lift: 'b36-lift', desc: 'Take east wing lift to Floor 1', landmark: 'East wing accessible lift' }
  ],

  'b36-f1': [
    { to: 'b36-ground', weight: 35, stepFreeWeight: 50, stepFree: true, type: 'lift', lift: 'b36-lift', desc: 'Take lift to Ground Floor', landmark: 'East wing accessible lift' }
  ],

  'b37-ground': [
    { to: 'b36-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered colonnade to Block 36', landmark: 'Sheltered colonnade arcade' },
    { to: 'b38-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered arcade to Mittal School of Business', landmark: 'Covered arcade to MSB' },
    { to: 'gate-2', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk east to Gate 2', landmark: 'Follow road to Gate 2 security entrance' },
    { to: 'gh-west', weight: 85, stepFreeWeight: 90, stepFree: true, type: 'outdoor', desc: 'Walk south to Girls Hostel 1–3', landmark: 'Southern residential pathway' }
  ],

  'b38-ground': [
    { to: 'b37-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk through covered arcade to Block 37 (Law)', landmark: 'Covered arcade' },
    { to: 'b35-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk northwest to Block 35 (Architecture)', landmark: 'Cross campus avenue' },
    { to: 'gate-2', weight: 55, stepFreeWeight: 60, stepFree: true, type: 'outdoor', desc: 'Walk east to Gate 2', landmark: 'Main approach road to Gate 2' },
    { to: 'gh-east', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk north to Girls Hostel 4–6', landmark: 'Paved residential route' }
  ],

  'b55-ground': [
    { to: 'b28-ground', weight: 90, stepFreeWeight: 95, stepFree: true, type: 'outdoor', desc: 'Walk southwest to Block 28', landmark: 'Northern engineering ring road' },
    { to: 'b29-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk west to Block 29 (Civil)', landmark: 'Western research corridor' },
    { to: 'b33-ground', weight: 65, stepFreeWeight: 70, stepFree: true, type: 'outdoor', desc: 'Walk south to Block 33', landmark: 'Agriculture avenue' },
    { to: 'b56-ground', weight: 40, stepFreeWeight: 45, stepFree: true, type: 'outdoor', desc: 'Walk east to Block 56 (Bio-Sciences)', landmark: 'Adjacent science wing' },
    { to: 'bh-north', weight: 65, stepFreeWeight: 70, stepFree: true, type: 'outdoor', desc: 'Walk north to Boys Hostel 5–8', landmark: 'Direct residential pathway' }
  ],

  'b56-ground': [
    { to: 'b55-ground', weight: 40, stepFreeWeight: 45, stepFree: true, type: 'outdoor', desc: 'Walk west to Block 55', landmark: 'Adjacent block' },
    { to: 'b34-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk south to Central Library', landmark: 'Library northern avenue' },
    { to: 'b35-ground', weight: 45, stepFreeWeight: 50, stepFree: true, type: 'outdoor', desc: 'Walk south to Block 35 (Architecture)', landmark: 'Adjacent design block' },
    { to: 'bh-north', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk north-west to Boys Hostel 5–8', landmark: 'North residential path' },
    { to: 'gh-east', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk east to Girls Hostel 4–6', landmark: 'East residential walkway' }
  ],

  'uni-hospital': [
    { to: 'main-gate', weight: 120, stepFreeWeight: 120, stepFree: true, type: 'outdoor', covered: true, desc: 'Walk north via covered walkway to Main Gate', landmark: 'Covered walkway towards Main Gate' },
    { to: 'food-court', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk north to Food Court', landmark: 'Paved garden path' },
    { to: 'b14-ground', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk north-west to Block 14', landmark: 'Follow western avenue' },
    { to: 'bh-south', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk south to Boys Hostel 1–4', landmark: 'Direct residential access' },
    { to: 'gate-3', weight: 55, stepFreeWeight: 60, stepFree: true, type: 'outdoor', desc: 'Walk south-west to Gate 3', landmark: 'Direct connection to Gate 3' }
  ],

  'indoor-stadium': [
    { to: 'food-court', weight: 85, stepFreeWeight: 90, stepFree: true, type: 'outdoor', desc: 'Walk north-west to Food Court', landmark: 'Follow sports complex avenue' },
    { to: 'b36-ground', weight: 65, stepFreeWeight: 70, stepFree: true, type: 'outdoor', desc: 'Walk north to Block 36 Student Centre', landmark: 'Direct stadium promenade' },
    { to: 'gh-west', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk east to Girls Hostel 1–3', landmark: 'Paved residential walkway' },
    { to: 'bh-south', weight: 95, stepFreeWeight: 100, stepFree: true, type: 'outdoor', desc: 'Walk south-west to Boys Hostel 1–4', landmark: 'Cross athletic track pathway' }
  ],

  'gate-2': [
    { to: 'b37-ground', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk west to Block 37 (School of Law)', landmark: 'Enter via Gate 2 security entrance' },
    { to: 'b38-ground', weight: 55, stepFreeWeight: 60, stepFree: true, type: 'outdoor', desc: 'Walk west to Mittal School of Business', landmark: 'Main entrance avenue' },
    { to: 'gh-east', weight: 85, stepFreeWeight: 90, stepFree: true, type: 'outdoor', desc: 'Walk north-west to Girls Hostel 4–6', landmark: 'Perimeter access road' }
  ],

  'gate-3': [
    { to: 'uni-hospital', weight: 55, stepFreeWeight: 60, stepFree: true, type: 'outdoor', desc: 'Walk north-east to University Hospital', landmark: 'Direct paved medical road' },
    { to: 'b14-ground', weight: 80, stepFreeWeight: 85, stepFree: true, type: 'outdoor', desc: 'Walk north to Block 14 (Humanities)', landmark: 'Western avenue approach' },
    { to: 'bh-south', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk east to Boys Hostel 1–4', landmark: 'South residential approach' }
  ],

  'bh-south': [
    { to: 'uni-hospital', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk north to University Hospital', landmark: 'Direct medical path' },
    { to: 'main-gate', weight: 190, stepFreeWeight: 200, stepFree: true, type: 'outdoor', desc: 'Walk north to Main Gate', landmark: 'Follow main campus transit road' },
    { to: 'gate-3', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk south-west to Gate 3', landmark: 'Southern exit road' },
    { to: 'indoor-stadium', weight: 95, stepFreeWeight: 100, stepFree: true, type: 'outdoor', desc: 'Walk north-east to Indoor Stadium', landmark: 'Sports complex path' }
  ],

  'bh-north': [
    { to: 'b29-ground', weight: 85, stepFreeWeight: 90, stepFree: true, type: 'outdoor', desc: 'Walk south to Block 29 (Civil)', landmark: 'Western research wing' },
    { to: 'b55-ground', weight: 65, stepFreeWeight: 70, stepFree: true, type: 'outdoor', desc: 'Walk south-east to Block 55 (Pharmacy)', landmark: 'Follow north perimeter road' },
    { to: 'b56-ground', weight: 70, stepFreeWeight: 75, stepFree: true, type: 'outdoor', desc: 'Walk south-east to Block 56 (Bio-Sciences)', landmark: 'Northern science avenue' }
  ],

  'gh-west': [
    { to: 'b36-ground', weight: 80, stepFreeWeight: 85, stepFree: true, type: 'outdoor', desc: 'Walk north to Block 36 Student Centre', landmark: 'Paved student promenade' },
    { to: 'b37-ground', weight: 85, stepFreeWeight: 90, stepFree: true, type: 'outdoor', desc: 'Walk north to Block 37 (School of Law)', landmark: 'Eastern corridor' },
    { to: 'indoor-stadium', weight: 60, stepFreeWeight: 65, stepFree: true, type: 'outdoor', desc: 'Walk west to Indoor Stadium', landmark: 'Direct sports path' }
  ],

  'gh-east': [
    { to: 'b38-ground', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk south to Block 38 (Business School)', landmark: 'Paved residential avenue' },
    { to: 'b35-ground', weight: 85, stepFreeWeight: 90, stepFree: true, type: 'outdoor', desc: 'Walk west to Block 35 (Architecture)', landmark: 'Campus design promenade' },
    { to: 'b56-ground', weight: 75, stepFreeWeight: 80, stepFree: true, type: 'outdoor', desc: 'Walk west to Block 56 (Bio-Sciences)', landmark: 'Northern academic link' },
    { to: 'gate-2', weight: 85, stepFreeWeight: 90, stepFree: true, type: 'outdoor', desc: 'Walk south-east to Gate 2', landmark: 'Perimeter access road' }
  ]
};

// ── BUILDING METADATA ────────────────────────────────────────
const BUILDINGS = {
  b14: { id: 'b14', label: 'Block 14', subtitle: 'Humanities & Social Sciences', lat: 31.2528, lng: 75.7028, lift: 'b14-lift', floors: 3, color: '#3949ab', number: '14' },
  b25: { id: 'b25', label: 'Block 25', subtitle: 'Computer Applications & IT', lat: 31.2539, lng: 75.7018, lift: 'b25-lift', floors: 4, color: '#0288d1', number: '25' },
  b26: { id: 'b26', label: 'Block 26', subtitle: 'Computer Science & Engineering', lat: 31.2543, lng: 75.7020, lift: 'b26-lift', floors: 5, color: '#0097a7', number: '26' },
  b27: { id: 'b27', label: 'Block 27', subtitle: 'Electronics & Communication', lat: 31.2547, lng: 75.7022, lift: 'b27-lift', floors: 4, color: '#00796b', number: '27' },
  b28: { id: 'b28', label: 'Block 28', subtitle: 'Mechanical & Aerospace Engg', lat: 31.2551, lng: 75.7024, lift: 'b28-lift', floors: 4, color: '#388e3c', number: '28' },
  b29: { id: 'b29', label: 'Block 29', subtitle: 'Civil Engineering & Biotech', lat: 31.2555, lng: 75.7026, lift: 'b29-lift', floors: 3, color: '#689f38', number: '29' },
  b32: { id: 'b32', label: 'Block 32', subtitle: 'Academic Block (CSE & Tech)', lat: 31.2545, lng: 75.7030, lift: 'b32-lift', floors: 4, color: '#1a237e', number: '32' },
  b33: { id: 'b33', label: 'Block 33', subtitle: 'Agriculture & Food Technology', lat: 31.2549, lng: 75.7038, lift: 'b33-lift', floors: 3, color: '#afb42b', number: '33' },
  b34: { id: 'b34', label: 'Block 34', subtitle: 'Shanti Devi Mittal Central Library', lat: 31.2552, lng: 75.7048, lift: 'b34-lift', floors: 3, color: '#1b5e20', number: '34' },
  b35: { id: 'b35', label: 'Block 35', subtitle: 'School of Architecture & Design', lat: 31.2556, lng: 75.7052, lift: 'b35-lift', floors: 4, color: '#f57c00', number: '35' },
  b36: { id: 'b36', label: 'Block 36', subtitle: 'Student Centre & Welfare', lat: 31.2538, lng: 75.7055, lift: 'b36-lift', floors: 3, color: '#880e4f', number: '36' },
  b37: { id: 'b37', label: 'Block 37', subtitle: 'School of Law', lat: 31.2542, lng: 75.7060, lift: 'b37-lift', floors: 4, color: '#5d4037', number: '37' },
  b38: { id: 'b38', label: 'Block 38', subtitle: 'Mittal School of Business (MSB)', lat: 31.2546, lng: 75.7065, lift: 'b38-lift', floors: 5, color: '#455a64', number: '38' },
  b55: { id: 'b55', label: 'Block 55', subtitle: 'School of Pharmaceutical Sciences', lat: 31.2560, lng: 75.7040, lift: 'b55-lift', floors: 3, color: '#d32f2f', number: '55' },
  b56: { id: 'b56', label: 'Block 56', subtitle: 'Bio-Sciences & Research Labs', lat: 31.2563, lng: 75.7044, lift: 'b56-lift', floors: 3, color: '#c2185b', number: '56' },
  unimall: { id: 'unimall', label: 'Uni-Mall', subtitle: 'Central Shopping & Food Plaza', lat: 31.2546, lng: 75.7050, lift: null, floors: 2, color: '#e65100', number: 'UM' },
  unihospital: { id: 'unihospital', label: 'Uni-Hospital', subtitle: '24/7 University Hospital & Trauma Care', lat: 31.2525, lng: 75.7034, lift: null, floors: 3, color: '#b71c1c', number: 'UH' },
  unipolis: { id: 'unipolis', label: 'Unipolis', subtitle: 'Baldev Raj Mittal Cultural Arena', lat: 31.2540, lng: 75.7045, lift: null, floors: 1, color: '#7b1fa2', number: 'UP' },
  indoorstadium: { id: 'indoorstadium', label: 'Indoor Stadium', subtitle: 'Olympic Pool & Multi-Sports Complex', lat: 31.2532, lng: 75.7062, lift: null, floors: 2, color: '#00838f', number: 'IS' },
  bhsouth: { id: 'bhsouth', label: 'Boys Hostel 1–4', subtitle: 'South Residential Complex', lat: 31.2515, lng: 75.7040, lift: 'bhs-lift', floors: 5, color: '#37474f', number: 'BH' },
  bhnorth: { id: 'bhnorth', label: 'Boys Hostel 5–8', subtitle: 'North Residential Complex', lat: 31.2570, lng: 75.7035, lift: 'bhn-lift', floors: 5, color: '#455a64', number: 'BH' },
  ghwest: { id: 'ghwest', label: 'Girls Hostel 1–3', subtitle: 'West Residential Complex', lat: 31.2520, lng: 75.7060, lift: 'ghw-lift', floors: 5, color: '#ad1457', number: 'GH' },
  gheast: { id: 'gheast', label: 'Girls Hostel 4–6', subtitle: 'East Residential Complex', lat: 31.2565, lng: 75.7060, lift: 'ghe-lift', floors: 5, color: '#880e4f', number: 'GH' }
};

// ── ACTIVE REPORTS SYSTEM ────────────────────────────────────
let activeReports = JSON.parse(sessionStorage.getItem('campusReports') || '[]');

activeReports.forEach(report => {
  if (report.type === 'lift-broken' && report.building) {
    const liftKey = `${report.building}-lift`;
    if (LIFTS[liftKey]) {
      LIFTS[liftKey].operational = false;
      LIFTS[liftKey].reportId = report.id;
    }
  }
});

function saveReports() {
  sessionStorage.setItem('campusReports', JSON.stringify(activeReports));
  if (window.CampusData) {
    window.CampusData.activeReports = activeReports;
  }
}

function addReport(report) {
  report.id = `report-${Date.now()}`;
  report.timestamp = new Date().toISOString();
  activeReports.unshift(report);
  saveReports();

  if (report.type === 'lift-broken' && report.building) {
    const liftKey = `${report.building}-lift`;
    if (LIFTS[liftKey]) {
      LIFTS[liftKey].operational = false;
      LIFTS[liftKey].reportId = report.id;
    }
  }
  return report;
}

function dismissReport(id) {
  const report = activeReports.find(r => r.id === id);
  activeReports = activeReports.filter(r => r.id !== id);
  saveReports();

  if (report && report.type === 'lift-broken' && report.building) {
    const liftKey = `${report.building}-lift`;
    if (LIFTS[liftKey] && LIFTS[liftKey].reportId === id) {
      LIFTS[liftKey].operational = true;
      delete LIFTS[liftKey].reportId;
    }
  }
  return report;
}

window.CampusData = {
  NODES,
  LIFTS,
  GRAPH,
  BUILDINGS,
  get activeReports() { return activeReports; },
  set activeReports(val) { activeReports = val; },
  addReport,
  dismissReport
};
