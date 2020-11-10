'use strict';

(function () {
  // Случайное число от min и до max
  const getRandomInteger = function (min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  // Выбирает случайный элемент массива
  const getRandomElement = function (items) {
    const item = items[Math.floor(Math.random() * items.length)];
    return item;
  };


  // Получаем новые массивы со случайным числом элементов
  const removeItemFromArray = function (array, index) {
    const filteredArray = array.filter(function (item, i) {
      return i !== index;
    });
    return filteredArray;
  };

  const getRandomSubArray = function (array) {
    const randomItemsAmount = window.data.getRandomInteger(0, array.length);
    let newArray = [...array]; // создает копию массива
    for (let i = 0; i < randomItemsAmount; i++) {
      const rendomItemIndex = window.data.getRandomInteger(0, newArray.length - 1);
      newArray = removeItemFromArray(newArray, rendomItemIndex);
    }
    return newArray;
  };

  window.data = {
    getRandomInteger,
    getRandomElement,
    getRandomSubArray
  };
})();
