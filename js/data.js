/**
 * data.js – Campus Navigation Data Store
 * LPU Pathway – 3 Buildings: Block 32, 34, 36
 */

'use strict';

// 
// LOCATION NODES
// Each node represents a navigable point on campus
// 
const NODES = {
 /* OUTDOOR / ENTRY POINTS */
 /* Real LPU coordinates: campus center ~31.2536°N, 75.7037°E */
 'main-gate': {
 id: 'main-gate',
 label: 'Main Gate',
 type: 'outdoor',
 lat: 31.2536, lng: 75.7037,
 landmark: 'Main campus entrance on GT Road with security booth. Ramped entry on left side.',
 stepFree: true,
 hasRamp: true,
 floor: null,
 building: null,
 },
 'uni-mall-entrance': {
 id: 'uni-mall-entrance',
 label: 'Uni-Mall Entrance',
 type: 'outdoor',
 lat: 31.2546, lng: 75.7050,
 landmark: 'Uni-Mall shopping complex entrance, fountain visible on left, level access',
 stepFree: true,
 hasRamp: true,
 floor: null,
 building: null,
 },
 'food-court': {
 id: 'food-court',
 label: 'Food Court',
 type: 'outdoor',
 lat: 31.2530, lng: 75.7042,
 landmark: 'Campus food court, multiple eateries, wheelchair accessible seating',
 stepFree: true,
 hasRamp: false,
 floor: null,
 building: null,
 },

 /* BLOCK 32 – ACADEMIC BLOCK */
 'b32-ground': {
 id: 'b32-ground',
 label: 'Block 32 – Ground Floor',
 type: 'indoor',
 lat: 31.2545, lng: 75.7030,
 landmark: 'Block 32 ground floor lobby, reception desk straight ahead, ramp at south entrance',
 stepFree: true,
 hasRamp: true,
 hasLift: true,
 hasStairs: true,
 lift: 'b32-lift',
 floor: 0,
 building: 'b32',
 },
 'b32-f1': {
 id: 'b32-f1',
 label: 'Block 32 – Floor 1',
 type: 'indoor',
 lat: 31.2545, lng: 75.7030,
 landmark: 'Block 32 floor 1, lecture halls 101–110 on your right after exiting lift',
 stepFree: true,
 hasLift: true,
 hasStairs: true,
 lift: 'b32-lift',
 floor: 1,
 building: 'b32',
 },
 'b32-f2': {
 id: 'b32-f2',
 label: 'Block 32 – Floor 2',
 type: 'indoor',
 lat: 31.2545, lng: 75.7030,
 landmark: 'Block 32 floor 2, computer labs and faculty offices, accessible toilet on left',
 stepFree: true,
 hasLift: true,
 hasStairs: true,
 lift: 'b32-lift',
 floor: 2,
 building: 'b32',
 },
 'b32-f3': {
 id: 'b32-f3',
 label: 'Block 32 – Floor 3',
 type: 'indoor',
 lat: 31.2545, lng: 75.7030,
 landmark: 'Block 32 floor 3, conference rooms and research labs at the end of corridor',
 stepFree: true,
 hasLift: true,
 hasStairs: true,
 lift: 'b32-lift',
 floor: 3,
 building: 'b32',
 },

 /* BLOCK 34 – LIBRARY BLOCK */
 'b34-ground': {
 id: 'b34-ground',
 label: 'Block 34 – Ground Floor (Library)',
 type: 'indoor',
 lat: 31.2552, lng: 75.7048,
 landmark: 'Block 34 ground floor, library issue counter on left, accessible toilets near entrance, level entry — no steps',
 stepFree: true,
 hasRamp: false,
 hasLift: true,
 hasStairs: true,
 lift: 'b34-lift',
 floor: 0,
 building: 'b34',
 },
 'b34-f1': {
 id: 'b34-f1',
 label: 'Block 34 – Floor 1 (Reading Room)',
 type: 'indoor',
 lat: 31.2552, lng: 75.7048,
 landmark: 'Block 34 floor 1, reading rooms straight ahead, reference section on right',
 stepFree: true,
 hasLift: true,
 hasStairs: true,
 lift: 'b34-lift',
 floor: 1,
 building: 'b34',
 },
 'b34-f2': {
 id: 'b34-f2',
 label: 'Block 34 – Floor 2 (Digital Library)',
 type: 'indoor',
 lat: 31.2552, lng: 75.7048,
 landmark: 'Block 34 floor 2, digital library on left, study carrels on right',
 stepFree: true,
 hasLift: true,
 hasStairs: true,
 lift: 'b34-lift',
 floor: 2,
 building: 'b34',
 },

 /* BLOCK 36 – STUDENT CENTRE */
 'b36-ground': {
 id: 'b36-ground',
 label: 'Block 36 – Ground Floor (Student Centre)',
 type: 'indoor',
 lat: 31.2538, lng: 75.7055,
 landmark: 'Block 36 ground floor, cafeteria on right, reception straight ahead. Use EAST entrance for step-free access.',
 stepFree: true,
 hasRamp: true,
 hasLift: true,
 hasStairs: true,
 lift: 'b36-lift',
 floor: 0,
 building: 'b36',
 accessNote: 'EAST entrance only — west entrance has 2 steps',
 },
 'b36-f1': {
 id: 'b36-f1',
 label: 'Block 36 – Floor 1 (Seminar Hall)',
 type: 'indoor',
 lat: 31.2538, lng: 75.7055,
 landmark: 'Block 36 floor 1, seminar hall ahead, wheelchair seating at front rows, club rooms on right',
 stepFree: true,
 hasLift: true,
 hasStairs: true,
 lift: 'b36-lift',
 floor: 1,
 building: 'b36',
 },
 'b36-f2': {
 id: 'b36-f2',
 label: 'Block 36 – Floor 2 (Admin)',
 type: 'indoor',
 lat: 31.2538, lng: 75.7055,
 landmark: 'Block 36 floor 2, admin offices on left, counselling centre at the end of corridor',
 stepFree: true,
 hasLift: true,
 hasStairs: true,
 lift: 'b36-lift',
 floor: 2,
 building: 'b36',
 },
};

