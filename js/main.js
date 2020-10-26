'use strict';

const TITLE = [`Уютное место`, `Отдых у моря`, `Для веселой компании`, `Семейная идилия`, `То что надо`, `Дом в облаках`, `Спортивное место`, `Романтическое место`];
const PRICE = [1000, 1500, 2000, 2500, 3500, 4000, 4100, 10000];
const TYPE = [`palace`, `flat`, `house`, `bungalow`];
const houseType = {palace: `Дворец`, flat: `Квартира`, house: `Дом`, bungalow: `Бунгало`};
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

const mapElement = document.querySelector(`.map`);
mapElement.classList.remove(`map--faded`);

const mapPins = document.querySelector(`.map__pins`);
const buttonTemplate = document.querySelector(`#pin`).content.querySelector(`button`);

const getRandomInteger = function (min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomElement = function (items) {
  const item = items[Math.floor(Math.random() * items.length)];
  return item;
};

const removeItemFromArray = function (array, index) {
  const filteredArray = array.filter(function (item, i) {
    if (index !== i) {
      return true;
    } else {
      return false;
    }
    /* заменить return i !== index; */
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

const randomArray = getRandomSubArray(FEATURES);

const getNewCard = function (i) {
  return {
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


const renderButton = function (cardData) {
  let buttonPin = buttonTemplate.cloneNode(true);
  buttonPin.style.left = `${cardData.location.x}px`;
  buttonPin.style.top = `${cardData.location.y}px`;
  buttonPin.querySelector(`img`).src = cardData.author.avatar;
  return buttonPin;
};

const fragment = document.createDocumentFragment();
for (let i = 0; i < maxOffer; i++) {
  fragment.appendChild(renderButton(getNewCard(i)));
}

mapPins.appendChild(fragment);

// module3-task2

const mapCardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const filters = document.querySelector(`.map__filters-container`);

const getCardType = function (cardDataType) {
  let cardType;
  switch (cardDataType) {
    case `flat`:
      cardType = houseType.flat;
      break;
    case `bungalow`:
      cardType = houseType.bungalow;
      break;
    case `house`:
      cardType = houseType.house;
      break;
    case `palace`:
      cardType = houseType.palace;
      break;
  }
  return cardType;
};

const updateCardData = function (cardAdvert, selector, value) {
  const element = cardAdvert.querySelector(selector);
  if (value) {
    element.textContent = value;
  } else {
    element.remove();
  }
};

const updateCardImg = function (cardAdvert, selector, value) {
  const elementImg = cardAdvert.querySelector(selector);
  if (value) {
    elementImg.src = value;
  } else {
    elementImg.remove();
  }
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

  let cardAdvertFeatures = cardAdvert.querySelector(`.popup__features`);
  let cardAdvertFeaturesList = cardAdvert.querySelectorAll(`.popup__feature`);
  let cardAdvertFeature = cardAdvert.querySelector(`.popup__feature--wifi`).cloneNode(true);

  for (let i = 0; i < cardAdvertFeaturesList.length; i++) {
    cardAdvertFeaturesList[i].remove();
  }

  for (let i = 0; i < randomArray.length; i++) {
    let advertCardFeatureClone = cardAdvertFeature.cloneNode(true);
    advertCardFeatureClone.classList.add(`popup__feature--${randomArray[i + 1]}`);
    cardAdvertFeatures.appendChild(advertCardFeatureClone);
  }

  // заменить на cardAdvertFeatures.innerHTML = randomArray.map((item) => `<li class="popup__feature popup__feature--${item}"></li>`).join(``);

  updateCardImg(cardAdvert, `.popup__photo`, cardData.offer.photos);

  return cardAdvert;
};


let cardsArray = [];
for (let i = 0; i < maxOffer; i++) {
  cardsArray.push(createCardAdvert(getNewCard(i)));
}

mapElement.insertBefore(cardsArray[0], filters);
