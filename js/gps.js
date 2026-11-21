/**
 * gps.js – Live Location & GPS Tracking System
 * LPU Pathway – Accessible Campus Navigation
 */

'use strict';

const CampusGPS = (() => {

  // LPU CAMPUS COORDINATES BOUNDS (for geofencing)
  const LPU_CENTER = { lat: 31.2536, lng: 75.7037 };
  const CAMPUS_RADIUS_METERS = 1800; // ~1.8km radius covers campus

  // SIMULATED CAMPUS WALKING PATH WAYPOINTS (Main Gate -> Uni-Mall -> Block 34 -> Block 32)
  const SIMULATED_WALK_PATH = [
    { lat: 31.2536, lng: 75.7037, label: 'Main Gate Entrance', prompt: 'Starting at Main Gate Security Booth' },
    { lat: 31.2538, lng: 75.7039, label: 'Central Walkway', prompt: 'Continue straight along the step-free central avenue' },
    { lat: 31.2541, lng: 75.7042, label: 'Near Open Amphitheatre', prompt: 'Passing Open Amphitheatre on your right' },
    { lat: 31.2544, lng: 75.7046, label: 'Approaching Uni-Mall', prompt: 'Keep left towards Uni-Mall accessible ramp' },
    { lat: 31.2546, lng: 75.7050, label: 'Uni-Mall Fountain Plaza', prompt: 'Turn slightly left towards Block 34 Library' },
    { lat: 31.2549, lng: 75.7049, label: 'Library Pathway', prompt: 'Approaching Block 34 Shanti Devi Mittal Library' },
    { lat: 31.2552, lng: 75.7048, label: 'Block 34 – Library Entrance', prompt: 'Arrived at Block 34 ground floor level entrance' },
    { lat: 31.2550, lng: 75.7042, label: 'Connecting Corridor', prompt: 'Walking westward towards Academic Block 32' },
    { lat: 31.2547, lng: 75.7035, label: 'Block 32 South Pathway', prompt: 'Approaching Block 32 main entrance ramp' },
    { lat: 31.2545, lng: 75.7030, label: 'Block 32 – Academic Block', prompt: 'Arrived at Block 32 Academic Block Ramp Entry' }
  ];

  // STATE
  let isTracking = false;
  let isSimulating = false;
  let followUser = true;
  let watchId = null;
  let simInterval = null;
  let simIndex = 0;
  let currentCoords = null; // { lat, lng, accuracy, speed, heading, timestamp }
  let lastAnnouncedWaypoint = null;

  // LEAFLET LAYERS
  let gpsLayer = null;
  let beaconMarker = null;
  let accuracyCircle = null;
  let trackPolyline = null;
  let trackHistory = [];

  // HAVERSINE DISTANCE FORMULA (meters)
  function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // GET NEAREST CAMPUS NODE ID
  function getNearestNodeId(lat = null, lng = null) {
    const coords = (lat != null && lng != null) ? { lat, lng } : currentCoords;
    if (!coords) return 'b32-ground';

    const nodes = window.CampusData?.NODES || {};
    let nearestId = 'b32-ground';
    let minDistance = Infinity;

    Object.entries(nodes).forEach(([id, node]) => {
      // Prioritize ground-level and outdoor entry points for routing
      if (node.lat && node.lng && (node.floor === 0 || node.floor === null)) {
        const d = calcDistance(coords.lat, coords.lng, node.lat, node.lng);
        if (d < minDistance) {
          minDistance = d;
          nearestId = id;
        }
      }
    });

    return nearestId;
  }

  // GET NEAREST LANDMARK INFO
  function getNearestLandmarkInfo(lat, lng) {
    const nodes = window.CampusData?.NODES || {};
    let nearestLabel = 'LPU Campus';
    let minD = Infinity;

    Object.entries(nodes).forEach(([id, node]) => {
      if (node.lat && node.lng && (node.floor === 0 || node.floor === null)) {
        const d = calcDistance(lat, lng, node.lat, node.lng);
        if (d < minD) {
          minD = d;
          nearestLabel = node.label || id;
        }
      }
    });

    return { label: nearestLabel, distance: minD };
  }

  // START LIVE GPS TRACKING
  function startTracking(follow = true) {
    const map = window.CampusMap?.getMap ? window.CampusMap.getMap() : window._lpuMap;
    if (!map) {
      setTimeout(() => startTracking(follow), 200);
      return;
    }

    // Switch to navigate tab to show map
    if (window.switchAppTab) window.switchAppTab('navigate');

    followUser = follow;
    ensureGpsLayer(map);

    const toggleBtn = document.getElementById('btn-toggle-gps');
    if (toggleBtn) {
      toggleBtn.classList.add('gps-active');
      toggleBtn.setAttribute('aria-pressed', 'true');
    }
    const fabBtn = document.getElementById('btn-gps-fab');
    if (fabBtn) {
      fabBtn.classList.add('active');
      fabBtn.setAttribute('aria-pressed', 'true');
    }

    const hud = document.getElementById('gps-hud');
    if (hud) hud.hidden = false;
    const idlePanel = document.getElementById('gps-panel-idle');
    if (idlePanel) idlePanel.hidden = true;

    updateHudStatus('Connecting to GPS...', 'Locating satellites...');

    if (!('geolocation' in navigator)) {
      announce('Geolocation is not supported by your browser. Starting campus walking simulation instead.');
      startSimulatedWalk();
      return;
    }

    isTracking = true;

    // Use watchPosition for continuous tracking
    try {
      watchId = navigator.geolocation.watchPosition(
        onPositionSuccess,
        onPositionError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 2000
        }
      );
    } catch (e) {
      console.warn('[CampusGPS] watchPosition failed:', e);
      startSimulatedWalk();
    }
  }

  // POSITION SUCCESS HANDLER
  function onPositionSuccess(position) {
    const { latitude: lat, longitude: lng, accuracy, speed, heading } = position.coords;

    // Check if user is within campus proximity (e.g. within ~15km of LPU)
    const distFromCenter = calcDistance(lat, lng, LPU_CENTER.lat, LPU_CENTER.lng);

    if (distFromCenter > 15000) {
      // User is far from campus (e.g., testing from outside Phagwara)
      updateHudStatus(
        'Location Detected (Off Campus)',
        `You are ${(distFromCenter / 1000).toFixed(1)}km from LPU. Switch to Demo Walk for on-campus navigation.`
      );
    }

    currentCoords = {
      lat,
      lng,
      accuracy: Math.round(accuracy || 5),
      speed: speed ? (speed * 3.6).toFixed(1) : '0.0', // km/h
      heading: heading || 0,
      timestamp: position.timestamp || Date.now(),
      simulated: false
    };

    updateMapMarker(currentCoords);
    updateHudStats(currentCoords);

    // Dynamic Turn-by-Turn proximity check if active route is drawn
    checkRouteTurnProximity(currentCoords);
  }

  // POSITION ERROR HANDLER
  function onPositionError(err) {
    console.warn('[CampusGPS] GPS Error code:', err.code, err.message);

    let errorMsg = 'Could not acquire GPS signal.';
    if (err.code === 1) {
      errorMsg = 'Location permission was denied.';
    } else if (err.code === 2) {
      errorMsg = 'GPS position unavailable.';
    }

    updateHudStatus('Live GPS Unavailable', `${errorMsg} Starting Campus Walk Demo...`);
    announce(`${errorMsg} Starting campus walk demonstration mode.`);

    // Gracefully fallback to simulated on-campus walk so feature is always testable
    setTimeout(() => {
      startSimulatedWalk();
    }, 1200);
  }

  // STOP TRACKING
  function stopTracking() {
    isTracking = false;
    isSimulating = false;

    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }

    if (simInterval) {
      clearInterval(simInterval);
      simInterval = null;
    }

    const toggleBtn = document.getElementById('btn-toggle-gps');
    if (toggleBtn) {
      toggleBtn.classList.remove('gps-active');
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
    const fabBtn = document.getElementById('btn-gps-fab');
    if (fabBtn) {
      fabBtn.classList.remove('active');
      fabBtn.setAttribute('aria-pressed', 'false');
    }

    const hud = document.getElementById('gps-hud');
    if (hud) hud.hidden = true;
    const idlePanel = document.getElementById('gps-panel-idle');
    if (idlePanel) idlePanel.hidden = false;

    const turnBanner = document.getElementById('gps-turn-banner');
    if (turnBanner) turnBanner.hidden = true;

    if (gpsLayer) {
      gpsLayer.clearLayers();
    }
    beaconMarker = null;
    accuracyCircle = null;
    trackPolyline = null;
    trackHistory = [];

    announce('GPS tracking stopped.');
  }

  // SIMULATED CAMPUS WALKING MODE
  function startSimulatedWalk() {
    stopTracking(); // Clear any real watcher

    isTracking = true;
    isSimulating = true;
    simIndex = 0;
    trackHistory = [];

    const map = window.CampusMap?.getMap ? window.CampusMap.getMap() : window._lpuMap;
    ensureGpsLayer(map);

    const toggleBtn = document.getElementById('btn-toggle-gps');
    if (toggleBtn) {
      toggleBtn.classList.add('gps-active');
      toggleBtn.setAttribute('aria-pressed', 'true');
    }
    const fabBtn = document.getElementById('btn-gps-fab');
    if (fabBtn) {
      fabBtn.classList.add('active');
      fabBtn.setAttribute('aria-pressed', 'true');
    }

    const hud = document.getElementById('gps-hud');
    if (hud) hud.hidden = false;
    const idlePanel = document.getElementById('gps-panel-idle');
    if (idlePanel) idlePanel.hidden = true;

    updateHudStatus('🚶 Campus Walk Simulation', 'Simulating step-free walk across LPU campus...');

    // Run first step immediately
    advanceSimulationStep();

    // Move along waypoints every 2.5 seconds
    simInterval = setInterval(advanceSimulationStep, 2500);

    announce('Simulated campus walking navigation started.');
  }

  function advanceSimulationStep() {
    if (!isSimulating || simIndex >= SIMULATED_WALK_PATH.length) {
      if (simIndex >= SIMULATED_WALK_PATH.length) {
        simIndex = 0; // Loop or finish
      }
    }

    const pt = SIMULATED_WALK_PATH[simIndex];
    simIndex++;

    currentCoords = {
      lat: pt.lat,
      lng: pt.lng,
      accuracy: 4,
      speed: '4.2', // ~4 km/h walking speed
      heading: (simIndex * 36) % 360,
      timestamp: Date.now(),
      simulated: true,
      label: pt.label,
      prompt: pt.prompt
    };

    updateMapMarker(currentCoords);
    updateHudStats(currentCoords);

    // Show turn prompt
    showTurnBanner(pt.prompt, 'Next Waypoint');
    announce(pt.prompt);
  }

  // ENSURE GPS LAYER INITIALIZED
  function ensureGpsLayer(map) {
    if (!gpsLayer && map) {
      gpsLayer = L.layerGroup().addTo(map);
    }
  }

  // UPDATE MAP MARKER & ACCURACY CIRCLE
  function updateMapMarker(coords) {
    const map = window.CampusMap?.getMap ? window.CampusMap.getMap() : window._lpuMap;
    if (!map) return;
    ensureGpsLayer(map);

    const latLng = [coords.lat, coords.lng];

    // 1. Accuracy Circle
    if (!accuracyCircle) {
      accuracyCircle = L.circle(latLng, {
        radius: Math.max(coords.accuracy, 6),
        color: coords.simulated ? '#00897b' : '#1976d2',
        weight: 1.5,
        fillColor: coords.simulated ? '#26a69a' : '#2196f3',
        fillOpacity: 0.12,
        interactive: false
      }).addTo(gpsLayer);
    } else {
      accuracyCircle.setLatLng(latLng);
      accuracyCircle.setRadius(Math.max(coords.accuracy, 6));
    }

    // 2. Beacon Marker (Custom pulsing DivIcon)
    const iconHtml = `
      <div class="gps-beacon-container" title="Your Live Location">
        <span class="gps-radar-wave"></span>
        <span class="gps-radar-wave delay"></span>
        <span class="gps-inner-dot ${coords.simulated ? 'simulated' : ''}"></span>
        ${coords.heading ? `<span class="gps-heading-arrow" style="transform: rotate(${coords.heading}deg);"></span>` : ''}
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'gps-marker-container',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });

    const landmarkInfo = getNearestLandmarkInfo(coords.lat, coords.lng);

    const popupHtml = `
      <div style="font-family:'Segoe UI',sans-serif;padding:4px;max-width:240px;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
          <span style="font-size:1.4rem;">📍</span>
          <div>
            <strong style="color:#1976d2;font-size:0.95rem;display:block;">
              ${coords.simulated ? 'Simulated Live Walk' : 'Your Live Location'}
            </strong>
            <span style="font-size:0.75rem;color:#666;">
              ${coords.lat.toFixed(5)}°N, ${coords.lng.toFixed(5)}°E
            </span>
          </div>
        </div>
        <div style="background:#f0f7ff;border:1px solid #bbdefb;border-radius:4px;padding:6px;font-size:0.8rem;margin-bottom:8px;">
          <div><strong>Accuracy:</strong> ±${coords.accuracy}m</div>
          <div><strong>Speed:</strong> ${coords.speed} km/h</div>
          <div><strong>Nearest:</strong> ${landmarkInfo.label} (${landmarkInfo.distance}m away)</div>
        </div>
        <button onclick="CampusGPS.setAsStartingPoint()"
                style="width:100%;background:#1976d2;color:white;border:none;border-radius:4px;padding:5px 8px;font-size:0.8rem;font-weight:700;cursor:pointer;">
          📍 Use as Route Starting Point
        </button>
      </div>
    `;

    if (!beaconMarker) {
      beaconMarker = L.marker(latLng, {
        icon: customIcon,
        alt: 'Your current live GPS location',
        title: 'Your Location',
        zIndexOffset: 1000
      }).addTo(gpsLayer);

      beaconMarker.bindPopup(popupHtml, { maxWidth: 260 });
    } else {
      beaconMarker.setLatLng(latLng);
      beaconMarker.setIcon(customIcon);
      beaconMarker.setPopupContent(popupHtml);
    }

    // 3. Track History Polyline (breadcrumb trail)
    trackHistory.push(latLng);
    if (trackHistory.length > 50) trackHistory.shift();

    if (!trackPolyline) {
      trackPolyline = L.polyline(trackHistory, {
        color: coords.simulated ? '#00897b' : '#1976d2',
        weight: 3,
        opacity: 0.5,
        dashArray: '4 4'
      }).addTo(gpsLayer);
    } else {
      trackPolyline.setLatLngs(trackHistory);
    }

    // Auto-center map if following
    if (followUser) {
      map.panTo(latLng, { animate: true, duration: 0.8 });
    }
  }

  // UPDATE HUD BAR
  function updateHudStatus(title, meta) {
    const titleEl = document.getElementById('gps-status-title');
    const metaEl = document.getElementById('gps-status-meta');
    const beaconEl = document.querySelector('.gps-status-beacon');

    if (titleEl) titleEl.textContent = title;
    if (metaEl) metaEl.textContent = meta;
    if (beaconEl) {
      beaconEl.classList.toggle('simulated', isSimulating);
    }
  }

  function updateHudStats(coords) {
    const accEl = document.getElementById('gps-stat-accuracy');
    const speedEl = document.getElementById('gps-stat-speed');
    const spotEl = document.getElementById('gps-stat-spot');

    if (accEl) accEl.textContent = `±${coords.accuracy}m`;
    if (speedEl) speedEl.textContent = `${coords.speed} km/h`;

    if (spotEl) {
      const nearest = getNearestLandmarkInfo(coords.lat, coords.lng);
      spotEl.textContent = `${nearest.label.split('–')[0].trim()} (${nearest.distance}m)`;
    }
  }

  // SHOW TURN / PROMPT BANNER OVER MAP
  function showTurnBanner(promptText, distText = '') {
    const banner = document.getElementById('gps-turn-banner');
    const textEl = document.getElementById('gps-turn-text');
    const distEl = document.getElementById('gps-turn-dist');

    if (!banner || !textEl) return;
    textEl.textContent = promptText;
    if (distEl) distEl.textContent = distText;
    banner.hidden = false;
  }

  // CHECK PROXIMITY TO ROUTE WAYPOINTS (DYNAMIC TURN NOTIFICATIONS)
  function checkRouteTurnProximity(coords) {
    // If route navigation is active with step directions
    const dirList = document.getElementById('directions-list');
    if (!dirList || dirList.children.length === 0) return;

    const nearestNodeId = getNearestNodeId(coords.lat, coords.lng);
    const nodes = window.CampusData?.NODES || {};
    const node = nodes[nearestNodeId];

    if (node && nearestNodeId !== lastAnnouncedWaypoint) {
      const d = calcDistance(coords.lat, coords.lng, node.lat, node.lng);
      if (d <= 25) {
        lastAnnouncedWaypoint = nearestNodeId;
        const msg = `You are near ${node.label}. Follow step-free paths.`;
        showTurnBanner(msg, `${d}m`);
        announce(msg);
      }
    }
  }

  // RE-CENTER ON CURRENT GPS
  function recenterMap() {
    const map = window.CampusMap?.getMap ? window.CampusMap.getMap() : window._lpuMap;
    if (!map || !currentCoords) {
      startTracking(true);
      return;
    }

    followUser = true;
    map.flyTo([currentCoords.lat, currentCoords.lng], 18, { animate: true, duration: 1 });
    if (beaconMarker) {
      setTimeout(() => beaconMarker.openPopup(), 1100);
    }
    announce('Map re-centered on your GPS position.');
  }

  // SET CURRENT LIVE LOCATION AS ROUTE STARTING POINT
  function setAsStartingPoint() {
    if (!currentCoords) {
      startTracking(true);
    }

    const fromSelect = document.getElementById('from-select');
    if (fromSelect) {
      // Ensure 'live-gps' option exists
      if (!fromSelect.querySelector('option[value="live-gps"]')) {
        const opt = document.createElement('option');
        opt.value = 'live-gps';
        opt.textContent = '📍 My Live GPS Location';
        fromSelect.insertBefore(opt, fromSelect.children[1]);
      }
      fromSelect.value = 'live-gps';

      // Switch to route panel on mobile/desktop
      const routePanel = document.getElementById('route-panel');
      if (routePanel) {
        routePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      announce('Starting point set to your live GPS location.');
    }
  }

  // ANNOUNCE ACCESSIBILITY HELPER
  function announce(msg) {
    const el = document.getElementById('polite-announcer');
    if (el) {
      el.textContent = '';
      setTimeout(() => { el.textContent = msg; }, 50);
    }
  }

  // INITIALIZE
  function init() {
    // 1. Toggle GPS on Map Header / Floating FAB
    const toggleBtn = document.getElementById('btn-toggle-gps');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (isTracking) {
          stopTracking();
        } else {
          startTracking(true);
        }
      });
    }
    const fabBtn = document.getElementById('btn-gps-fab');
    if (fabBtn) {
      fabBtn.addEventListener('click', () => {
        if (isTracking) {
          stopTracking();
        } else {
          startTracking(true);
        }
      });
    }

    // 1b. Main Panel Buttons
    const startMainBtn = document.getElementById('btn-gps-start-main');
    if (startMainBtn) {
      startMainBtn.addEventListener('click', () => startTracking(true));
    }
    const simMainBtn = document.getElementById('btn-gps-sim-main');
    if (simMainBtn) {
      simMainBtn.addEventListener('click', startSimulatedWalk);
    }

    // 2. HUD Buttons
    const recenterBtn = document.getElementById('btn-gps-recenter');
    if (recenterBtn) {
      recenterBtn.addEventListener('click', recenterMap);
    }

    const simBtn = document.getElementById('btn-gps-sim-walk');
    if (simBtn) {
      simBtn.addEventListener('click', () => {
        if (isSimulating) {
          stopTracking();
        } else {
          startSimulatedWalk();
        }
      });
    }

    const routeFromBtn = document.getElementById('btn-gps-route-from');
    if (routeFromBtn) {
      routeFromBtn.addEventListener('click', setAsStartingPoint);
    }

    const stopBtn = document.getElementById('btn-gps-stop');
    if (stopBtn) {
      stopBtn.addEventListener('click', stopTracking);
    }

    // 3. Route Form "Use Live Location" shortcut button
    const useGpsBtn = document.getElementById('btn-use-gps-start');
    if (useGpsBtn) {
      useGpsBtn.addEventListener('click', () => {
        setAsStartingPoint();
        if (!isTracking) startTracking(true);
      });
    }

    // 4. Listen on route form changes
    const fromSelect = document.getElementById('from-select');
    if (fromSelect) {
      fromSelect.addEventListener('change', (e) => {
        if (e.target.value === 'live-gps') {
          if (!isTracking) startTracking(true);
        }
      });
    }

    console.log('[CampusGPS] Live location & tracking system initialized');
  }

  return {
    init,
    startTracking,
    stopTracking,
    startSimulatedWalk,
    recenterMap,
    setAsStartingPoint,
    getNearestNodeId,
    getCurrentCoords: () => currentCoords,
    isTracking: () => isTracking
  };

})();

window.CampusGPS = CampusGPS;
