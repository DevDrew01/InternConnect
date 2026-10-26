(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    window.ICCore?.coordinator?.initHolidays?.();
  }, { once: true });
})();
