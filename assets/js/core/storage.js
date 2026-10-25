/* Shared storage boundary for the gradual script.js refactor. */
(function (root) {
  'use strict';

  function getJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function remove(key) {
    localStorage.removeItem(key);
  }

  root.ICCore = root.ICCore || {};
  root.ICCore.storage = Object.freeze({ getJSON, setJSON, remove });
})(window);
