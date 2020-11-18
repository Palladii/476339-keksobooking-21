'use strict';
(function () {
  const form = document.querySelector(`.ad-form`);
  const map = document.querySelector(`.map`);
  const selectsList = document.querySelectorAll(`select`);
  const filter = document.querySelector(`.map__filters-container`);
  const fieldsetList = form.querySelectorAll(`fieldset`);

  // Активирует карту
  const getMapOpen = () => {
    map.classList.remove(`map--faded`);
  };

  // Деактивирует элементы
  const deactivateFormFilter = () => {
    for (let select of selectsList) {
      select.setAttribute(`disabled`, `disabled`);
    }
    for (let fieldset of fieldsetList) {
      fieldset.setAttribute(`disabled`, `disabled`);
    }
    form.classList.add(`ad-form--disabled`);
    filter.setAttribute(`disabled`, `disabled`);
  };
  deactivateFormFilter();

  // Активирует поля
  const getFieldsetActive = () => {
    for (let select of selectsList) {
      select.removeAttribute(`disabled`, `disabled`);
    }
    for (let fieldset of fieldsetList) {
      fieldset.removeAttribute(`disabled`, `disabled`);
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
