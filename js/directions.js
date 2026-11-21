/**
 * directions.js – Directions renderer + Read Aloud (Web Speech API)
 * Works with the inline directions-output panel inside the route form page.
 */

'use strict';

const DirectionsPanel = (() => {

  let currentDirections = [];
  let isSpeaking = false;

  // ── RENDER DIRECTIONS ──────────────────────────────────────
  function render(directions, routeMeta) {
    currentDirections = directions;

    const output      = document.getElementById('directions-output');
    const placeholder = document.getElementById('directions-placeholder');
    const list        = document.getElementById('directions-list');
    const summaryText = document.getElementById('route-summary-text');
    const badges      = document.getElementById('route-badges');
    const audioCtrl   = document.getElementById('audio-controls');

    if (!directions || directions.length === 0) {
      showPlaceholder('No route found. Try different locations.');
      return;
    }

    // Build steps
    list.innerHTML = '';
    directions.forEach((step, idx) => {
      const li = document.createElement('li');
      li.className = `direction-step${step.stepFreeOnly ? ' stepfree-only' : ''}`;
      li.dataset.step = idx;

      let tagHTML = '';
      if (step.accessTag) {
        tagHTML = `<span class="step-access-tag ${step.accessTag.type}">${step.accessTag.label}</span>`;
      }

      li.innerHTML = `
        <div class="step-number" aria-hidden="true">${step.step}</div>
        <div class="step-content">
          <div class="step-instruction">${escapeHTML(step.instruction)}</div>
          ${step.landmark ? `<div class="step-landmark">${escapeHTML(step.landmark)}</div>` : ''}
          ${tagHTML}
          ${step.distance ? `<div class="step-distance">${escapeHTML(step.distance)}</div>` : ''}
        </div>`;

      list.appendChild(li);
    });

    // Route summary
    if (routeMeta) {
      const timeStr = RouteEngine.formatTime(routeMeta.totalTime);
      summaryText.textContent = `${routeMeta.fromLabel} → ${routeMeta.toLabel} · ${timeStr}`;
      
      let modeBadgeHTML = '';
      if (routeMeta.mode === 'covered') {
        modeBadgeHTML = '<span class="route-badge route-badge--covered">☂️ Covered &amp; Shaded</span>';
      } else if (routeMeta.stepFree) {
        modeBadgeHTML = '<span class="route-badge route-badge--stepfree">♿ Step-Free</span>';
      } else {
        modeBadgeHTML = '<span class="route-badge route-badge--fastest">⚡ Fastest</span>';
      }

      badges.innerHTML = `
        ${modeBadgeHTML}
        <span class="route-badge route-badge--time">⏱️ ${timeStr}</span>`;
    }

    // Show output, hide placeholder
    output.hidden = false;
    if (placeholder) placeholder.style.display = 'none';

    // Scroll list to top
    list.scrollTo({ top: 0, behavior: 'smooth' });

    // Announce to screen reader
    announceAssertive(
      `Route ready: ${directions.length} steps. ${routeMeta ? RouteEngine.formatTime(routeMeta.totalTime) : ''}.`
    );
  }

  // ── SHOW PLACEHOLDER / ERROR ───────────────────────────────
  function showPlaceholder(msg) {
    const output      = document.getElementById('directions-output');
    const placeholder = document.getElementById('directions-placeholder');

    if (output) output.hidden = true;
    if (placeholder) {
      placeholder.style.display = '';
      placeholder.innerHTML = msg
        ? `<p>${escapeHTML(msg)}</p>`
        : `<p>Select start &amp; destination above, then click <strong>Find Route</strong>.</p>`;
    }
    if (msg) announceAssertive(msg);
  }

  // ── READ ALOUD ─────────────────────────────────────────────
  function readAloud() {
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    if (currentDirections.length === 0) {
      alert('No directions to read. Please find a route first.');
      return;
    }

    stopSpeech(); // cancel any ongoing

    const readBtn = document.getElementById('read-aloud-btn');
    const stopBtn = document.getElementById('stop-speech-btn');
    const steps   = document.querySelectorAll('.direction-step');

    // Build spoken text sentence per step
    const sentences = currentDirections.map(step => {
      let s = `Step ${step.step}: ${step.instruction}.`;
      if (step.landmark) s += ` Look for: ${step.landmark}.`;
      return s;
    });

    let stepIndex = 0;

    function speakNext() {
      if (stepIndex >= sentences.length || !isSpeaking) {
        finishReading();
        return;
      }

      // Highlight current step
      steps.forEach(el => el.classList.remove('reading-active'));
      if (steps[stepIndex]) {
        steps[stepIndex].classList.add('reading-active');
        steps[stepIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const utter = new SpeechSynthesisUtterance(sentences[stepIndex]);
      utter.lang  = 'en-IN';
      utter.rate  = 0.88;
      utter.pitch = 1;

      utter.onend = () => {
        stepIndex++;
        speakNext();
      };
      utter.onerror = () => finishReading();

      window.speechSynthesis.speak(utter);
    }

    function finishReading() {
      isSpeaking = false;
      steps.forEach(el => el.classList.remove('reading-active'));
      if (readBtn) {
        readBtn.textContent = 'Read Aloud';
        readBtn.classList.remove('reading');
        readBtn.hidden = false;
      }
      if (stopBtn) stopBtn.hidden = true;
      announcePolite('Finished reading directions.');
    }

    // Start
    isSpeaking = true;
    if (readBtn) {
      readBtn.textContent = 'Reading...';
      readBtn.classList.add('reading');
      readBtn.hidden = true;
    }
    if (stopBtn) stopBtn.hidden = false;

    announcePolite('Reading directions aloud.');
    speakNext();
  }

  // ── STOP SPEECH ────────────────────────────────────────────
  function stopSpeech() {
    isSpeaking = false;
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const readBtn = document.getElementById('read-aloud-btn');
    const stopBtn = document.getElementById('stop-speech-btn');
    const steps   = document.querySelectorAll('.direction-step');

    steps.forEach(el => el.classList.remove('reading-active'));
    if (readBtn) {
      readBtn.textContent = 'Read Aloud';
      readBtn.classList.remove('reading');
      readBtn.hidden = false;
    }
    if (stopBtn) stopBtn.hidden = true;
  }

  // ── SHARE ROUTE ────────────────────────────────────────────
  function shareRoute(fromId, toId, stepFree) {
    const url = new URL(window.location.href);
    url.searchParams.set('from', fromId);
    url.searchParams.set('to', toId);
    url.searchParams.set('mode', stepFree ? 'stepfree' : 'fastest');

    if (navigator.share) {
      navigator.share({ title: 'LPU Pathway Route', url: url.toString() })
        .catch(() => copyToClipboard(url.toString()));
    } else {
      copyToClipboard(url.toString());
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => announcePolite('Route link copied to clipboard.'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      announcePolite('Route link copied to clipboard.');
    }
  }

  // ── HELPERS ────────────────────────────────────────────────
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function announceAssertive(msg) {
    const el = document.getElementById('live-announcer');
    if (el) { el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 50); }
  }

  function announcePolite(msg) {
    const el = document.getElementById('polite-announcer');
    if (el) { el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 50); }
  }

  return { render, showPlaceholder, readAloud, stopSpeech, shareRoute };

})();

window.DirectionsPanel = DirectionsPanel;
