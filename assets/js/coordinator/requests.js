(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    window.ICCore?.coordinator?.initRequests?.();
    window.ICCore?.coordinator?.initAlumniRequests?.();
    window.ICCore?.coordinator?.initJoinRequests?.();
  }, { once: true });
})();
