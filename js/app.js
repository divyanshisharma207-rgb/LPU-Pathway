/**
 * app.js – Main application orchestrator
 * Ties together: map, routing, directions, reporting
 * Tab/Page SPA mode — no scrolling between sections
 */

'use strict';

(function () {

 // INIT ALL MODULES 
 document.addEventListener('DOMContentLoaded', () => {
 // 1. Init tab/page navigation (FIRST — hides inactive pages)
 initTabNav();

 // 2. Init map (Leaflet, real LPU coords) — slight delay ensures div is rendered
 setTimeout(() => {
   CampusMap.init();
   // Force Leaflet to recalculate map size after render
   setTimeout(() => {
     if (window._lpuMap) window._lpuMap.invalidateSize();
   }, 400);
 }, 100);

 // 3. Init report system
 ReportSystem.init();

 // 4. Set up route form
 initRouteForm();

 // 5. Set up map view toggle (outdoor / indoor)
 initMapToggle();

 // 6. Set up font size toggle
 initFontToggle();

 // 7. Set up audio controls
 initAudioControls();

 // 8. Handle URL params (deep-linked routes)
 handleURLParams();

 // 9. Update lift status display
 ReportSystem.updateLiftStatusUI();

 // 10. Init Autos & E-Carts transit feature
 if (window.CampusAutos) CampusAutos.init();
  // 11. Init Live GPS & Tracking feature
  if (window.CampusGPS) CampusGPS.init();

 console.log('[LPU Pathway] Accessible navigation ready ');
 });

 // CURRENT ROUTE STATE 
 let currentRoute = null;
 let currentFrom = null;
 let currentTo = null;
 let currentMode = 'fastest';

 // 
 // TAB / PAGE NAVIGATION
 // 
 function initTabNav() {
 // All clickable tab triggers (top nav + mobile bottom nav + footer links)
 const allTabLinks = document.querySelectorAll('[data-tab]');
 // All page sections
 const allPages = document.querySelectorAll('.page-section');

 function switchTab(tabId, triggerEl) {
    if (tabId === 'gps') {
      switchTab('navigate');
      setTimeout(() => {
        if (window.CampusGPS) window.CampusGPS.startTracking(true);
        const panel = document.getElementById('gps-panel') || document.getElementById('gps-hud');
        if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
      return;
    }

 // 1. Hide all pages
 allPages.forEach(page => {
 page.classList.remove('active-page');
 });

 // 2. Show target page(s) — 'navigate' spans two sections
 allPages.forEach(page => {
 if (page.dataset.page === tabId) {
 page.classList.add('active-page');
 }
 });

 // 3. Update all nav links active state
 allTabLinks.forEach(link => {
 const isActive = link.dataset.tab === tabId;
 link.classList.toggle('active', isActive);
 if (isActive) link.setAttribute('aria-current', 'page');
 else link.removeAttribute('aria-current');
 });

 // 4. Scroll to top of main
 document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
 window.scrollTo({ top: 0, behavior: 'smooth' });

 // 5. Update browser hash (for bookmarking)
 const hashMap = {
 navigate: '#navigate',
 buildings: '#buildings',
 autos: '#autos',
 report: '#report',
 help: '#help',
 };
 history.replaceState(null, '', hashMap[tabId] || '#');

 // 6. Screen reader announcement
 const pageNames = {
 navigate: 'Navigate — Route Planner',
 buildings: 'Buildings — Accessibility Info',
 autos: 'Nearest Autos & E-Carts',
 report: 'Report Issue',
 help: 'Help & Guide',
 };
 announce(`Page: ${pageNames[tabId] || tabId}`, false);

 // 7. If switching to navigate, invalidate map size (Leaflet needs this)
 if (tabId === 'navigate') {
 setTimeout(() => {
 if (window.CampusMap && window.CampusMap._map) {
 window.CampusMap._map.invalidateSize();
 }
 // Trigger map resize via Leaflet internal
 const mapEl = document.getElementById('campus-map');
 if (mapEl) mapEl.dispatchEvent(new Event('resize'));
 }, 100);
 }
 }

 // Bind all tab links
 allTabLinks.forEach(link => {
 link.addEventListener('click', (e) => {
 e.preventDefault();
 switchTab(link.dataset.tab, link);
 });
 });

 // Expose switchTab globally so other components can navigate to tabs
 window.switchAppTab = switchTab;

 // Handle hash on page load
 const hash = window.location.hash;
 const hashToTab = {
 '#navigate': 'navigate',
 '#buildings': 'buildings',
 '#autos': 'autos',
 '#report': 'report',
 '#help': 'help',
 // Legacy anchor support
 '#route-panel': 'navigate',
 '#map-section': 'navigate',
 '#buildings-section': 'buildings',
 '#report-section': 'report',
 '#help-section': 'help',
 };
 if (hash && hashToTab[hash]) {
 switchTab(hashToTab[hash]);
 }

 // Expose switchTab globally for building card buttons
 window.switchToTab = switchTab;
 }

 // ROUTE FORM 
 function initRouteForm() {
 const form = document.getElementById('route-form');
 const fromSelect = document.getElementById('from-select');
 const toSelect = document.getElementById('to-select');
 const btn = document.getElementById('find-route-btn');

 form.addEventListener('submit', (e) => {
 e.preventDefault();
 calculateAndDisplayRoute();
 });

 // Prevent same start + destination
 fromSelect.addEventListener('change', () => syncSelects(fromSelect, toSelect));
 toSelect.addEventListener('change', () => syncSelects(toSelect, fromSelect));
 }

 function syncSelects(changedEl, otherEl) {
 // Disable the selected option in the other dropdown
 Array.from(otherEl.options).forEach(opt => {
 opt.disabled = (opt.value !== '' && opt.value === changedEl.value);
 });
 }

  function calculateAndDisplayRoute() {
    const fromId = document.getElementById('from-select').value;
    const toId = document.getElementById('to-select').value;
    const stepFree = document.getElementById('stepfree-route').checked;
    const btn = document.getElementById('find-route-btn');

    if (!fromId || !toId) {
      announce('Please select both a start location and a destination.', true);
      if (!fromId) document.getElementById('from-select').focus();
      else document.getElementById('to-select').focus();
      return;
    }

    if (fromId === toId) {
      announce('Start and destination are the same location. Please choose different locations.', true);
      return;
    }

    // Show loading state
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Finding route…';
    btn.disabled = true;

    // Small delay for UX (simulates async)
    setTimeout(() => {
      let resolvedFromId = fromId;
      let liveGpsCoords = null;

      if (fromId === 'live-gps') {
        if (window.CampusGPS) {
          liveGpsCoords = CampusGPS.getCurrentCoords();
          resolvedFromId = CampusGPS.getNearestNodeId();
        } else {
          resolvedFromId = 'b32-ground';
        }
      }

      // Check if step-free is feasible
      if (stepFree && !RouteEngine.canFindStepFree(resolvedFromId, toId)) {
        // Fall back with warning
        announce('⚠️ No step-free route available right now (lift may be out of service). Showing fastest route instead.', true);
        performRouting(fromId, resolvedFromId, toId, false, liveGpsCoords);
      } else {
        performRouting(fromId, resolvedFromId, toId, stepFree, liveGpsCoords);
      }

      btn.innerHTML = '<span aria-hidden="true">🔍</span> Find Route';
      btn.disabled = false;
    }, 300);
  }

  function performRouting(fromId, resolvedFromId, toId, stepFree, liveGpsCoords = null) {
    const { NODES } = window.CampusData;

    const route = RouteEngine.findRoute(resolvedFromId, toId, stepFree);

    if (!route) {
      DirectionsPanel.showPlaceholder('No route found between these locations. Please try different locations.');
      CampusMap.clearRoute();
      return;
    }

    currentRoute = route;
    currentFrom = fromId;
    currentTo = toId;
    currentMode = stepFree ? 'stepfree' : 'fastest';

    const directions = RouteEngine.buildDirections(route, stepFree);
    const fromNode = NODES[fromId] || (fromId === 'live-gps' ? { label: 'My Live GPS Location' } : null);
    const toNode = NODES[toId];

    DirectionsPanel.render(directions, {
      totalTime: route.totalTime,
      stepFree,
      fromLabel: fromNode ? fromNode.label : fromId,
      toLabel: toNode ? toNode.label : toId,
    });

    // Draw on map with live GPS coords if active
    CampusMap.drawRoute(route.path, stepFree, liveGpsCoords);

    // Update URL (shareable)
    updateURL(fromId, toId, stepFree);
  }

 // QUICK NAVIGATE (from building cards) 
 window.quickNavigateTo = function (destinationId) {
 const toSelect = document.getElementById('to-select');
 toSelect.value = destinationId;

 // Switch to Navigate tab
 if (window.switchToTab) window.switchToTab('navigate');

 // Focus destination field after short delay
 setTimeout(() => document.getElementById('to-select').focus(), 150);

 announce(`Destination set to ${window.CampusData.NODES[destinationId]?.label}. Now select a starting point and tap Find Route.`, false);

 // Fly map to building
 const node = window.CampusData.NODES[destinationId];
 if (node && node.building) {
 CampusMap.flyToBuilding(node.building);
 }
 };

 // MAP VIEW TOGGLE (outdoor / indoor) 
 function initMapToggle() {
 const btnOutdoor = document.getElementById('btn-outdoor');
 const btnIndoor = document.getElementById('btn-indoor');
 const floorSelector = document.getElementById('floor-selector');
 const buildingSelector = document.getElementById('building-selector');
 const mapEl = document.getElementById('campus-map');
 const indoorView = document.getElementById('indoor-view');

 btnOutdoor.addEventListener('click', () => {
 btnOutdoor.setAttribute('aria-pressed', 'true');
 btnIndoor.setAttribute('aria-pressed', 'false');
 mapEl.hidden = false;
 indoorView.hidden = true;
 floorSelector.hidden = true;
 buildingSelector.hidden = true;
 CampusMap.resetView();
 announce('Switched to outdoor map view', false);
 });

 btnIndoor.addEventListener('click', () => {
 btnIndoor.setAttribute('aria-pressed', 'true');
 btnOutdoor.setAttribute('aria-pressed', 'false');
 mapEl.hidden = true;
 indoorView.hidden = false;
 floorSelector.hidden = false;
 buildingSelector.hidden = false;
 renderIndoorFloorPlan();
 announce('Switched to indoor floor plan view', false);
 });

 // Floor / building selector
 document.getElementById('floor-select').addEventListener('change', renderIndoorFloorPlan);
 document.getElementById('building-select').addEventListener('change', renderIndoorFloorPlan);
 }

 // INDOOR FLOOR PLAN (Canvas) 
 function renderIndoorFloorPlan() {
 const canvas = document.getElementById('indoor-canvas');
 const floorSel = document.getElementById('floor-select');
 const bldSel = document.getElementById('building-select');

 if (!canvas) return;
 const ctx = canvas.getContext('2d');

 // Set canvas size
 const container = canvas.parentElement;
 canvas.width = container.clientWidth || 800;
 canvas.height = container.clientHeight || 500;
 const W = canvas.width, H = canvas.height;

 const building = bldSel.value;
 const floor = parseInt(floorSel.value, 10);

 // Background 
 ctx.fillStyle = '#f8f9ff';
 ctx.fillRect(0, 0, W, H);

 // Grid lines 
 ctx.strokeStyle = '#e8eaf6';
 ctx.lineWidth = 1;
 for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
 for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

 // Building data for each block 
 const plans = {
 b32: getB32Plan(W, H, floor),
 b34: getB34Plan(W, H, floor),
 b36: getB36Plan(W, H, floor),
 };

 const plan = plans[building] || plans.b32;
 drawFloorPlan(ctx, plan, W, H, building, floor);

 // Floor title
 ctx.fillStyle = '#1a237e';
 ctx.font = 'bold 16px Segoe UI, sans-serif';
 ctx.fillText(`${{ b32: 'Block 32 – Academic', b34: 'Block 34 – Library', b36: 'Block 36 – Student Centre' }[building]} · Floor ${floor}`, 20, 30);
 }

 function drawFloorPlan(ctx, plan, W, H, building, floor) {
 // Draw rooms
 plan.rooms.forEach(r => {
 ctx.fillStyle = r.color || '#e8eaf6';
 ctx.strokeStyle = '#9fa8da';
 ctx.lineWidth = 1.5;
 ctx.beginPath();
 ctx.roundRect(r.x, r.y, r.w, r.h, 4);
 ctx.fill();
 ctx.stroke();

 // Label
 ctx.fillStyle = r.labelColor || '#1a237e';
 ctx.font = `${r.bold ? 'bold ' : ''}12px Segoe UI, sans-serif`;
 ctx.textAlign = 'center';
 ctx.textBaseline = 'middle';
 ctx.fillText(r.label, r.x + r.w / 2, r.y + r.h / 2);
 if (r.sublabel) {
 ctx.font = '10px Segoe UI, sans-serif';
 ctx.fillStyle = '#5c6bc0';
 ctx.fillText(r.sublabel, r.x + r.w / 2, r.y + r.h / 2 + 14);
 }
 });

 // Draw accessibility icons
 plan.icons.forEach(ic => {
 ctx.font = `${ic.size || 20}px serif`;
 ctx.textAlign = 'center';
 ctx.textBaseline = 'middle';
 ctx.fillText(ic.icon, ic.x, ic.y);
 });

 // Draw step-free route if available
 if (plan.stepFreePath && plan.stepFreePath.length > 1) {
 ctx.strokeStyle = '#2e7d32';
 ctx.lineWidth = 4;
 ctx.setLineDash([10, 5]);
 ctx.lineJoin = 'round';
 ctx.lineCap = 'round';
 ctx.beginPath();
 ctx.moveTo(plan.stepFreePath[0][0], plan.stepFreePath[0][1]);
 plan.stepFreePath.slice(1).forEach(pt => ctx.lineTo(pt[0], pt[1]));
 ctx.stroke();
 ctx.setLineDash([]);

 // Label
 ctx.fillStyle = '#2e7d32';
 ctx.font = 'bold 11px Segoe UI, sans-serif';
 ctx.textAlign = 'left';
 ctx.fillText(' Step-free path', plan.stepFreePath[0][0] + 8, plan.stepFreePath[0][1] - 10);
 }

 ctx.textAlign = 'left';
 ctx.textBaseline = 'alphabetic';
 }

 // FLOOR PLAN DATA 
 function getB32Plan(W, H, floor) {
 const floorLabels = ['Ground Floor Lobby', '1st Floor – Lecture Halls', '2nd Floor – Computer Labs', '3rd Floor – Research Labs'];
 const roomSets = [
 // Ground floor
 [
 { x: 50, y: 60, w: 200, h: 100, label: 'Reception / Admin', color: '#c5cae9', bold: true },
 { x: 50, y: 180, w: 90, h: 80, label: 'Accessible\nToilet', sublabel: '', color: '#e8f5e9' },
 { x: 160, y: 180, w: 90, h: 80, label: 'Ramp Entry', sublabel: '', color: '#fff9c4' },
 { x: 280, y: 60, w: 160, h: 200, label: 'Lobby Corridor', color: '#ede7f6' },
 { x: 460, y: 60, w: 140, h: 100, label: 'Security', color: '#fce4ec' },
 { x: 460, y: 180, w: 140, h: 80, label: 'Fire Exit\n(steps)', color: '#fff3e0' },
 ],
 // Floor 1
 [
 { x: 50, y: 60, w: 150, h: 100, label: 'Hall 101', color: '#e3f2fd', bold: true },
 { x: 220, y: 60, w: 150, h: 100, label: 'Hall 102', color: '#e3f2fd' },
 { x: 390, y: 60, w: 150, h: 100, label: 'Hall 103', color: '#e3f2fd' },
 { x: 50, y: 180, w: 150, h: 100, label: 'Seminar Room A', color: '#f3e5f5' },
 { x: 220, y: 180, w: 90, h: 100, label: 'Accessible\nToilet', sublabel: '', color: '#e8f5e9' },
 { x: 320, y: 180, w: 220, h: 100, label: 'Staff Room', color: '#fff9c4' },
 ],
 // Floor 2
 [
 { x: 50, y: 60, w: 200, h: 120, label: 'Computer Lab A', color: '#e0f7fa', bold: true },
 { x: 270, y: 60, w: 200, h: 120, label: 'Computer Lab B', color: '#e0f7fa' },
 { x: 490, y: 60, w: 100, h: 120, label: 'Server Room', color: '#fce4ec' },
 { x: 50, y: 200, w: 540, h: 60, label: 'Faculty Office Corridor', color: '#ede7f6' },
 { x: 50, y: 280, w: 100, h: 60, label: 'Accessible\nToilet', sublabel: '', color: '#e8f5e9' },
 ],
 // Floor 3
 [
 { x: 50, y: 60, w: 250, h: 120, label: 'Conference Room A', color: '#f3e5f5', bold: true },
 { x: 320, y: 60, w: 250, h: 120, label: 'Research Lab', color: '#e8eaf6' },
 { x: 50, y: 200, w: 160, h: 100, label: 'Meeting Room', color: '#fff9c4' },
 { x: 220, y: 200, w: 100, h: 100, label: 'Accessible\nToilet', sublabel: '', color: '#e8f5e9' },
 ],
 ];

 const liftX = W - 80, liftY = 120;

 return {
 rooms: roomSets[Math.min(floor, 3)].map(r => ({ ...r, labelColor: '#1a237e' })),
 icons: [
 { icon: '', x: liftX, y: liftY, size: 28 },
 { icon: '', x: 60, y: H - 50, size: 22 },
 ],
 stepFreePath: [[60, H - 60], [60, liftY], [liftX, liftY]],
 };
 }

 function getB34Plan(W, H, floor) {
 const roomSets = [
 // Ground – Library
 [
 { x: 50, y: 60, w: 300, h: 80, label: 'Library Entry / Issue Counter', color: '#c8e6c9', bold: true },
 { x: 50, y: 160, w: 120, h: 80, label: 'Accessible\nToilet', sublabel: '', color: '#e8f5e9' },
 { x: 190, y: 160, w: 160, h: 80, label: 'General Stacks', color: '#fffde7' },
 { x: 370, y: 60, w: 200, h: 180, label: 'Reading Area (Quiet)', color: '#f1f8e9' },
 ],
 // Floor 1
 [
 { x: 50, y: 60, w: 250, h: 120, label: 'Reference Section', color: '#dcedc8', bold: true },
 { x: 320, y: 60, w: 250, h: 120, label: 'Reading Room A', color: '#f1f8e9' },
 { x: 50, y: 200, w: 540, h: 60, label: 'Braille / Large Print Section', color: '#e8f5e9' },
 ],
 // Floor 2
 [
 { x: 50, y: 60, w: 300, h: 120, label: 'Digital Library', color: '#e0f2f1', bold: true },
 { x: 370, y: 60, w: 200, h: 120, label: 'Study Carrels', color: '#e8f5e9' },
 { x: 50, y: 200, w: 150, h: 80, label: 'Group Study Room', color: '#f3e5f5' },
 ],
 ];

 const liftX = W - 90, liftY = 100;

 return {
 rooms: (roomSets[Math.min(floor, 2)] || roomSets[0]).map(r => ({ ...r, labelColor: '#1b5e20' })),
 icons: [
 { icon: '', x: liftX, y: liftY, size: 28 },
 { icon: '', x: 70, y: H - 50, size: 20 }, // tactile path
 ],
 stepFreePath: [[70, H - 60], [70, liftY], [liftX, liftY]],
 };
 }

 function getB36Plan(W, H, floor) {
 const roomSets = [
 // Ground – Student Centre
 [
 { x: 50, y: 60, w: 160, h: 80, label: 'Reception', color: '#fce4ec', bold: true },
 { x: 230, y: 60, w: 200, h: 80, label: 'Cafeteria', color: '#fff9c4' },
 { x: 50, y: 160, w: 100, h: 80, label: 'Accessible\nToilet (F1)', sublabel: '', color: '#e8f5e9' },
 { x: 160, y: 160, w: 270, h: 80, label: 'Student Services Counter', color: '#f3e5f5' },
 { x: 450, y: 60, w: 120, h: 180, label: 'East Entry\n(Step-Free)', sublabel: '', color: '#e8f5e9' },
 ],
 // Floor 1
 [
 { x: 50, y: 60, w: 350, h: 150, label: 'Seminar Hall (accessible seating)', color: '#fce4ec', bold: true },
 { x: 420, y: 60, w: 150, h: 150, label: 'Club Room', color: '#ede7f6' },
 { x: 50, y: 230, w: 100, h: 70, label: 'Accessible\nToilet', sublabel: '', color: '#e8f5e9' },
 { x: 160, y: 230, w: 410, h: 70, label: 'Corridor', color: '#f5f5f5' },
 ],
 // Floor 2
 [
 { x: 50, y: 60, w: 250, h: 120, label: 'Admin Office', color: '#e1f5fe', bold: true },
 { x: 320, y: 60, w: 250, h: 120, label: 'Counselling Centre', color: '#fce4ec' },
 { x: 50, y: 200, w: 540, h: 60, label: 'Admin Corridor', color: '#f5f5f5' },
 ],
 ];

 const liftX = W - 100, liftY = 120;

 return {
 rooms: (roomSets[Math.min(floor, 2)] || roomSets[0]).map(r => ({ ...r, labelColor: '#880e4f' })),
 icons: [
 { icon: '', x: liftX, y: liftY, size: 28 },
 { icon: '', x: W - 110, y: 200, size: 22 }, // east accessible entry
 ],
 stepFreePath: [[W - 110, H - 60], [W - 110, liftY], [liftX, liftY]],
 };
 }

 // FONT SIZE TOGGLE 
 function initFontToggle() {
 const btn = document.getElementById('fontToggleBtn');
 if (!btn) return;

 // Restore saved preference
 const saved = localStorage.getItem('campusLargeText');
 if (saved === 'true') {
 document.body.classList.add('large-text');
 btn.setAttribute('aria-pressed', 'true');
 }

 btn.addEventListener('click', () => {
 const isLarge = document.body.classList.toggle('large-text');
 btn.setAttribute('aria-pressed', String(isLarge));
 localStorage.setItem('campusLargeText', isLarge);
 announce(`Text size ${isLarge ? 'increased' : 'restored to normal'}`, false);
 });
 }

 // NAV LINKS — replaced by initTabNav(), kept as stub 
 function initNavLinks() {
 // Tab navigation is handled by initTabNav()
 // This function is intentionally a no-op in SPA mode
 }

 // AUDIO CONTROLS 
 function initAudioControls() {
 document.getElementById('read-aloud-btn')?.addEventListener('click', () => {
 DirectionsPanel.readAloud();
 });
 document.getElementById('stop-speech-btn')?.addEventListener('click', () => {
 DirectionsPanel.stopSpeech();
 });
 document.getElementById('share-route-btn')?.addEventListener('click', () => {
 if (currentFrom && currentTo) {
 DirectionsPanel.shareRoute(currentFrom, currentTo, currentMode === 'stepfree');
 } else {
 announce('No route to share yet. Please find a route first.', false);
 }
 });
 }

 // URL PARAMS (deep linking) 
 function handleURLParams() {
 const params = new URLSearchParams(window.location.search);
 const from = params.get('from');
 const to = params.get('to');
 const mode = params.get('mode');

 if (from && to) {
 const fromSel = document.getElementById('from-select');
 const toSel = document.getElementById('to-select');
 if (fromSel) fromSel.value = from;
 if (toSel) toSel.value = to;
 if (mode === 'stepfree') document.getElementById('stepfree-route').checked = true;

 // Auto calculate after short delay (let map init)
 setTimeout(() => calculateAndDisplayRoute(), 800);
 }
 }

 function updateURL(fromId, toId, stepFree) {
 const url = new URL(window.location.href);
 url.searchParams.set('from', fromId);
 url.searchParams.set('to', toId);
 url.searchParams.set('mode', stepFree ? 'stepfree' : 'fastest');
 window.history.replaceState({}, '', url.toString());
 }

 // ANNOUNCE 
 function announce(msg, assertive = false) {
 const id = assertive ? 'live-announcer' : 'polite-announcer';
 const el = document.getElementById(id);
 if (el) { el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 50); }
 }


  // ── LOW VISION & ACCESSIBILITY CONTROLS (W3C WCAG 2.1 AA) ──
  function initLowVisionControls() {
    // 1. Text Size Controls (Normal 100%, Large 125%, Extra-Large 150%)
    const btnNormal = document.getElementById('btn-text-normal');
    const btnLarge = document.getElementById('btn-text-large');
    const btnXLarge = document.getElementById('btn-text-xlarge');

    function setTextSize(size) {
      document.documentElement.classList.remove('text-size-large', 'text-size-xlarge');
      if (size === 'large') document.documentElement.classList.add('text-size-large');
      if (size === 'xlarge') document.documentElement.classList.add('text-size-xlarge');

      [btnNormal, btnLarge, btnXLarge].forEach(b => {
        if (!b) return;
        const isActive = (b.id === `btn-text-${size}`);
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-checked', String(isActive));
      });

      localStorage.setItem('campusTextSize', size);
      announce(`Text size set to ${size === 'xlarge' ? 'Extra Large' : size === 'large' ? 'Large' : 'Normal'}.`);
      
      // Invalidate map size so layout adapts cleanly
      setTimeout(() => {
        if (window.CampusMap && window.CampusMap.getMap && window.CampusMap.getMap()) {
          window.CampusMap.getMap().invalidateSize();
        }
      }, 100);
    }

    btnNormal?.addEventListener('click', () => setTextSize('normal'));
    btnLarge?.addEventListener('click', () => setTextSize('large'));
    btnXLarge?.addEventListener('click', () => setTextSize('xlarge'));

    // Restore saved text size
    const savedTextSize = localStorage.getItem('campusTextSize') || 'normal';
    if (savedTextSize !== 'normal') setTextSize(savedTextSize);

    // 2. High Contrast Theme Toggle
    const btnContrast = document.getElementById('btn-high-contrast');
    function setHighContrast(enable) {
      const isHC = Boolean(enable);
      document.body.classList.toggle('theme-high-contrast', isHC);
      if (btnContrast) {
        btnContrast.classList.toggle('active', isHC);
        btnContrast.setAttribute('aria-pressed', String(isHC));
      }
      localStorage.setItem('campusHighContrast', String(isHC));
      announce(isHC ? 'High contrast theme enabled.' : 'Standard contrast theme restored.');

      // Redraw active route with high-contrast lines if present
      if (currentRoute) {
        const stepFree = document.getElementById('stepfree-route')?.checked ?? false;
        CampusMap.drawRoute(currentRoute.path, stepFree);
      }
    }

    btnContrast?.addEventListener('click', () => {
      const active = document.body.classList.contains('theme-high-contrast');
      setHighContrast(!active);
    });

    if (localStorage.getItem('campusHighContrast') === 'true') {
      setHighContrast(true);
    }

    // 3. Simplified Map Toggle
    const btnSimpA11y = document.getElementById('btn-simplified-map');
    const btnSimpToolbar = document.getElementById('btn-toggle-simplified');

    function toggleSimplified() {
      const isSimp = document.body.classList.contains('simplified-map');
      if (window.CampusMap && window.CampusMap.setSimplifiedMode) {
        window.CampusMap.setSimplifiedMode(!isSimp);
      }
    }

    btnSimpA11y?.addEventListener('click', toggleSimplified);
    btnSimpToolbar?.addEventListener('click', toggleSimplified);

    // 4. Distinct Routes Toggle
    const btnDistinct = document.getElementById('btn-distinct-routes');
    btnDistinct?.addEventListener('click', () => {
      const active = document.body.classList.toggle('high-vis-routes');
      btnDistinct.classList.toggle('active', active);
      btnDistinct.setAttribute('aria-pressed', String(active));
      if (currentRoute) {
        const stepFree = document.getElementById('stepfree-route')?.checked ?? false;
        CampusMap.drawRoute(currentRoute.path, stepFree);
      }
      announce(active ? 'Distinct high-visibility route lines active.' : 'Standard route lines active.');
    });

    // 5. Swap Locations Button (Start <-> Destination)
    const btnSwap = document.getElementById('btn-swap-locations');
    btnSwap?.addEventListener('click', () => {
      const fromSel = document.getElementById('from-select');
      const toSel = document.getElementById('to-select');
      if (!fromSel || !toSel) return;

      const temp = fromSel.value;
      fromSel.value = toSel.value;
      toSel.value = temp;

      announce(`Locations swapped. Starting point is now ${fromSel.options[fromSel.selectedIndex]?.text || 'empty'}, destination is ${toSel.options[toSel.selectedIndex]?.text || 'empty'}.`);

      // If both selected, auto re-calculate
      if (fromSel.value && toSel.value && fromSel.value !== toSel.value) {
        calculateAndDisplayRoute();
      }
    });

    // 6. Repeat Aloud Button
    const btnRepeat = document.getElementById('repeat-speech-btn');
    btnRepeat?.addEventListener('click', () => {
      DirectionsPanel.repeatAloud();
    });

    // 7. Text-Only Directions Toggle
    const btnTextOnly = document.getElementById('btn-toggle-text-only');
    btnTextOnly?.addEventListener('click', () => {
      DirectionsPanel.toggleTextOnlyMode();
    });
  }

})();
