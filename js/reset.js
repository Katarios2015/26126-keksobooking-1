'use strict';
(function () {
  var noteForm = document.querySelector('.ad-form');
  var resetButton = noteForm.querySelector('.ad-form__reset');
  var removePins = function () {
    var pins = window.map.mapBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
    [].forEach.call(pins, function (element) {
      window.pin.copyPinsBlock.removeChild(element);
    });
  };
  var InitialCoordsMainPin = {
    top: window.map.mapPinMain.style.top,
    left: window.map.mapPinMain.style.left
  };

  var replaseMainPinToInitial = function () {
    var LastCoordsMainPin = window.map.getCurrentCoords(window.map.mapPinMain);
    if (LastCoordsMainPin.left !== InitialCoordsMainPin.left) {
      window.map.mapPinMain.style.left = InitialCoordsMainPin.left;
    }
    if (LastCoordsMainPin.top !== InitialCoordsMainPin.top) {
      window.map.mapPinMain.style.top = InitialCoordsMainPin.top;
    }
  };

  var resetButtonClickHandler = function (evt) {
    evt.preventDefault();
    noteForm.reset();
    removePins();
    window.card.closePopup();
    window.form.makeDisabled(true);
    window.form.roomNumberChangeHandler();
    window.map.mapBlock.classList.add('map--faded');
    replaseMainPinToInitial();
    window.form.noteAdress.value = window.form.getPositionMainPin();
    window.form.activeForm.classList.add('ad-form--disabled');
    resetButton.removeEventListener('click', resetButtonClickHandler);
    window.map.mapPinMain.addEventListener('mousedown', window.map.mapPinMainMouseDownHandler);
  };
  window.reset = {
    resetButton: noteForm.querySelector('.ad-form__reset'),
    resetButtonClickHandler: resetButtonClickHandler,
  };
})();
