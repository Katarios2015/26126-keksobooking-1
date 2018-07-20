'use strict';
(function () {
  var closePopupBtn = null;
  var copyCardBlock = window.map.mapBlock;
  var beforeBlockFilter = document.querySelector('.map__filters-container');
  var copyCardTemplate = document.querySelector('#copy_offers').content.querySelector('.map__card');
  var closePopup = function () {
    var mapCardPopup = window.map.mapBlock.querySelector('.popup');

    if (mapCardPopup) {
      window.map.mapBlock.removeChild(mapCardPopup);
      document.removeEventListener('keydown', popupCloseEscPressHandler);
    }
  };
  var renderCard = function (note) {
    var card = copyCardTemplate.cloneNode(true);
    card.querySelector('.popup__title').textContent = note.offer.title;
    card.querySelector('.popup__text--address').textContent = note.offer.address;
    card.querySelector('.popup__text--price').textContent = note.offer.price + ' ₽/ночь';
    card.querySelector('.popup__type').textContent = window.data.types[note.offer.type].ru;
    card.querySelector('.popup__text--capacity').textContent = note.offer.rooms + 'комнаты для' + note.offer.guests;
    card.querySelector('.popup__text--time').textContent = 'Заезд после' + note.offer.checkin + ',' + 'выезд до' + note.offer.checkout + '.';
    closePopupBtn = card.querySelector('.popup__close');
    closePopupBtn.addEventListener('click', closePopupBtnHandler);
    var featuresElement = card.querySelector('.popup__features');
    var listElements = featuresElement.querySelectorAll('li');
    if (listElements.length > 0) {
      [].forEach.call(listElements, function (item) {
        var liClass = item.classList[1].replace('popup__feature--', '');
        if (note.offer.features.indexOf(liClass) === -1) {
          featuresElement.removeChild(item);
        }
      });
    }
    card.querySelector('.popup__description').textContent = note.offer.description;
    var photos = card.querySelector('.popup__photos');
    var photoElement = photos.querySelector('.popup__photo');
    for (var i = 0; i < note.offer.photos.length; i++) {
      var newPhoto = photoElement.cloneNode(true);
      newPhoto.src = note.offer.photos[i];
      photos.appendChild(newPhoto);
    }
    photos.removeChild(photoElement);
    card.querySelector('.popup__avatar').src = note.author.avatar;
    copyCardBlock.insertBefore(card, beforeBlockFilter);
    document.addEventListener('keydown', popupCloseEscPressHandler);
    return card;
  };
  var closePopupBtnHandler = function () {
    closePopup();
  };
  var popupCloseEscPressHandler = function (evt) {
    window.utils.isEscEvent(evt, closePopup);
  };
  window.card = {
    renderCard: renderCard,
    closePopup: closePopup,
  };
})();
