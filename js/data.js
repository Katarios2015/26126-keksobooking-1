'use strict';
(function () {
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

  var typesArray = Object.keys(TYPES); // ['flat', 'house' ...]

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
        x: getRandom(0, window.map.mapBlock.offsetWidth),
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

  window.data = {
    types: TYPES,
    notes: notes
  };
})();
