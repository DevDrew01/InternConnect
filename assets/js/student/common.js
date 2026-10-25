(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const student = window.ICCore?.student;
    if (document.body.dataset.role !== 'student' || !document.getElementById('sidebar')) return;
    const user = student?.authorize?.();
    if (user && student.hydrate?.(user)) {
      student.registerModules?.();
      student.initAccountControls?.();
      student.initSidebar?.();
      student.initNotifications?.();
      student.initAttendanceControls?.();
    }
  }, { once: true });
})();
