/**
 * ═══════════════════════════════════════════════════════════════════
 * LPU PATHWAY – CAMPUS AI ASSISTANT CHATBOT ENGINE
 * Intelligent NLP, accessible speech synthesis/recognition,
 * multi-intent routing, live smart-campus data integration.
 * Zero-emoji compliant.
 * ═══════════════════════════════════════════════════════════════════
 */

window.CampusChatbot = (() => {
  let isOpen = false;
  let voiceOutputEnabled = false;
  let recognition = null;
  let isListening = false;
  let messagesHistory = [];

  // Knowledge base intent definitions
  const KNOWLEDGE_BASE = [
    {
      intent: 'placements',
      keywords: ['placement', 'placements', 'drive', 'company', 'google', 'microsoft', 'amazon', 'deloitte', 'bosch', 'cognizant', 'interview', 'package', 'ctc', 'dress code', 'dresscode'],
      handler: (q) => {
        if (q.includes('google')) {
          return {
            text: 'Google India is visiting today for Software Development Engineer (SDE-1) offering ₹32.5 LPA. Reporting time is 08:30 AM Sharp at Block 38 MSB Auditorium (Floor 0, Room 012). Dress code: Strict Formal Business Suit / Blazer with matching formal trousers, polished leather shoes, and University RFID ID Card.',
            actions: [
              { label: 'Route to Block 38', action: 'route', args: ['b38-ground', 'Block 38 Auditorium'] },
              { label: 'Indoor Hall Guide', action: 'indoor', args: ['b38', 0, '012'] },
              { label: 'View Placements Tab', action: 'tab', args: ['placements'] }
            ]
          };
        }
        if (q.includes('microsoft')) {
          return {
            text: 'Microsoft is visiting today for Cloud Solution Architect & Support Engineer offering ₹28.0 LPA. Reporting time is 09:15 AM at Block 25 IT Labs (Floor 1, Lab 102). Dress code: Formal Corporate Attire with formal shirt, dark trousers, formal tie, and dress shoes.',
            actions: [
              { label: 'Route to Block 25', action: 'route', args: ['b25-ground', 'Block 25 IT Labs'] },
              { label: 'Indoor Lab Guide', action: 'indoor', args: ['b25', 1, '102'] },
              { label: 'View Placements Tab', action: 'tab', args: ['placements'] }
            ]
          };
        }
        if (q.includes('amazon')) {
          return {
            text: 'Amazon Web Services (AWS) is hosting Pre-Placement Talks & Tests today for Cloud Support Associate (₹22.0 LPA). Reporting time is 11:00 AM at Shanti Devi Mittal Indoor Stadium & Auditorium. Dress code: Formal Business Suit or Formal Shirt & Trousers with University ID card.',
            actions: [
              { label: 'Route to Stadium & Audi', action: 'route', args: ['indoor-stadium', 'Shanti Devi Mittal Indoor Stadium & Auditorium'] },
              { label: 'View Placements Tab', action: 'tab', args: ['placements'] }
            ]
          };
        }
        return {
          text: 'Upcoming campus placement drives include Google India (₹32.5 LPA at Block 38 MSB Audi, 08:30 AM), Microsoft (₹28.0 LPA at Block 25, 09:15 AM), and Amazon AWS (₹22.0 LPA at Shanti Devi Mittal Stadium, 11:00 AM). Formal business attire and physical RFID ID card are strictly mandatory.',
          actions: [
            { label: 'Open Placement Drives', action: 'tab', args: ['placements'] },
            { label: 'Route to Block 38', action: 'route', args: ['b38-ground', 'Block 38 MSB Auditorium'] }
          ]
        };
      }
    },
    {
      intent: 'queues',
      keywords: ['queue', 'wait', 'fee', 'counter', 'token', 'billing', 'accounts', 'clearance', 'admissions desk', 'opd', 'pharmacy'],
      handler: (q) => {
        return {
          text: 'Live counter wait estimates:\n• Fee Clearance & Accounts (Block 36): ~11 mins wait (Serving #142, 14 ahead)\n• Admissions & Verification (Block 32): ~16 mins wait (Serving #210, 18 ahead)\n• Uni-Hospital OPD Triage: ~5 mins wait (Serving #048, 3 ahead)\n• Uni-Mall Central Pharmacy: ~7 mins wait',
          actions: [
            { label: 'Open Queue Times Hub', action: 'tab', args: ['queues'] },
            { label: 'Route to Block 36 Fee Cell', action: 'route', args: ['b36-ground', 'Block 36 Fee Clearance Desk'] }
          ]
        };
      }
    },
    {
      intent: 'indoor',
      keywords: ['indoor', 'floor', 'lift', 'stairs', 'room 502', 'room', 'guidance', 'staircase', 'which lift'],
      handler: (q) => {
        return {
          text: 'Our Indoor Navigation provides floor-by-floor step-free guidance. For example, for Block 32, Floor 5, Room 502 (Advanced AI & Robotics Lab): enter via the East Ramped Ground Entrance, take Lift Bank B to Floor 5, and turn right into the North Wing corridor.',
          actions: [
            { label: 'Open Indoor Nav', action: 'tab', args: ['indoor'] },
            { label: 'Guide to Room 502', action: 'indoor', args: ['b32', 5, '502'] }
          ]
        };
      }
    },
    {
      intent: 'emergency',
      keywords: ['sos', 'emergency', 'doctor', 'hospital', 'medical', 'ambulance', 'trauma', 'first aid', 'safe heaven', 'security', 'police', 'fire'],
      handler: (q) => {
        return {
          text: 'For immediate medical or security emergency:\n• 24/7 Campus Hospital & Ambulance Hotline: +91 1824 404040\n• Uni-Hospital Trauma Center is located behind Block 38 with full ICU & stretcher lifts.\n• Chief Security Control Room is at Main Gate 1.\nAll 6 designated Safe Heavens are marked on the map.',
          actions: [
            { label: 'Route to Uni-Hospital', action: 'route', args: ['uni-hospital', 'Uni-Hospital Trauma Center'] },
            { label: 'Call 24/7 Emergency', action: 'call', args: ['+911824404040'] },
            { label: 'View Safe Heavens', action: 'tab', args: ['navigate'] }
          ]
        };
      }
    },
    {
      intent: 'buildings',
      keywords: ['block 14', 'block 25', 'block 26', 'block 27', 'block 28', 'block 29', 'block 32', 'block 33', 'block 34', 'block 35', 'block 36', 'block 37', 'block 38', 'block 55', 'block 56', 'unimall', 'uni-mall', 'unipolis', 'stadium', 'library'],
      handler: (q) => {
        if (q.includes('38')) {
          return {
            text: 'Block 38 houses the Mittal School of Business (MSB), Executive Lecture Theatres, and the Central Academic Auditorium. It features dual passenger lifts, covered arcade walkways from Gate 2, and ramped entrances.',
            actions: [
              { label: 'Route to Block 38', action: 'route', args: ['b38-ground', 'Block 38'] },
              { label: 'Building Details', action: 'tab', args: ['buildings'] }
            ]
          };
        }
        if (q.includes('34') || q.includes('library')) {
          return {
            text: 'Block 34 is the Shanti Devi Mittal Central Library, spanning 5 floors with automated self-issue kiosks, quiet study carrels, and braille reading corners. It has passenger lift access and zero-step level entry.',
            actions: [
              { label: 'Route to Central Library', action: 'route', args: ['b34-ground', 'Block 34 Central Library'] },
              { label: 'Building Details', action: 'tab', args: ['buildings'] }
            ]
          };
        }
        if (q.includes('32')) {
          return {
            text: 'Block 32 is the Academic Block for Computer Science & Engineering (CSE) and Tech, with computer laboratories, robotics studios, and high-speed passenger lifts equipped with voice alerts.',
            actions: [
              { label: 'Route to Block 32', action: 'route', args: ['b32-ground', 'Block 32'] },
              { label: 'Indoor Guide Floor 5', action: 'indoor', args: ['b32', 5, '502'] }
            ]
          };
        }
        if (q.includes('unimall') || q.includes('uni-mall')) {
          return {
            text: 'Uni-Mall is the central student commercial and dining complex with restaurants, bank ATMs, stationery superstores, and student utility shops. It has level step-free entrances and accessible restrooms.',
            actions: [
              { label: 'Route to Uni-Mall', action: 'route', args: ['uni-mall-entrance', 'Uni-Mall'] },
              { label: 'Building Details', action: 'tab', args: ['buildings'] }
            ]
          };
        }
        if (q.includes('unipolis')) {
          return {
            text: 'Baldev Raj Mittal Unipolis is LPU’s 10,000-capacity open amphitheatre hosting convocations, celebrity concerts, and cultural fests. Accessible via wide paved perimeter ramps.',
            actions: [
              { label: 'Route to Unipolis', action: 'route', args: ['unipolis', 'Baldev Raj Mittal Unipolis'] }
            ]
          };
        }
        if (q.includes('stadium')) {
          return {
            text: 'Shanti Devi Mittal Indoor Sports Stadium houses Olympic-grade athletic facilities, a heated swimming pool, 12 wooden badminton courts, and gyms with wheelchair lift access.',
            actions: [
              { label: 'Route to Stadium', action: 'route', args: ['indoor-stadium', 'Shanti Devi Mittal Indoor Stadium'] }
            ]
          };
        }
        return {
          text: 'Every block on campus is connected via our 100% step-free accessibility network with passenger lifts, ramps, tactile floor paths, and accessible washrooms.',
          actions: [
            { label: 'View Campus Buildings', action: 'tab', args: ['buildings'] },
            { label: 'Plan Route on Map', action: 'tab', args: ['navigate'] }
          ]
        };
      }
    },
    {
      intent: 'autos',
      keywords: ['auto', 'e-cart', 'fare', 'rickshaw', 'stand', 'cart', 'transport', 'shuttle'],
      handler: (q) => {
        return {
          text: 'LPU operates university-regulated eco e-carts and autos across campus.\n• Flat fare: ₹10 for standard points, ₹15 cross-campus terminal ride.\n• 4 Key Stands: Main Gate 1, Uni-Mall Plaza, Central Library Block 34, and Gate 2.\n• Free golf cart shuttles for wheelchair users depart Gate 1 every 3 minutes.',
          actions: [
            { label: 'Track Autos Live', action: 'tab', args: ['autos'] },
            { label: 'Route to Gate 1 Stand', action: 'route', args: ['main-gate', 'Main Gate 1 Auto Stand'] }
          ]
        };
      }
    },
    {
      intent: 'parking',
      keywords: ['parking', 'car', 'bike', 'scooter', 'ev charging', 'ev', 'vehicle', 'slot', 'slots'],
      handler: (q) => {
        return {
          text: 'Campus has 6 major parking lots (P1 to P6) with live slot tracking and fast EV charging points:\n• P1 (Gate 1): 42 Slots Free (Staff 4W & Visitors, 4 EV ports)\n• P2 (Block 34-38 Multi-Level): 156 Slots Free (Student 2W & Staff 4W, 8 EV ports)\n• P3 (Uni-Mall Plaza): 45 Slots Free\nFree parking with RFID university vehicle sticker.',
          actions: [
            { label: 'Open Parking Hub', action: 'tab', args: ['parking'] },
            { label: 'Route to P2 Multi-Level', action: 'route', args: ['b34-ground', 'Central Multi-Level Parking P2'] }
          ]
        };
      }
    },
    {
      intent: 'heatmap',
      keywords: ['crowd', 'rush', 'heatmap', 'busy', 'density', 'quiet', 'study'],
      handler: (q) => {
        return {
          text: 'Live Crowd Density Hotspots:\n• Central Library Reading Halls: 82% Crowd Density (High rush)\n• Uni-Mall Food Court: 75% Density (Peak lunch hour)\n• Quiet study recommendation: Block 14 2nd Floor Research Foyer or Block 34 Floor 3 Quiet Carrels.',
          actions: [
            { label: 'View Crowd Heatmap', action: 'tab', args: ['heatmap'] },
            { label: 'Route to Quiet Study Zone', action: 'route', args: ['b14-ground', 'Block 14 Social Sciences'] }
          ]
        };
      }
    },
    {
      intent: 'exams',
      keywords: ['exam', 'seat', 'hall', 'admit card', 'roll number', 'roll', 'seating'],
      handler: (q) => {
        return {
          text: 'Enter your 8-digit university roll number in our Exam Hall tab to find your exact exam hall, desk number, floor number, and step-free lift access route.',
          actions: [
            { label: 'Find Exam Hall & Desk', action: 'tab', args: ['exams'] },
            { label: 'Indoor Hall Guide', action: 'tab', args: ['indoor'] }
          ]
        };
      }
    },
    {
      intent: 'stories',
      keywords: ['stories', 'famous', 'tour', 'landmark', 'history', 'spots', 'monuments'],
      handler: (q) => {
        return {
          text: 'Explore our 6 famous campus landmark orientation tours:\n1. Baldev Raj Mittal Unipolis\n2. Shanti Devi Mittal Central Library\n3. Uni-Mall Shopping & Food Plaza\n4. Shanti Devi Mittal Indoor Stadium & Auditorium\n5. Main Gate 1 & Sandstone Boulevard\n6. Block 32 & 34 Tech Quadrangle',
          actions: [
            { label: 'Explore Campus Stories', action: 'tab', args: ['stories'] },
            { label: 'Start Guided Visitor Tour', action: 'tab', args: ['visitor'] }
          ]
        };
      }
    },
    {
      intent: 'accessibility',
      keywords: ['wheelchair', 'accessible', 'ramp', 'lift', 'blind', 'braille', 'disability', 'pwd', 'step free', 'elevator'],
      handler: (q) => {
        return {
          text: 'LPU Pathway is built from the ground up for full accessibility:\n• 100% Step-Free and Covered Route calculation options.\n• Real-time passenger lift status alerts.\n• Voice announcements, Text-to-Speech Read Aloud, and high-contrast WCAG 2.1 AA modes.\n• Braille floor signage in all academic buildings.',
          actions: [
            { label: 'Plan Step-Free Route', action: 'tab', args: ['navigate'] },
            { label: 'View Building Lifts', action: 'tab', args: ['buildings'] }
          ]
        };
      }
    },
    {
      intent: 'directions',
      keywords: ['how to reach', 'how do i go', 'take me to', 'route to', 'directions to', 'where is', 'navigate to'],
      handler: (q) => {
        // try to detect destination
        let destNode = 'b32-ground';
        let destLabel = 'Block 32';
        if (q.includes('38') || q.includes('msb') || q.includes('business')) { destNode = 'b38-ground'; destLabel = 'Block 38'; }
        else if (q.includes('34') || q.includes('library')) { destNode = 'b34-ground'; destLabel = 'Block 34 Central Library'; }
        else if (q.includes('hospital') || q.includes('medical')) { destNode = 'uni-hospital'; destLabel = 'Uni-Hospital'; }
        else if (q.includes('unimall') || q.includes('mall') || q.includes('food')) { destNode = 'uni-mall-entrance'; destLabel = 'Uni-Mall'; }
        else if (q.includes('unipolis')) { destNode = 'unipolis'; destLabel = 'Unipolis Arena'; }
        else if (q.includes('stadium') || q.includes('sports')) { destNode = 'indoor-stadium'; destLabel = 'Indoor Stadium & Auditorium'; }
        else if (q.includes('gate 1') || q.includes('main gate')) { destNode = 'main-gate'; destLabel = 'Main Gate 1'; }
        else if (q.includes('25') || q.includes('it')) { destNode = 'b25-ground'; destLabel = 'Block 25'; }

        return {
          text: `I can guide you step-by-step to ${destLabel}. Click the route button below to view turn-by-turn step-free directions with live distance and voice guidance.`,
          actions: [
            { label: `Route to ${destLabel}`, action: 'route', args: [destNode, destLabel] },
            { label: 'Open Map Navigation', action: 'tab', args: ['navigate'] }
          ]
        };
      }
    }
  ];

  function getFallbackResponse(query) {
    return {
      text: `I understand you're asking about "${query}". I can help you find campus buildings, step-free routes, live queue wait times, today's placement drives, parking availability, or emergency hospital support. What would you like to explore?`,
      actions: [
        { label: 'Route on Map', action: 'tab', args: ['navigate'] },
        { label: 'Placement Drives', action: 'tab', args: ['placements'] },
        { label: 'Queue Wait Times', action: 'tab', args: ['queues'] },
        { label: 'Indoor Navigation', action: 'tab', args: ['indoor'] },
        { label: 'Emergency Support', action: 'tab', args: ['navigate'] }
      ]
    };
  }

  function processQuery(userInput) {
    const q = userInput.toLowerCase().trim();

    // Check greetings
    if (/^(hi|hello|hey|good morning|good afternoon|namaste|greetings)\b/.test(q)) {
      return {
        text: 'Hello! Welcome to LPU Pathway. I am your accessible Campus AI Assistant. How can I assist you with navigation, placement drives, queue times, or building guides today?',
        actions: [
          { label: 'Placement Drives', action: 'tab', args: ['placements'] },
          { label: 'Queue Times', action: 'tab', args: ['queues'] },
          { label: 'Indoor Hall Guide', action: 'tab', args: ['indoor'] },
          { label: 'Emergency Safe Heavens', action: 'route', args: ['uni-hospital', 'Uni-Hospital'] }
        ]
      };
    }

    // Check knowledge base
    for (const item of KNOWLEDGE_BASE) {
      for (const kw of item.keywords) {
        if (q.includes(kw)) {
          return item.handler(q);
        }
      }
    }

    return getFallbackResponse(userInput);
  }

  // ─────────────────────────────────────────────────────────────────
  // UI CONSTRUCTION & INITIALIZATION
  // ─────────────────────────────────────────────────────────────────

  function init() {
    createChatbotDOM();
    bindEvents();
    console.log('[CampusChatbot] AI Campus Assistant initialized.');
  }

  function createChatbotDOM() {
    if (document.getElementById('chatbot-widget-root')) return;

    const root = document.createElement('div');
    root.id = 'chatbot-widget-root';
    root.innerHTML = `
      <!-- Launcher Button -->
      <button type="button" id="chatbot-trigger-btn" class="chatbot-trigger-btn" aria-label="Open LPU Campus AI Assistant Chatbot" aria-expanded="false" title="Ask LPU Campus AI Assistant">
        <span class="chatbot-trigger-icon" aria-hidden="true">AI</span>
        <span class="chatbot-trigger-label">Campus AI</span>
      </button>

      <!-- Chat Window -->
      <div id="chatbot-window" class="chatbot-window" role="dialog" aria-modal="true" aria-label="LPU Campus AI Assistant Chat" aria-hidden="true">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-left">
            <div class="chatbot-avatar" aria-hidden="true">AI</div>
            <div class="chatbot-header-info">
              <h3 class="chatbot-title">LPU Campus AI</h3>
              <span class="chatbot-status">
                <span class="chatbot-status-beacon" aria-hidden="true"></span>
                Online · Instant Campus Guide
              </span>
            </div>
          </div>
          <div class="chatbot-header-actions">
            <button type="button" id="btn-chatbot-voice-toggle" class="chatbot-header-btn" title="Toggle AI voice narration" aria-label="Toggle voice output">
              Voice: Off
            </button>
            <button type="button" id="btn-chatbot-reset" class="chatbot-header-btn" title="Clear chat history" aria-label="Clear chat history">
              Reset
            </button>
            <button type="button" id="btn-chatbot-close" class="chatbot-header-btn" title="Close chat window" aria-label="Close chat window">
              ✕
            </button>
          </div>
        </div>

        <!-- Quick Prompts Bar -->
        <div class="chatbot-quick-bar" role="toolbar" aria-label="Suggested quick questions">
          <button type="button" class="chatbot-chip" data-prompt="Today placement drives and dress code">Placement Drives</button>
          <button type="button" class="chatbot-chip" data-prompt="Where is the fee counter and wait time?">Fee Queue Times</button>
          <button type="button" class="chatbot-chip" data-prompt="How to reach Room 502 in Block 32?">Room 502 Guide</button>
          <button type="button" class="chatbot-chip" data-prompt="Take me to Uni-Hospital emergency">Emergency Hospital</button>
          <button type="button" class="chatbot-chip" data-prompt="Where can I find parking with EV charging?">Parking &amp; EV</button>
          <button type="button" class="chatbot-chip" data-prompt="What is the auto rickshaw fare and stands?">Auto Stands &amp; Fare</button>
          <button type="button" class="chatbot-chip" data-prompt="Tell me about famous campus stories">Campus Stories</button>
        </div>

        <!-- Messages Area -->
        <div id="chatbot-messages" class="chatbot-messages" role="log" aria-live="polite">
          <div class="chat-bubble-wrap bot">
            <div class="chat-bubble">
              <strong>Hello! I am your LPU Campus AI Assistant.</strong><br>
              I can help you navigate step-free routes between blocks, check live queue wait times, indoor floor guides, today's placement drives with dress-code reminders, and 24/7 medical safe heavens. What can I find for you?
            </div>
            <span class="chat-meta">Pathway AI · Online</span>
          </div>
        </div>

        <!-- Input Bar -->
        <form id="chatbot-form" class="chatbot-input-bar" role="search">
          <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Ask about routes, blocks, lifts, queues..." autocomplete="off" aria-label="Message the campus AI assistant" />
          <button type="button" id="btn-chatbot-mic" class="chatbot-mic-btn" title="Dictate message with voice" aria-label="Voice input dictation">
            Mic
          </button>
          <button type="submit" id="btn-chatbot-send" class="chatbot-send-btn" aria-label="Send message">
            Send
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(root);
  }

  function bindEvents() {
    const triggerBtn = document.getElementById('chatbot-trigger-btn');
    const closeBtn = document.getElementById('btn-chatbot-close');
    const resetBtn = document.getElementById('btn-chatbot-reset');
    const voiceBtn = document.getElementById('btn-chatbot-voice-toggle');
    const micBtn = document.getElementById('btn-chatbot-mic');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const quickChips = document.querySelectorAll('.chatbot-chip');

    triggerBtn?.addEventListener('click', toggleWindow);
    closeBtn?.addEventListener('click', closeWindow);
    resetBtn?.addEventListener('click', resetChat);
    voiceBtn?.addEventListener('click', toggleVoiceOutput);
    micBtn?.addEventListener('click', toggleVoiceInput);

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      sendUserMessage(val);
    });

    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.dataset.prompt;
        if (prompt) sendUserMessage(prompt);
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeWindow();
      }
    });
  }

  function toggleWindow() {
    if (isOpen) closeWindow();
    else openWindow();
  }

  function openWindow() {
    isOpen = true;
    const win = document.getElementById('chatbot-window');
    const btn = document.getElementById('chatbot-trigger-btn');
    if (win) {
      win.classList.add('active');
      win.setAttribute('aria-hidden', 'false');
    }
    if (btn) btn.setAttribute('aria-expanded', 'true');
    const input = document.getElementById('chatbot-input');
    if (input) input.focus();
    if (window.announce) announce('Campus AI Assistant opened.', false);
  }

  function closeWindow() {
    isOpen = false;
    const win = document.getElementById('chatbot-window');
    const btn = document.getElementById('chatbot-trigger-btn');
    if (win) {
      win.classList.remove('active');
      win.setAttribute('aria-hidden', 'true');
    }
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function resetChat() {
    const messages = document.getElementById('chatbot-messages');
    if (!messages) return;
    messages.innerHTML = `
      <div class="chat-bubble-wrap bot">
        <div class="chat-bubble">
          <strong>Chat reset.</strong><br>
          I am ready for your next query about campus routes, blocks, placement visits, or queue estimates.
        </div>
        <span class="chat-meta">Pathway AI · Online</span>
      </div>
    `;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (window.announce) announce('Chat cleared.', false);
  }

  function sendUserMessage(text) {
    addMessage('user', text);
    showTypingIndicator();

    setTimeout(() => {
      hideTypingIndicator();
      const response = processQuery(text);
      addMessage('bot', response.text, response.actions);

      if (voiceOutputEnabled) {
        speakText(response.text);
      }
    }, 400);
  }

  function addMessage(sender, text, actions = []) {
    const container = document.getElementById('chatbot-messages');
    if (!container) return;

    const wrap = document.createElement('div');
    wrap.className = `chat-bubble-wrap ${sender}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let actionsHtml = '';
    if (actions && actions.length > 0) {
      actionsHtml = `
        <div class="chat-actions-container">
          ${actions.map((act, i) => {
            const isDanger = act.label.toLowerCase().includes('emergency') || act.label.toLowerCase().includes('call');
            const safeArgs = JSON.stringify(act.args).replace(/"/g, '&quot;');
            return `
              <button type="button" class="chat-action-btn ${isDanger ? 'danger' : ''}" onclick='CampusChatbot.handleAction("${act.action}", ${safeArgs})'>
                ${act.label}
              </button>
            `;
          }).join('')}
        </div>
      `;
    }

    const formattedText = text.replace(/\n/g, '<br>');

    wrap.innerHTML = `
      <div class="chat-bubble">
        ${formattedText}
        ${actionsHtml}
      </div>
      <span class="chat-meta">${sender === 'user' ? 'You' : 'Pathway AI'} · ${time}</span>
    `;

    container.appendChild(wrap);
    container.scrollTop = container.scrollHeight;
  }

  function showTypingIndicator() {
    const container = document.getElementById('chatbot-messages');
    if (!container) return;

    const typing = document.createElement('div');
    typing.id = 'chat-typing-indicator';
    typing.className = 'chat-bubble-wrap bot';
    typing.innerHTML = `
      <div class="chat-typing">
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
      </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  function hideTypingIndicator() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
  }

  function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Strip any HTML tags or action text
    const clean = text.replace(/•/g, '').replace(/\n+/g, '. ').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'en-IN';
    utterance.rate = 0.94;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  function toggleVoiceOutput() {
    voiceOutputEnabled = !voiceOutputEnabled;
    const btn = document.getElementById('btn-chatbot-voice-toggle');
    if (btn) {
      btn.textContent = `Voice: ${voiceOutputEnabled ? 'On' : 'Off'}`;
      btn.classList.toggle('active', voiceOutputEnabled);
    }
    if (!voiceOutputEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (window.announce) {
      announce(`AI voice read aloud ${voiceOutputEnabled ? 'enabled' : 'disabled'}`, false);
    }
  }

  function toggleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const micBtn = document.getElementById('btn-chatbot-mic');
    if (isListening) {
      if (recognition) recognition.stop();
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      if (micBtn) {
        micBtn.classList.add('listening');
        micBtn.textContent = 'Listening...';
      }
      if (window.announce) announce('Listening to your voice prompt...', false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById('chatbot-input');
      if (input) input.value = transcript;
      sendUserMessage(transcript);
    };

    recognition.onerror = () => {
      isListening = false;
      if (micBtn) {
        micBtn.classList.remove('listening');
        micBtn.textContent = 'Mic';
      }
    };

    recognition.onend = () => {
      isListening = false;
      if (micBtn) {
        micBtn.classList.remove('listening');
        micBtn.textContent = 'Mic';
      }
    };

    recognition.start();
  }

  function handleAction(actionType, args) {
    if (!args) args = [];

    switch (actionType) {
      case 'route': {
        const [nodeId, label] = args;
        closeWindow();
        if (window.CampusSmartHub && window.CampusSmartHub.navigateToNode) {
          window.CampusSmartHub.navigateToNode(nodeId, label);
        } else if (window.switchAppTab) {
          window.switchAppTab('navigate');
        }
        break;
      }

      case 'indoor': {
        const [blockKey, floor, roomCode] = args;
        closeWindow();
        if (window.CampusSmartHub && window.CampusSmartHub.guideToPlacementIndoor) {
          window.CampusSmartHub.guideToPlacementIndoor(blockKey, floor, roomCode);
        } else if (window.switchAppTab) {
          window.switchAppTab('indoor');
        }
        break;
      }

      case 'tab': {
        const [tabId] = args;
        closeWindow();
        if (window.switchAppTab) {
          window.switchAppTab(tabId);
        } else if (window.switchToTab) {
          window.switchToTab(tabId);
        } else {
          document.querySelector(`[data-tab="${tabId}"]`)?.click();
        }
        break;
      }

      case 'call': {
        const [phone] = args;
        window.location.href = `tel:${phone}`;
        break;
      }

      case 'listen': {
        const [text] = args;
        speakText(text);
        break;
      }
    }
  }

  return {
    init,
    openWindow,
    closeWindow,
    toggleWindow,
    sendUserMessage,
    resetChat,
    handleAction
  };

})();
