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

  var addPinsToFragment = function () {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < window.data.notes.length; i++) {
      fragment.appendChild(renderPins(window.data.notes[i]));
    }

    copyPinsBlock.appendChild(fragment);
  };

  window.pin = {
    addPinsToFragment: addPinsToFragment,
    copyPinsBlock: copyPinsBlock
  };
})();
