'use strict';

(function () {

  (function () {

    const DEBOUNCE_INTERVAL = 500;

    const setDebounce = function (cb) {
      let lastTimeout = null;

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
})();
