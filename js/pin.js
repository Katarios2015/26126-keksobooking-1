'use strict';
(function () {
  var copyPinsBlock = window.map.mapBlock.querySelector('.map__pins');
  var copyPinTemplate = document.querySelector('#copy_offers').content.querySelector('.map__pin');
  var renderPins = function (note) {
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
    return onePin;
  };
  var successHandler = function (notes) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < notes.length; i++) {
      fragment.appendChild(renderPins(notes[i]));
    }
    copyPinsBlock.appendChild(fragment);
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
  window.pin = {
    addPinsToFragment: function () {
      window.backend.load(successHandler, errorHandler);
    },
    copyPinsBlock: copyPinsBlock
  };
})();
