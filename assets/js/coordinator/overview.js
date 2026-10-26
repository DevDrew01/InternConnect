(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    window.ICCore?.coordinator?.initSummaryExport?.();
    window.ICCore?.coordinator?.initOverview?.();
  }, { once: true });
})();
