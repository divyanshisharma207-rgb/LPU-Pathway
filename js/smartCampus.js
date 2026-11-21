/**
 * smartCampus.js – LPU Pathway Smart Campus Ecosystem
 * Features:
 * 1. Parking Availability (Staff & Student Vehicles, EV Charging)
 * 2. Crowd Heatmap (Library, Food Courts, Gates, Lifts)
 * 3. Exam Hall Finder (Roll Number, Hall, Seat, Step-Free Route)
 * 4. Event Navigation (Society Fests, Seminars, Directions & Reminders)
 * 5. Visitor Mode (Guided Tours for Parents & First-Year Orientation)
 * 6. Emergency Map Layer (Medical Centers, Security Posts, Fire Exits & Assembly)
 */

'use strict';

window.CampusSmartHub = (() => {

  // ═════════════════════════════════════════════════════════════════
  // 1. PARKING AVAILABILITY SYSTEM
  // ═════════════════════════════════════════════════════════════════
  const PARKING_LOTS = [
    {
      id: 'lot-p1',
      name: 'Gate 1 Faculty & Visitor Parking (P1)',
      location: 'Near Main Gate 1 & University Admin Block',
      nodeId: 'main-gate',
      lat: 31.2554,
      lng: 75.7056,
      category: 'staff',
      types: ['4w', '2w', 'staff', 'visitor'],
      totalSlots: 120,
      occupied: 78,
      slots: { staff4w: 18, student2w: 24, ev: 4 },
      evCharging: true,
      rates: 'Free for Faculty & Registered Visitors'
    },
    {
      id: 'lot-p2',
      name: 'Central Multi-Level Parking Block 34-38 (P2)',
      location: 'Adjacent to Central Library & Mittal School of Business',
      nodeId: 'b34-ground',
      lat: 31.2541,
      lng: 75.7030,
      category: 'student',
      types: ['4w', '2w', 'student', 'staff', 'ev'],
      totalSlots: 350,
      occupied: 194,
      slots: { staff4w: 42, student2w: 110, ev: 8 },
      evCharging: true,
      rates: 'Student RFID & Staff Access'
    },
    {
      id: 'lot-p3',
      name: 'Uni-Mall Shoppers & Dining Parking (P3)',
      location: 'Behind Uni-Mall Commercial & Food Plaza',
      nodeId: 'uni-mall-entrance',
      lat: 31.2545,
      lng: 75.7049,
      category: 'student',
      types: ['4w', '2w', 'student', 'visitor'],
      totalSlots: 180,
      occupied: 135,
      slots: { staff4w: 12, student2w: 33, ev: 2 },
      evCharging: true,
      rates: 'Standard Campus Parking Rules'
    },
    {
      id: 'lot-p4',
      name: 'BH-South Student 2-Wheeler Lot (P4)',
      location: 'Boys Hostel 1–4 Complex Avenue',
      nodeId: 'bh-south',
      lat: 31.2505,
      lng: 75.7035,
      category: 'student',
      types: ['2w', 'student'],
      totalSlots: 260,
      occupied: 165,
      slots: { staff4w: 0, student2w: 95, ev: 12 },
      evCharging: true,
      rates: 'Hostel Resident 2-Wheeler Permit'
    },
    {
      id: 'lot-p5',
      name: 'Gate 2 West Campus Parking (P5)',
      location: 'Near Law & Business Wing (Gate 2 West)',
      nodeId: 'gate-2',
      lat: 31.2522,
      lng: 75.6985,
      category: 'staff',
      types: ['4w', '2w', 'staff', 'student'],
      totalSlots: 140,
      occupied: 86,
      slots: { staff4w: 22, student2w: 32, ev: 3 },
      evCharging: true,
      rates: 'Open for West Sector Commuters'
    },
    {
      id: 'lot-p6',
      name: 'Uni-Hospital Emergency Patient Lot (P6)',
      location: 'Uni-Hospital South Gate Emergency Wing',
      nodeId: 'uni-hospital',
      lat: 31.2514,
      lng: 75.7062,
      category: 'emergency',
      types: ['4w', 'staff', 'emergency'],
      totalSlots: 40,
      occupied: 28,
      slots: { staff4w: 8, student2w: 4, ev: 0 },
      evCharging: false,
      rates: 'Emergency Patients & Ambulance Priority'
    }
  ];

  let parkingLayerGroup = null;

  // ═════════════════════════════════════════════════════════════════
  // 2. CROWD HEATMAP SYSTEM
  // ═════════════════════════════════════════════════════════════════
  const HEATMAP_HOTSPOTS = [
    {
      id: 'heat-library',
      name: 'Central Library (Block 34)',
      nodeId: 'b34-ground',
      lat: 31.2544,
      lng: 75.7036,
      density: 84, // percentage
      status: 'peak',
      waitMinutes: 8,
      peakHours: '11:00 AM – 04:30 PM',
      desc: 'Ground & 1st Floor reading tables near 90% full. 2nd & 3rd Floor quiet zones have 60+ open cubicles.',
      tip: 'Head to Floor 2 for faster seating and quieter study environment.'
    },
    {
      id: 'heat-foodcourt',
      name: 'Uni-Mall Food Court & Plaza',
      nodeId: 'uni-mall-entrance',
      lat: 31.2542,
      lng: 75.7046,
      density: 92,
      status: 'peak',
      waitMinutes: 18,
      peakHours: '12:30 PM – 02:30 PM & 05:00 PM – 07:30 PM',
      desc: 'High rush at central billing counters and Domino’s / Subway outlets.',
      tip: 'Order via campus takeaway apps or visit Block 36 Food Outlet for under 5-min queue.'
    },
    {
      id: 'heat-gate1',
      name: 'Main Gate 1 Turnstiles & Auto Stand',
      nodeId: 'main-gate',
      lat: 31.2558,
      lng: 75.7051,
      density: 72,
      status: 'moderate',
      waitMinutes: 6,
      peakHours: '08:30 AM – 09:30 AM & 04:45 PM – 05:45 PM',
      desc: 'Steady flow of day scholars arriving/departing via GT Road buses and campus e-rickshaws.',
      tip: 'Pedestrian turnstiles 4 & 5 (Wheelchair wide lane) currently have zero wait.'
    },
    {
      id: 'heat-b36',
      name: 'Student Centre & DSW (Block 36)',
      nodeId: 'b36-ground',
      lat: 31.2539,
      lng: 75.7053,
      density: 64,
      status: 'moderate',
      waitMinutes: 7,
      peakHours: '10:30 AM – 03:00 PM',
      desc: 'Moderate student queue for fee clearance and ID card replacements.',
      tip: 'Use LPU Touch app for online requests to bypass physical counter lines.'
    },
    {
      id: 'heat-b32-lifts',
      name: 'Block 32 CSE Atrium & Elevator Hub',
      nodeId: 'b32-ground',
      lat: 31.2538,
      lng: 75.7028,
      density: 88,
      status: 'peak',
      waitMinutes: 10,
      peakHours: 'Between 10-minute lecture intervals',
      desc: 'High elevator demand between classes for floors 2–4.',
      tip: 'Step-free gentle central ramp is faster than waiting 2 cycles for Lift L1.'
    },
    {
      id: 'heat-unipolis',
      name: 'Baldev Raj Mittal Unipolis',
      nodeId: 'unipolis',
      lat: 31.2530,
      lng: 75.7035,
      density: 28,
      status: 'low',
      waitMinutes: 0,
      peakHours: 'Festival days & evening concerts',
      desc: 'Plaza is open, pleasant and clear of crowd congestion.',
      tip: 'Fastest step-free outdoor pathway currently between engineering and hostel sectors.'
    }
  ];

  let heatmapLayerGroup = null;

  // ═════════════════════════════════════════════════════════════════
  // 3. EXAM HALL FINDER SYSTEM
  // ═════════════════════════════════════════════════════════════════
  const SEED_EXAMS = {
    '12201948': {
      roll: '12201948',
      name: 'Aryan Varma',
      program: 'B.Tech Computer Science & Engineering',
      courseCode: 'CSE316',
      courseTitle: 'Operating Systems & System Architecture',
      date: 'Today',
      shift: 'Afternoon (01:30 PM – 04:30 PM)',
      block: 'b32-ground',
      blockLabel: 'Block 32 – Academic Block',
      floor: 'Floor 2',
      hall: 'Hall 204 (West Wing)',
      row: 'Row C',
      seat: 'Desk 14 (Window Side)',
      stepFreeNote: 'Use Lift L-32A (operational) to Floor 2, turn left for Hall 204.'
    },
    '12104523': {
      roll: '12104523',
      name: 'Simran Kaur',
      program: 'MBA – International Business',
      courseCode: 'MGT201',
      courseTitle: 'Corporate Financial Strategy & Valuation',
      date: 'Today',
      shift: 'Morning (09:30 AM – 12:30 PM)',
      block: 'b38-ground',
      blockLabel: 'Block 38 – Mittal School of Business',
      floor: 'Floor 1',
      hall: 'Executive Hall 102',
      row: 'Row B',
      seat: 'Desk 08',
      stepFreeNote: 'Ground ramp connects directly to central corridor lift.'
    },
    '12308911': {
      roll: '12308911',
      name: 'Rohan Sharma',
      program: 'B.Tech Electronics & Comm. Engg.',
      courseCode: 'ECE205',
      courseTitle: 'Digital Signal Processing & Microcontrollers',
      date: 'Tomorrow',
      shift: 'Afternoon (01:30 PM – 04:30 PM)',
      block: 'b27-ground',
      blockLabel: 'Block 27 – ECE Building',
      floor: 'Floor 3',
      hall: 'Exam Hall 308',
      row: 'Row E',
      seat: 'Desk 22',
      stepFreeNote: 'Block 26-27 covered skywalk has elevator access to Floor 3.'
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 4. EVENT NAVIGATION & REMINDERS
  // ═════════════════════════════════════════════════════════════════
  const CAMPUS_EVENTS = [
    {
      id: 'event-yv',
      title: 'Youth Vibe 2026 – Mega Cultural & Arts Festival',
      category: 'cultural',
      society: 'LPU Student Welfare & Cultural Affairs',
      date: 'Nov 24 – Nov 26, 2026',
      time: '10:00 AM Onwards',
      venue: 'Baldev Raj Mittal Unipolis Arena',
      nodeId: 'unipolis',
      desc: 'National inter-university battle of bands, celebrity live concert, fashion choreography and 40+ street dance showdowns.',
      entry: 'Free for All Students (LPU ID Required)',
      badge: 'Major Fest',
      bannerGradient: 'linear-gradient(135deg, #059669, #10b981)'
    },
    {
      id: 'event-techx',
      title: 'TechXplore AI & Autonomous Robotics Hackathon',
      category: 'technical',
      society: 'Google Developer Student Club & Robotics Wing',
      date: 'Tomorrow',
      time: '09:00 AM – 06:00 PM',
      venue: 'Block 25 IT Auditorium & Innovation Labs',
      nodeId: 'b25-ground',
      desc: '36-hour hackathon tackling smart mobility, accessible campus tools, and Generative AI agents. ₹2.5 Lakh prize pool.',
      entry: 'Registered Participants & Spectators',
      badge: 'Hackathon',
      bannerGradient: 'linear-gradient(135deg, #059669, #10b981)'
    },
    {
      id: 'event-oneworld',
      title: 'One World International Culture Carnival',
      category: 'cultural',
      society: 'Division of International Affairs',
      date: 'Nov 28, 2026',
      time: '11:00 AM – 07:00 PM',
      venue: 'Shanti Devi Mittal Indoor Sports Stadium',
      nodeId: 'indoor-stadium',
      desc: 'Students from 50+ nations showcase traditional attires, international street foods, cultural dances and country pavilions.',
      entry: 'Open to All Students & Visitors',
      badge: 'Global Fest',
      bannerGradient: 'linear-gradient(135deg, #059669, #10b981)'
    },
    {
      id: 'event-msb',
      title: 'Global Business & Startup Conclave 2026',
      category: 'academic',
      society: 'Mittal School of Business (MSB)',
      date: 'Dec 02, 2026',
      time: '02:00 PM – 05:30 PM',
      venue: 'Block 38 MSB Auditorium',
      nodeId: 'b38-ground',
      desc: 'Keynote panels with Fortune 500 venture capitalists, Angel investors, and successful student startup founders.',
      entry: 'Pre-Registration on LPU Touch',
      badge: 'Conclave',
      bannerGradient: 'linear-gradient(135deg, #059669, #10b981)'
    },
    {
      id: 'event-moot',
      title: 'All-India National Moot Court Competition',
      category: 'academic',
      society: 'School of Law & Moot Court Society',
      date: 'Dec 05, 2026',
      time: '10:00 AM – 04:00 PM',
      venue: 'Block 37 Moot Court Hall',
      nodeId: 'b37-ground',
      desc: 'Constitutional law debates, mock trials judged by sitting High Court judges and senior legal counsel.',
      entry: 'Open Spectator Seating',
      badge: 'Competition',
      bannerGradient: 'linear-gradient(135deg, #059669, #10b981)'
    }
  ];

  // ═════════════════════════════════════════════════════════════════
  // 5. VISITOR MODE GUIDED TOURS
  // ═════════════════════════════════════════════════════════════════
  const GUIDED_TOURS = [
    {
      id: 'tour-admission',
      title: 'Parent & New Admission Campus Tour',
      subtitle: 'Complete orientation covering university admissions, central facilities, library & hospital',
      stops: [
        {
          index: 1,
          name: 'Main Gate 1 & University Reception',
          nodeId: 'main-gate',
          lat: 31.2558,
          lng: 75.7051,
          walkTime: '0 min (Starting Point)',
          highlights: 'Grand GT Road entrance, visitor pass desk, wheelchair assistance point, electric campus buggy station.',
          audioText: 'Welcome to Lovely Professional University. Main Gate 1 is our flagship entrance on the Grand Trunk Road. Here parents and new admissions can obtain campus passes and board our accessible electric buggies.'
        },
        {
          index: 2,
          name: 'Division of Student Welfare & Admission Cell (Block 32)',
          nodeId: 'b32-ground',
          lat: 31.2538,
          lng: 75.7028,
          walkTime: '4 min walk',
          highlights: 'Central admission verification, student counseling, career guidance, step-free access and ramps.',
          audioText: 'Block 32 is the university academic hub. On the ground floor is the Division of Student Welfare and Admissions Cell, offering step-free access and friendly counselors.'
        },
        {
          index: 3,
          name: 'Shanti Devi Mittal Central Library (Block 34)',
          nodeId: 'b34-ground',
          lat: 31.2544,
          lng: 75.7036,
          walkTime: '3 min walk',
          highlights: '5-storey library, 1.5 million+ book volumes, automated RFID kiosk, digital research labs.',
          audioText: 'Now arriving at the Shanti Devi Mittal Central Library. Spanning five floors, it is one of the largest academic libraries in northern India with air-conditioned reading halls and digital repositories.'
        },
        {
          index: 4,
          name: 'Uni-Mall Student Life & Food Hub',
          nodeId: 'uni-mall-entrance',
          lat: 31.2542,
          lng: 75.7046,
          walkTime: '2 min walk',
          highlights: 'Shopping arcade, food court, banks, ATMs, stationery stores, salon and student amenities.',
          audioText: 'Next is Uni-Mall, the lifestyle and commercial heartbeat of campus, featuring multi-cuisine dining, national banks, and convenience stores.'
        },
        {
          index: 5,
          name: 'Uni-Hospital 24/7 Super-Specialty Healthcare',
          nodeId: 'uni-hospital',
          lat: 31.2512,
          lng: 75.7065,
          walkTime: '5 min walk',
          highlights: '24/7 emergency casualty, ICU, resident medical doctors, subsidized pharmacy, trauma care.',
          audioText: 'Uni-Hospital provides round-the-clock medical care for students and faculty, staffed with 24-hour doctors and ambulance response teams.'
        },
        {
          index: 6,
          name: 'Shanti Devi Mittal Indoor Sports Complex',
          nodeId: 'indoor-stadium',
          lat: 31.2498,
          lng: 75.7052,
          walkTime: '3 min walk',
          highlights: 'Olympic swimming pool, badminton arenas, shooting range, bowling alley, gyms.',
          audioText: 'Our tour concludes at the Indoor Sports Complex, housing an all-weather Olympic swimming pool and world-class athletic facilities.'
        }
      ]
    },
    {
      id: 'tour-firstyear',
      title: 'First-Year Student Orientation Walkthrough',
      subtitle: 'Essential daily navigation for engineering, computing, law & hostel residents',
      stops: [
        {
          index: 1,
          name: 'Main Gate E-Cart Transit Station',
          nodeId: 'main-gate',
          lat: 31.2558,
          lng: 75.7051,
          walkTime: '0 min',
          highlights: 'Hop on free accessible carts or flat ₹10 student e-rickshaws to reach any classroom block.',
          audioText: 'Welcome freshers! The Main Gate transit bay is where campus e-rickshaws and free wheelchair carts depart every three minutes.'
        },
        {
          index: 2,
          name: 'Student Welfare & Clubs Centre (Block 36)',
          nodeId: 'b36-ground',
          lat: 31.2539,
          lng: 75.7053,
          walkTime: '4 min walk',
          highlights: 'Student organizations, cultural clubs, NSS, NCC, ID card printing, fee counters.',
          audioText: 'Block 36 is where university student clubs, sports federations, and the department of student welfare reside.'
        },
        {
          index: 3,
          name: 'Academic Complex (Blocks 25 to 29)',
          nodeId: 'b25-ground',
          lat: 31.2546,
          lng: 75.7018,
          walkTime: '5 min walk',
          highlights: 'CSE, IT, ECE, Aerospace & Mechanical blocks connected via covered, step-free corridors.',
          audioText: 'Blocks 25 through 29 form the engineering quadrangle, interconnected by shaded all-weather covered walkways.'
        },
        {
          index: 4,
          name: 'Baldev Raj Mittal Unipolis Arena',
          nodeId: 'unipolis',
          lat: 31.2530,
          lng: 75.7035,
          walkTime: '3 min walk',
          highlights: '10,000-seat amphitheatre, Youth Vibe concerts, fresher welcome parties, outdoor dining.',
          audioText: 'Unipolis is LPU’s iconic open amphitheatre where thousands gather for cultural fests and concerts.'
        },
        {
          index: 5,
          name: 'Hostel Residential Zone (BH & GH Complex)',
          nodeId: 'bh-south',
          lat: 31.2505,
          lng: 75.7035,
          walkTime: '4 min walk',
          highlights: 'Hostel wardens, study rooms, night canteens, laundromats, step-free ramps.',
          audioText: 'Finally, the residential hostel avenues provide night cafeterias, automated laundries, and secure living spaces.'
        }
      ]
    }
  ];

  let currentTourId = 'tour-admission';
  let currentTourStopIdx = 0;

  // ═════════════════════════════════════════════════════════════════
  // 6. EMERGENCY MAP LAYER & SAFE HAVENS
  // ═════════════════════════════════════════════════════════════════
  const EMERGENCY_POSTS = [
    {
      id: 'em-hospital',
      name: 'Uni-Hospital 24/7 Trauma & Emergency ICU',
      type: 'medical',
      nodeId: 'uni-hospital',
      lat: 31.2512,
      lng: 75.7065,
      phone: '+91 1824 404040',
      badge: '24/7 Ambulance Bay',
      icon: '',
      desc: 'Immediate emergency triage, ICU, medical doctor on-duty, wheelchair access, trauma treatment.'
    },
    {
      id: 'em-security-main',
      name: 'Chief Security Control Room & Quick Response Team',
      type: 'security',
      nodeId: 'main-gate',
      lat: 31.2556,
      lng: 75.7048,
      phone: '+91 1824 404040',
      badge: 'Patrol Dispatch',
      icon: '',
      desc: 'Central security surveillance, 24/7 emergency patrol vehicle dispatch, gate control.'
    },
    {
      id: 'em-security-gate2',
      name: 'Gate 2 West Sector Security Post',
      type: 'security',
      nodeId: 'gate-2',
      lat: 31.2520,
      lng: 75.6980,
      phone: '+91 1824 404040',
      badge: 'Security Post',
      icon: '',
      desc: 'West campus security post, night escort support, quick assistance.'
    },
    {
      id: 'em-firstaid-b36',
      name: 'Student Centre First-Aid & AED Station',
      type: 'medical',
      nodeId: 'b36-ground',
      lat: 31.2539,
      lng: 75.7053,
      phone: '+91 1824 404040',
      badge: 'First-Aid Post',
      icon: '',
      desc: 'Defibrillator (AED), medical stretcher, certified nursing assistance, first-aid kits.'
    },
    {
      id: 'em-assembly-plaza',
      name: 'Fire Safe Assembly Area 1 (Central Plaza Lawn)',
      type: 'assembly',
      nodeId: 'food-court',
      lat: 31.2540,
      lng: 75.7040,
      phone: 'N/A (Evacuation Zone)',
      badge: 'Safe Assembly Area',
      icon: '',
      desc: 'Wide open green lawns designated for building evacuation during earthquake or fire alarms.'
    },
    {
      id: 'em-assembly-sports',
      name: 'Fire Safe Assembly Area 2 (South Sports Ground)',
      type: 'assembly',
      nodeId: 'indoor-stadium',
      lat: 31.2495,
      lng: 75.7048,
      phone: 'N/A (Evacuation Zone)',
      badge: 'Safe Assembly Area',
      icon: '',
      desc: 'South sector open athletic field for hostel and indoor complex evacuation.'
    }
  ];

  let emergencyLayerGroup = null;

  // ═════════════════════════════════════════════════════════════════
  // INITIALIZATION & EVENT WIRING
  // ═════════════════════════════════════════════════════════════════
  function init() {
    renderParkingSection();
    renderHeatmapSection();
    renderExamsSection();
    renderEventsSection();
    renderVisitorSection();
    renderEmergencySection();
    renderIndoorSection();
    renderQueuesSection();
    renderStoriesSection();
    wireMapToolbarButtons();
    wireQuickLaunchers();
    console.log('[CampusSmartHub] Smart Campus features initialized.');
  }

  // ─────────────────────────────────────────────────────────────────
  // UI RENDERERS
  // ─────────────────────────────────────────────────────────────────

  function renderParkingSection() {
    const container = document.getElementById('parking-container');
    if (!container) return;

    let html = `
      <div class="parking-filter-bar">
        <button class="filter-chip active" data-filter="all">All Lots (${PARKING_LOTS.length})</button>
        <button class="filter-chip" data-filter="student">Student Lots</button>
        <button class="filter-chip" data-filter="staff">Staff Only</button>
        <button class="filter-chip" data-filter="ev">EV Charging</button>
        <button class="filter-chip" data-filter="2w">2-Wheeler</button>
        <button class="filter-chip" data-filter="4w">4-Wheeler</button>
      </div>
      <div class="parking-grid" id="parking-cards-grid">
    `;

    PARKING_LOTS.forEach(lot => {
      const freeSlots = lot.totalSlots - lot.occupied;
      const pctFree = Math.round((freeSlots / lot.totalSlots) * 100);
      const statusClass = pctFree > 35 ? 'available' : (pctFree > 10 ? 'filling' : 'full');
      const statusText = pctFree > 35 ? `${freeSlots} Slots Free` : (pctFree > 10 ? 'Filling Fast' : 'Almost Full');

      html += `
        <div class="parking-card" data-lot-id="${lot.id}" data-category="${lot.category}" data-ev="${lot.evCharging}">
          <div>
            <div class="parking-header">
              <div>
                <h3 class="parking-title">${lot.name}</h3>
                <div class="parking-location">${lot.location}</div>
              </div>
              <span class="parking-status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="parking-slots-grid">
              <div class="slot-stat">
                <span class="slot-num">${lot.slots.staff4w}</span>
                <span class="slot-label">Staff 4W</span>
              </div>
              <div class="slot-stat">
                <span class="slot-num">${lot.slots.student2w}</span>
                <span class="slot-label">Student 2W</span>
              </div>
              <div class="slot-stat">
                <span class="slot-num">${lot.slots.ev}</span>
                <span class="slot-label">EV Ports</span>
              </div>
            </div>
            <p style="font-size:0.75rem; color:#64748b; margin:0 0 0.85rem;"><strong>Access:</strong> ${lot.rates}</p>
          </div>
          <button type="button" class="btn-route-parking" onclick="CampusSmartHub.navigateToNode('${lot.nodeId}', '${lot.name}')">
            Navigate to Parking
          </button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Filter clicks
    container.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        container.querySelectorAll('.parking-card').forEach(card => {
          if (filter === 'all') {
            card.style.display = 'flex';
          } else if (filter === 'ev') {
            card.style.display = card.dataset.ev === 'true' ? 'flex' : 'none';
          } else {
            card.style.display = card.dataset.category.includes(filter) ? 'flex' : 'none';
          }
        });
      });
    });
  }

  function renderHeatmapSection() {
    const container = document.getElementById('heatmap-container');
    if (!container) return;

    let html = `
      <div class="heatmap-status-banner">
        <div>
          <strong style="color:#1e3a8a;">Live LPU Foot Traffic &amp; Queue Estimator</strong>
          <div style="font-size:0.8rem; color:#475569;">Updated every 5 mins based on Wi-Fi density &amp; counter check-ins</div>
        </div>
        <div class="heatmap-legend">
          <div class="legend-item"><span class="legend-dot low"></span> Low (&lt;40%)</div>
          <div class="legend-item"><span class="legend-dot moderate"></span> Moderate (40-75%)</div>
          <div class="legend-item"><span class="legend-dot peak"></span> Peak Rush (&gt;75%)</div>
        </div>
      </div>
      <div class="crowd-cards-grid">
    `;

    HEATMAP_HOTSPOTS.forEach(spot => {
      const fillClass = spot.status === 'peak' ? 'peak' : (spot.status === 'moderate' ? 'moderate' : 'low');
      html += `
        <div class="crowd-card ${fillClass}">
          <div class="crowd-card-header">
            <div>
              <h3 class="crowd-zone-title">${spot.name}</h3>
              <span style="font-size:0.75rem; color:#64748b;">Peak Hours: ${spot.peakHours}</span>
            </div>
            <span class="parking-status-badge ${spot.status === 'low' ? 'available' : (spot.status === 'moderate' ? 'filling' : 'full')}">
              ${spot.density}% Busy
            </span>
          </div>
          <div class="crowd-density-meter">
            <div class="crowd-density-fill ${fillClass}" style="width: ${spot.density}%"></div>
          </div>
          <div class="crowd-metrics">
            <span>Estimated Queue: <strong>${spot.waitMinutes} mins</strong></span>
            <span>Capacity Status: <strong>${spot.status.toUpperCase()}</strong></span>
          </div>
          <div class="crowd-tip">
            <strong>Crowd Tip:</strong> ${spot.tip}
          </div>
          <button type="button" class="btn btn-outline btn-sm" style="width:100%;" onclick="CampusSmartHub.navigateToNode('${spot.nodeId}', '${spot.name}')">
            View on Map / Route Here
          </button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  function renderExamsSection() {
    const container = document.getElementById('exams-container');
    if (!container) return;

    container.innerHTML = `
      <div class="exam-search-box">
        <label for="exam-roll-input" class="exam-search-label">
          Enter Your LPU Registration / Roll Number
        </label>
        <p style="font-size:0.85rem; color:#166534; margin:0 0 0.85rem;">
          Get your exact allocated Examination Block, Floor, Room, Seat Number, and step-free navigation route.
        </p>
        <div class="exam-input-group">
          <input type="text" id="exam-roll-input" class="exam-input" placeholder="e.g. 12201948 or 12104523" value="12201948" aria-label="LPU Roll Number" />
          <button type="button" id="btn-search-exam" class="btn-exam-search">
            Find My Exam Hall
          </button>
        </div>
        <div style="font-size:0.75rem; color:#4b7c59; margin-top:0.5rem;">
          Try sample roll numbers: <a href="#" onclick="document.getElementById('exam-roll-input').value='12201948'; document.getElementById('btn-search-exam').click(); return false;">12201948</a>, <a href="#" onclick="document.getElementById('exam-roll-input').value='12104523'; document.getElementById('btn-search-exam').click(); return false;">12104523</a>, or <a href="#" onclick="document.getElementById('exam-roll-input').value='12308911'; document.getElementById('btn-search-exam').click(); return false;">12308911</a>
        </div>
      </div>
      <div id="exam-result-area"></div>
    `;

    const searchBtn = container.querySelector('#btn-search-exam');
    const input = container.querySelector('#exam-roll-input');
    if (searchBtn && input) {
      searchBtn.addEventListener('click', () => lookupExamHall(input.value.trim()));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') lookupExamHall(input.value.trim());
      });
      // Run initial search
      lookupExamHall('12201948');
    }
  }

  function lookupExamHall(roll) {
    const resultArea = document.getElementById('exam-result-area');
    if (!resultArea) return;

    if (!roll) {
      resultArea.innerHTML = `<div class="alert-banner" role="alert" style="display:flex;"><span>Please enter your 8-digit LPU Roll Number.</span></div>`;
      return;
    }

    // Lookup in seeds or deterministically generate for any roll number
    let exam = SEED_EXAMS[roll];
    if (!exam) {
      // Deterministic generator so students can enter ANY roll number
      const num = parseInt(roll.replace(/\D/g, '') || '12345678', 10);
      const blocks = ['b32-ground', 'b25-ground', 'b26-ground', 'b27-ground', 'b33-ground', 'b37-ground', 'b38-ground'];
      const blockLabels = ['Block 32 – Academic', 'Block 25 – Computer App', 'Block 26 – CSE', 'Block 27 – ECE', 'Block 33 – Agriculture', 'Block 37 – Law', 'Block 38 – MSB'];
      const bIdx = num % blocks.length;
      const floorNum = (num % 3) + 1;
      const roomNum = floorNum * 100 + (num % 18) + 1;
      const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const row = rowLetters[num % rowLetters.length];
      const seatNum = (num % 30) + 1;
      const courses = [
        { code: 'CSE316', title: 'Operating Systems & System Architecture' },
        { code: 'CAP204', title: 'Data Structures & Algorithms in C++' },
        { code: 'MTH108', title: 'Differential Equations & Linear Algebra' },
        { code: 'MGT201', title: 'Financial Management & Decision Modeling' },
        { code: 'ECE205', title: 'Analog Circuits & Semiconductor Devices' }
      ];
      const course = courses[num % courses.length];

      exam = {
        roll: roll,
        name: `LPU Student #${roll.slice(-4)}`,
        program: 'Undergraduate Degree Program',
        courseCode: course.code,
        courseTitle: course.title,
        date: 'Today',
        shift: (num % 2 === 0) ? 'Afternoon (01:30 PM – 04:30 PM)' : 'Morning (09:30 AM – 12:30 PM)',
        block: blocks[bIdx],
        blockLabel: blockLabels[bIdx],
        floor: `Floor ${floorNum}`,
        hall: `Hall ${roomNum}`,
        row: `Row ${row}`,
        seat: `Desk ${seatNum < 10 ? '0' + seatNum : seatNum}`,
        stepFreeNote: `Accessible via Central Lift to Floor ${floorNum}. Step-free corridor ramps verified.`
      };
    }

    resultArea.innerHTML = `
      <div class="exam-card-result">
        <div class="exam-card-header">
          <div>
            <h3 style="margin:0; font-size:1.15rem; font-weight:800;">Official LPU Examination Allocation</h3>
            <span style="font-size:0.8rem; opacity:0.9;">Roll No: <strong>${exam.roll}</strong> • ${exam.name}</span>
          </div>
          <span style="background:rgba(255,255,255,0.25); padding:4px 10px; border-radius:999px; font-size:0.75rem; font-weight:700;">
            ${exam.date}
          </span>
        </div>
        <div class="exam-card-body">
          <div class="exam-seat-callout">
            <div class="seat-title">YOUR ASSIGNED EXAM HALL &amp; DESK</div>
            <div class="seat-number">${exam.hall} • ${exam.row} - ${exam.seat}</div>
            <div style="font-weight:700; color:#92400e; font-size:0.95rem;">${exam.blockLabel} (${exam.floor})</div>
          </div>

          <div class="exam-details-grid">
            <div class="exam-detail-item">
              <div class="exam-detail-label">Course / Subject</div>
              <div class="exam-detail-val">${exam.courseCode}</div>
              <div style="font-size:0.78rem; color:#64748b; margin-top:2px;">${exam.courseTitle}</div>
            </div>
            <div class="exam-detail-item">
              <div class="exam-detail-label">Reporting Shift</div>
              <div class="exam-detail-val">${exam.shift}</div>
              <div style="font-size:0.78rem; color:#64748b; margin-top:2px;">Gates close 15 mins prior</div>
            </div>
            <div class="exam-detail-item">
              <div class="exam-detail-label">Step-Free Accessibility</div>
              <div class="exam-detail-val" style="color:#16a34a;">Step-Free Lift Verified</div>
              <div style="font-size:0.78rem; color:#64748b; margin-top:2px;">${exam.stepFreeNote}</div>
            </div>
          </div>

          <button type="button" class="btn btn-primary btn-large" style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="CampusSmartHub.routeToExam('${exam.block}', '${exam.hall}')">
            Route to My Exam Hall (${exam.blockLabel})
          </button>
        </div>
      </div>
    `;
  }

  function renderEventsSection() {
    const container = document.getElementById('events-container');
    if (!container) return;

    let html = `
      <div class="events-filter-bar">
        <button class="filter-chip active" data-filter="all">All Events (${CAMPUS_EVENTS.length})</button>
        <button class="filter-chip" data-filter="cultural">Cultural &amp; Fests</button>
        <button class="filter-chip" data-filter="technical">Tech &amp; AI</button>
        <button class="filter-chip" data-filter="academic">Conclaves &amp; Seminars</button>
      </div>
      <div class="events-list-grid" id="events-cards-grid">
    `;

    CAMPUS_EVENTS.forEach(ev => {
      html += `
        <div class="event-card" data-category="${ev.category}">
          <div>
            <div class="event-card-banner" style="background:${ev.bannerGradient}">
              <span class="event-badge">${ev.badge}</span>
              <span style="font-size:0.8rem; font-weight:700;">${ev.date}</span>
            </div>
            <div class="event-card-body">
              <h3 class="event-title">${ev.title}</h3>
              <div class="event-meta-line">
                <strong>Venue:</strong> ${ev.venue}
              </div>
              <div class="event-meta-line">
                <strong>Time:</strong> ${ev.time}
              </div>
              <div class="event-meta-line">
                <strong>Organized by:</strong> <span style="font-size:0.78rem;">${ev.society}</span>
              </div>
              <p class="event-desc">${ev.desc}</p>
              <div style="font-size:0.75rem; color:#475569; font-weight:600;">
                Entry: ${ev.entry}
              </div>
            </div>
          </div>
          <div class="event-actions">
            <button type="button" class="btn-event-remind" onclick="CampusSmartHub.addEventReminder('${ev.id}')">
              Set Reminder
            </button>
            <button type="button" class="btn-event-route" onclick="CampusSmartHub.navigateToNode('${ev.nodeId}', '${ev.title}')">
              Take Me There
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        container.querySelectorAll('.event-card').forEach(card => {
          card.style.display = (f === 'all' || card.dataset.category === f) ? 'flex' : 'none';
        });
      });
    });
  }

  function renderVisitorSection() {
    const container = document.getElementById('visitor-container');
    if (!container) return;

    const tour = GUIDED_TOURS.find(t => t.id === currentTourId) || GUIDED_TOURS[0];
    const stop = tour.stops[currentTourStopIdx] || tour.stops[0];

    container.innerHTML = `
      <div class="visitor-tours-nav">
        ${GUIDED_TOURS.map(t => `
          <div class="visitor-tour-pill ${t.id === currentTourId ? 'active' : ''}" onclick="CampusSmartHub.selectTour('${t.id}')">
            <span class="tour-name">${t.title}</span>
            <span class="tour-stops-count">${t.stops.length} Guided Stops • ${t.subtitle}</span>
          </div>
        `).join('')}
      </div>

      <div class="visitor-hud-card">
        <div class="visitor-hud-progress">
          <span class="tour-step-badge">Stop ${stop.index} of ${tour.stops.length}</span>
          <span style="font-size:0.82rem; font-weight:700; color:#0284c7;">Walk Time: ${stop.walkTime}</span>
        </div>
        <h3 class="visitor-hud-title">${stop.name}</h3>
        <p class="visitor-hud-desc">${stop.highlights}</p>
        <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:0.75rem 1rem; margin-bottom:1.25rem; font-size:0.85rem; color:#0369a1;">
          <strong>Audio Tour Guide:</strong> "${stop.audioText}"
        </div>
        <div class="visitor-hud-controls">
          <button type="button" class="btn-tour-nav btn-tour-audio" onclick="CampusSmartHub.readTourStop()">
            Listen Audio Guide
          </button>
          <button type="button" class="btn-tour-nav" style="background:#0284c7; color:#fff;" onclick="CampusSmartHub.navigateToNode('${stop.nodeId}', '${stop.name}')">
            View Stop on Map
          </button>
          <div style="margin-left:auto; display:flex; gap:0.5rem;">
            <button type="button" class="btn-tour-nav btn-tour-prev" ${currentTourStopIdx === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="CampusSmartHub.prevTourStop()">
              ← Previous Stop
            </button>
            <button type="button" class="btn-tour-nav btn-tour-next" ${currentTourStopIdx === tour.stops.length - 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="CampusSmartHub.nextTourStop()">
              Next Stop →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderEmergencySection() {
    const container = document.getElementById('emergency-container');
    if (!container) return;

    let html = `
      <div class="emergency-hub-banner">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:0.4rem;">
          <h3 style="margin:0; font-size:1.25rem; font-weight:800; color:#991b1b;">Campus Safety, Emergency Posts &amp; Evacuation Assembly</h3>
        </div>
        <p style="font-size:0.85rem; color:#7f1d1d; margin:0 0 0.85rem;">
          In case of fire, medical trauma, or campus hazard, head immediately to the nearest designated Safe Haven below.
        </p>
        <button type="button" class="btn btn-outline" style="background:#fff; border-color:#ef6351; color:#ef6351; font-weight:800;" onclick="CampusSmartHub.routeToNearestEmergency()">
          Find &amp; Route to Nearest Safe Haven From My Position
        </button>
      </div>

      <div class="emergency-posts-grid">
    `;

    EMERGENCY_POSTS.forEach(post => {
      const cardType = post.type === 'medical' ? 'medical' : (post.type === 'security' ? 'security' : 'assembly');
      html += `
        <div class="emergency-post-card ${cardType}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.5rem;">+</span>
              <h4 style="margin:0; font-size:1.05rem; font-weight:800;">${post.name}</h4>
            </div>
            <span class="parking-status-badge available" style="background:#fee2e2; color:#991b1b; border-color:#fca5a5;">
              ${post.badge}
            </span>
          </div>
          <p style="font-size:0.82rem; color:#475569; margin:0 0 0.75rem; line-height:1.4;">${post.desc}</p>
          <div style="font-size:0.78rem; color:#1e293b; font-weight:700; margin-bottom:0.5rem;">
            Direct Line: <a href="tel:${post.phone}" style="color:#ef6351;">${post.phone}</a>
          </div>
          <button type="button" class="btn-emergency-route-safe" onclick="CampusSmartHub.navigateToNode('${post.nodeId}', '${post.name}')">
            Route to This Safe Haven
          </button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  // ─────────────────────────────────────────────────────────────────
  // LEAFLET MAP LAYERS (Toggled from Map Controls toolbar)
  // ─────────────────────────────────────────────────────────────────

  function wireMapToolbarButtons() {
    const btnHeatmap = document.getElementById('btn-toggle-heatmap');
    const btnParking = document.getElementById('btn-toggle-parking');
    const btnEmergency = document.getElementById('btn-toggle-emergency');

    if (btnHeatmap) {
      btnHeatmap.addEventListener('click', () => {
        const isActive = btnHeatmap.classList.toggle('active-layer');
        btnHeatmap.setAttribute('aria-pressed', isActive);
        toggleHeatmapLayer(isActive);
      });
    }

    if (btnParking) {
      btnParking.addEventListener('click', () => {
        const isActive = btnParking.classList.toggle('active-layer');
        btnParking.setAttribute('aria-pressed', isActive);
        toggleParkingLayer(isActive);
      });
    }

    if (btnEmergency) {
      btnEmergency.addEventListener('click', () => {
        const isActive = btnEmergency.classList.toggle('active-emergency');
        btnEmergency.setAttribute('aria-pressed', isActive);
        toggleEmergencyLayer(isActive);
      });
    }
  }

  function toggleHeatmapLayer(show) {
    const map = window.CampusMap ? window.CampusMap.getMap() : null;
    if (!map || typeof L === 'undefined') return;

    if (!heatmapLayerGroup) {
      heatmapLayerGroup = L.layerGroup();
      HEATMAP_HOTSPOTS.forEach(spot => {
        const color = spot.status === 'peak' ? '#ef4444' : (spot.status === 'moderate' ? '#f59e0b' : '#22c55e');
        const radius = spot.status === 'peak' ? 65 : (spot.status === 'moderate' ? 50 : 38);

        // Radiant pulsing circle
        const circle = L.circle([spot.lat, spot.lng], {
          radius: radius,
          color: color,
          fillColor: color,
          fillOpacity: 0.38,
          weight: 2
        });

        // Center dot
        const dot = L.circleMarker([spot.lat, spot.lng], {
          radius: 8,
          color: '#ffffff',
          fillColor: color,
          fillOpacity: 1,
          weight: 2
        });

        const popupContent = `
          <div class="smart-map-popup">
            <h4>${spot.name}</h4>
            <p><strong>Crowd Density:</strong> ${spot.density}% (${spot.status.toUpperCase()})<br>
            <strong>Queue Wait:</strong> ~${spot.waitMinutes} mins<br>
            <em>${spot.tip}</em></p>
            <button class="popup-btn" onclick="CampusSmartHub.navigateToNode('${spot.nodeId}', '${spot.name}')">Route Here</button>
          </div>
        `;
        circle.bindPopup(popupContent);
        dot.bindPopup(popupContent);

        circle.addTo(heatmapLayerGroup);
        dot.addTo(heatmapLayerGroup);
      });
    }

    if (show) {
      map.addLayer(heatmapLayerGroup);
      if (window.announce) announce('Crowd heatmap layer activated on map.', false);
    } else {
      map.removeLayer(heatmapLayerGroup);
    }
  }

  function toggleParkingLayer(show) {
    const map = window.CampusMap ? window.CampusMap.getMap() : null;
    if (!map || typeof L === 'undefined') return;

    if (!parkingLayerGroup) {
      parkingLayerGroup = L.layerGroup();
      PARKING_LOTS.forEach(lot => {
        const freeSlots = lot.totalSlots - lot.occupied;
        const iconHtml = `<div class="smart-map-marker parking" title="${lot.name}">P</div>`;
        const icon = L.divIcon({
          html: iconHtml,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([lot.lat, lot.lng], { icon });
        const popupContent = `
          <div class="smart-map-popup">
            <h4>${lot.name}</h4>
            <p><strong>Available:</strong> ${freeSlots} / ${lot.totalSlots} Slots Free<br>
            Staff 4W: ${lot.slots.staff4w} | Student 2W: ${lot.slots.student2w} | EV: ${lot.slots.ev} ports<br>
            <em>${lot.rates}</em></p>
            <button class="popup-btn" onclick="CampusSmartHub.navigateToNode('${lot.nodeId}', '${lot.name}')">Navigate to Lot</button>
          </div>
        `;
        marker.bindPopup(popupContent);
        marker.addTo(parkingLayerGroup);
      });
    }

    if (show) {
      map.addLayer(parkingLayerGroup);
      if (window.announce) announce('Parking availability layer active on map.', false);
    } else {
      map.removeLayer(parkingLayerGroup);
    }
  }

  function toggleEmergencyLayer(show) {
    const map = window.CampusMap ? window.CampusMap.getMap() : null;
    if (!map || typeof L === 'undefined') return;

    if (!emergencyLayerGroup) {
      emergencyLayerGroup = L.layerGroup();
      EMERGENCY_POSTS.forEach(post => {
        const iconHtml = `<div class="smart-map-marker emergency" title="${post.name}">+</div>`;
        const icon = L.divIcon({
          html: iconHtml,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker([post.lat, post.lng], { icon });
        const popupContent = `
          <div class="smart-map-popup">
            <h4 style="color:#ef6351;">${post.name}</h4>
            <p><strong>Type:</strong> ${post.badge}<br>
            <strong>24/7 Phone:</strong> <a href="tel:${post.phone}">${post.phone}</a><br>
            ${post.desc}</p>
            <button class="popup-btn" style="background:#ef6351;" onclick="CampusSmartHub.navigateToNode('${post.nodeId}', '${post.name}')">Emergency Route Here</button>
          </div>
        `;
        marker.bindPopup(popupContent);
        marker.addTo(emergencyLayerGroup);
      });
    }

    if (show) {
      map.addLayer(emergencyLayerGroup);
      if (window.announce) announce('Emergency Medical & Security Safe Haven layer active.', false);
    } else {
      map.removeLayer(emergencyLayerGroup);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // QUICK LAUNCHERS (On Navigate Tab)
  // ─────────────────────────────────────────────────────────────────
  function wireQuickLaunchers() {
    document.querySelectorAll('[data-smart-launch]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const feature = card.dataset.smartLaunch;
        switch (feature) {
          case 'parking':
            window.switchTabTo ? window.switchTabTo('parking') : document.querySelector('[data-tab="parking"]')?.click();
            break;
          case 'heatmap':
            window.switchTabTo ? window.switchTabTo('heatmap') : document.querySelector('[data-tab="heatmap"]')?.click();
            break;
          case 'exams':
            window.switchTabTo ? window.switchTabTo('exams') : document.querySelector('[data-tab="exams"]')?.click();
            break;
          case 'events':
            window.switchTabTo ? window.switchTabTo('events') : document.querySelector('[data-tab="events"]')?.click();
            break;
          case 'visitor':
            window.switchTabTo ? window.switchTabTo('visitor') : document.querySelector('[data-tab="visitor"]')?.click();
            break;
          case 'indoor':
            window.switchTabTo ? window.switchTabTo('indoor') : document.querySelector('[data-tab="indoor"]')?.click();
            break;
          case 'queues':
            window.switchTabTo ? window.switchTabTo('queues') : document.querySelector('[data-tab="queues"]')?.click();
            break;
          case 'stories':
            window.switchTabTo ? window.switchTabTo('stories') : document.querySelector('[data-tab="stories"]')?.click();
            break;
          case 'emergency':
            // Toggle emergency layer on map and switch to map view
            window.switchTabTo ? window.switchTabTo('navigate') : document.querySelector('[data-tab="navigate"]')?.click();
            const btnEm = document.getElementById('btn-toggle-emergency');
            if (btnEm && !btnEm.classList.contains('active-emergency')) {
              btnEm.click();
            }
            break;
        }
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // ACTIONS & NAVIGATION HELPERS
  // ─────────────────────────────────────────────────────────────────

  function navigateToNode(nodeId, label) {
    // Switch to navigate tab
    const navTab = document.querySelector('[data-tab="navigate"]');
    if (navTab) navTab.click();

    setTimeout(() => {
      const toSelect = document.getElementById('to-select');
      const fromSelect = document.getElementById('from-select');
      if (toSelect) {
        toSelect.value = nodeId;
      }
      if (fromSelect && !fromSelect.value) {
        // default from Main Gate or live GPS
        fromSelect.value = 'main-gate';
      }

      // Trigger find route
      const findBtn = document.getElementById('find-route-btn');
      if (findBtn) {
        findBtn.click();
      }

      // Announce
      if (window.announce) announce(`Routing to ${label}`, true);
    }, 200);
  }

  function routeToExam(blockId, hallLabel) {
    navigateToNode(blockId, hallLabel);
  }

  function selectTour(tourId) {
    currentTourId = tourId;
    currentTourStopIdx = 0;
    renderVisitorSection();
  }

  function nextTourStop() {
    const tour = GUIDED_TOURS.find(t => t.id === currentTourId);
    if (!tour) return;
    if (currentTourStopIdx < tour.stops.length - 1) {
      currentTourStopIdx++;
      renderVisitorSection();
    }
  }

  function prevTourStop() {
    if (currentTourStopIdx > 0) {
      currentTourStopIdx--;
      renderVisitorSection();
    }
  }

  function readTourStop() {
    const tour = GUIDED_TOURS.find(t => t.id === currentTourId);
    if (!tour) return;
    const stop = tour.stops[currentTourStopIdx];
    if (!stop || !('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // stop any current speech
    const utterance = new SpeechSynthesisUtterance(stop.audioText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    if (window.announce) announce(`Reading tour guide for ${stop.name}`, false);
  }

  function addEventReminder(eventId) {
    const ev = CAMPUS_EVENTS.find(e => e.id === eventId);
    if (!ev) return;

    // Create a calendar .ics file for download
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LPU Pathway//Campus Events//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:${ev.desc} | Venue: ${ev.venue} (${ev.time})`,
      `LOCATION:${ev.venue}, Lovely Professional University, Phagwara`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ev.id}-reminder.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.announce) announce(`Reminder saved for ${ev.title}. Event file downloaded.`, true);
  }

  function routeToNearestEmergency() {
    // Determine closest emergency facility to current GPS coordinates or main gate
    let userLat = 31.2536;
    let userLng = 75.7037;

    if (window.CampusGPS && window.CampusGPS.getCurrentCoords) {
      const coords = window.CampusGPS.getCurrentCoords();
      if (coords && coords.lat && coords.lng) {
        userLat = coords.lat;
        userLng = coords.lng;
      }
    }

    // Find closest post
    let closestPost = EMERGENCY_POSTS[0];
    let minDist = Infinity;

    EMERGENCY_POSTS.forEach(post => {
      const dist = Math.hypot(post.lat - userLat, post.lng - userLng);
      if (dist < minDist) {
        minDist = dist;
        closestPost = post;
      }
    });

    navigateToNode(closestPost.nodeId, closestPost.name);
  }

  // ═════════════════════════════════════════════════════════════════
  // 7. INDOOR NAVIGATION SYSTEM (Floor-by-Floor & Rooms)
  // ═════════════════════════════════════════════════════════════════
  const INDOOR_BLOCKS = {
    'b32': {
      id: 'b32',
      name: 'Block 32 – Academic Block (CSE & Tech)',
      nodeId: 'b32-ground',
      floors: [0, 1, 2, 3, 4, 5],
      lifts: [
        { id: 'L-32A', name: 'Lift L-32A (North Wing)', status: 'Operational', floors: [0, 1, 2, 3, 4, 5], accessible: true, notes: 'Voice announcements and Braille buttons.' },
        { id: 'L-32B', name: 'Lift L-32B (South Wing)', status: 'Operational', floors: [0, 1, 2, 3, 4, 5], accessible: true, notes: 'High-speed passenger lift.' }
      ],
      stairs: [
        { id: 'S-32-1', name: 'Central Grand Staircase', floors: [0, 1, 2, 3, 4, 5], notes: 'Wide flight with dual handrails.' },
        { id: 'S-32-2', name: 'East Wing Stairwell', floors: [0, 1, 2, 3, 4, 5], notes: 'Direct access to engineering labs.' }
      ],
      rooms: [
        { floor: 0, code: '001', name: 'Dean’s Secretariat & Executive Boardroom', wing: 'East Wing', side: 'Right' },
        { floor: 0, code: '004', name: 'Student Counseling & Faculty Advisors Cell', wing: 'West Wing', side: 'Left' },
        { floor: 0, code: '012', name: 'Central Academic Auditorium & Seminar Foyer', wing: 'Central Plaza', side: 'Straight' },
        { floor: 1, code: '102', name: 'Robotics & Embedded Systems Laboratory', wing: 'North Wing', side: 'Right' },
        { floor: 1, code: '105', name: 'Faculty Cabins & Research Mentors', wing: 'East Wing', side: 'Left' },
        { floor: 1, code: '110', name: 'Smart Classroom & Audio-Visual Studio', wing: 'West Wing', side: 'Right' },
        { floor: 2, code: '204', name: 'CSE Computer Lab 4 (High Performance Computing)', wing: 'North Wing', side: 'Left' },
        { floor: 2, code: '208', name: 'Database Management Systems Testing Lab', wing: 'East Wing', side: 'Right' },
        { floor: 2, code: '214', name: 'Lecture Hall 214 (Tiered Seating)', wing: 'South Wing', side: 'Left' },
        { floor: 3, code: '302', name: 'Software Engineering Studio & Project Hub', wing: 'North Wing', side: 'Right' },
        { floor: 3, code: '305', name: 'Cloud Computing & Distributed Systems Lab', wing: 'East Wing', side: 'Left' },
        { floor: 3, code: '310', name: 'Lecture Hall 310 (Interactive Smart Board)', wing: 'South Wing', side: 'Right' },
        { floor: 4, code: '401', name: 'Data Science & Big Data Research Unit', wing: 'North Wing', side: 'Left' },
        { floor: 4, code: '406', name: 'Machine Learning & Cyber Security Lab', wing: 'East Wing', side: 'Right' },
        { floor: 4, code: '412', name: 'Lecture Hall 412', wing: 'South Wing', side: 'Left' },
        { floor: 5, code: '502', name: 'Advanced AI & Deep Learning Lab', wing: 'North Wing', side: 'Right' },
        { floor: 5, code: '505', name: 'Ph.D. Research Scholar Suites', wing: 'East Wing', side: 'Left' },
        { floor: 5, code: '508', name: 'Executive Conference Room & Colloquium Hall', wing: 'South Wing', side: 'Right' }
      ]
    },
    'b34': {
      id: 'b34',
      name: 'Block 34 – Shanti Devi Mittal Central Library',
      nodeId: 'b34-ground',
      floors: [0, 1, 2, 3, 4],
      lifts: [
        { id: 'L-34', name: 'Central Library Glass Lift', status: 'Operational', floors: [0, 1, 2, 3, 4], accessible: true, notes: 'Spacious glass elevator with wheelchair priority.' }
      ],
      stairs: [
        { id: 'S-34-1', name: 'Library Spiral Staircase', floors: [0, 1, 2, 3, 4], notes: 'Iconic central spiral staircase.' }
      ],
      rooms: [
        { floor: 0, code: '001', name: 'Circulation Desk & RFID Self-Checkout', wing: 'Ground Lobby', side: 'Straight' },
        { floor: 1, code: '101', name: 'Undergraduate Sciences & Engineering Stacks', wing: 'Main Reading Floor', side: 'Left' },
        { floor: 2, code: '201', name: 'Quiet Study Pods & Research Archives', wing: 'Quiet Zone', side: 'Right' },
        { floor: 3, code: '301', name: 'Digital Library & International Journal Lab', wing: 'Tech Wing', side: 'Left' },
        { floor: 4, code: '401', name: 'Post-Graduate Scholars & Theses Repository', wing: 'Silent Zone', side: 'Right' }
      ]
    },
    'b36': {
      id: 'b36',
      name: 'Block 36 – Student Centre & Welfare',
      nodeId: 'b36-ground',
      floors: [0, 1, 2, 3],
      lifts: [
        { id: 'L-36', name: 'Student Centre Lift', status: 'Operational', floors: [0, 1, 2, 3], accessible: true, notes: 'Direct access to auditorium and clubs.' }
      ],
      stairs: [
        { id: 'S-36', name: 'Main Broad Staircase', floors: [0, 1, 2, 3], notes: 'High traffic central staircase.' }
      ],
      rooms: [
        { floor: 0, code: '001', name: 'Fee Accounts & Student Billing Counter', wing: 'Front Lobby', side: 'Left' },
        { floor: 0, code: '005', name: 'Examination Transcript & Migration Cell', wing: 'Front Lobby', side: 'Right' },
        { floor: 1, code: '102', name: 'Division of Student Welfare & Clubs Office', wing: 'Cultural Wing', side: 'Left' },
        { floor: 2, code: '201', name: 'Student Council Secretariat & NSS Office', wing: 'Activity Floor', side: 'Right' },
        { floor: 3, code: '301', name: 'Multi-Purpose Rehearsal Hall & Club Studios', wing: 'Top Auditorium', side: 'Straight' }
      ]
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 8. QUEUE ESTIMATES (Live Wait Times & Tokens)
  // ═════════════════════════════════════════════════════════════════
  const QUEUE_POINTS = [
    {
      id: 'q-fee',
      name: 'Fee Clearance & Accounts Cell',
      location: 'Block 36 Ground Floor, Counter 1–5',
      nodeId: 'b36-ground',
      currentToken: 142,
      inQueue: 14,
      avgWaitMins: 11,
      openCounters: '4 of 5 Active',
      status: 'moderate',
      services: ['Semester Tuition Fees', 'Hostel Dues', 'No-Dues Clearance', 'Bus Pass Validation'],
      peakTime: '11:30 AM – 02:00 PM'
    },
    {
      id: 'q-admin',
      name: 'Admissions & Document Verification Cell',
      location: 'Block 32 Central Atrium, Desk A–H',
      nodeId: 'b32-ground',
      currentToken: 210,
      inQueue: 18,
      avgWaitMins: 16,
      openCounters: '6 of 8 Active',
      status: 'busy',
      services: ['Original Certificate Verification', 'Migration Submission', 'Scholarship Approval', 'ID Card Issuance'],
      peakTime: '10:00 AM – 03:30 PM'
    },
    {
      id: 'q-med-opd',
      name: 'Uni-Hospital Medical Center – General OPD',
      location: 'Uni-Hospital South Wing, Ground Floor',
      nodeId: 'uni-hospital',
      currentToken: 45,
      inQueue: 6,
      avgWaitMins: 8,
      openCounters: '3 Doctors On-Duty',
      status: 'low',
      services: ['General Physician Consultation', 'Vital Signs Check', 'Doctor Prescription', 'First-Aid'],
      peakTime: '09:00 AM – 11:30 AM'
    },
    {
      id: 'q-med-pharm',
      name: 'Uni-Hospital Pharmacy & Dispensary',
      location: 'Uni-Hospital Ground Floor Entrance',
      nodeId: 'uni-hospital',
      currentToken: 78,
      inQueue: 3,
      avgWaitMins: 3,
      openCounters: '2 Dispensers Open',
      status: 'low',
      services: ['Subsidized Student Medication', 'First-Aid Supplies', 'Prescription Fulfillment'],
      peakTime: '12:00 PM – 02:00 PM'
    },
    {
      id: 'q-exam',
      name: 'Examination Cell & Transcripts',
      location: 'Block 36 Ground Floor, Counter 6–8',
      nodeId: 'b36-ground',
      currentToken: 89,
      inQueue: 7,
      avgWaitMins: 6,
      openCounters: '3 of 3 Active',
      status: 'low',
      services: ['Grade Sheet Re-Issue', 'Provisional Degree', 'Attestation', 'Exam Hall Correction'],
      peakTime: '02:00 PM – 04:30 PM'
    },
    {
      id: 'q-hostel',
      name: 'Hostel Administration & Warden Registry',
      location: 'BH-South Admin Block Office',
      nodeId: 'bh-south',
      currentToken: 34,
      inQueue: 5,
      avgWaitMins: 4,
      openCounters: '2 Desks Open',
      status: 'low',
      services: ['Room Allocation', 'Hostel Leave Pass', 'Maintenance Complaints', 'Guest Pass'],
      peakTime: '05:00 PM – 07:00 PM'
    }
  ];

  // ═════════════════════════════════════════════════════════════════
  // 9. CAMPUS STORIES & VISUAL ORIENTATION
  // ═════════════════════════════════════════════════════════════════
  const CAMPUS_STORIES = [
    {
      id: 'story-unipolis',
      title: 'Baldev Raj Mittal Unipolis',
      tagline: 'The Amphitheatre of Dreams',
      category: 'Student Life',
      duration: '45s Tour',
      nodeId: 'unipolis',
      bannerGradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      storyText: 'Baldev Raj Mittal Unipolis is LPU’s iconic 10,000-capacity open amphitheatre. It hosts our star-studded Youth Vibe concerts, celebrity nights, and cultural convocations. Its wide paved ramps make it 100% accessible from all sides.',
      orientationTip: 'The central boulevard passing through Unipolis is the smoothest, step-free walking route between academic blocks and student hostels.',
      audioText: 'Welcome to Baldev Raj Mittal Unipolis. With a capacity of ten thousand, this magnificent open amphitheatre is the beating heart of campus entertainment and student convocations.'
    },
    {
      id: 'story-library',
      title: 'Shanti Devi Mittal Central Library',
      tagline: 'Northern India’s 5-Storey Knowledge Citadel',
      category: 'Academics',
      duration: '50s Tour',
      nodeId: 'b34-ground',
      bannerGradient: 'linear-gradient(135deg, #065f46, #059669)',
      storyText: 'Spanning five immense floors, the Central Library houses over 1.5 million volumes, RFID automated checkout kiosks, soundproof discussion pods, and peaceful air-conditioned reading halls.',
      orientationTip: 'Need absolute silence for exam preparation? Head straight to the quiet reading rooms on Floors 2 and 3.',
      audioText: 'You are viewing the Shanti Devi Mittal Central Library. Five stories of academic resources, automated self-issue kiosks, and serene study zones.'
    },
    {
      id: 'story-unimall',
      title: 'Uni-Mall Shopping & Food Plaza',
      tagline: 'The Campus Downtown & Social Hub',
      category: 'Dining & Retail',
      duration: '40s Tour',
      nodeId: 'uni-mall-entrance',
      bannerGradient: 'linear-gradient(135deg, #9a3412, #ea580c)',
      storyText: 'Uni-Mall brings multi-cuisine food courts, Domino’s, Subway, national bank branches, ATMs, stationery superstores, and student boutiques together in an air-conditioned lifestyle complex.',
      orientationTip: 'During summer heat or monsoon showers, use the covered ground corridor connecting Block 34 directly into Uni-Mall.',
      audioText: 'Welcome to Uni-Mall, the student lifestyle and dining hub of LPU, complete with banks, restaurants, and shopping stores.'
    },
    {
      id: 'story-stadium',
      title: 'Indoor Sports Stadium',
      tagline: 'Olympic-Standard Athletic Marvel',
      category: 'Sports & Fitness',
      duration: '45s Tour',
      nodeId: 'indoor-stadium',
      bannerGradient: 'linear-gradient(135deg, #0e7490, #06b6d4)',
      storyText: 'Features an Olympic-size heated swimming pool, 12 professional wooden badminton courts, glass-back squash arenas, an indoor shooting range, and modern gyms.',
      orientationTip: 'Students can access the gym and pool free during scheduled university sports timings with their student ID.',
      audioText: 'The Shanti Devi Mittal Indoor Sports Stadium houses Olympic-grade athletic facilities, including a heated swimming pool and international badminton courts.'
    },
    {
      id: 'story-gate1',
      title: 'Main Gate 1 & Sandstone Boulevard',
      tagline: 'The Gateway to Lovely Professional University',
      category: 'Campus Entry',
      duration: '35s Tour',
      nodeId: 'main-gate',
      bannerGradient: 'linear-gradient(135deg, #831843, #db2777)',
      storyText: 'The grand red sandstone archway stands proudly on the Grand Trunk (GT) Road. It features dedicated transit bays for university buses, e-rickshaws, and free accessible wheelchair golf carts.',
      orientationTip: 'Free university wheelchair carts depart from Gate 1 every three minutes directly to classroom blocks.',
      audioText: 'Main Gate 1 is our flagship campus entrance on the Grand Trunk Road, featuring visitor reception and eco-friendly golf cart transit.'
    },
    {
      id: 'story-techquad',
      title: 'Block 32 & 34 Tech Quadrangle',
      tagline: 'The Innovation & Coding Powerhouse',
      category: 'Technology',
      duration: '50s Tour',
      nodeId: 'b32-ground',
      bannerGradient: 'linear-gradient(135deg, #4338ca, #6366f1)',
      storyText: 'The computing epicenter of campus, housing advanced AI laboratories, autonomous robotics clusters, iOS development centres, and 24/7 student hackathon incubators.',
      orientationTip: 'Lift L-32A on the north side is equipped with voice floor announcements and provides step-free access to all 5 floors.',
      audioText: 'The Tech Quadrangle is home to our cutting-edge computer science labs, robotics workshops, and artificial intelligence research centres.'
    }
  ];

  let currentStoryIdx = 0;
  let storyAutoTimer = null;

  // ─────────────────────────────────────────────────────────────────
  // INDOOR NAVIGATION HANDLERS & RENDERER
  // ─────────────────────────────────────────────────────────────────
  function renderIndoorSection() {
    const container = document.getElementById('indoor-container');
    if (!container) return;

    container.innerHTML = `
      <div class="indoor-navigator-card">
        <h3 style="margin:0 0 0.5rem; font-size:1.2rem; font-weight:800;">Floor-by-Floor Indoor Guidance</h3>
        <p style="font-size:0.85rem; color:#64748b; margin:0 0 1.25rem;">
          Select any university block, floor, and target room (e.g. Block 32, Floor 5, Room 502) to receive step-by-step guidance including which lift or staircase to take.
        </p>

        <div class="indoor-controls-grid">
          <div class="indoor-control-group">
            <label for="indoor-block-select">Select Building / Block</label>
            <select id="indoor-block-select">
              <option value="b32">Block 32 – Academic Block (CSE &amp; Tech)</option>
              <option value="b34">Block 34 – Central Library</option>
              <option value="b36">Block 36 – Student Centre</option>
            </select>
          </div>

          <div class="indoor-control-group">
            <label for="indoor-floor-select">Select Target Floor</label>
            <select id="indoor-floor-select">
              <option value="0">Ground Floor</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
              <option value="4">Floor 4</option>
              <option value="5" selected>Floor 5</option>
            </select>
          </div>

          <div class="indoor-control-group">
            <label for="indoor-room-select">Target Room / Facility</label>
            <select id="indoor-room-select"></select>
          </div>
        </div>

        <div style="margin-bottom:0.6rem; font-size:0.82rem; font-weight:700;">Transit Preference (Lift vs Stairs)</div>
        <div class="transit-toggle-group">
          <button type="button" class="transit-chip active" data-transit="lift" id="chip-lift">
            Lift Only (Step-Free &amp; Accessible)
          </button>
          <button type="button" class="transit-chip" data-transit="stairs" id="chip-stairs">
            Staircase (Fastest Walk)
          </button>
        </div>

        <button type="button" id="btn-calculate-indoor" class="btn btn-primary" style="width:100%; padding:0.75rem; font-weight:800; font-size:0.95rem;">
          Get Indoor Turn-by-Turn Guidance
        </button>

        <div id="indoor-route-output" style="margin-top:1.25rem;"></div>
      </div>
    `;

    const bldSelect = container.querySelector('#indoor-block-select');
    const floorSelect = container.querySelector('#indoor-floor-select');
    const roomSelect = container.querySelector('#indoor-room-select');
    const chipLift = container.querySelector('#chip-lift');
    const chipStairs = container.querySelector('#chip-stairs');
    const calcBtn = container.querySelector('#btn-calculate-indoor');

    let currentTransit = 'lift';

    function populateRooms() {
      const bldKey = bldSelect.value;
      const floorNum = parseInt(floorSelect.value, 10);
      const bld = INDOOR_BLOCKS[bldKey];
      if (!bld) return;

      const matchingRooms = bld.rooms.filter(r => r.floor === floorNum);
      if (matchingRooms.length > 0) {
        roomSelect.innerHTML = matchingRooms.map(r => `<option value="${r.code}">${r.code} – ${r.name}</option>`).join('');
      } else {
        roomSelect.innerHTML = `<option value="101">Room ${floorNum}01 – Lecture Hall</option><option value="102">Room ${floorNum}02 – Faculty Room</option>`;
      }
    }

    bldSelect.addEventListener('change', () => {
      // update floors
      const bld = INDOOR_BLOCKS[bldSelect.value];
      if (bld) {
        floorSelect.innerHTML = bld.floors.map(f => `<option value="${f}">${f === 0 ? 'Ground Floor' : 'Floor ' + f}</option>`).join('');
        floorSelect.value = bld.floors[bld.floors.length - 1]; // pick top floor default
        populateRooms();
      }
    });

    floorSelect.addEventListener('change', populateRooms);

    chipLift.addEventListener('click', () => {
      chipLift.classList.add('active');
      chipStairs.classList.remove('active');
      currentTransit = 'lift';
    });

    chipStairs.addEventListener('click', () => {
      chipStairs.classList.add('active');
      chipLift.classList.remove('active');
      currentTransit = 'stairs';
    });

    calcBtn.addEventListener('click', () => {
      calculateIndoorGuidance(bldSelect.value, parseInt(floorSelect.value, 10), roomSelect.value, currentTransit);
    });

    // Initial populate & run
    populateRooms();
    calculateIndoorGuidance('b32', 5, '502', 'lift');
  }

  function calculateIndoorGuidance(blockKey, targetFloor, roomCode, transitMode) {
    const output = document.getElementById('indoor-route-output');
    if (!output) return;

    const bld = INDOOR_BLOCKS[blockKey] || INDOOR_BLOCKS.b32;
    const room = bld.rooms.find(r => r.code === roomCode && r.floor === targetFloor) || {
      code: roomCode,
      name: `Room ${roomCode}`,
      wing: 'North Wing',
      side: 'Right'
    };

    const isGround = targetFloor === 0;
    const lift = bld.lifts[0];
    const stairs = bld.stairs[0];

    const transitName = transitMode === 'lift' ? lift.name : stairs.name;
    const transitNotes = transitMode === 'lift' ? lift.notes : stairs.notes;

    const steps = [
      `Enter ${bld.name} through the East Ramped Ground Entrance (equipped with automatic double doors).`,
      `Proceed straight 20 metres down the central ground corridor past the reception security checkpoint.`
    ];

    if (!isGround) {
      if (transitMode === 'lift') {
        steps.push(`Take <strong>${lift.name}</strong> on your left to <strong>Floor ${targetFloor}</strong>. (${lift.status} • ${lift.notes})`);
      } else {
        steps.push(`Take <strong>${stairs.name}</strong> on the right flight up to <strong>Floor ${targetFloor}</strong>. (${stairs.notes})`);
      }
      steps.push(`Exit at Floor ${targetFloor} into the ${room.wing} atrium.`);
    }

    steps.push(`Follow the corridor signs towards <strong>Room ${room.code}</strong> (${room.name}).`);
    steps.push(`Arrive at <strong>Room ${room.code}</strong> on your ${room.side}. Tactile Braille room plate is installed at 1.4m height beside the door.`);

    output.innerHTML = `
      <div class="indoor-route-result">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <div>
            <strong style="font-size:1.05rem; color:#14532d;">Indoor Route: ${bld.name} · Floor ${targetFloor} · Room ${room.code}</strong>
            <div style="font-size:0.8rem; color:#475569;">Destination: ${room.name} (${room.wing})</div>
          </div>
          <span style="background:#dcfce7; color:#166534; font-weight:800; font-size:0.75rem; padding:4px 10px; border-radius:999px;">
            ${transitMode === 'lift' ? 'Lift / Step-Free' : 'Staircase Route'}
          </span>
        </div>

        <ul class="indoor-steps-list">
          ${steps.map((st, i) => `
            <li class="indoor-step-item">
              <span class="step-num-badge">${i + 1}</span>
              <div>${st}</div>
            </li>
          `).join('')}
        </ul>

        <div style="margin-top:1rem; display:flex; gap:0.5rem;">
          <button type="button" class="btn btn-primary btn-sm" onclick="CampusSmartHub.navigateToNode('${bld.nodeId}', '${bld.name}')">
            Route Outside to ${bld.name}
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="CampusSmartHub.viewFloorPlan('${bld.id}', ${targetFloor})">
            View Graphical Floor Plan
          </button>
        </div>
      </div>
    `;

    if (window.announce) announce(`Indoor guidance generated for Room ${room.code} on Floor ${targetFloor}`, false);
  }

  function viewFloorPlan(bldId, floorNum) {
    const navTab = document.querySelector('[data-tab="navigate"]');
    if (navTab) navTab.click();

    setTimeout(() => {
      const btnIndoor = document.getElementById('btn-indoor');
      if (btnIndoor) btnIndoor.click();

      const bldSel = document.getElementById('building-select');
      const floorSel = document.getElementById('floor-select');
      if (bldSel) {
        bldSel.value = bldId;
        bldSel.dispatchEvent(new Event('change'));
      }
      if (floorSel) {
        floorSel.value = floorNum.toString();
        floorSel.dispatchEvent(new Event('change'));
      }
    }, 200);
  }

  // ─────────────────────────────────────────────────────────────────
  // QUEUE ESTIMATES HANDLERS & RENDERER
  // ─────────────────────────────────────────────────────────────────
  function renderQueuesSection() {
    const container = document.getElementById('queues-container');
    if (!container) return;

    let html = `
      <div class="heatmap-status-banner">
        <div>
          <strong style="color:#0369a1;">Live Campus Queue Tracker &amp; Wait Estimates</strong>
          <div style="font-size:0.8rem; color:#475569;">Real-time token dispension &amp; counter pacing for fee billing, student welfare, admissions, and Uni-Hospital</div>
        </div>
        <button type="button" class="btn btn-outline btn-sm" style="background:#fff;" onclick="CampusSmartHub.refreshQueues()">
          Refresh Live Queues
        </button>
      </div>

      <div class="queues-grid">
    `;

    QUEUE_POINTS.forEach(q => {
      const statusBadge = q.status === 'low' ? 'available' : (q.status === 'moderate' ? 'filling' : 'full');
      html += `
        <div class="queue-card" data-queue-id="${q.id}">
          <div>
            <div class="queue-card-header">
              <div>
                <h4 class="queue-title">${q.name}</h4>
                <div class="queue-location">${q.location}</div>
              </div>
              <span class="parking-status-badge ${statusBadge}">${q.status.toUpperCase()} WAIT</span>
            </div>

            <div class="queue-wait-display">
              <span class="queue-wait-num">${q.avgWaitMins}</span>
              <span class="queue-wait-unit">mins est. wait</span>
            </div>

            <div class="queue-stats-row">
              <span>Now Serving: <strong>#${q.currentToken}</strong></span>
              <span>In Queue: <strong>${q.inQueue} ahead</strong></span>
              <span>${q.openCounters}</span>
            </div>

            <div style="font-size:0.75rem; color:#64748b; margin-bottom:0.75rem;">
              <strong>Services:</strong> ${q.services.join(', ')}<br>
              <strong>Peak Hours:</strong> ${q.peakTime}
            </div>
          </div>

          <div class="queue-token-action">
            <button type="button" class="btn btn-outline btn-sm" style="flex:1;" onclick="CampusSmartHub.takeVirtualToken('${q.id}')">
              Get Token #${q.currentToken + q.inQueue + 1}
            </button>
            <button type="button" class="btn btn-primary btn-sm" style="flex:1;" onclick="CampusSmartHub.navigateToNode('${q.nodeId}', '${q.name}')">
              Navigate to Desk
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  function takeVirtualToken(queueId) {
    const q = QUEUE_POINTS.find(item => item.id === queueId);
    if (!q) return;

    const myToken = q.currentToken + q.inQueue + 1;
    q.inQueue += 1;
    alert(`Token Booked Successfully!

Service: ${q.name}
Your Token Number: #${myToken}
Estimated Call Time: In approx. ${q.avgWaitMins + 2} minutes
Location: ${q.location}

Please proceed to the counter lounge.`);
    renderQueuesSection();
    if (window.announce) announce(`Token #${myToken} booked for ${q.name}`, true);
  }

  function refreshQueues() {
    QUEUE_POINTS.forEach(q => {
      // small simulation fluctuation
      q.currentToken += Math.floor(Math.random() * 2);
      q.inQueue = Math.max(2, q.inQueue + (Math.floor(Math.random() * 3) - 1));
      q.avgWaitMins = Math.max(3, Math.round(q.inQueue * 0.8));
    });
    renderQueuesSection();
    if (window.announce) announce('Queue wait times updated.', false);
  }

  // ─────────────────────────────────────────────────────────────────
  // CAMPUS STORIES HANDLERS & RENDERER
  // ─────────────────────────────────────────────────────────────────
  function renderStoriesSection() {
    const container = document.getElementById('stories-container');
    if (!container) return;

    let html = `
      <div style="margin-bottom:1.25rem;">
        <h3 style="margin:0 0 0.35rem; font-size:1.15rem; font-weight:800;">Visual Orientation &amp; Landmark Stories</h3>
        <p style="font-size:0.85rem; color:#64748b; margin:0;">
          Short visual tours and architectural highlights of famous LPU landmarks to help new students and visitors feel at home.
        </p>
      </div>

      <div class="stories-grid">
    `;

    CAMPUS_STORIES.forEach((story, idx) => {
      html += `
        <div class="story-card" onclick="CampusSmartHub.openStory(${idx})">
          <div class="story-media-banner" style="background:${story.bannerGradient}">
            <span class="story-tag-pill">${story.category}</span>
            <div>
              <span style="font-size:0.75rem; font-weight:700; opacity:0.9;">${story.duration}</span>
              <h4 style="margin:0; font-size:1.15rem; font-weight:800;">${story.title}</h4>
            </div>
          </div>
          <div class="story-card-body">
            <div>
              <div class="story-tagline">"${story.tagline}"</div>
              <p style="font-size:0.82rem; color:#334155; line-height:1.4; margin:0 0 0.75rem;">
                ${story.storyText}
              </p>
              <div class="story-tip-box">
                <strong>Orientation Tip:</strong> ${story.orientationTip}
              </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" style="width:100%; font-weight:700;">
              Watch Orientation Story →
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  function openStory(index) {
    currentStoryIdx = index;
    const modal = document.getElementById('story-modal-overlay');
    if (!modal) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    updateStoryModalView();
  }

  function closeStory() {
    const modal = document.getElementById('story-modal-overlay');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function updateStoryModalView() {
    const story = CAMPUS_STORIES[currentStoryIdx];
    if (!story) return;

    const total = CAMPUS_STORIES.length;
    const container = document.getElementById('story-player-card');
    if (!container) return;

    // Build segments
    const progressHtml = CAMPUS_STORIES.map((_, i) => `
      <div class="story-bar-segment">
        <div class="story-bar-fill" style="width: ${i < currentStoryIdx ? '100%' : (i === currentStoryIdx ? '100%' : '0%')}"></div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="story-progress-container">${progressHtml}</div>

      <div class="story-player-header">
        <span style="font-size:0.8rem; font-weight:800; background:rgba(0,0,0,0.5); padding:4px 10px; border-radius:999px;">
          Story ${currentStoryIdx + 1} of ${total} • ${story.category}
        </span>
        <button type="button" class="sos-close-btn" onclick="CampusSmartHub.closeStory()" aria-label="Close story">✕</button>
      </div>

      <div class="story-player-body" style="background:${story.bannerGradient}">
        <span style="font-size:0.85rem; font-weight:700; color:#cbd5e1; text-transform:uppercase; letter-spacing:0.5px;">
          ${story.duration}
        </span>
        <h3 style="font-size:1.6rem; font-weight:900; margin:4px 0 6px; text-shadow:0 2px 4px rgba(0,0,0,0.4);">
          ${story.title}
        </h3>
        <div style="font-size:0.95rem; font-style:italic; opacity:0.95; margin-bottom:1rem;">
          "${story.tagline}"
        </div>
        <p style="font-size:0.9rem; line-height:1.5; color:#f1f5f9; text-shadow:0 1px 2px rgba(0,0,0,0.4); margin-bottom:1rem;">
          ${story.storyText}
        </p>
        <div style="background:rgba(0,0,0,0.45); backdrop-filter:blur(6px); border-radius:8px; padding:0.75rem 1rem; margin-bottom:1.25rem; font-size:0.82rem; border-left:4px solid #38bdf8;">
          <strong>Orientation Tip:</strong> ${story.orientationTip}
        </div>

        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button type="button" class="btn btn-primary btn-sm" style="flex:1;" onclick="CampusSmartHub.readCurrentStoryAudio()">
            Listen Audio Tour
          </button>
          <button type="button" class="btn btn-outline btn-sm" style="flex:1; background:#ffffff; color:#0f172a;" onclick="CampusSmartHub.closeStory(); CampusSmartHub.navigateToNode('${story.nodeId}', '${story.title}')">
            Route to Spot
          </button>
        </div>

        <div style="display:flex; justify-content:space-between; margin-top:1rem;">
          <button type="button" class="btn-tour-nav btn-tour-prev" style="padding:4px 10px; font-size:0.8rem;" ${currentStoryIdx === 0 ? 'disabled style="opacity:0.4;"' : ''} onclick="CampusSmartHub.prevStory()">
            ← Previous
          </button>
          <button type="button" class="btn-tour-nav btn-tour-next" style="padding:4px 10px; font-size:0.8rem;" ${currentStoryIdx === total - 1 ? 'disabled style="opacity:0.4;"' : ''} onclick="CampusSmartHub.nextStory()">
            Next Story →
          </button>
        </div>
      </div>
    `;
  }

  function nextStory() {
    if (currentStoryIdx < CAMPUS_STORIES.length - 1) {
      currentStoryIdx++;
      updateStoryModalView();
    }
  }

  function prevStory() {
    if (currentStoryIdx > 0) {
      currentStoryIdx--;
      updateStoryModalView();
    }
  }

  function readCurrentStoryAudio() {
    const story = CAMPUS_STORIES[currentStoryIdx];
    if (!story || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(story.audioText);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    if (window.announce) announce(`Reading story narration for ${story.title}`, false);
  }

  return {
    init,
    navigateToNode,
    routeToExam,
    selectTour,
    nextTourStop,
    prevTourStop,
    readTourStop,
    addEventReminder,
    routeToNearestEmergency,
    toggleHeatmapLayer,
    toggleParkingLayer,
    toggleEmergencyLayer,
    renderIndoorSection,
    renderQueuesSection,
    renderStoriesSection,
    calculateIndoorGuidance,
    viewFloorPlan,
    takeVirtualToken,
    refreshQueues,
    openStory,
    closeStory,
    nextStory,
    prevStory,
    readCurrentStoryAudio,
    INDOOR_BLOCKS,
    QUEUE_POINTS,
    CAMPUS_STORIES,
    PARKING_LOTS,
    HEATMAP_HOTSPOTS,
    CAMPUS_EVENTS,
    GUIDED_TOURS,
    EMERGENCY_POSTS
  };

})();
