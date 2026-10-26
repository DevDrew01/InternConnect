(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'resume' && window.ICCore?.resume?.init) window.ICCore.resume.init();
  }, { once: true });
})();
