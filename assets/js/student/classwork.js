(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'classwork' && window.ICCore?.student?.initClasswork) window.ICCore.student.initClasswork();
  }, { once: true });
})();
