'use strict';


(function () {
  /* Валидация */
  const checkIn = document.querySelector(`#timein`);
  const checkOut = document.querySelector(`#timeout`);
  const roomNumber = document.querySelector(`#room_number`);
  const capacity = document.querySelector(`#capacity`);

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
      roomNumber.setCustomValidity(`Не для гостей`);
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

  let typesRus = {
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
  let validateMinPriceOfHousing = () => {
    let type = typesRus[typeOfHousing.value];
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


  window.main.form.addEventListener(`submit`, function (evt) {
    evt.preventDefault();
  });

  // Добавляет обработчик клика на кнопку отправки формы
  let title = window.main.form.querySelector(`input[name="title"]`);

  window.main.form.addEventListener(`submit`, function (evt) {
    evt.preventDefault();
    if (title.value === ``) {
      title.setCustomValidity(`Заголовок - обязательное поле`);
    } else if (priceOfHousing.value === ``) {
      priceOfHousing.setCustomValidity(`Цена за ночь - обязательное поле`);
    } else {
      validateRoom();
    }
  });
})();

