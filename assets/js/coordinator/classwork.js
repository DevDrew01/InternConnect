(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    window.ICCore?.coordinator?.initTaskList?.();
    window.ICCore?.coordinator?.initBatchSelector?.();
  }, { once: true });
})();
