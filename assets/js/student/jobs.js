(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'jobs' && window.ICCore?.student?.initJobs) window.ICCore.student.initJobs();
  }, { once: true });
})();
