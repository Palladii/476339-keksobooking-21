'use strict';

const TITLE = ['Уютное место', 'Отдых у моря', 'Для веселой компании', 'Семейная идилия', 'То что надо', 'Дом в облаках', 'Спортивное место', 'Романтическое место'];
const PRICE = [1000, 1500, 2000, 2500, 3500, 4000, 4100, 10000];
const TYPE = ['palace', 'flat', 'house', 'bungalow'];
const ROOMS = [1, 2, 3, 4, 5];
const GUESTS = [1, 2, 3, 4];
const CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];
const FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
const DESCRIPTION = ['Лучшее предложение', 'Лучшая цена', 'Высокая оценка гостей', 'Рядом с центром'];
const PHOTOS_ROOMS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
const minMapX = 40;
const maxMapX = 1160;
const minMapY = 130;
const maxMapY = 630;
const minOffer = 1;
const maxOffer = 8;

const map = document.querySelector('.map');
map.classList.remove('map--faded');

const mapPins = document.querySelector('.map__pins');
const buttonTemplate = document.querySelector('#pin').content.querySelector('button');

const getRandomInteger = function (min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomElement = function (items) {
  let item = items[Math.floor(Math.random() * items.length)];
  return item;
};

const getNewCard = function () {
  return {
    author: {
      avatar: "img/avatars/user0" + getRandomInteger(minOffer, maxOffer) + ".png",
    },
    offer: {
      title: getRandomElement(TITLE),
      address: 'location.x, location.y',
      price: getRandomElement(PRICE),
      type: getRandomElement(TYPE),
      rooms: getRandomElement(ROOMS),
      guests: getRandomElement(GUESTS),
      checkin: getRandomElement(CHECKIN_CHECKOUT),
      checkout: getRandomElement(CHECKIN_CHECKOUT),
      features: getRandomElement(FEATURES),
      description: getRandomElement(DESCRIPTION),
      photos: getRandomElement(PHOTOS_ROOMS),
    },
    location: {
      x: getRandomInteger(minMapX, maxMapX),
      y: getRandomInteger(minMapY, maxMapY),
    }
  };
};


var renderButton = function (cardData) {
  var buttonPin = buttonTemplate.cloneNode(true);
  buttonPin.style.left = `${cardData.location.x}px`;
  buttonPin.style.top = `${cardData.location.y}px`;
  buttonPin.querySelector('img').src = cardData.author.avatar;
  return buttonPin;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < maxOffer; i++) {
  fragment.appendChild(renderButton(getNewCard()));
}

mapPins.appendChild(fragment);

