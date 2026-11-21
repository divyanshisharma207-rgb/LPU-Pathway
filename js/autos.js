/**
 * autos.js – Nearest Autos & E-Carts Transit System
 * LPU Pathway – Accessible Campus Navigation
 */

'use strict';

const CampusAutos = (() => {

  // TRANSIT SVG VECTOR ICONS
  const GOLF_CART_SVG = `<svg class="golf-cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="1em" height="1em" aria-hidden="true"><path d="M7 5h17c1.1 0 2 .9 2 2v1.5H5V7c0-1.1.9-2 2-2z" fill="#2e7d32"/><line x1="8" y1="8" x2="8" y2="18" stroke="#2e7d32" stroke-width="2" stroke-linecap="round"/><line x1="23" y1="8" x2="20.5" y2="18" stroke="#2e7d32" stroke-width="2" stroke-linecap="round"/><polygon points="23,8 20.5,18 19.5,18 22,8" fill="#81d4fa" opacity="0.6"/><line x1="17.5" y1="18" x2="15.5" y2="13" stroke="#2e7d32" stroke-width="1.8" stroke-linecap="round"/><circle cx="15" cy="12" r="1.8" fill="none" stroke="#2e7d32" stroke-width="1.5"/><rect x="9" y="12.5" width="2.5" height="5.5" rx="1" fill="#2e7d32"/><rect x="9" y="16.5" width="6.5" height="2.5" rx="1" fill="#2e7d32"/><path d="M4 19h17.5l4 2.5v2H3v-2.5l1-2z" fill="#2e7d32"/><circle cx="8" cy="24.5" r="3.5" fill="#263238" stroke="#fff" stroke-width="1.2"/><circle cx="21" cy="24.5" r="3.5" fill="#263238" stroke="#fff" stroke-width="1.2"/><circle cx="8" cy="24.5" r="1.2" fill="#fff"/><circle cx="21" cy="24.5" r="1.2" fill="#fff"/></svg>`;
  const ACCESSIBLE_SVG = `<svg class="transit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.29-1.16-.28H7c-1.1 0-2 .9-2 2v5h2v-5h3.18l-1.39 6.94A5.002 5.002 0 0 0 13 21a5 5 0 0 0 5-5c0-.35-.04-.69-.11-1.02L19 13zm-6 6c-1.66 0-3-1.34-3-3 0-.58.17-1.13.46-1.59l1.49 1.49c.14.78.78 1.41 1.57 1.55l1.04 1.04c-.49.32-1.07.51-1.56.51z"/></svg>`;
  const AUTO_SVG = `<svg class="transit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`;

  // LPU CAMPUS AUTOS & E-CARTS FLEET
  const FLEET = [
    {
      id: 'auto-access-1',
      name: 'Disability Cell Mobility E-Cart #1',
      category: 'accessible',
      vehicle: '6-Seater Accessible Electric Golf Cart (Low-Floor Ramp)',
      driver: 'Gurpreet Singh',
      phone: '+91 98765 43210',
      rating: 4.95,
      rides: 890,
      lat: 31.2543,
      lng: 75.7032,
      baseLat: 31.2543,
      baseLng: 75.7032,
      heading: 'Block 32 & Medical Centre',
      fare: 'FREE',
      fareDesc: 'University Disability Support',
      wheelchairRamp: true,
      stepFree: true,
      capacity: '2 Wheelchairs + 4 Seats',
      icon: ACCESSIBLE_SVG,
      textIcon: 'Accessible'
    },
    {
      id: 'auto-ecart-1',
      name: 'LPU Campus Green Golf Cart #8',
      category: 'ecart',
      vehicle: 'Campus Electric Golf Cart / Buggy',
      driver: 'Rajesh Kumar',
      phone: '+91 98123 45678',
      rating: 4.8,
      rides: 1420,
      lat: 31.2548,
      lng: 75.7046,
      baseLat: 31.2548,
      baseLng: 75.7046,
      heading: 'Uni-Mall ↔ Block 34 (Library)',
      fare: '₹10',
      fareDesc: 'Fixed Campus Flat Fare',
      wheelchairRamp: false,
      stepFree: true,
      capacity: '6 Passengers',
      icon: GOLF_CART_SVG,
      textIcon: 'Golf Cart'
    },
    {
      id: 'auto-access-2',
      name: 'Student Welfare Wheelchair E-Cart #3',
      category: 'accessible',
      vehicle: 'ClubCar Wheelchair E-Cart (Rear Folding Ramp)',
      driver: 'Amanpreet Kaur',
      phone: '+91 98722 11223',
      rating: 5.0,
      rides: 680,
      lat: 31.2539,
      lng: 75.7053,
      baseLat: 31.2539,
      baseLng: 75.7053,
      heading: 'Student Centre (Block 36)',
      fare: 'FREE',
      fareDesc: 'Direct Assistance Service',
      wheelchairRamp: true,
      stepFree: true,
      capacity: '1 Wheelchair + 3 Attendants',
      icon: ACCESSIBLE_SVG,
      textIcon: 'Accessible'
    },
    {
      id: 'auto-erickshaw-1',
      name: 'Campus E-Rickshaw #14',
      category: 'erickshaw',
      vehicle: 'Battery Electric Auto (Level Entry)',
      driver: 'Surinder Pal',
      phone: '+91 98888 77665',
      rating: 4.75,
      rides: 1100,
      lat: 31.2531,
      lng: 75.7043,
      baseLat: 31.2531,
      baseLng: 75.7043,
      heading: 'Food Court & Central Lawns',
      fare: '₹10',
      fareDesc: 'Fixed Campus Flat Fare',
      wheelchairRamp: false,
      stepFree: true,
      capacity: '4 Passengers',
      icon: AUTO_SVG,
      textIcon: 'E-Rickshaw'
    },
    {
      id: 'auto-cng-1',
      name: 'Campus Auto-Rickshaw #22',
      category: 'auto',
      vehicle: 'Bajaj RE Auto-Rickshaw (Foldable Wheelchair Space)',
      driver: 'Harjit Singh',
      phone: '+91 98555 88990',
      rating: 4.85,
      rides: 2600,
      lat: 31.2535,
      lng: 75.7036,
      baseLat: 31.2535,
      baseLng: 75.7036,
      heading: 'Main Gate Auto Stand (GT Road)',
      fare: '₹30 - ₹50',
      fareDesc: 'Metered / Shared Auto',
      wheelchairRamp: false,
      stepFree: false,
      foldableBoot: true,
      capacity: '3 Passengers',
      icon: AUTO_SVG,
      textIcon: 'Auto'
    },
    {
      id: 'auto-ecart-2',
      name: 'LPU Campus Green Golf Cart #12',
      category: 'ecart',
      vehicle: '8-Seater Campus Electric Golf Cart',
      driver: 'Balwinder Singh',
      phone: '+91 98000 12345',
      rating: 4.9,
      rides: 1350,
      lat: 31.2537,
      lng: 75.7039,
      baseLat: 31.2537,
      baseLng: 75.7039,
      heading: 'Main Gate ↔ Academic Blocks',
      fare: '₹10',
      fareDesc: 'Fixed Campus Flat Fare',
      wheelchairRamp: false,
      stepFree: true,
      capacity: '8 Passengers',
      icon: GOLF_CART_SVG,
      textIcon: 'Golf Cart'
    }
  ];

  // CAMPUS PICKUP SPOTS
  const PICKUP_SPOTS = {
    'main-gate':        { label: 'Main Gate 1 Auto & Transit Stand', lat: 31.2536, lng: 75.7037 },
    'b32-ground':       { label: 'Block 32 – Academic Block (Ramp Entry)', lat: 31.2545, lng: 75.7030 },
    'b34-ground':       { label: 'Block 34 – Central Library (Level Entry)', lat: 31.2552, lng: 75.7048 },
    'b36-ground':       { label: 'Block 36 – Student Centre (East Ramp)', lat: 31.2538, lng: 75.7055 },
    'b26-ground':       { label: 'Block 26 – School of CSE Foyer', lat: 31.2543, lng: 75.7020 },
    'b38-ground':       { label: 'Block 38 – Mittal School of Business', lat: 31.2546, lng: 75.7065 },
    'uni-mall':         { label: 'Uni-Mall Complex (Fountain Plaza)', lat: 31.2546, lng: 75.7050 },
    'unipolis':         { label: 'Unipolis Cultural Arena Entrance', lat: 31.2540, lng: 75.7045 },
    'uni-hospital':     { label: 'Uni-Hospital Emergency Entry', lat: 31.2525, lng: 75.7034 },
    'indoor-stadium':   { label: 'Indoor Sports Stadium Foyer', lat: 31.2532, lng: 75.7062 },
    'bh-south':         { label: 'Boys Hostel 1–4 Main Gate', lat: 31.2515, lng: 75.7040 },
    'bh-north':         { label: 'Boys Hostel 5–8 Transit Stop', lat: 31.2570, lng: 75.7035 },
    'gh-west':          { label: 'Girls Hostel 1–3 Security Checkpost', lat: 31.2520, lng: 75.7060 },
    'gh-east':          { label: 'Girls Hostel 4–6 Main Gate', lat: 31.2565, lng: 75.7060 },
    'gate-2':           { label: 'Gate 2 (West Gate - Law & Business)', lat: 31.2548, lng: 75.7075 }
  };

  let currentPickup = 'b32-ground';
  let currentFilter = 'all';
  let autoMarkers = {};
  let autosLayer = null;
  let autosVisibleOnMap = true;
  let simInterval = null;

  // HAVERSINE DISTANCE (meters)
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

  // ESTIMATE ETA (minutes)
  function calcETA(meters) {
    const speedMeterPerMin = 220; // ~13 km/h average speed in campus pedestrian zones
    return Math.max(1, Math.round(meters / speedMeterPerMin) + 1);
  }

  // RENDER AUTOS & E-CARTS LIST
  function renderAutos() {
    const listEl = document.getElementById('autos-list');
    if (!listEl) return;

    const pickup = PICKUP_SPOTS[currentPickup] || PICKUP_SPOTS['b32-ground'];

    // Calculate distance and ETA for each vehicle
    const processed = FLEET.map(item => {
      const distance = calcDistance(pickup.lat, pickup.lng, item.lat, item.lng);
      const eta = calcETA(distance);
      return { ...item, distance, eta };
    });

    // Sort by distance (nearest first)
    processed.sort((a, b) => a.distance - b.distance);

    // Apply filter
    const filtered = processed.filter(item => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'accessible') return item.category === 'accessible';
      if (currentFilter === 'ecart') return item.category === 'ecart';
      if (currentFilter === 'auto') return item.category === 'auto' || item.category === 'erickshaw';
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--clr-text-muted);">
          <p style="font-size:1.1rem;margin-bottom:0.5rem;">No vehicles found for this category right now.</p>
          <button class="btn btn-outline btn-sm" onclick="CampusAutos.setFilter('all')">Show All Autos &amp; E-Carts</button>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(item => {
      const isFree = item.fare === 'FREE';
      return `
        <article class="auto-card ${item.wheelchairRamp ? 'accessible-auto' : ''}" data-auto-id="${item.id}">
          <div>
            <div class="auto-card-header">
              <div class="auto-card-icon" aria-hidden="true">${item.icon}</div>
              <div class="auto-card-title-group">
                <h3 class="auto-card-name">${escapeHTML(item.name)}</h3>
                <p class="auto-card-vehicle">${escapeHTML(item.vehicle)}</p>
              </div>
              <div class="auto-eta-badge" aria-label="Estimated arrival in ${item.eta} minutes">
                <span class="auto-eta-time">${item.eta} min</span>
                <span>${item.distance}m away</span>
              </div>
            </div>

            <div class="auto-badges-list">
              ${item.wheelchairRamp ? '<span class="auto-badge ramp">Wheelchair Ramp</span>' : ''}
              ${item.stepFree && !item.wheelchairRamp ? '<span class="auto-badge">Level Step-Free</span>' : ''}
              ${item.foldableBoot ? '<span class="auto-badge">Wheelchair Storage</span>' : ''}
              <span class="auto-badge ${isFree ? 'free' : ''}">${isFree ? 'Free Campus Assist' : 'Eco Golf Cart'}</span>
              <span class="auto-badge">Rating: ${item.rating} (${item.rides}+ trips)</span>
            </div>

            <div class="auto-details-meta">
              <div><strong>Driver:</strong> ${escapeHTML(item.driver)}</div>
              <div><strong>Route/Stand:</strong> ${escapeHTML(item.heading)}</div>
              <div><strong>Capacity:</strong> ${escapeHTML(item.capacity)}</div>
            </div>
          </div>

          <div class="auto-card-footer">
            <div>
              <span class="auto-fare-label">${escapeHTML(item.fareDesc)}</span>
              <span class="auto-fare" style="color:${isFree ? 'var(--clr-success)' : 'var(--clr-primary-dark)'};">
                ${escapeHTML(item.fare)}
              </span>
            </div>
            <div class="auto-card-actions">
              <button class="btn btn-outline btn-sm btn-auto-map" data-auto-id="${item.id}" title="View vehicle on map">
                Map
              </button>
              <button class="btn btn-primary btn-sm btn-auto-book" data-auto-id="${item.id}">
                ${isFree ? 'Request E-Cart' : 'Book Auto'}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Bind action buttons
    listEl.querySelectorAll('.btn-auto-map').forEach(btn => {
      btn.addEventListener('click', () => {
        viewAutoOnMap(btn.dataset.autoId);
      });
    });

    listEl.querySelectorAll('.btn-auto-book').forEach(btn => {
      btn.addEventListener('click', () => {
        openBookingModal(btn.dataset.autoId);
      });
    });
  }

  // FILTER TOGGLE
  function setFilter(cat) {
    currentFilter = cat;
    document.querySelectorAll('.auto-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filter === cat);
    });
    renderAutos();
  }

  // PICKUP SELECTION
  function setPickup(spotId) {
    currentPickup = spotId;
    renderAutos();
  }

  // LEAFLET MAP INTEGRATION
  function initMapAutos() {
    const map = window.CampusMap?.getMap ? window.CampusMap.getMap() : window._lpuMap;
    if (!map || autosLayer) return;

    autosLayer = L.layerGroup().addTo(map);
    renderMapMarkers();

    // Start subtle movement simulation
    if (!simInterval) {
      simInterval = setInterval(simulateMovement, 6000);
    }
  }

  // RENDER MARKERS ON LEAFLET MAP
  function renderMapMarkers() {
    if (!autosLayer) return;
    autosLayer.clearLayers();
    autoMarkers = {};

    if (!autosVisibleOnMap) return;

    FLEET.forEach(item => {
      const customIcon = L.divIcon({
        html: `
          <div class="auto-map-marker">
            <span class="auto-marker-pulse"></span>
            <div class="auto-marker-badge ${item.category}">
              ${item.icon}
            </div>
          </div>
        `,
        className: '',
        iconSize: [42, 42],
        iconAnchor: [21, 21],
        popupAnchor: [0, -20]
      });

      const popupHtml = `
        <div style="font-family:'Segoe UI',sans-serif;max-width:240px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="font-size:1.5rem;">${item.icon}</span>
            <div>
              <strong style="font-size:0.95rem;color:var(--clr-primary);display:block;">${escapeHTML(item.name)}</strong>
              <span style="font-size:0.75rem;color:#666;">${escapeHTML(item.vehicle)}</span>
            </div>
          </div>
          <div style="font-size:0.8rem;color:#333;margin-bottom:6px;background:#f9f9f9;padding:4px 8px;border-radius:4px;">
            <div><strong>Driver:</strong> ${escapeHTML(item.driver)} (Rating: ${item.rating})</div>
            <div><strong>Fare:</strong> <span style="color:#2e7d32;font-weight:700;">${item.fare}</span> (${item.fareDesc})</div>
            ${item.wheelchairRamp ? '<div style="color:#1b5e20;font-weight:700;">Low-Floor Ramp Assistance</div>' : ''}
          </div>
          <div style="display:flex;gap:4px;margin-top:6px;">
            <button onclick="CampusAutos.openBookingModal('${item.id}')"
                    style="flex:1;background:#245501;color:white;border:none;border-radius:4px;padding:4px 8px;font-size:0.78rem;font-weight:600;cursor:pointer;">
              ${item.fare === 'FREE' ? 'Request E-Cart' : 'Book Auto'}
            </button>
            <a href="tel:${item.phone}"
               style="background:#f1f8e9;color:#2e7d32;border:1px solid #c5e1a5;border-radius:4px;padding:4px 8px;font-size:0.78rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;">
              Call
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([item.lat, item.lng], {
        icon: customIcon,
        alt: `${item.name} – ${item.vehicle}`,
        title: item.name
      }).addTo(autosLayer);

      marker.bindPopup(popupHtml, { maxWidth: 260 });
      marker.bindTooltip(`${item.name} (${item.fare})`, { direction: 'top', className: 'route-tooltip' });

      autoMarkers[item.id] = marker;
    });
  }

  // SIMULATE SUBTLE LIVE ROAMING
  function simulateMovement() {
    FLEET.forEach(item => {
      const offsetLat = (Math.random() - 0.5) * 0.0003;
      const offsetLng = (Math.random() - 0.5) * 0.0003;
      item.lat = item.baseLat + offsetLat;
      item.lng = item.baseLng + offsetLng;

      const marker = autoMarkers[item.id];
      if (marker) {
        marker.setLatLng([item.lat, item.lng]);
      }
    });

    const autosPage = document.getElementById('autos-section');
    if (autosPage && autosPage.classList.contains('active-page')) {
      renderAutos();
    }
  }

  // TOGGLE AUTOS VISIBILITY ON MAP
  function toggleMapAutos(visible) {
    autosVisibleOnMap = visible !== undefined ? visible : !autosVisibleOnMap;
    const btn = document.getElementById('btn-toggle-autos');
    if (btn) {
      btn.setAttribute('aria-pressed', autosVisibleOnMap ? 'true' : 'false');
      btn.classList.toggle('active', autosVisibleOnMap);
    }
    renderMapMarkers();
  }

  // VIEW VEHICLE ON MAP
  function viewAutoOnMap(autoId) {
    const item = FLEET.find(c => c.id === autoId);
    if (!item) return;

    if (window.switchAppTab) window.switchAppTab('navigate');

    setTimeout(() => {
      initMapAutos();
      toggleMapAutos(true);

      const marker = autoMarkers[autoId];
      const map = window.CampusMap?.getMap ? window.CampusMap.getMap() : window._lpuMap;
      if (marker && map) {
        map.flyTo([item.lat, item.lng], 18, { animate: true, duration: 1 });
        setTimeout(() => marker.openPopup(), 1100);
      }
    }, 250);
  }

  // BOOKING / ASSIST MODAL
  function openBookingModal(autoId) {
    const item = FLEET.find(c => c.id === autoId);
    if (!item) return;

    const modalEl = document.getElementById('auto-booking-modal');
    const contentEl = document.getElementById('auto-modal-body');
    if (!modalEl || !contentEl) return;

    const pickup = PICKUP_SPOTS[currentPickup] || PICKUP_SPOTS['b32-ground'];
    const distance = calcDistance(pickup.lat, pickup.lng, item.lat, item.lng);
    const eta = calcETA(distance);
    const isFree = item.fare === 'FREE';
    const otp = Math.floor(1000 + Math.random() * 9000);

    contentEl.innerHTML = `
      <div style="margin-bottom:1rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;">
          <span style="font-size:2rem;">${item.icon}</span>
          <div>
            <h4 style="margin:0;font-size:1.1rem;color:var(--clr-primary-dark);">${escapeHTML(item.name)}</h4>
            <div style="font-size:0.85rem;color:var(--clr-text-muted);">${escapeHTML(item.vehicle)}</div>
          </div>
        </div>

        <div style="background:var(--clr-surface-alt);border:1px solid var(--clr-border);border-radius:var(--radius-md);padding:0.75rem 1rem;font-size:0.85rem;display:flex;flex-direction:column;gap:0.4rem;">
          <div><strong>Pickup:</strong> ${escapeHTML(pickup.label)}</div>
          <div><strong>ETA:</strong> <span style="color:var(--clr-primary-dark);font-weight:700;">${eta} mins</span> (${distance}m away)</div>
          <div><strong>Driver:</strong> ${escapeHTML(item.driver)} · Rating: ${item.rating}</div>
          <div><strong>Fare:</strong> <strong style="color:${isFree ? 'var(--clr-success)' : 'var(--clr-text)'};">${item.fare}</strong> (${item.fareDesc})</div>
          ${item.wheelchairRamp ? '<div style="color:var(--clr-success);font-weight:700;">Ramp assistance confirmed</div>' : ''}
        </div>
      </div>

      <div id="auto-booking-stage-initial">
        <button id="btn-confirm-auto" class="btn btn-primary btn-large" style="width:100%;margin-bottom:0.5rem;">
          ${isFree ? 'Confirm E-Cart Assistance' : 'Confirm Auto Booking'}
        </button>
        <button id="btn-cancel-auto-modal" class="btn btn-outline" style="width:100%;">
          Cancel
        </button>
      </div>

      <div id="auto-booking-stage-confirmed" hidden style="text-align:center;padding:0.5rem 0;">
        <div style="font-size:1.5rem;color:var(--clr-success);margin-bottom:0.25rem;font-weight:700;">Booking Confirmed</div>
        <h4 style="margin:0 0 0.5rem;font-size:1.15rem;color:var(--clr-primary-dark);">Ride Dispatched!</h4>
        <p style="font-size:0.85rem;color:var(--clr-text-muted);margin:0 0 1rem;">
          ${escapeHTML(item.name)} is heading to <strong>${escapeHTML(pickup.label)}</strong>.
        </p>

        <div style="background:#e8f5e9;border:1.5px dashed #2e7d32;border-radius:var(--radius-md);padding:0.75rem;margin-bottom:1rem;">
          <div style="font-size:0.75rem;text-transform:uppercase;font-weight:700;color:#1b5e20;">Ride Verification OTP</div>
          <div style="font-size:1.75rem;font-weight:900;letter-spacing:4px;color:#1b5e20;">${otp}</div>
          <div style="font-size:0.75rem;color:#2e7d32;">Share this OTP with driver upon boarding</div>
        </div>

        <div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;">
          <a href="tel:${item.phone}" class="btn btn-primary btn-sm" style="text-decoration:none;">
            Call Driver
          </a>
          <button id="btn-track-auto-map" class="btn btn-outline btn-sm">
            Track on Map
          </button>
          <button id="btn-done-auto" class="btn btn-sm">
            Done
          </button>
        </div>
      </div>
    `;

    modalEl.hidden = false;

    // Bind modal actions
    document.getElementById('btn-confirm-auto').addEventListener('click', () => {
      document.getElementById('auto-booking-stage-initial').hidden = true;
      document.getElementById('auto-booking-stage-confirmed').hidden = false;

      const el = document.getElementById('live-announcer');
      if (el) el.textContent = `Auto booked: ${item.name}. Arriving in ${eta} minutes at ${pickup.label}. OTP is ${otp}.`;
    });

    document.getElementById('btn-cancel-auto-modal').addEventListener('click', closeBookingModal);

    const trackBtn = document.getElementById('btn-track-auto-map');
    if (trackBtn) {
      trackBtn.addEventListener('click', () => {
        closeBookingModal();
        viewAutoOnMap(autoId);
      });
    }

    const doneBtn = document.getElementById('btn-done-auto');
    if (doneBtn) {
      doneBtn.addEventListener('click', closeBookingModal);
    }
  }

  function closeBookingModal() {
    const modalEl = document.getElementById('auto-booking-modal');
    if (modalEl) modalEl.hidden = true;
  }

  // ESCAPE HELPER
  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // INITIALIZE
  function init() {
    const pickupSelect = document.getElementById('autos-pickup-select');
    if (pickupSelect) {
      pickupSelect.innerHTML = Object.entries(PICKUP_SPOTS).map(([key, spot]) => {
        return `<option value="${key}">${escapeHTML(spot.label)}</option>`;
      }).join('');
      pickupSelect.value = currentPickup;

      pickupSelect.addEventListener('change', (e) => {
        setPickup(e.target.value);
      });
    }

    // Filter chips
    document.querySelectorAll('.auto-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        setFilter(chip.dataset.filter);
      });
    });

    // Modal close
    const modalBackdrop = document.getElementById('auto-booking-modal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeBookingModal();
      });
    }

    const modalCloseBtn = document.getElementById('auto-modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeBookingModal);
    }

    // Toggle button on map header
    const toggleAutosBtn = document.getElementById('btn-toggle-autos');
    if (toggleAutosBtn) {
      toggleAutosBtn.addEventListener('click', () => {
        initMapAutos();
        toggleMapAutos();
      });
    }

    // GPS Location button
    const locateBtn = document.getElementById('btn-autos-gps');
    if (locateBtn) {
      locateBtn.addEventListener('click', () => {
        if ('geolocation' in navigator) {
          locateBtn.textContent = 'Locating...';
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              locateBtn.textContent = 'Near You';
              let closestKey = 'b32-ground';
              let minD = Infinity;
              Object.entries(PICKUP_SPOTS).forEach(([k, s]) => {
                const d = calcDistance(pos.coords.latitude, pos.coords.longitude, s.lat, s.lng);
                if (d < minD) { minD = d; closestKey = k; }
              });
              if (pickupSelect) pickupSelect.value = closestKey;
              setPickup(closestKey);
            },
            () => {
              locateBtn.textContent = 'GPS Unavailable';
              setTimeout(() => { locateBtn.textContent = 'Use My Location'; }, 2000);
            },
            { timeout: 8000 }
          );
        }
      });
    }

    // Initial render
    renderAutos();

    // Map init hook
    setTimeout(initMapAutos, 500);

    console.log('[CampusAutos] Autos and E-Carts transit system initialized');
  }

  return {
    init,
    renderAutos,
    setFilter,
    setPickup,
    viewAutoOnMap,
    openBookingModal,
    closeBookingModal,
    toggleMapAutos,
    FLEET,
    PICKUP_SPOTS
  };

})();

window.CampusAutos = CampusAutos;
