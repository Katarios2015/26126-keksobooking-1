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
var SIZE_PIN_END = 22;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var TYPE_PRICE = {
  'flat': '1000',
  'bungalo': '0',
  'house': '5000',
  'palace': '10000'
};
var ROOMS_CAPACITY = {
  '1': ['1'],
  '2': ['2', '1'],
  '3': ['3', '2', '1'],
  '100': ['0']
};

var typesArray = Object.keys(TYPES); // ['flat', 'house' ...]

var map = document.querySelector('.map');
var closePopupBtn = null;

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

var closePopup = function () {
  var mapCardPopup = map.querySelector('.popup');

  if (mapCardPopup) {
    map.removeChild(mapCardPopup);
    document.removeEventListener('keydown', PopupCloseEscPressHandler);
  }
};

var renderPins = function (note) {
  var onePin = copyPinTemplate.cloneNode(true);

  onePin.addEventListener('click', function () {
    closePopup();
    renderCard(note);
  });

  onePin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup();
      renderCard(note);
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

var closeButtonHandler = function () {
  closePopup();
};

var renderCard = function (note) {
  var card = copyCardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = note.offer.title;
  card.querySelector('.popup__text--address').textContent = note.offer.address;
  card.querySelector('.popup__text--price').textContent = note.offer.price + ' ₽/ночь';
  card.querySelector('.popup__type').textContent = TYPES[note.offer.type].ru;
  card.querySelector('.popup__text--capacity').textContent = note.offer.rooms + 'комнаты для' + note.offer.guests;
  card.querySelector('.popup__text--time').textContent = 'Заезд после' + note.offer.checkin + ',' + 'выезд до' + note.offer.checkout + '.';

  closePopupBtn = card.querySelector('.popup__close');
  closePopupBtn.addEventListener('click', closeButtonHandler);

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
  document.addEventListener('keydown', PopupCloseEscPressHandler);
  return card;
};

var PopupCloseEscPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
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
var noteAdress = document.querySelector('#address');
var getPositionMainPin = function (active) {
  var mapPinMainX = Math.floor(parseInt(mapPinMain.style.left, 10) + mapPinMain.offsetWidth / 2);
  var mapPinMainY = Math.floor(parseInt(mapPinMain.style.top, 10) + mapPinMain.offsetHeight / 2);
  if (active) {
    mapPinMainY = Math.floor(parseInt(mapPinMain.style.top, 10) + mapPinMain.offsetHeight + active);
  }
  var PositionMainPin = mapPinMainX.toString(10) + ', ' + mapPinMainY.toString(10);
  return PositionMainPin;
};
noteAdress.value = getPositionMainPin();

var roomNumber = document.querySelector('#room_number');
var capacity = document.querySelector('#capacity');
var type = document.querySelector('#type');
var price = document.querySelector('#price');
var title = document.querySelector('#title');

var roomNumberChangeHandler = function () {
  if (capacity.options.length > 0) {
    [].forEach.call(capacity.options, function (item) {
      item.selected = (ROOMS_CAPACITY[roomNumber.value][0] === item.value) ? true : false;
      item.hidden = (ROOMS_CAPACITY[roomNumber.value].indexOf(item.value) >= 0) ? false : true;
    });
  }
};
roomNumberChangeHandler();

var typeChangeHandler = function () {
  var minPrice = TYPE_PRICE[type.value];
  price.min = minPrice;
  price.placeholder = minPrice;
};

typeChangeHandler();

var timeout = document.querySelector('#timeout');
var timein = document.querySelector('#timein');

var timeinChangeHandler = function () {
  timeout.value = timein.value;
};
var timeoutChangeHandler = function () {
  timein.value = timeout.value;
};

var priceValidHandler = function () {
  if (price.validity.rangeOverflow) {
    price.setCustomValidity('Максимальная цена за ночь  1 000 000р.');
  } else if (price.validity.valueMissing) {
    price.setCustomValidity('Поле обязательно для заполнения');
  }
  price.style.borderColor = '#C62222';
};

var titleValidHandler = function () {
  if (title.validity.valueMissing || title.validity.tooShort) {
    title.setCustomValidity('Заголовок объявления должен быть не менее 30 символов');
    title.style.borderColor = '#C62222';
  } else if (title.validity.tooLong) {
    title.setCustomValidity('Заголовок объявления должен быть не более 100 символов');
    title.style.borderColor = '#C62222';
  }
};
var noteForm = document.querySelector('.ad-form');
var resetButton = noteForm.querySelector('.ad-form__reset');

var removePins = function () {
  var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
  [].forEach.call(pins, function (element) {
    copyPinsBlock.removeChild(element);
  });
};
var titleInputHandler = function () {
  title.setCustomValidity('');
  title.style.borderColor = 'none';
};
var priceInputHandler = function () {
  price.setCustomValidity('');
  price.style.borderColor = 'none';
};

var mapFiltersBlock = map.querySelector('.map__filters-container');

var getCurrentCoords = function (elem) {
  var currentElement = elem.getBoundingClientRect();
  return {
    top: currentElement.top + pageYOffset,
    left: currentElement.left + pageXOffset
  };
};

var InitialCoordsMainPin = {
  top: mapPinMain.style.top,
  left: mapPinMain.style.left
};

var replaseMainPinToInitial = function () {
  var LastCoordsMainPin = getCurrentCoords(mapPinMain);
  if (LastCoordsMainPin.left !== InitialCoordsMainPin.left) {
    mapPinMain.style.left = InitialCoordsMainPin.left;
  }
  if (LastCoordsMainPin.top !== InitialCoordsMainPin.top) {
    mapPinMain.style.top = InitialCoordsMainPin.top;
  }
};

var resetButtonClickHandler = function (evt) {
  evt.preventDefault();
  noteForm.reset();
  removePins();
  closePopup();
  makeDisabled(true);
  roomNumberChangeHandler();
  map.classList.add('map--faded');
  replaseMainPinToInitial();
  noteAdress.value = getPositionMainPin();
  activeForm.classList.add('ad-form--disabled');
  resetButton.removeEventListener('click', resetButtonClickHandler);
  mapPinMain.addEventListener('mousedown', mapPinMainMouseDownHandler);
};

var mapPinMainMouseDownHandler = function (evt) {
  evt.preventDefault();
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };
  var mapPinMainCoords = getCurrentCoords(mapPinMain);
  var mapCoords = getCurrentCoords(map);
  var shift = {
    x: startCoords.x - mapPinMainCoords.left,
    y: startCoords.y - mapPinMainCoords.top
  };

  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();
    var newMapPinMainLeft = moveEvt.clientX - shift.x - mapCoords.left;
    var newMapPinMainTop = moveEvt.clientY - shift.y;

    if (newMapPinMainLeft < 0) {
      newMapPinMainLeft = 0;
    }
    var mapRightEdge = map.offsetWidth - mapPinMain.offsetWidth;
    if (newMapPinMainLeft > mapRightEdge) {
      newMapPinMainLeft = mapRightEdge;
    }
    mapPinMain.style.left = newMapPinMainLeft + 'px';
    if (newMapPinMainTop < 0) {
      newMapPinMainTop = 0;
    }
    var mapBottomEdge = map.offsetHeight + map.offsetTop - mapFiltersBlock.offsetHeight - mapPinMain.offsetHeight - SIZE_PIN_END;
    if (newMapPinMainTop > mapBottomEdge) {
      newMapPinMainTop = mapBottomEdge;
    }
    mapPinMain.style.top = newMapPinMainTop + 'px';
  };
  var MapPinMainMouseupHandler = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mouseup', MapPinMainMouseupHandler);
    document.removeEventListener('mousemove', mouseMoveHandler);
    map.classList.remove('map--faded');
    activeForm.classList.remove('ad-form--disabled');
    makeDisabled(false);
    noteAdress.value = getPositionMainPin(SIZE_PIN_END);
    addPinsToFragment(true);
    roomNumber.addEventListener('change', roomNumberChangeHandler);
    type.addEventListener('change', typeChangeHandler);
    timein.addEventListener('change', timeinChangeHandler);
    timeout.addEventListener('change', timeoutChangeHandler);
    title.addEventListener('invalid', titleValidHandler);
    price.addEventListener('invalid', priceValidHandler);
    title.addEventListener('input', titleInputHandler);
    price.addEventListener('input', priceInputHandler);
    resetButton.addEventListener('click', resetButtonClickHandler);
  };
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', MapPinMainMouseupHandler);
};
mapPinMain.addEventListener('mousedown', mapPinMainMouseDownHandler);
