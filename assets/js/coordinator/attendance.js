(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    window.ICCore?.coordinator?.initAttendanceExport?.();
    window.ICCore?.coordinator?.initAttendanceLinks?.();
    window.ICCore?.coordinator?.initAttendanceTable?.();
  }, { once: true });
})();
