(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'taskdetail' && window.ICCore?.student?.initTaskDetail) window.ICCore.student.initTaskDetail();
  }, { once: true });
})();
