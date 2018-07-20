'use strict';
(function () {
  var SIZE_PIN_END = 22;
  var mapBlock = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapFiltersBlock = mapBlock.querySelector('.map__filters-container');

  var getCurrentCoords = function (elem) {
    var currentElement = elem.getBoundingClientRect();
    return {
      top: currentElement.top + pageYOffset,
      left: currentElement.left + pageXOffset
    };
  };
  var mapPinMainMouseDownHandler = function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var mapPinMainCoords = getCurrentCoords(mapPinMain);
    var mapCoords = getCurrentCoords(mapBlock);
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
      var mapRightEdge = mapBlock.offsetWidth - mapPinMain.offsetWidth;
      if (newMapPinMainLeft > mapRightEdge) {
        newMapPinMainLeft = mapRightEdge;
      }
      mapPinMain.style.left = newMapPinMainLeft + 'px';
      if (newMapPinMainTop < 0) {
        newMapPinMainTop = 0;
      }
      var mapBottomEdge = mapBlock.offsetHeight + mapBlock.offsetTop - mapFiltersBlock.offsetHeight - mapPinMain.offsetHeight - SIZE_PIN_END;
      if (newMapPinMainTop > mapBottomEdge) {
        newMapPinMainTop = mapBottomEdge;
      }
      mapPinMain.style.top = newMapPinMainTop + 'px';
    };
    var mapFiltersChangeHandler = function () {
      window.pin.removeChild('.map__pin');
      window.card.closePopup();
      window.debounce(window.filters.updatePins(offers), 500);// ЗАМЕНИТЬ
    };
    var mapPinMainMouseupHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mouseup', mapPinMainMouseupHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      mapBlock.classList.remove('map--faded');
      window.form.activeForm.classList.remove('ad-form--disabled');
      window.form.makeDisabled(false);
      window.form.noteAdress.value = window.form.getPositionMainPin(SIZE_PIN_END);
      window.pin.addPinsToFragment(true);
      window.form.roomNumber.addEventListener('change', window.form.roomNumberChangeHandler);
      window.form.type.addEventListener('change', window.form.typeChangeHandler);
      window.form.timein.addEventListener('change', window.form.timeinChangeHandler);
      window.form.timeout.addEventListener('change', window.form.timeoutChangeHandler);
      window.form.title.addEventListener('invalid', window.form.titleValidHandler);
      window.form.price.addEventListener('invalid', window.form.priceValidHandler);
      window.form.title.addEventListener('input', window.form.titleInputHandler);
      window.form.price.addEventListener('input', window.form.priceInputHandler);
      window.filters.mapFilters.addEventListener('change', mapFiltersChangeHandler);
      window.reset.resetButton.addEventListener('click', window.reset.resetButtonClickHandler);
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mapPinMainMouseupHandler);
  };
  mapPinMain.addEventListener('mousedown', mapPinMainMouseDownHandler);
  window.map = {
    mapBlock: mapBlock,
    mapPinMain: document.querySelector('.map__pin--main'),
    getCurrentCoords: getCurrentCoords,
    mapPinMainMouseDownHandler: mapPinMainMouseDownHandler
  };
})();
