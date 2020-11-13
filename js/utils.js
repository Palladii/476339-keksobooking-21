'use strict';

(function () {

  /* const getRandomInteger = function (min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }; */

  const getRandomElement = function (items) {
    const item = items[Math.floor(Math.random() * items.length)];
    return item;
  };

  window.map = {
    getRandomElement
  };
})();
