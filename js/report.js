/**
 * report.js – Accessibility barrier reporting system
 * Updates lift status and reroutes automatically
 */

'use strict';

const ReportSystem = (() => {

 // RENDER ACTIVE REPORTS 
 function renderActiveReports() {
 const { activeReports } = window.CampusData;
 const list = document.getElementById('active-reports-list');
 if (!list) return;

 if (activeReports.length === 0) {
 list.innerHTML = `<li style="color:var(--clr-text-muted);font-size:0.9rem;padding:0.75rem;">
 <span aria-hidden="true"></span> No active accessibility issues reported.
 </li>`;
 return;
 }

 list.innerHTML = activeReports.map(report => {
 const time = new Date(report.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
 const typeLabel = {
 'lift-broken': ' Lift not working',
 'ramp-blocked': ' Ramp blocked',
 'door-broken': ' Accessible door broken',
 'tactile-damaged':' Tactile path damaged',
 'toilet-closed': ' Accessible toilet closed',
 'other': ' Other barrier',
 }[report.type] || ' Issue reported';

 const buildingLabel = {
 b32: 'Block 32', b34: 'Block 34', b36: 'Block 36', outdoor: 'Outdoor'
 }[report.building] || report.building;

 return `
 <li class="report-item" role="listitem" aria-label="${typeLabel} at ${buildingLabel}">
 <div class="report-item-urgency ${report.urgency}" aria-hidden="true"></div>
 <div class="report-item-body">
 <div class="report-item-title">${typeLabel}</div>
 <div class="report-item-meta">
 ${buildingLabel}${report.floor ? ` · ${report.floor}` : ''} &nbsp;·&nbsp;
 ${time}
 ${report.urgency === 'high' ? ' &nbsp;·&nbsp; <strong style="color:var(--clr-danger)">HIGH URGENCY</strong>' : ''}
 </div>
 ${report.description ? `<div style="font-size:0.8rem;margin-top:4px;color:var(--clr-text-muted)">${escapeHTML(report.description)}</div>` : ''}
 </div>
 <button class="report-item-dismiss" data-report-id="${report.id}"
 aria-label="Dismiss report: ${typeLabel} at ${buildingLabel}">
 Resolved
 </button>
 </li>`;
 }).join('');

 // Bind dismiss buttons
 list.querySelectorAll('.report-item-dismiss').forEach(btn => {
 btn.addEventListener('click', () => {
 const id = btn.dataset.reportId;
 window.CampusData.dismissReport(id);
 renderActiveReports();
 updateLiftStatusUI();
 CampusMap.refreshLiftMarkers();
 announcePolite('Report marked as resolved. Lift status updated.');

 // Show alert banner if restored
 const { LIFTS } = window.CampusData;
 const allOk = Object.values(LIFTS).every(l => l.operational);
 if (allOk) showAlert('All lifts are now operational. Step-free routes restored.', 'success');
 });
 });
 }

 // UPDATE LIFT STATUS UI 
 function updateLiftStatusUI() {
 const { LIFTS } = window.CampusData;

 Object.entries(LIFTS).forEach(([id, lift]) => {
 // Lift status list in route panel
 const item = document.querySelector(`[data-lift="${id}"]`);
 if (item) {
 const badge = item.querySelector('.lift-badge');
 if (badge) {
 badge.textContent = lift.operational ? ' Operational' : ' Out of service';
 badge.className = `lift-badge ${lift.operational ? 'operational' : 'broken'}`;
 badge.setAttribute('aria-label', `${lift.label} is ${lift.operational ? 'operational' : 'out of service'}`);
 }
 }

 // Building card lift status
 const buildingStatus = document.getElementById(`${lift.building}-lift-status`);
 if (buildingStatus) {
 buildingStatus.textContent = lift.operational ? ' Operational' : ' Out of service';
 buildingStatus.style.color = lift.operational ? 'var(--clr-success)' : 'var(--clr-danger)';
 }
 });
 }

 // SHOW ALERT BANNER 
 function showAlert(message, type = 'warning') {
 const banner = document.getElementById('alert-banner');
 const textEl = document.getElementById('alert-text');
 if (!banner || !textEl) return;

 textEl.textContent = message;
 banner.hidden = false;
 banner.style.background = type === 'success' ? 'var(--clr-success)' : 'var(--clr-warning)';

 // Auto-hide after 8 seconds
 clearTimeout(banner._timer);
 banner._timer = setTimeout(() => { banner.hidden = true; }, 8000);
 }

 // HANDLE FORM SUBMIT 
 function handleSubmit(e) {
 e.preventDefault();

 const form = document.getElementById('report-form');
 const building = document.getElementById('report-building').value;
 const type = document.getElementById('report-type').value;
 const floor = document.getElementById('report-floor').value.trim();
 const description = document.getElementById('report-description').value.trim();
 const urgency = document.querySelector('input[name="urgency"]:checked')?.value || 'medium';

 // Validate
 if (!building) {
 alert('Please select a building.');
 document.getElementById('report-building').focus();
 return;
 }
 if (!type) {
 alert('Please select an issue type.');
 document.getElementById('report-type').focus();
 return;
 }

 // Add report
 const report = window.CampusData.addReport({ building, type, floor, description, urgency });

 // Update UI
 renderActiveReports();
 updateLiftStatusUI();
 CampusMap.refreshLiftMarkers();

 // Show confirmation
 const confirmation = document.getElementById('report-confirmation');
 const confirmText = document.getElementById('confirmation-text');
 form.hidden = true;
 confirmation.hidden = false;

 const typeLabels = {
 'lift-broken': 'Lift outage',
 'ramp-blocked': 'Blocked ramp',
 'door-broken': 'Broken accessible door',
 'tactile-damaged':'Damaged tactile path',
 'toilet-closed': 'Inaccessible toilet',
 'other': 'Accessibility barrier',
 };
 confirmText.textContent =
 `${typeLabels[type] || 'Issue'} reported for ${building.toUpperCase()}${floor ? ` (${floor})` : ''}.`;

 // Show banner warning
 if (type === 'lift-broken') {
 showAlert(` ${typeLabels[type]} reported in ${building.toUpperCase()}. Step-free routes updated automatically.`);
 }

 announceAssertive('Report submitted. Routes have been updated. Thank you for helping make campus more accessible.');

 // Scroll confirmation into view
 confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
 }

 // HELPERS 
 function escapeHTML(str) {
 return String(str)
 .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
 }

 function announceAssertive(msg) {
 const el = document.getElementById('live-announcer');
 if (el) { el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 50); }
 }

 function announcePolite(msg) {
 const el = document.getElementById('polite-announcer');
 if (el) { el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 50); }
 }

 // INIT 
 function init() {
 const form = document.getElementById('report-form');
 if (form) form.addEventListener('submit', handleSubmit);

 // Character counter
 const textarea = document.getElementById('report-description');
 const charCount = document.getElementById('char-count');
 if (textarea && charCount) {
 textarea.addEventListener('input', () => {
 charCount.textContent = `${textarea.value.length} / 500`;
 });
 }

 // Alert close button
 const closeAlert = document.getElementById('close-alert');
 if (closeAlert) {
 closeAlert.addEventListener('click', () => {
 document.getElementById('alert-banner').hidden = true;
 });
 }

 // "Report another" button
 const anotherBtn = document.getElementById('report-another-btn');
 if (anotherBtn) {
 anotherBtn.addEventListener('click', () => {
 document.getElementById('report-form').reset();
 document.getElementById('report-form').hidden = false;
 document.getElementById('report-confirmation').hidden = true;
 document.getElementById('report-building').focus();
 document.getElementById('char-count').textContent = '0 / 500';
 });
 }

 // Render any persisted reports
 renderActiveReports();
 updateLiftStatusUI();
 }

 return { init, renderActiveReports, updateLiftStatusUI, showAlert };

})();

window.ReportSystem = ReportSystem;
