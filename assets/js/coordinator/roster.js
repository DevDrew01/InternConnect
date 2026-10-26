(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    window.ICCore?.coordinator?.initRoster?.();
    window.ICCore?.coordinator?.initDeletions?.();
  }, { once: true });
})();
