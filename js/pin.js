'use strict';
(function () {
  var copyPinsBlock = window.map.mapBlock.querySelector('.map__pins');
  var copyPinTemplate = document.querySelector('#copy_offers').content.querySelector('.map__pin');

  var renderPin = function (note) {
    var onePin = copyPinTemplate.cloneNode(true);

    onePin.addEventListener('click', function () {
      window.card.closePopup();
      window.card.renderCard(note);
    });
    onePin.addEventListener('keydown', function (evt) {
      window.utils.isEnterEvent(evt, function () {
        window.card.closePopup();
        window.card.renderCard(note);
      });
    });
    onePin.style.left = note.location.x + 'px';
    onePin.style.top = note.location.y + 'px';
    var pinImage = onePin.querySelector('img');
    pinImage.src = note.author.avatar;
    pinImage.alt = note.offer.title;

    // return onePin;
    copyPinsBlock.appendChild(onePin);
  };

  var renderPins = function (pins) {
    pins.forEach(function (item) {
      renderPin(item);
    });
  };

  var offers = [];
  var successHandler = function (data) {
    offers = data.slice();
    renderPins(offers.slice(0, 5));
  };
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: gray;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var removePins = function () {
    var pins = window.map.mapBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
    [].forEach.call(pins, function (element) {
      copyPinsBlock.removeChild(element);
    });
  };

  window.pin = {
    copyPinsBlock: copyPinsBlock,
    offers: function () {
      return offers;
    },
    remove: removePins,
    render: renderPins,
    load: function () {
      window.backend.load(successHandler, errorHandler);
    }
  };
})();
