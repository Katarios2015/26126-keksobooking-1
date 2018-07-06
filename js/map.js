'use strict';

var NOTES_COUNT = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var CHEKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];

var TYPES = {
  flat: {
    ru: 'квартира'
  },
  house: {
    ru: 'дом'
  },
  palace: {
    ru: 'дворец'
  },
  bungalo: {
    ru: 'бунгало'
  }
};
var SIZE_PIN = '100' + ', ' + '50';
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var typesArray = Object.keys(TYPES); // ['flat', 'house' ...]

var map = document.querySelector('.map');

var notes = [];

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var shuffleArray = function (a) {
  var j;
  var x;
  var i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
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
      type: typesArray[getRandom(0, typesArray.length - 1)],
      rooms: getRandom(1, 5),
      guests: getRandom(1, 4),
      checkin: CHEKINS[getRandom(0, CHEKINS.length - 1)],
      checkout: CHECKOUTS[getRandom(0, CHECKOUTS.length - 1)],
      features: FEATURES.slice(0, getRandom(0, FEATURES.length - 1)),
      description: '',
      photos: shuffleArray(PHOTOS)
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

var copyPinsBlock = map.querySelector('.map__pins');
var copyPinTemplate = document.querySelector('#copy_offers').content.querySelector('.map__pin');

var renderPins = function (note) {
  var onePin = copyPinTemplate.cloneNode(true);
  onePin.addEventListener('click', function () {
    makePopupHidden(false);
  });
  onePin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      makePopupHidden(false);
    }
  });
  onePin.style.left = note.location.x + 'px';
  onePin.style.top = note.location.y + 'px';
  var pinImage = onePin.querySelector('img');
  pinImage.src = note.author.avatar;
  pinImage.alt = note.offer.title;
  return onePin;
};

var addPinsToFragment = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < notes.length; i++) {
    fragment.appendChild(renderPins(notes[i]));
  }

  copyPinsBlock.appendChild(fragment);
};

var copyCardBlock = map;
var beforeBlockFilter = document.querySelector('.map__filters-container');
var copyCardTemplate = document.querySelector('#copy_offers').content.querySelector('.map__card');

var renderCard = function (note) {
  var card = copyCardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = note.offer.title;
  card.querySelector('.popup__text--address').textContent = note.offer.address;
  card.querySelector('.popup__text--price').textContent = note.offer.price + ' ₽/ночь';
  card.querySelector('.popup__type').textContent = TYPES[note.offer.type].ru;
  card.querySelector('.popup__text--capacity').textContent = note.offer.rooms + 'комнаты для' + note.offer.guests;
  card.querySelector('.popup__text--time').textContent = 'Заезд после' + note.offer.checkin + ',' + 'выезд до' + note.offer.checkout + '.';
  var closePopupBtn = card.querySelector('.popup__close');
  closePopupBtn.addEventListener('click', function () {
    makePopupHidden(true);
  });
  var featuresElement = card.querySelector('.popup__features');
  var listElements = featuresElement.querySelectorAll('li');
  for (var i = 0; i < listElements.length; i++) {
    var liClass = listElements[i].classList[1].replace('popup__feature--', '');
    if (note.offer.features.indexOf(liClass) === -1) {
      featuresElement.removeChild(listElements[i]);
    }
  }

  card.querySelector('.popup__description').textContent = note.offer.description;
  var photos = card.querySelector('.popup__photos');
  var photoElement = photos.querySelector('.popup__photo');

  for (i = 0; i < note.offer.photos.length; i++) {
    var newPhoto = photoElement.cloneNode(true);
    newPhoto.src = note.offer.photos[i];
    photos.appendChild(newPhoto);
  }
  photos.removeChild(photoElement);

  card.querySelector('.popup__avatar').src = note.author.avatar;
  copyCardBlock.insertBefore(card, beforeBlockFilter);
  return card;
};
// закрыть по клавише ESC_KEYCODE
var closePopupEscHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    makePopupHidden(true);
  }
};
var makePopupHidden = function (status) {
  var mapCardPopup = document.querySelector('.popup');
  mapCardPopup.hidden = status;
  if (status) {
    document.removeEventListener('keydown', closePopupEscHandler);
  }
};

var noteFormFields = document.querySelectorAll('fieldset');
var makeDisabled = function (status) {
  if (noteFormFields.length > 0) {
    [].forEach.call(noteFormFields, function (item) {
      item.disabled = status;
    });
  }
};
makeDisabled(true);

var mapPinMain = document.querySelector('.map__pin--main');
var activeForm = document.querySelector('.ad-form');
var noteAdress = document.getElementById('address');

mapPinMain.addEventListener('mouseup', function () {
  map.classList.remove('map--faded');
  activeForm.classList.remove('ad-form--disabled');
  makeDisabled(false);
  noteAdress.value = SIZE_PIN;
  noteAdress.setAttribute('disabled', 'disabled');
  addPinsToFragment(true);
  renderCard(notes[0]);
  makePopupHidden(true);
});
