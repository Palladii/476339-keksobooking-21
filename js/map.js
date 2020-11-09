'use strict';

(function () {
  const mapPins = document.querySelector(`.map__pins`);
  const mainMapPin = mapPins.querySelector(`.map__pin--main`);
  const PIN_WIDTH = 40;
  const PIN_HEIGHT = 44;
  const PIN_TIP = 22;
  const address = window.main.form.querySelector(`#address`);
  const buttonTemplate = document.querySelector(`#pin`).content.querySelector(`button`);

  const TITLE = [`Уютное место`, `Отдых у моря`, `Для веселой компании`, `Семейная идилия`, `То что надо`, `Дом в облаках`, `Спортивное место`, `Романтическое место`];
  const PRICE = [1000, 1500, 2000, 2500, 3500, 4000, 4100, 10000];
  const TYPE = [`palace`, `flat`, `house`, `bungalow`];
  const avaliableHouseTypes = {bungalow: `bungalow`, flat: `flat`, house: `house`, palace: `palace`};
  const ROOMS = [1, 2, 3, 4, 5];
  const GUESTS = [1, 2, 3, 4];
  const CHECKIN_CHECKOUT = [`12:00`, `13:00`, `14:00`];
  const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
  const DESCRIPTION = [`Лучшее предложение`, `Лучшая цена`, `Высокая оценка гостей`, `Рядом с центром`];
  const PHOTOS_ROOMS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
  const minMapX = 40;
  const maxMapX = 1120;
  const minMapY = 130;
  const maxMapY = 630;
  const maxOffer = 8;

  // Середина метки
  const PIN_LOCATION_X = parseInt(mainMapPin.style.left, 10) - PIN_WIDTH / 2;
  const PIN_LOCATION_Y = parseInt(mainMapPin.style.top, 10) - PIN_HEIGHT / 2;

  // Функция вычисления адреса
  const getAddress = function () {
    address.value = `${PIN_LOCATION_X}, ${PIN_LOCATION_Y}`;
  };
  getAddress();

  // Генерация карточки объявления
  const getNewCard = function (i) {
    return {
      index: i,
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      offer: {
        title: window.data.getRandomElement(TITLE),
        address: `${window.data.getRandomInteger(minMapX, maxMapX)} ${window.data.getRandomInteger(minMapY, maxMapY)}`,
        price: window.data.getRandomElement(PRICE),
        type: window.data.getRandomElement(TYPE),
        rooms: window.data.getRandomElement(ROOMS),
        guests: window.data.getRandomElement(GUESTS),
        checkin: window.data.getRandomElement(CHECKIN_CHECKOUT),
        checkout: window.data.getRandomElement(CHECKIN_CHECKOUT),
        features: window.data.getRandomSubArray(FEATURES),
        description: window.data.getRandomElement(DESCRIPTION),
        photos: window.data.getRandomElement(PHOTOS_ROOMS),
      },
      location: {
        x: window.data.getRandomInteger(minMapX, maxMapX),
        y: window.data.getRandomInteger(minMapY, maxMapY),
      }
    };
  };

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

  const cardsList = [];
  const pins = [];

  // Активация карты по клику
  mainMapPin.addEventListener(`mousedown`, function (evt) {
    if (evt.button === 0) {
      window.main.getMapOpen();
      address.value = `${PIN_LOCATION_X}, ${PIN_LOCATION_Y + PIN_TIP}`;
      window.main.form.classList.remove(`ad-form--disabled`);
      window.main.getFieldsetActive();
      pins.forEach((pin) => pin.classList.remove(`hidden`));
    }
  });

  // Активация карты по нажатию enter
  mainMapPin.addEventListener(`keydown`, function (event) {
    if (event.key === `Enter`) {
      window.main.getMapOpen();
      address.value = `${PIN_LOCATION_X}, ${PIN_LOCATION_Y + PIN_TIP}`;
      window.main.form.classList.remove(`ad-form--disabled`);
      window.main.getFieldsetActive();
      pins.forEach((pin) => pin.classList.remove(`hidden`));
    }
  });

  const fragment = document.createDocumentFragment(); // Создает новый пустой DocumentFragment
  for (let i = 0; i < maxOffer; i++) {
    const cardData = getNewCard(i);
    const newPin = renderButton(cardData);
    cardsList.push(cardData);
    pins.push(newPin);
    fragment.appendChild(newPin);
  }

  mapPins.appendChild(fragment);

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
    let cardAdvertFeaturesList = cardAdvert.querySelectorAll(`.popup__feature`);
    let cardAdvertFeature = cardAdvert.querySelector(`.popup__feature--wifi`).cloneNode(true);

    for (let i = 0; i < cardAdvertFeaturesList.length; i++) {
      cardAdvertFeaturesList[i].remove();
    }

    cardAdvertFeature.innerHTML = cardData.offer.features.map((item) => `<li class="popup__feature popup__feature--${item}"></li>`).join(``);

    updateCardImg(cardAdvert, `.popup__photo`, cardData.offer.photos);

    return cardAdvert;
  };

  /* Открывает и закрывает карточку */
  const removeMapCard = function () {
    window.main.map.querySelector(`.map__card`).remove();
  };

  const onPopupСloseClick = (evt) => {
    evt.preventDefault();
    removeMapCard();
  };
  const onEscPress = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      removeMapCard();
    }
  };

  pins.forEach((pin) => {
    pin.addEventListener(`click`, function () {
      if (window.main.map.querySelector(`.map__card`)) {
        removeMapCard();
        const cardData = cardsList[pin.dataset.index];
        createCardAdvert(cardData);
      } else {
        const cardData = cardsList[pin.dataset.index];
        createCardAdvert(cardData);
      }
      const popupСlose = document.querySelector(`.popup__close`);
      popupСlose.addEventListener(`click`, onPopupСloseClick);
      window.main.map.addEventListener(`keydown`, onEscPress);
    });
  });

  window.map = {
    mainMapPin,
    address,
    PIN_TIP,
    minMapX,
    maxMapX,
    minMapY,
    maxMapY
  };
})();
