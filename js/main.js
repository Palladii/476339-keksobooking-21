'use strict';

const TITLE = [`Уютное место`, `Отдых у моря`, `Для веселой компании`, `Семейная идилия`, `То что надо`, `Дом в облаках`, `Спортивное место`, `Романтическое место`];
const PRICE = [1000, 1500, 2000, 2500, 3500, 4000, 4100, 10000];
const TYPE = [`palace`, `flat`, `house`, `bungalow`];
const houseTypes = {palace: `Дворец`, flat: `Квартира`, house: `Дом`, bungalow: `Бунгало`};
const ROOMS = [1, 2, 3, 4, 5];
const GUESTS = [1, 2, 3, 4];
const CHECKIN_CHECKOUT = [`12:00`, `13:00`, `14:00`];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const DESCRIPTION = [`Лучшее предложение`, `Лучшая цена`, `Высокая оценка гостей`, `Рядом с центром`];
const PHOTOS_ROOMS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const minMapX = 40;
const maxMapX = 1160;
const minMapY = 130;
const maxMapY = 630;
const maxOffer = 8;
const PIN_WIDTH = 40;
const PIN_HEIGHT = 44;
const PIN_TIP = 22;
const roomNumber = document.querySelector(`#room_number`);
const capacity = document.querySelector(`#capacity`);
const typeHousing = document.querySelector(`#type`);
const price = document.querySelector(`#price`);
const map = document.querySelector(`.map`);
const mapPins = document.querySelector(`.map__pins`);
const buttonTemplate = document.querySelector(`#pin`).content.querySelector(`button`);
const mainMapPin = mapPins.querySelector(`.map__pin--main`);
const form = document.querySelector(`.ad-form`);
const fieldsets = form.querySelectorAll(`fieldset`);
const filters = document.querySelector(`.map__filters`);
const address = form.querySelector(`#address`);
const timeIn = document.querySelector(`#timein`);
const timeOut = document.querySelector(`#timeout`);

// Активирует карту
const getMapOpen = function () {
  document.querySelector(`.map`).classList.remove(`map--faded`);
};

// Деактивирует элементы
form.classList.add(`ad-form--disabled`);

for (let field of fieldsets) {
  field.setAttribute(`disabled`, `disabled`);
}

filters.setAttribute(`disabled`, `disabled`);

// Активирует поля
const getFieldsetActive = function () {
  for (let field of fieldsets) {
    field.removeAttribute(`disabled`, `disabled`);
  }
  filters.removeAttribute(`disabled`, `disabled`);
};

// Середина метки
const PIN_LOCATION_X = parseInt(mainMapPin.style.left, 10) - PIN_WIDTH / 2;
const PIN_LOCATION_Y = parseInt(mainMapPin.style.top, 10) - PIN_HEIGHT / 2;

// Функция вычисления адреса
const getAddress = function () {
  address.value = `${PIN_LOCATION_X}, ${PIN_LOCATION_Y}`;
};
getAddress();

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
  const randomItemsAmount = getRandomInteger(0, array.length);
  let newArray = [...array]; // создает копию массива
  for (let i = 0; i < randomItemsAmount; i++) {
    const rendomItemIndex = getRandomInteger(0, newArray.length - 1);
    newArray = removeItemFromArray(newArray, rendomItemIndex);
  }
  return newArray;
};


// Генерация карточки объявления
const getNewCard = function (i) {
  return {
    index: i,
    author: {
      avatar: `img/avatars/user0${i + 1}.png`
    },
    offer: {
      title: getRandomElement(TITLE),
      address: `${getRandomInteger(minMapX, maxMapX)} ${getRandomInteger(minMapY, maxMapY)}`,
      price: getRandomElement(PRICE),
      type: getRandomElement(TYPE),
      rooms: getRandomElement(ROOMS),
      guests: getRandomElement(GUESTS),
      checkin: getRandomElement(CHECKIN_CHECKOUT),
      checkout: getRandomElement(CHECKIN_CHECKOUT),
      features: getRandomSubArray(FEATURES),
      description: getRandomElement(DESCRIPTION),
      photos: getRandomElement(PHOTOS_ROOMS),
    },
    location: {
      x: getRandomInteger(minMapX, maxMapX),
      y: getRandomInteger(minMapY, maxMapY),
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
    getMapOpen();
    address.value = `${PIN_LOCATION_X}, ${PIN_LOCATION_Y + PIN_TIP}`;
    form.classList.remove(`ad-form--disabled`);
    getFieldsetActive();
    pins.forEach((pin) => pin.classList.remove(`hidden`));
  }
});

// Активация карты по нажатию enter
mainMapPin.addEventListener(`keydown`, function (event) {
  if (event.key === `Enter`) {
    getMapOpen();
    address.value = `${PIN_LOCATION_X}, ${PIN_LOCATION_Y + PIN_TIP}`;
    form.classList.remove(`ad-form--disabled`);
    getFieldsetActive();
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

const getCardType = function (cardDataType) {
  let cardType;
  switch (cardDataType) {
    case `flat`:
      cardType = houseTypes.flat;
      break;
    case `bungalow`:
      cardType = houseTypes.bungalow;
      break;
    case `house`:
      cardType = houseTypes.house;
      break;
    case `palace`:
      cardType = houseTypes.palace;
      break;
  }
  return cardType;
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
  map.querySelector(`.map__card`).remove();
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
    if (map.querySelector(`.map__card`)) {
      removeMapCard();
      const cardData = cardsList[pin.dataset.index];
      createCardAdvert(cardData);
    } else {
      const cardData = cardsList[pin.dataset.index];
      createCardAdvert(cardData);
    }
    const popupСlose = document.querySelector(`.popup__close`);
    popupСlose.addEventListener(`click`, onPopupСloseClick);
    map.addEventListener(`keydown`, onEscPress);
  });
});

/* Валидация */
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

const validateHousing = function () {
  const valueHousing = typeHousing.value;
  if (valueHousing === `Бунгало`) {
    price.placeholder = 0;
    price.min = 0;
    typeHousing.setCustomValidity(`Минимальная цена за ночь 0`);
  } else if (valueHousing === `Квартира`) {
    price.placeholder = 1000;
    price.min = 1000;
    typeHousing.setCustomValidity(`Минимальная цена за ночь 1 000`);
  } else if (valueHousing === `Дом`) {
    price.placeholder = 5000;
    price.min = 5000;
    typeHousing.setCustomValidity(`Минимальная цена за ночь 5 000`);
  } else if (valueHousing === `Дворец`) {
    price.placeholder = 10000;
    price.min = 10000;
    typeHousing.setCustomValidity(`Минимальная цена за ночь 10 000`);
  } else {
    typeHousing.setCustomValidity(``);
  }
};
validateHousing();

typeHousing.addEventListener(`change`, function () {
  validateHousing();
});
price.addEventListener(`change`, function () {
  validateHousing();
});

const getTimeOut = function () {
  if (timeOut.value !== timeIn.value) {
    timeOut.setCustomValidity(`Время выезда не может быть позже ` + timeIn.value);
  } else {
    timeOut.setCustomValidity(``);
  }
};

timeOut.addEventListener(`change`, function () {
  getTimeOut();
});
timeIn.addEventListener(`change`, function () {
  getTimeOut();
});
