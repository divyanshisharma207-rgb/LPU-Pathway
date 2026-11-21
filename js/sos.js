/**
 * sos.js – 1-Tap Campus Emergency & Medical Assistance Module
 * LPU Pathway – Accessible Campus Navigation
 */

'use strict';

const CampusSOS = (() => {

  // LPU DEFAULT EMERGENCY CONTACTS
  const CONTACTS = {
    ambulance: '+911824404040',    // LPU Uni-Hospital 24/7 Trauma / Ambulance
    security:  '+911824404040',    // Chief Security & Quick Response Patrol
    disability: '+911824404040',   // Disability Support & Mobility Cell
    women:     '1091',             // Punjab Police Women Helpline
    whatsapp:  '919876543210'      // Campus Rapid Response WhatsApp Dispatch
  };

  let currentSpotInfo = {
    name: 'Lovely Professional University (LPU) Campus',
    coords: '31.2536°N, 75.7037°E',
    lat: 31.2536,
    lng: 75.7037
  };

  // RESOLVE USER'S CURRENT LOCATION
  function resolveCurrentLocation() {
    // 1. Try Live GPS coords if active
    if (window.CampusGPS) {
      const gpsCoords = window.CampusGPS.getCurrentCoords();
      if (gpsCoords && gpsCoords.lat && gpsCoords.lng) {
        const nearestId = window.CampusGPS.getNearestNodeId(gpsCoords.lat, gpsCoords.lng);
        const node = window.CampusData?.NODES[nearestId];
        const label = node ? node.label : 'LPU Campus Pathway';

        currentSpotInfo = {
          name: `Near ${label}`,
          coords: `${gpsCoords.lat.toFixed(5)}°N, ${gpsCoords.lng.toFixed(5)}°E`,
          lat: gpsCoords.lat,
          lng: gpsCoords.lng
        };
        updateLocationUI();
        return;
      }
    }

    // 2. Try selected Route Starting Point
    const fromSelect = document.getElementById('from-select');
    if (fromSelect && fromSelect.value && fromSelect.value !== 'live-gps') {
      const node = window.CampusData?.NODES[fromSelect.value];
      if (node) {
        currentSpotInfo = {
          name: `At ${node.label}`,
          coords: `${node.lat.toFixed(5)}°N, ${node.lng.toFixed(5)}°E`,
          lat: node.lat,
          lng: node.lng
        };
        updateLocationUI();
        return;
      }
    }

    // 3. Fallback: Query browser geolocation once quickly
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let nearestName = 'LPU Campus';
          let minD = Infinity;

          if (window.CampusData?.NODES) {
            Object.values(window.CampusData.NODES).forEach(n => {
              if (n.lat && n.lng) {
                const d = Math.hypot(lat - n.lat, lng - n.lng);
                if (d < minD) { minD = d; nearestName = n.label; }
              }
            });
          }

          currentSpotInfo = {
            name: `Near ${nearestName}`,
            coords: `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`,
            lat: lat,
            lng: lng
          };
          updateLocationUI();
        },
        () => {
          // Default LPU central coords
          updateLocationUI();
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      updateLocationUI();
    }
  }

  // UPDATE LOCATION IN MODAL UI
  function updateLocationUI() {
    const nameEl = document.getElementById('sos-loc-name');
    const coordsEl = document.getElementById('sos-loc-coords');
    const waBtn = document.getElementById('sos-whatsapp-btn');

    if (nameEl) nameEl.textContent = currentSpotInfo.name;
    if (coordsEl) coordsEl.textContent = currentSpotInfo.coords;

    // Update WhatsApp link with pre-filled message
    if (waBtn) {
      const msg = `EMERGENCY ASSISTANCE NEEDED: I am at LPU Campus, ${currentSpotInfo.name} (${currentSpotInfo.coords}). Please send immediate medical/security assistance.`;
      waBtn.href = `https://wa.me/${CONTACTS.whatsapp}?text=${encodeURIComponent(msg)}`;
    }
  }

  // COPY LOCATION TO CLIPBOARD
  function copyLocation() {
    const text = `Emergency at LPU Campus: ${currentSpotInfo.name} (Coordinates: ${currentSpotInfo.coords})`;
    const copyBtn = document.getElementById('btn-copy-sos-loc');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        if (copyBtn) {
          const orig = copyBtn.innerHTML;
          copyBtn.innerHTML = '✓ Copied to Clipboard!';
          setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
        }
      });
    } else {
      alert(`Location copied:\n${text}`);
    }
  }

  // OPEN MODAL
  function openModal() {
    const modal = document.getElementById('sos-modal-overlay');
    if (!modal) return;

    resolveCurrentLocation();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Announce to screen reader
    const announcer = document.getElementById('live-announcer');
    if (announcer) {
      announcer.textContent = 'Campus Emergency and Medical Assistance opened. Choose an emergency service to call immediately.';
    }

    // Set focus on close button or primary ambulance card
    setTimeout(() => {
      document.getElementById('sos-call-ambulance')?.focus();
    }, 150);
  }

  // CLOSE MODAL
  function closeModal() {
    const modal = document.getElementById('sos-modal-overlay');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('btn-emergency-sos')?.focus();
  }

  // INITIALIZE
  function init() {
    const triggerBtn = document.getElementById('btn-emergency-sos');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', openModal);
    }

    const closeBtn = document.getElementById('btn-close-sos');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    const overlay = document.getElementById('sos-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    const copyBtn = document.getElementById('btn-copy-sos-loc');
    if (copyBtn) {
      copyBtn.addEventListener('click', copyLocation);
    }

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('sos-modal-overlay');
        if (modal && modal.classList.contains('active')) {
          closeModal();
        }
      }
    });

    console.log('[CampusSOS] 1-Tap Emergency & Medical Assistance ready');
  }

  return {
    init,
    openModal,
    closeModal,
    resolveCurrentLocation,
    copyLocation
  };

})();

window.CampusSOS = CampusSOS;
