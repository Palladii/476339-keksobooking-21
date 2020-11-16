'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 300; // ms

  const setDebounce = function (cb) {
    var lastTimeout = null;

    return function (...parameters) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb(...parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.debounce = {
    setDebounce
  };
})();
