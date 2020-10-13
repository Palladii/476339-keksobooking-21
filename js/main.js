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
      avatar: "img/avatars/user0" + getRandomInteger(1, 8) + ".png",
    },
    offer: {
      title: getRandomElement(TITLE),
      address: '600 350',
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
      x: getRandomInteger(20, 1180),
      y: getRandomInteger(130, 630),
    }
  };
};

var buttonObj = [
  {
    avatar: "img/avatars/user0" + getRandomInteger(1, 8) + ".png", x: getRandomInteger(20, 1180),
    y: getRandomInteger(130, 630)
  },
  {
    avatar: "img/avatars/user0" + getRandomInteger(1, 8) + ".png", x: getRandomInteger(20, 1180),
    y: getRandomInteger(130, 630)
  },
  {
    avatar: "img/avatars/user0" + getRandomInteger(1, 8) + ".png", x: getRandomInteger(20, 1180),
    y: getRandomInteger(130, 630)
  }
];

var renderButton = function (button) {
  var buttonPin = buttonTemplate.cloneNode(true);

  buttonPin.querySelector('.map.pin').style.left = buttonObj[i].x;
  buttonPin.querySelector('.map.pin').style.top = buttonObj[i].y;
  buttonPin.querySelector('button.img').src = buttonObj[i].avatar;

  return buttonPin;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < buttonObj.length; i++) {
  fragment.appendChild(renderButton(buttonObj[i]));
}
mapPins.appendChild(fragment);


// var nombOffer = 8;

//
// var mapPins = document.querySelector('.map__pins');
// var buttonTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
//
//

//
//
//
//
// for (var i = 0; i < nombOffer; i++) {
//   var buttonElement = buttonTemplate.cloneNode(true);
//
//   mapPins.appendChild(buttonElement);
// }
//
