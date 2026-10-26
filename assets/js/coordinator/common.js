/* Shared coordinator page boundary. Feature modules consume these helpers through ICCore. */
(function () {
  'use strict';
  window.ICCore = window.ICCore || {};
  window.ICCore.coordinator = window.ICCore.coordinator || {};
  document.addEventListener('DOMContentLoaded', () => {
    window.ICCore.coordinator.updateRequestBadge?.();
    window.ICCore.coordinator.initSidebar?.();
    window.ICCore.coordinator.renderSubmissionNotifications?.();
  }, { once: true });
})();
