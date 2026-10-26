(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    window.ICCore?.coordinator?.initPlacements?.();
  }, { once: true });
})();
