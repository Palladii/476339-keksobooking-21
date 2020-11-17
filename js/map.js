'use strict';

(function () {
  const mapPins = document.querySelector(`.map__pins`);
  const mainMapPin = mapPins.querySelector(`.map__pin--main`);
  const PIN_WIDTH = 40;
  const PIN_HEIGHT = 44;
  const PIN_TIP = 22;
  const address = window.main.form.querySelector(`#address`);
  const buttonTemplate = document.querySelector(`#pin`).content.querySelector(`button`);
  const MAX_SIMILAR_PINS_COUNT = 5;
  const minMapX = 40;
  const maxMapX = 1120;
  const minMapY = 130;
  const maxMapY = 630;
  const avaliableHouseTypes = {bungalow: `bungalow`, flat: `flat`, house: `house`, palace: `palace`};
  const housingType = window.main.map.querySelector(`#housing-type`);
  const housingPrice = window.main.map.querySelector(`#housing-price`);
  const housingRooms = window.main.map.querySelector(`#housing-rooms`);
  const housingGuests = window.main.map.querySelector(`#housing-guests`);
  const cardsList = [];
  const pins = [];
  let pinsData = [];

  const successHandler = function (adsData) {
    pinsData = adsData;
  };

  const errorHandler = function (errorMessage) {
    const node = document.createElement(`div`);
    node.style = `z-index: 100; margin: 300 auto; text-align: center; background-color: #FF6618;`;
    node.style.position = `absolute`;
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = `30px`;

    node.textContent = errorMessage;
    document.body.insertAdjacentElement(`afterbegin`, node);
  };


  // Середина метки
  const PIN_LOCATION_X = parseInt(mainMapPin.style.left, 10) - PIN_WIDTH / 2;
  const PIN_LOCATION_Y = parseInt(mainMapPin.style.top, 10) - PIN_HEIGHT / 2;

  // Функция вычисления адреса
  const getAddress = function () {
    address.value = `${PIN_LOCATION_X}, ${PIN_LOCATION_Y}`;
  };
  getAddress();

  // Получаем метку на карте
  const renderButton = function (cardData) {
    let buttonPin = buttonTemplate.cloneNode(true);
    buttonPin.style.left = `${cardData.location.x}px`;
    buttonPin.style.top = `${cardData.location.y}px`;
    buttonPin.querySelector(`img`).src = cardData.author.avatar;
    buttonPin.dataset.index = cardData.index; // 0, 1, 2
    buttonPin.classList.add(`hidden`);
    return buttonPin;
  };


  mainMapPin.addEventListener(`mousedown`, function (evt) {
    if (evt.button === 0) {
      window.load.getAdsData(function (adsData) {
        pinsData = adsData;
        renderPins(pinsData);
      }, errorHandler);
    }
  });

  mainMapPin.addEventListener(`keydown`, function (event) {
    if (event.key === `Enter`) {
      renderPins(pinsData);
    }
  });

  const mapCardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

  const houseType = {
    [avaliableHouseTypes.bungalow]: `Бунгало`,
    [avaliableHouseTypes.flat]: `Квартира`,
    [avaliableHouseTypes.house]: `Дом`,
    [avaliableHouseTypes.palace]: `Дворец`
  };

  const getCardType = function (cardDataType) {
    return houseType[cardDataType];
  };

  const updateCardData = function (cardAdvert, selector, value) {
    const element = cardAdvert.querySelector(selector);
    if (value) {
      element.textContent = value;
      return;
    }
    element.remove();
  };

  const updateCardImg = function (cardAdvert, selector, value) {
    const elementImg = cardAdvert.querySelector(selector);
    if (value) {
      elementImg.src = value;
      return;
    }
    elementImg.remove();
  };
  const createCardAdvert = function (cardData) {

    let cardAdvert = mapCardTemplate.cloneNode(true);

    mapPins.appendChild(cardAdvert);

    updateCardImg(cardAdvert, `.popup__avatar`, cardData.author.avatar);
    updateCardData(cardAdvert, `.popup__title`, cardData.offer.title);
    updateCardData(cardAdvert, `.popup__text--address`, cardData.offer.address);
    updateCardData(cardAdvert, `.popup__text--price`, cardData.offer.price ? `${cardData.offer.price}₽/ночь` : null);
    updateCardData(cardAdvert, `.popup__text--capacity`, cardData.offer.rooms && cardData.offer.guests ? `${cardData.offer.rooms} комнат для ${cardData.offer.guests}` : null);
    updateCardData(cardAdvert, `.popup__text--time`, cardData.offer.checkin && cardData.offer.checkout ? `Заезд после ${cardData.offer.checkin}, выезд до ${cardData.offer.checkout}` : null);

    updateCardData(cardAdvert, `.popup__description`, cardData.offer.description);

    cardAdvert.querySelector(`.popup__type`).textContent = getCardType(cardData.offer.type);
    const featuresContainer = cardAdvert.querySelector(`.popup__features`);
    let cardAdvertFeaturesList = featuresContainer.querySelectorAll(`.popup__feature`);


    for (let i = 0; i < cardAdvertFeaturesList.length; i++) {
      cardAdvertFeaturesList[i].remove();
    }
    featuresContainer.innerHTML = cardData.offer.features.map((item) => `<li class="popup__feature popup__feature--${item}"></li>`).join(``);

    updateCardImg(cardAdvert, `.popup__photo`, cardData.offer.photos[0]);

    return cardAdvert;
  };

  /* Открывает и закрывает карточку */
  const removeMapCard = function () {
    const mapCard = window.main.map.querySelector(`.map__card`);
    if (mapCard !== null) {
      mapCard.remove();
    }
  };

  const onPopupCloseClick = (evt) => {
    evt.preventDefault();
    removeMapCard();
  };
  const onEscPress = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      removeMapCard();
    }
  };

  const hidePins = function () {
    let buttonsPin = window.map.mapPins.querySelectorAll(`button`);
    buttonsPin.forEach((item) => {
      if (item.className === `map__pin`) {
        item.remove();
      }
    });
  };

  const renderPins = function (myPinsData) {
    removeMapCard();
    hidePins();
    const fragment = document.createDocumentFragment();
    const maxPinsCount = MAX_SIMILAR_PINS_COUNT < myPinsData.length ? MAX_SIMILAR_PINS_COUNT : myPinsData.length;
    for (let i = 0; i < maxPinsCount; i++) {
      const cardData = myPinsData[i];
      const newPin = renderButton(cardData);
      cardsList.push(cardData);
      pins.push(newPin);
      fragment.appendChild(newPin);
    }

    mapPins.appendChild(fragment);

    pins.forEach((pin, pinIndex) => {
      pin.addEventListener(`click`, function () {
        if (window.main.map.querySelector(`.map__card`)) {
          removeMapCard();
          const cardData = cardsList[pinIndex];
          createCardAdvert(cardData);
        } else {
          const cardData = cardsList[pinIndex];
          createCardAdvert(cardData);
        }
        const popupClose = document.querySelector(`.popup__close`);
        popupClose.addEventListener(`click`, onPopupCloseClick);
        window.main.map.addEventListener(`keydown`, onEscPress);
      });
    });
    window.main.getMapOpen();
    address.value = `${PIN_LOCATION_X}, ${PIN_LOCATION_Y + PIN_TIP}`;
    window.main.form.classList.remove(`ad-form--disabled`);
    window.main.getFieldsetActive();
    pins.forEach((pin) => pin.classList.remove(`hidden`));
  };

  const filterFunction = function () {
    const newType = housingType.value;
    const newPrice = housingPrice.value;
    const newRooms = housingRooms.value;
    const newGuests = housingGuests.value;
    // console.log(pinsData);
    // console.log(newPrice);
    let newPinsData = pinsData.filter(function (pinData) {
      if (newType === `any`) {
        return true;
      }
      return pinData.offer.type === newType;
    });
    newPinsData = newPinsData.filter(function (pinData) {
      if (newPrice === `middle`) {
        return (pinData.offer.price > 10000) & (pinData.offer.price < 50000);
      }
      if (newPrice === `low`) {
        return (pinData.offer.price <= 10000);
      }
      if (newPrice === `high`) {
        return (pinData.offer.price >= 50000);
      }
      return true;
    });
    newPinsData = newPinsData.filter(function (pinData) {
      if (newRooms === `any`) {
        return true;
      }
      // console.log(pinData.offer.rooms);
      // console.log(newRooms);
      return pinData.offer.rooms === Number(newRooms);
    });
    newPinsData = newPinsData.filter(function (pinData) {
      if (newGuests === `any`) {
        return true;
      }
      return pinData.offer.guests === Number(newGuests);
    });
    newPinsData = newPinsData.filter(function (pinData) {
      const featuresOn = window.main.map.querySelectorAll(`.map__checkbox:checked`);
      return Array.from(featuresOn).every((featureOn) => pinData.offer.features.includes(featureOn.value));
    });
    window.debounce.setDebounce(renderPins(newPinsData));
  };

  // window.main.filters.addEventListener(`change`, window.setDebounce(filterFunction));
  window.main.filters.addEventListener(`change`, filterFunction);

  window.map = {
    mainMapPin,
    mapPins,
    successHandler,
    address,
    PIN_TIP,
    minMapX,
    maxMapX,
    minMapY,
    maxMapY,
    hidePins,
    removeMapCard
  };
})();
