'use strict';

(function () {

  const DEBOUNCE_INTERVAL = 500;

  const setHold = (cb) => {
    let lastTimeout = null;

    return (...parameters) => {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(() => {
        cb(...parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.debounce = {
    setHold
  };
})();
