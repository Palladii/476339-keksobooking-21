'use strict';
(function () {
  const form = document.querySelector(`.ad-form`);
  const map = document.querySelector(`.map`);
  const fieldsets = form.querySelectorAll(`fieldset`);
  const filters = document.querySelector(`.map__filters-container`);

  // Активирует карту
  const getMapOpen = function () {
    map.classList.remove(`map--faded`);
  };

  // Деактивирует элементы

  const deactivateFormFilter = function () {
    form.classList.add(`ad-form--disabled`);
    for (let field of fieldsets) {
      field.setAttribute(`disabled`, `disabled`);
    }

    filters.setAttribute(`disabled`, `disabled`);
  };
  deactivateFormFilter();
  // Активирует поля
  const getFieldsetActive = function () {
    for (let field of fieldsets) {
      field.removeAttribute(`disabled`, `disabled`);
    }
    filters.removeAttribute(`disabled`, `disabled`);
  };

  window.main = {
    form,
    getMapOpen,
    getFieldsetActive,
    map,
    deactivateFormFilter,
    filters
  };
})();
