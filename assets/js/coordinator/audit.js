/* Coordinator Audit Trail page wiring. Feature logic remains exposed through ICCore.audit. */
(function () {
  'use strict';
  if (!document.getElementById('auditTbody') || !window.ICCore?.audit) return;
  const audit = window.ICCore.audit;
  getDeletionRequests();
  audit.render();
  const btn = document.getElementById('exportAuditBtn');
  const menu = document.getElementById('exportAuditMenu');
  if (!btn || !menu) return;
  const setMenu = (open) => { menu.classList.toggle('hidden', !open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); setMenu(menu.classList.contains('hidden')); });
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('[data-export]');
    if (!item) return;
    setMenu(false);
    const label = item.dataset.export === 'xlsx' ? 'Excel' : 'PDF';
    try { if (!(item.dataset.export === 'xlsx' ? audit.exportXlsx() : audit.exportPdf())) return; }
    catch (err) { console.error(err); showToast('Could not create the file. Please try again.', 'warn'); return; }
    audit.log('Exported the audit trail log (' + label + ')');
    audit.render();
    showToast('Audit log downloaded as ' + label + '.', 'success');
  });
})();
