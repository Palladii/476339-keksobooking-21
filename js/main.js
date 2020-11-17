'use strict';
(function () {
  const form = document.querySelector(`.ad-form`);
  const map = document.querySelector(`.map`);
  const fieldsetList = form.querySelectorAll(`fieldset`);
  const filter = document.querySelector(`.map__filters-container`);

  // Активирует карту
  const getMapOpen = function () {
    map.classList.remove(`map--faded`);
  };

  // Деактивирует элементы

  const deactivateFormFilter = function () {
    form.classList.add(`ad-form--disabled`);
    for (let field of fieldsetList) {
      field.setAttribute(`disabled`, `disabled`);
    }

    filter.setAttribute(`disabled`, `disabled`);
  };
  deactivateFormFilter();
  // Активирует поля
  const getFieldsetActive = function () {
    for (let field of fieldsetList) {
      field.removeAttribute(`disabled`, `disabled`);
    }
    filter.removeAttribute(`disabled`, `disabled`);
  };

  window.main = {
    form,
    getMapOpen,
    getFieldsetActive,
    map,
    deactivateFormFilter,
    filter
  };
})();
