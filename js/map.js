'use strict';

var NOTES_COUNT = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHEKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];

var map = document.querySelector('.map');

var notes = [];

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// создание одного объекта
var addNote = function (index) {
  var note = {
    author: {
      avatar: 'img/avatars/user0' + ++index + '.png'
    },
    offer: {
      title: TITLES[getRandom(0, TITLES.length - 1)],
      address: String(getRandom(200, 600)) + ', ' + String(getRandom(300, 500)),
      price: getRandom(1000, 1000000),
      type: TYPES[getRandom(0, TYPES.length - 1)],
      rooms: getRandom(1, 5),
      guests: getRandom(1, 4),
      checkin: CHEKINS[getRandom(0, CHEKINS.length - 1)],
      checkout: CHECKOUTS[getRandom(0, CHECKOUTS.length - 1)],
      features: FEATURES.slice(0, getRandom(0, FEATURES.length - 1)),
      description: '',
      photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
    },
    location: {
      x: getRandom(0, map.offsetWidth),
      y: getRandom(130, 630)
    }
  };

  notes.push(note);
};

// заполнение массива
var fillNotes = function () {
  for (var i = 0; i < NOTES_COUNT; i++) {
    addNote(i);
  }
};

fillNotes();

map.classList.remove('map--faded');
var copyPinsBlock = map.querySelector('.map__pins');
var copyPinTemplate = document.querySelector('#copy_offers').content.querySelector('.map__card');
var renderPins = function (note) {
  var onePin = copyPinTemplate.cloneNode(true);
  onePin.querySelector('.map__pin').style.left = note.offer.location.x + 'px';
  onePin.querySelector('.map__pin').style.top = note.offer.location.y + 'px';
  onePin.querySelector('.map__pin').src = note.author.avatar;
  onePin.querySelector('.map__pin').alt = note.offer.title;
  return onePin;
};
var fragment = document.createDocumentFragment();
for (var i = 0; i < notes.length; i++) {
  fragment.appendChild(renderPins(notes[i]));
}
copyPinsBlock.appendchild(fragment);
var copyCardBlock = map;
var beforeBlockFilter = document.querySelector('.map__filters-container');
var copyCardTemplate = document.querySelector('#copy_offers').content.querySelector('.map__card');
var renderCard = function (note) {
  var card = copyCardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = note.offer.title;
  card.querySelector('.popup__text--address').textContent = note.offer.address;
  card.querySelector('.popup__text--price').textContent = note.offer.price + '₽/ночь';
  card.querySelector('.popup__text--price').textContent = note.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = note.offer.type;
  card.querySelector('.popup__text--capacity').textContent = note.offer.rooms + 'комнаты для' + note.offer.guests;
  card.querySelector('.popup__text--time').textContent = 'Заезд после' + note.offer.checkin + ',' + 'выезд до' + note.offer.checkout + '.';
  card.querySelector('.popup__features').li = note.offer.features;
  card.querySelector('.popup__description').textContent = note.offer.description;
  card.querySelector('.popup__photos').src = note.photos;
  card.querySelector('.popup__avatar').src = note.author.avatar;
  copyCardBlock.insertBefore(card, beforeBlockFilter);
  return card;
};
renderCard(notes[0]);