// 
// LIFT STATUS
// 
const LIFTS = {
 'b32-lift': {
 id: 'b32-lift',
 building: 'b32',
 label: 'Block 32 Lift',
 operational: true,
 floors: [0, 1, 2, 3],
 location: 'Central corridor, next to accessible toilet',
 },
 'b34-lift': {
 id: 'b34-lift',
 building: 'b34',
 label: 'Block 34 Lift',
 operational: true,
 floors: [0, 1, 2],
 location: 'Main atrium, left of the entrance',
 },
 'b36-lift': {
 id: 'b36-lift',
 building: 'b36',
 label: 'Block 36 Lift',
 operational: true,
 floors: [0, 1, 2],
 location: 'East wing, near accessible entrance',
 },
};

// 
// ROUTE GRAPH (adjacency + step-free flags)
// Each edge: { to, weight, stepFreeWeight, stepFree, type, description, landmark }
// weight = walking time in seconds (fastest)
// stepFreeWeight = time via accessible route (may differ)
// 
const GRAPH = {
 'main-gate': [
 { to: 'uni-mall-entrance', weight: 60, stepFreeWeight: 60, stepFree: true, type: 'outdoor', desc: 'Walk along the main campus road', landmark: 'Past the security cabin, follow the central path' },
 { to: 'b32-ground', weight: 180, stepFreeWeight: 200, stepFree: true, type: 'outdoor', desc: 'Walk to Block 32 via main road', landmark: 'Follow signs for Academic Block 32' },
 { to: 'food-court', weight: 120, stepFreeWeight: 130, stepFree: true, type: 'outdoor', desc: 'Walk to food court', landmark: 'Follow path past the main fountain' },
 ],
 'uni-mall-entrance': [
 { to: 'main-gate', weight: 60, stepFreeWeight: 60, stepFree: true, type: 'outdoor', desc: 'Walk back to main gate', landmark: 'Follow path past security cabin' },
 { to: 'b34-ground', weight: 90, stepFreeWeight: 100, stepFree: true, type: 'outdoor', desc: 'Walk to Block 34 (Library)', landmark: 'Pass Uni-Mall, Block 34 on your left with level entry' },
 { to: 'b36-ground', weight: 100, stepFreeWeight: 120, stepFree: true, type: 'outdoor', desc: 'Walk to Block 36 Student Centre', landmark: 'Follow path to east entrance of Block 36' },
 { to: 'food-court', weight: 70, stepFreeWeight: 70, stepFree: true, type: 'outdoor', desc: 'Walk to food court', landmark: 'Food court is adjacent to Uni-Mall' },
 ],
 'food-court': [
 { to: 'main-gate', weight: 120, stepFreeWeight: 130, stepFree: true, type: 'outdoor', desc: 'Walk to main gate', landmark: 'Follow path past fountain' },
 { to: 'uni-mall-entrance', weight: 70, stepFreeWeight: 70, stepFree: true, type: 'outdoor', desc: 'Walk to Uni-Mall entrance', landmark: 'Adjacent to food court' },
 { to: 'b32-ground', weight: 100, stepFreeWeight: 110, stepFree: true, type: 'outdoor', desc: 'Walk to Block 32', landmark: 'Follow signs for Academic Block 32' },
 ],
 'b32-ground': [
 { to: 'main-gate', weight: 180, stepFreeWeight: 200, stepFree: true, type: 'outdoor', desc: 'Exit Block 32 via main ramp', landmark: 'Ramp exit at south entrance, follow campus road' },
 { to: 'food-court', weight: 100, stepFreeWeight: 110, stepFree: true, type: 'outdoor', desc: 'Walk to food court', landmark: 'Exit south, follow path past garden' },
 { to: 'b34-ground', weight: 150, stepFreeWeight: 160, stepFree: true, type: 'outdoor', desc: 'Walk from Block 32 to Block 34', landmark: 'Exit south, turn right, Block 34 is next building' },
 { to: 'b32-f1', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take the lift up to Floor 1', landmark: 'Lift is in the central corridor, past reception desk' },
 { to: 'b32-f1', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take the stairs to Floor 1', landmark: 'Stairs are at north end of corridor — not step-free' },
 ],
 'b32-f1': [
 { to: 'b32-ground', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take the lift down to Ground Floor', landmark: 'Lift at central corridor' },
 { to: 'b32-ground', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take the stairs down to Ground Floor', landmark: 'Stairs at north end — not step-free' },
 { to: 'b32-f2', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take the lift up to Floor 2', landmark: 'Same lift, central corridor' },
 { to: 'b32-f2', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take the stairs up to Floor 2', landmark: 'Stairs not step-free' },
 ],
 'b32-f2': [
 { to: 'b32-f1', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take the lift down to Floor 1', landmark: 'Lift at central corridor' },
 { to: 'b32-f1', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take the stairs down to Floor 1', landmark: 'Not step-free' },
 { to: 'b32-f3', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take the lift up to Floor 3', landmark: 'Same lift, central corridor' },
 { to: 'b32-f3', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take the stairs up to Floor 3', landmark: 'Not step-free' },
 ],
 'b32-f3': [
 { to: 'b32-f2', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b32-lift', desc: 'Take the lift down to Floor 2', landmark: 'Central corridor lift' },
 { to: 'b32-f2', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take stairs down to Floor 2', landmark: 'North end stairs' },
 ],
 'b34-ground': [
 { to: 'uni-mall-entrance', weight: 90, stepFreeWeight: 100, stepFree: true, type: 'outdoor', desc: 'Walk to Uni-Mall entrance', landmark: 'Level exit, turn right past fountain' },
 { to: 'b32-ground', weight: 150, stepFreeWeight: 160, stepFree: true, type: 'outdoor', desc: 'Walk to Block 32', landmark: 'Exit south, turn left, Block 32 is adjacent' },
 { to: 'b36-ground', weight: 120, stepFreeWeight: 130, stepFree: true, type: 'outdoor', desc: 'Walk to Block 36 Student Centre', landmark: 'Exit east, follow campus path' },
 { to: 'b34-f1', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b34-lift', desc: 'Take the lift up to Floor 1', landmark: 'Lift at main atrium, left of entrance' },
 { to: 'b34-f1', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take stairs up to Floor 1', landmark: 'Right side stairs — not step-free' },
 ],
 'b34-f1': [
 { to: 'b34-ground', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b34-lift', desc: 'Take the lift down to Ground Floor', landmark: 'Atrium lift' },
 { to: 'b34-ground', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take stairs down', landmark: 'Right side stairs' },
 { to: 'b34-f2', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b34-lift', desc: 'Take the lift up to Floor 2', landmark: 'Same atrium lift' },
 { to: 'b34-f2', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take stairs up to Floor 2', landmark: 'Not step-free' },
 ],
 'b34-f2': [
 { to: 'b34-f1', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b34-lift', desc: 'Take the lift down to Floor 1', landmark: 'Atrium lift' },
 { to: 'b34-f1', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take stairs down', landmark: 'Not step-free' },
 ],
 'b36-ground': [
 { to: 'uni-mall-entrance', weight: 100, stepFreeWeight: 120, stepFree: true, type: 'outdoor', desc: 'Walk to Uni-Mall via east path', landmark: 'Exit via east accessible entrance, turn left' },
 { to: 'b34-ground', weight: 120, stepFreeWeight: 130, stepFree: true, type: 'outdoor', desc: 'Walk to Block 34', landmark: 'Exit east, follow signs for Library Block' },
 { to: 'b36-f1', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b36-lift', desc: 'Take the lift up to Floor 1', landmark: 'Lift at east wing near accessible entrance' },
 { to: 'b36-f1', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take stairs up to Floor 1', landmark: 'West stairs — not step-free' },
 ],
 'b36-f1': [
 { to: 'b36-ground', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b36-lift', desc: 'Take the lift down to Ground Floor', landmark: 'East wing lift' },
 { to: 'b36-ground', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take stairs down', landmark: 'West stairs — not step-free' },
 { to: 'b36-f2', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b36-lift', desc: 'Take the lift up to Floor 2', landmark: 'Same east wing lift' },
 { to: 'b36-f2', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take stairs up to Floor 2', landmark: 'Not step-free' },
 ],
 'b36-f2': [
 { to: 'b36-f1', weight: 60, stepFreeWeight: 90, stepFree: true, type: 'lift', lift: 'b36-lift', desc: 'Take the lift down to Floor 1', landmark: 'East wing lift' },
 { to: 'b36-f1', weight: 30, stepFreeWeight: null, stepFree: false, type: 'stairs', desc: 'Take stairs down', landmark: 'Not step-free' },
 ],
};

// 
// ACTIVE REPORTS (persisted in sessionStorage)
// 
let activeReports = JSON.parse(sessionStorage.getItem('campusReports') || '[]');

// Sync lift status with any persisted reports
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

 // If it's a lift issue, mark the lift as broken
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

 // If it was a lift report, restore operational status
 if (report && report.type === 'lift-broken' && report.building) {
 const liftKey = `${report.building}-lift`;
 if (LIFTS[liftKey] && LIFTS[liftKey].reportId === id) {
 LIFTS[liftKey].operational = true;
 delete LIFTS[liftKey].reportId;
 }
 }
 return report;
}

// 
// BUILDING META
// 
const BUILDINGS = {
 b32: {
 id: 'b32', label: 'Block 32', subtitle: 'Academic Block',
 lat: 31.2545, lng: 75.7030, // Real LPU campus coords
 lift: 'b32-lift', floors: 4,
 color: '#1a237e',
 },
 b34: {
 id: 'b34', label: 'Block 34', subtitle: 'Library Block',
 lat: 31.2552, lng: 75.7048, // Real LPU campus coords
 lift: 'b34-lift', floors: 3,
 color: '#1b5e20',
 },
 b36: {
 id: 'b36', label: 'Block 36', subtitle: 'Student Centre',
 lat: 31.2538, lng: 75.7055, // Real LPU campus coords
 lift: 'b36-lift', floors: 3,
 color: '#880e4f',
 },
};

// Export for other modules
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
