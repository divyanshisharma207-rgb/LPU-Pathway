/**
 * map.js – LPU Campus Map using Leaflet.js
 * Real LPU campus coordinates: 31.2536°N, 75.7037°E
 */

'use strict';

const CampusMap = (() => {

 // REAL LPU COORDINATES 
 // Campus center (Wikipedia/GPS verified)
 const LPU_CENTER = [31.2536, 75.7037];
 const LPU_ZOOM = 17; // tight campus zoom

 let map = null;
 let routeLayer = null;
 let markersLayer = null;
 let currentRoutePolylines = [];
 let buildingMarkers = {};

 // REAL BUILDING POSITIONS (approximate within campus) 
 // These are manually offset from the campus center to reflect
 // known layout: Block 32 (academic), 34 (library), 36 (student)
 const BUILDING_COORDS = {
 b32: { lat: 31.2545, lng: 75.7030, label: 'Block 32', subtitle: 'Academic Block', color: '#1a237e' },
 b34: { lat: 31.2552, lng: 75.7048, label: 'Block 34', subtitle: 'Library Block', color: '#1b5e20' },
 b36: { lat: 31.2538, lng: 75.7055, label: 'Block 36', subtitle: 'Student Centre', color: '#880e4f' },
 };

 // Key landmarks
 const LANDMARKS = [
 { lat: 31.2536, lng: 75.7037, label: 'Main Gate', icon: '', desc: 'Main campus entrance with security booth. Ramped entry available.' },
 { lat: 31.2546, lng: 75.7050, label: 'Uni-Mall', icon: '', desc: 'Shopping & food complex. Level entry, step-free.' },
 { lat: 31.2530, lng: 75.7042, label: 'Food Court', icon: '', desc: 'Campus dining area.' },
 { lat: 31.2555, lng: 75.7040, label: 'Open Amphitheatre', icon: '', desc: 'Open air auditorium.' },
 { lat: 31.2541, lng: 75.7025, label: 'Medical Centre', icon: '', desc: 'Campus hospital & first aid.' },
 ];

 // Accessible path waypoints (outdoor step-free routes between buildings)
 const ACCESSIBLE_PATHS = [
 // Main gate → Block 32
 {
 coords: [[31.2536, 75.7037], [31.2538, 75.7030], [31.2545, 75.7030]],
 label: 'Main Gate → Block 32 (Step-Free)',
 color: '#2e7d32',
 },
 // Block 32 → Block 34
 {
 coords: [[31.2545, 75.7030], [31.2548, 75.7040], [31.2552, 75.7048]],
 label: 'Block 32 → Block 34 (Step-Free)',
 color: '#2e7d32',
 },
 // Block 34 → Block 36
 {
 coords: [[31.2552, 75.7048], [31.2546, 75.7050], [31.2538, 75.7055]],
 label: 'Block 34 → Block 36 (Step-Free)',
 color: '#2e7d32',
 },
 // Uni-Mall → Block 34
 {
 coords: [[31.2546, 75.7050], [31.2552, 75.7048]],
 label: 'Uni-Mall → Block 34 (Step-Free)',
 color: '#2e7d32',
 },
 // Main Gate → Food Court
 {
 coords: [[31.2536, 75.7037], [31.2533, 75.7039], [31.2530, 75.7042]],
 label: 'Main Gate → Food Court',
 color: '#2e7d32',
 },
 ];

 // CUSTOM MARKER ICONS 
 function makeBuildingIcon(color, label) {
 const svg = `
 <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52">
 <defs>
 <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
 <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
 </filter>
 </defs>
 <path d="M22 2C13.16 2 6 9.16 6 18c0 12.5 16 32 16 32s16-19.5 16-32C38 9.16 30.84 2 22 2z"
 fill="${color}" filter="url(#shadow)" stroke="white" stroke-width="1.5"/>
 <circle cx="22" cy="18" r="10" fill="white" opacity="0.95"/>
 <text x="22" y="22" text-anchor="middle" font-size="10" font-weight="800"
 font-family="Segoe UI, sans-serif" fill="${color}">${label}</text>
 </svg>`;
 return L.divIcon({
 html: svg,
 className: '',
 iconSize: [44, 52],
 iconAnchor: [22, 52],
 popupAnchor: [0, -52],
 });
 }

 function makeLandmarkIcon(emoji) {
 return L.divIcon({
 html: `<div style="font-size:1.6rem;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4));">${emoji}</div>`,
 className: '',
 iconSize: [30, 30],
 iconAnchor: [15, 15],
 popupAnchor: [0, -20],
 });
 }

 function makeLiftIcon(operational) {
 const color = operational ? '#1b5e20' : '#b71c1c';
 const icon = operational ? '' : '';
 return L.divIcon({
 html: `<div style="background:${color};color:white;border-radius:6px;padding:3px 6px;font-size:0.75rem;font-weight:700;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.3)">${icon} Lift</div>`,
 className: '',
 iconSize: [60, 26],
 iconAnchor: [30, 13],
 popupAnchor: [0, -20],
 });
 }

 // INIT MAP 
 function init() {
 if (map) return; // already initialised

 map = L.map('campus-map', {
 center: LPU_CENTER,
 zoom: LPU_ZOOM,
 zoomControl: true,
 attributionControl: true,
 keyboard: true, // keyboard nav (accessibility)
 scrollWheelZoom: true,
 });

 // TILE LAYERS 
 // Default: OpenStreetMap (free, accurate for LPU campus)
 const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
 maxZoom: 21,
 });

 // Satellite layer (Esri)
 const satelliteLayer = L.tileLayer(
 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
 attribution: '© Esri — Satellite imagery',
 maxZoom: 21,
 });

 // Default visible
 osmLayer.addTo(map);

 // Layer control (map / satellite toggle)
 L.control.layers(
 { ' Map': osmLayer, ' Satellite': satelliteLayer },
 {},
 { position: 'topright', collapsed: false }
 ).addTo(map);

 // LAYERS 
 routeLayer = L.layerGroup().addTo(map);
 markersLayer = L.layerGroup().addTo(map);

 // Draw campus boundary
 drawCampusBoundary();

 // Add building markers
 addBuildingMarkers();

 // Add landmark markers
 addLandmarkMarkers();

 // Draw accessible paths
 drawAccessiblePaths();

 // Add lift markers
 addLiftMarkers();

 // Add scale
 L.control.scale({ imperial: false }).addTo(map);

 // Keyboard focus handler for accessibility
 document.getElementById('campus-map').addEventListener('keydown', (e) => {
 if (e.key === 'Enter' || e.key === ' ') {
 map.flyTo(LPU_CENTER, LPU_ZOOM, { animate: true, duration: 1 });
 announce('Map centred on LPU campus');
 }
 });

 console.log('[CampusMap] LPU map initialised at', LPU_CENTER);
 }

 // CAMPUS BOUNDARY 
 function drawCampusBoundary() {
 // Approximate LPU campus polygon (GT Road campus)
 const boundary = [
 [31.2525, 75.7020],
 [31.2560, 75.7020],
 [31.2565, 75.7070],
 [31.2525, 75.7070],
 ];
 L.polygon(boundary, {
 color: '#1a237e',
 weight: 2.5,
 fill: true,
 fillColor: '#1a237e',
 fillOpacity: 0.04,
 dashArray: '8 4',
 })
 .addTo(markersLayer)
 .bindTooltip(' LPU Campus Boundary', {
 permanent: false,
 direction: 'top',
 className: 'route-tooltip',
 });
 }

 // BUILDING MARKERS 
 function addBuildingMarkers() {
 Object.entries(BUILDING_COORDS).forEach(([id, b]) => {
 const { LIFTS } = window.CampusData;
 const liftId = `${id}-lift`;
 const lift = LIFTS[liftId];
 const liftStatus = lift
 ? (lift.operational ? ' Operational' : ' Out of service')
 : '—';

 const popupHTML = `
 <div>
 <div class="popup-title">${b.label}</div>
 <div class="popup-desc">${b.subtitle}</div>
 <div class="popup-badges">
 <span class="popup-badge"> Step-Free</span>
 <span class="popup-badge ${lift && !lift.operational ? 'broken' : ''}">
 Lift: ${liftStatus}
 </span>
 <span class="popup-badge"> Accessible WC</span>
 </div>
 <button onclick="quickNavigateTo('${id}-ground')"
 style="margin-top:8px;padding:4px 12px;background:${b.color};color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.8rem;font-weight:600;">
 Navigate here
 </button>
 </div>`;

 const marker = L.marker([b.lat, b.lng], {
 icon: makeBuildingIcon(b.color, id === 'b32' ? '32' : id === 'b34' ? '34' : '36'),
 alt: `${b.label} – ${b.subtitle}. Lift: ${liftStatus}. Click for accessibility info.`,
 title: `${b.label} – ${b.subtitle}`,
 keyboard: true,
 })
 .addTo(markersLayer)
 .bindPopup(popupHTML, { maxWidth: 240 });

 buildingMarkers[id] = marker;

 // Label underneath
 L.marker([b.lat, b.lng], {
 icon: L.divIcon({
 html: `<div style="background:${b.color};color:white;padding:2px 7px;border-radius:4px;font-size:0.7rem;font-weight:700;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.3);margin-top:52px;">${b.label}</div>`,
 className: '',
 iconSize: [80, 20],
 iconAnchor: [40, 0],
 }),
 interactive: false,
 keyboard: false,
 alt: '',
 }).addTo(markersLayer);
 });
 }

 // LANDMARK MARKERS 
 function addLandmarkMarkers() {
 LANDMARKS.forEach(lm => {
 L.marker([lm.lat, lm.lng], {
 icon: makeLandmarkIcon(lm.icon),
 alt: `${lm.label}: ${lm.desc}`,
 title: lm.label,
 keyboard: true,
 })
 .addTo(markersLayer)
 .bindPopup(`<div class="popup-title">${lm.icon} ${lm.label}</div><div class="popup-desc">${lm.desc}</div>`, { maxWidth: 220 });
 });
 }

 // ACCESSIBLE PATHS 
 function drawAccessiblePaths() {
 ACCESSIBLE_PATHS.forEach(path => {
 L.polyline(path.coords, {
 color: path.color,
 weight: 5,
 opacity: 0.65,
 dashArray: null,
 lineJoin: 'round',
 lineCap: 'round',
 })
 .addTo(markersLayer)
 .bindTooltip(` ${path.label}`, {
 sticky: true,
 className: 'route-tooltip stepfree',
 });
 });
 }

 // LIFT MARKERS 
 function addLiftMarkers() {
 const { LIFTS } = window.CampusData;

 // Lift positions (slightly offset from building centre)
 const LIFT_POSITIONS = {
 'b32-lift': [31.2545, 75.7031],
 'b34-lift': [31.2553, 75.7049],
 'b36-lift': [31.2539, 75.7056],
 };

 Object.entries(LIFTS).forEach(([id, lift]) => {
 const pos = LIFT_POSITIONS[id];
 if (!pos) return;

 L.marker(pos, {
 icon: makeLiftIcon(lift.operational),
 alt: `${lift.label}: ${lift.operational ? 'operational' : 'out of service'}`,
 title: lift.label,
 keyboard: true,
 })
 .addTo(markersLayer)
 .bindPopup(`
 <div class="popup-title"> ${lift.label}</div>
 <div class="popup-desc">
 Status: <strong style="color:${lift.operational ? '#1b5e20' : '#b71c1c'}">${lift.operational ? ' Operational' : ' Out of Service'}</strong><br>
 Floors: ${lift.floors.map(f => `G+${f}`).join(', ')}<br>
 Location: ${lift.location}
 </div>`, { maxWidth: 220 });
 });
 }

 // DRAW ROUTE ON MAP 
 function drawRoute(path, stepFree) {
 clearRoute();

 const { NODES } = window.CampusData;
 const { BUILDING_COORDS: BC } = { BUILDING_COORDS };

 // Build coordinate list
 const coords = path.map(nodeId => {
 const node = NODES[nodeId];
 if (!node) return null;
 return [node.lat, node.lng];
 }).filter(Boolean);

 if (coords.length < 2) return;

 const color = stepFree ? '#2e7d32' : '#1565c0';
 const label = stepFree ? ' Step-Free Route' : ' Fastest Route';
 const weight = 7;

 // Main route line
 const routeLine = L.polyline(coords, {
 color,
 weight,
 opacity: 0.9,
 lineJoin: 'round',
 lineCap: 'round',
 })
 .addTo(routeLayer)
 .bindTooltip(label, { sticky: true, className: `route-tooltip ${stepFree ? 'stepfree' : ''}` });

 currentRoutePolylines.push(routeLine);

 // Animated moving dot (simulated navigation)
 const dashed = L.polyline(coords, {
 color: 'white',
 weight: 2.5,
 opacity: 0.6,
 dashArray: '10 8',
 }).addTo(routeLayer);
 currentRoutePolylines.push(dashed);

 // Start marker
 const startCoord = coords[0];
 const startMarker = L.circleMarker(startCoord, {
 radius: 10,
 fillColor: '#fff',
 color,
 weight: 3,
 fillOpacity: 1,
 })
 .addTo(routeLayer)
 .bindTooltip(' Start', { permanent: false });
 currentRoutePolylines.push(startMarker);

 // End marker
 const endCoord = coords[coords.length - 1];
 const endMarker = L.circleMarker(endCoord, {
 radius: 12,
 fillColor: color,
 color: '#fff',
 weight: 3,
 fillOpacity: 1,
 })
 .addTo(routeLayer)
 .bindTooltip(' Destination', { permanent: false });
 currentRoutePolylines.push(endMarker);

 // Pan/zoom map to fit the route
 const bounds = L.latLngBounds(coords);
 map.fitBounds(bounds, { padding: [60, 60], maxZoom: 18, animate: true });

 announce(`Route drawn on map. ${stepFree ? 'Step-free' : 'Fastest'} path shown.`);
 }

 function clearRoute() {
 routeLayer.clearLayers();
 currentRoutePolylines = [];
 }

 // UPDATE LIFT MARKER 
 function refreshLiftMarkers() {
 // Re-draw all markers to reflect updated lift status
 markersLayer.clearLayers();
 drawCampusBoundary();
 addBuildingMarkers();
 addLandmarkMarkers();
 drawAccessiblePaths();
 addLiftMarkers();
 }

 // FLY TO BUILDING 
 function flyToBuilding(buildingId) {
 const b = BUILDING_COORDS[buildingId];
 if (!b || !map) return;
 map.flyTo([b.lat, b.lng], 19, { animate: true, duration: 1.2 });
 setTimeout(() => {
 if (buildingMarkers[buildingId]) {
 buildingMarkers[buildingId].openPopup();
 }
 }, 1300);
 }

 // RESET VIEW 
 function resetView() {
 if (!map) return;
 map.flyTo(LPU_CENTER, LPU_ZOOM, { animate: true, duration: 1 });
 }

 // ANNOUNCE (screen reader) 
 function announce(msg) {
 const el = document.getElementById('polite-announcer');
 if (el) { el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 50); }
 }

 return { init, drawRoute, clearRoute, refreshLiftMarkers, flyToBuilding, resetView, BUILDING_COORDS };

})();

window.CampusMap = CampusMap;
