'use strict';

(function () {
  const PIN_WIDTH = 62;
  const PIN_HEIGHT = 62;
  const PIN_TIP = 22;
  const MAX_SIMILAR_PINS_COUNT = 5;

  const mapPin = document.querySelector(`.map__pins`);
  const mainPin = mapPin.querySelector(`.map__pin--main`);
  const address = window.main.form.querySelector(`#address`);
  const buttonTemplate = document.querySelector(`#pin`).content.querySelector(`button`);
  const mapCardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
  const AvaliableHouseTypes = {bungalow: `bungalow`, flat: `flat`, house: `house`, palace: `palace`};
  const housingType = window.main.map.querySelector(`#housing-type`);
  const housingPrice = window.main.map.querySelector(`#housing-price`);
  const housingRooms = window.main.map.querySelector(`#housing-rooms`);
  const housingGuests = window.main.map.querySelector(`#housing-guests`);
  const cardsList = [];
  const pins = [];
  let pinsData = [];

  const errorHandler = (errorMessage) => {
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
  const PIN_LOCATION_X = parseInt(mainPin.style.left, 10) + PIN_WIDTH / 2;
  const PIN_LOCATION_Y = parseInt(mainPin.style.top, 10) + PIN_HEIGHT / 2;

  // Функция вычисления адреса
  const getAddress = () => {
    address.value = `${PIN_LOCATION_X}, ${PIN_LOCATION_Y}`;
  };
  getAddress();

  // Получаем метку на карте
  const renderButton = (cardData, ix) => {
    const buttonPin = buttonTemplate.cloneNode(true);
    buttonPin.style.left = `${cardData.location.x}px`;
    buttonPin.style.top = `${cardData.location.y}px`;
    buttonPin.querySelector(`img`).src = cardData.author.avatar;
    buttonPin.dataset.index = cardData.index;
    buttonPin.classList.add(`hidden`);
    buttonPin.dataset.index = ix;
    return buttonPin;
  };

  const outputMessage = () => {
    if (window.main.form.classList.contains(`ad-form--disabled`)) {
      window.main.form.classList.remove(`ad-form--disabled`);
      window.load.getAdsData((adsData = []) => {
        window.main.getFieldsetActive();
        pinsData = adsData;
        renderPins(pinsData);
      }, errorHandler);
    }
  };

  mainPin.addEventListener(`mousedown`, (evt) => {
    if (evt.button === 0) {
      outputMessage();
    }
  });

  mainPin.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Enter`) {
      outputMessage();
    }
  });

  const HouseType = {
    [AvaliableHouseTypes.bungalow]: `Бунгало`,
    [AvaliableHouseTypes.flat]: `Квартира`,
    [AvaliableHouseTypes.house]: `Дом`,
    [AvaliableHouseTypes.palace]: `Дворец`
  };

  const getCardType = (cardDataType) => {
    return HouseType[cardDataType];
  };

  const updateCardData = (cardAdvert, selector, value) => {
    const element = cardAdvert.querySelector(selector);
    if (value) {
      element.textContent = value;
      return;
    }
    element.classList.add(`hidden`);
  };

  const updateCardImg = (cardAdvert, selector, value) => {
    const elementImg = cardAdvert.querySelector(selector);
    if (value) {
      elementImg.src = value;
      return;
    }
    elementImg.remove();
  };
  const createCardAdvert = (cardData) => {

    const cardAdvert = mapCardTemplate.cloneNode(true);

    mapPin.appendChild(cardAdvert);

    updateCardImg(cardAdvert, `.popup__avatar`, cardData.author.avatar);

    if (cardData.offer !== undefined) {
      updateCardData(cardAdvert, `.popup__title`, cardData.offer.title);
      updateCardData(cardAdvert, `.popup__text--address`, cardData.offer.address);
      updateCardData(cardAdvert, `.popup__text--price`, cardData.offer.price ? `${cardData.offer.price}₽/ночь` : null);
      updateCardData(cardAdvert, `.popup__text--capacity`, cardData.offer.rooms && cardData.offer.guests ? `${cardData.offer.rooms} комнат для ${cardData.offer.guests}` : null);
      updateCardData(cardAdvert, `.popup__text--time`, cardData.offer.checkin && cardData.offer.checkout ? `Заезд после ${cardData.offer.checkin}, выезд до ${cardData.offer.checkout}` : null);
      updateCardData(cardAdvert, `.popup__description`, cardData.offer.description);
      cardAdvert.querySelector(`.popup__type`).textContent = getCardType(cardData.offer.type);
    }
    const featuresContainer = cardAdvert.querySelector(`.popup__features`);
    const featureTamplate = featuresContainer.querySelector(`.popup__feature`);
    let cardAdvertFeaturesList = featuresContainer.querySelectorAll(`.popup__feature`);


    for (let i = 0; i < cardAdvertFeaturesList.length; i++) {
      cardAdvertFeaturesList[i].remove();
    }
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < cardData.offer.features.length; i++) {
      const item = cardData.offer.features[i];
      let feature = featureTamplate.cloneNode(true);
      feature.classList.add(`popup__feature--${item}`);
      fragment.appendChild(feature);
    }
    featuresContainer.innerHTML = ``;
    featuresContainer.appendChild(fragment);

    updateCardImg(cardAdvert, `.popup__photo`, cardData.offer.photos[0]);

    return cardAdvert;
  };

  /* Открывает и закрывает карточку */
  const removeCard = () => {
    const mapCard = window.main.map.querySelector(`.map__card`);
    if (mapCard !== null) {
      mapCard.remove();
    }
  };

  const onPopupCloseClick = (evt) => {
    evt.preventDefault();
    removeCard();
  };
  const onEscPress = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      removeCard();
    }
  };

  const hidePins = () => {
    let buttonsPin = mapPin.querySelectorAll(`button`);
    buttonsPin.forEach((item) => {
      if (item.classList.contains(`map__pin`) && !item.classList.contains(`map__pin--main`)) {
        item.remove();
      }
    });
  };

  const renderPins = (myPinsData) => {
    removeCard();
    hidePins();
    const fragment = document.createDocumentFragment();
    const maxPinsCount = MAX_SIMILAR_PINS_COUNT < myPinsData.length ? MAX_SIMILAR_PINS_COUNT : myPinsData.length;
    for (let i = 0; i < maxPinsCount; i++) {
      const cardData = myPinsData[i];
      const newPin = renderButton(cardData, i);
      cardsList.push(cardData);
      pins.push(newPin);
      fragment.appendChild(newPin);
    }

    mapPin.appendChild(fragment);

    pins.forEach((pin, pinIndex) => {
      pin.classList.remove(`map__pin--active`);
      pin.addEventListener(`click`, (event) => {
        if (window.main.map.querySelector(`.map__card`)) {
          removeCard();
          const cardData = cardsList[pinIndex];
          createCardAdvert(cardData);
        } else {
          const cardData = cardsList[pinIndex];
          createCardAdvert(cardData);
        }
        let clicked = event.target;
        if (clicked.localName === `img`) {
          clicked = clicked.parentElement;
        }
        let activePins = document.querySelectorAll(`.map__pin--active`);
        activePins.forEach((activePin) => {
          activePin.classList.remove(`map__pin--active`);
        });
        clicked.classList.add(`map__pin--active`);
        const popupClose = document.querySelector(`.popup__close`);
        popupClose.addEventListener(`click`, onPopupCloseClick);
        window.main.map.addEventListener(`keydown`, onEscPress);
      });
    });
    window.main.getMapOpen();
    address.value = `${PIN_LOCATION_X}, ${PIN_LOCATION_Y + PIN_TIP}`;


    pins.forEach((pin) => {
      pin.classList.remove(`hidden`);
    });
  };

  const filterType = (data) => {
    const newType = housingType.value;
    if (newType === `any`) {
      return true;
    }
    return data.offer.type === newType;
  };
  const filterPrice = (data) => {
    const newPrice = housingPrice.value;
    if (newPrice === `middle`) {
      return (data.offer.price > 10000) & (data.offer.price < 50000);
    }
    if (newPrice === `low`) {
      return (data.offer.price <= 10000);
    }
    if (newPrice === `high`) {
      return (data.offer.price >= 50000);
    }
    return true;
  };
  const filterRooms = (data) => {
    const newRooms = housingRooms.value;
    if (newRooms === `any`) {
      return true;
    }
    return data.offer.rooms === Number(newRooms);
  };
  const filterGuests = (data) => {
    const newGuests = housingGuests.value;
    if (newGuests === `any`) {
      return true;
    }
    return data.offer.guests === Number(newGuests);
  };
  const filterFeatures = (data) => {
    const featuresOn = window.main.map.querySelectorAll(`.map__checkbox:checked`);
    return Array.from(featuresOn).every((featureOn) => data.offer.features.includes(featureOn.value));
  };

  const filterFunction = () => {
    let getFilteredArray = pinsData.filter((pinData) => {
      if (filterType(pinData)
        && filterPrice(pinData)
        && filterRooms(pinData)
        && filterGuests(pinData)
        && filterFeatures(pinData)) {
        return true;
      }
      return false;
    });
    const shortArray = getFilteredArray.slice(0, MAX_SIMILAR_PINS_COUNT) || [];
    renderPins(shortArray);
  };

  const setFilter = window.debounce.setHold(filterFunction);

  window.main.filter.addEventListener(`change`, setFilter);


  window.map = {
    mainPin,
    address,
    PIN_TIP,
    hidePins,
    removeCard,
    PIN_WIDTH,
    PIN_HEIGHT,
    getAddress
  };
})();
