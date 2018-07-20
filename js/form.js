'use strict';
(function () {
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
  var noteFormFields = document.querySelectorAll('fieldset');
  var makeDisabled = function (status) {
    if (noteFormFields.length > 0) {
      [].forEach.call(noteFormFields, function (item) {
        item.disabled = status;
      });
    }
  };
  makeDisabled(true);
  var noteAdress = document.querySelector('#address');

  var getPositionMainPin = function (active) {
    var mapPinMainX = Math.floor(parseInt(window.map.mapPinMain.style.left, 10) + window.map.mapPinMain.offsetWidth / 2);
    var mapPinMainY = Math.floor(parseInt(window.map.mapPinMain.style.top, 10) + window.map.mapPinMain.offsetHeight / 2);
    if (active) {
      mapPinMainY = Math.floor(parseInt(window.map.mapPinMain.style.top, 10) + window.map.mapPinMain.offsetHeight + active);
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
  var titleInputHandler = function () {
    title.setCustomValidity('');
    title.style.borderColor = 'none';
  };
  var priceInputHandler = function () {
    price.setCustomValidity('');
    price.style.borderColor = 'none';
  };
  var successPage = document.querySelector('.success');
  var successPageCloseEscPressHandler = function (evt) {
    window.utils.isEscEvent(evt, function () {
      successPage.classList.add('hidden');
    });
    document.removeEventListener('keydown', successPageCloseEscPressHandler);
  };
  var successPageClickHandler = function () {
    successPage.classList.add('hidden');
    successPage.removeEventListener('click', successPageClickHandler);
  };
  var noteForm = document.querySelector('.ad-form');
  var submitButton = noteForm.querySelector('.ad-form__submit');
  var successHandlerUpload = function () {
    successPage.classList.remove('hidden');
    successPage.addEventListener('click', successPageClickHandler);
    document.addEventListener('keydown', successPageCloseEscPressHandler);
  };

  var errorHandlerUpload = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: gray;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };
  submitButton.addEventListener('click', function (evt) {
    window.backend.upload(successHandlerUpload, errorHandlerUpload, new FormData(noteForm));
    window.reset.handler(evt);
    evt.preventDefault();
  });

  window.form = {
    noteForm: noteForm,
    activeForm: document.querySelector('.ad-form'),
    noteAdress: noteAdress,
    roomNumber: roomNumber,
    capacity: capacity,
    type: type,
    price: price,
    title: title,
    timein: timein,
    timeout: timeout,
    makeDisabled: makeDisabled,
    getPositionMainPin: getPositionMainPin,
    timeinChangeHandler: timeinChangeHandler,
    timeoutChangeHandler: timeoutChangeHandler,
    roomNumberChangeHandler: roomNumberChangeHandler,
    typeChangeHandler: typeChangeHandler,
    titleInputHandler: titleInputHandler,
    priceInputHandler: priceInputHandler,
    priceValidHandler: priceValidHandler,
    titleValidHandler: titleValidHandler
  };
})();
