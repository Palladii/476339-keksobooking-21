'use strict';

(function () {
  /* Валидация */
  const checkIn = document.querySelector(`#timein`);
  const checkOut = document.querySelector(`#timeout`);
  const roomNumber = document.querySelector(`#room_number`);
  const capacity = document.querySelector(`#capacity`);
  const main = document.querySelector(`main`);
  const mapFilter = window.main.filter.querySelector(`.map__filters`);
  const formReset = window.main.form.querySelector(`.ad-form__reset`);
  const INITIAL_PIN_POSITION = {
    x: 570,
    y: 375
  };
  let TypesRus = {
    flat: {
      translate: `Квартира`,
      minPrice: 1000
    },
    bungalow: {
      translate: `Бунгало`,
      minPrice: 0
    },
    house: {
      translate: `Дом`,
      minPrice: 5000
    },
    palace: {
      translate: `Дворец`,
      minPrice: 10000
    }
  };
  let typeOfHousing = window.main.form.querySelector(`select[name="type"]`);
  let priceOfHousing = window.main.form.querySelector(`input[name="price"]`);
  const validateRoom = function () {

    const valueRoomNumber = Number(roomNumber.value);
    const valueCapacity = Number(capacity.value);

    if (valueCapacity === 1 && valueRoomNumber === 100) {
      roomNumber.setCustomValidity(`Много лишних комнат`);
    } else if (valueCapacity === 2 && valueRoomNumber < 2) {
      roomNumber.setCustomValidity(`Выберите не менее двух комнат`);
    } else if (valueCapacity === 2 && valueRoomNumber > 3) {
      roomNumber.setCustomValidity(`Много лишних комнат`);
    } else if (valueCapacity === 3 && valueRoomNumber !== 3) {
      roomNumber.setCustomValidity(`Вам необходимо выбрать 3 комнаты`);
    } else if (valueCapacity === 0 && valueRoomNumber < 100) {
      roomNumber.setCustomValidity(`Не для гостей не менее 100 комнат`);
    } else {
      roomNumber.setCustomValidity(``);
    }
  };
  validateRoom();

  roomNumber.addEventListener(`change`, function () {
    validateRoom();
  });
  capacity.addEventListener(`change`, function () {
    validateRoom();
  });

  let validateMinPriceOfHousing = () => {
    let type = TypesRus[typeOfHousing.value];
    priceOfHousing.placeholder = type.minPrice;
    priceOfHousing.min = type.minPrice;
  };
  typeOfHousing.addEventListener(`change`, validateMinPriceOfHousing);

  checkIn.addEventListener(`change`, function (evt) {
    checkOut.value = evt.target.value;
  });
  checkOut.addEventListener(`change`, function (evt) {
    checkIn.value = evt.target.value;
  });

  const getSuccess = function () {
    const newSuccessPopup = document.querySelector(`#success`).content.cloneNode(true);
    main.appendChild(newSuccessPopup);

    const deleteSuccessPopup = () => {
      main.removeChild(document.querySelector(`.success`));
      document.removeEventListener(`mousedown`, onShowSuccessMousedown);
      document.removeEventListener(`keydown`, onShowSuccessSaveEscPress);
    };

    const onShowSuccessSaveEscPress = (evt) => {
      if (evt.key === `Escape`) {
        deleteSuccessPopup();
      }
    };

    const onShowSuccessMousedown = () => {
      deleteSuccessPopup();
    };

    document.addEventListener(`mousedown`, onShowSuccessMousedown);
    document.addEventListener(`keydown`, onShowSuccessSaveEscPress);
  };

  const getError = () => {
    const newErrorPopup = document.querySelector(`#error`).content.cloneNode(true);
    main.appendChild(newErrorPopup);

    const deleteErrorPopup = () => {
      main.removeChild(document.querySelector(`.error`));
      document.removeEventListener(`mousedown`, onErrorSaveMousedown);
      document.removeEventListener(`keydown`, onErrorSaveEscPress);
    };

    const onErrorSaveClick = () => {
      deleteErrorPopup();
    };

    const onErrorSaveMousedown = () => {
      deleteErrorPopup();
    };

    const onErrorSaveEscPress = (evt) => {
      if (evt.key === `Escape`) {
        deleteErrorPopup();
      }
    };

    document.querySelector(`.error__button`).addEventListener(`click`, onErrorSaveClick);
    document.addEventListener(`mousedown`, onErrorSaveMousedown);
    document.addEventListener(`keydown`, onErrorSaveEscPress);
  };

  let deactivate = function () {
    window.main.map.classList.add(`map--faded`);
    window.main.form.reset();
    mapFilter.reset();
    window.main.deactivateFormFilter();
    window.map.hidePins();
    window.map.mainMapPin.style.left = INITIAL_PIN_POSITION.x + `px`;
    window.map.mainMapPin.style.top = INITIAL_PIN_POSITION.y + `px`;
    window.map.removeMapCard();
    window.map.address.value = `${parseInt(window.map.mainMapPin.style.left, 10)}, ${parseInt(window.map.mainMapPin.style.top, 10) + window.map.PIN_TIP}`;
  };

  window.main.form.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    window.load.upload(new FormData(window.main.form), () => {
      getSuccess();
    }, getError);
    deactivate();
  });

  formReset.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    deactivate();
  });
})();
