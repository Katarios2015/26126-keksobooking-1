'use strict';
(function () {
  var PRICES_TO_COMPARE = {
    low: 10000,
    high: 50000
  };
  var mapFilters = document.querySelector('.map__filters');
  var updatePins = function (offers) {
    var filteredOffers = offers.slice();
    var selectorFilters = mapFilters.querySelectorAll('select');
    var featuresFilters = mapFilters.querySelectorAll('input[type=checkbox]:checked');
    var filterRules = {
      'housing-type': 'type',
      'housing-rooms': 'room',
      'housing-guests': 'guests'
    };
    var filterByValue = function (element, property) {
      return filteredOffers.filter(function (offerData) {
        return offerData.offer[property].toString() === element.value;
      });
    };
    var filterByPrice = function (priceFilter) {
      return filteredOffers.filter(function (offerData) {
        var priceFilterValues = {
          'middle': offerData.offer.price >= PRICES_TO_COMPARE.low && offerData.offer.price < PRICES_TO_COMPARE.high,
          'low': offerData.offer.price < PRICES_TO_COMPARE.low,
          'high': offerData.offer.price >= PRICES_TO_COMPARE.high
        };
        return priceFilterValues[priceFilter.value];
      });
    };
    var filterByFeatures = function (item) {
      return filteredOffers.filter(function (offerData) {
        return offerData.offer.features.indexOf(item.value) >= 0;
      });
    };
    if (selectorFilters.length !== null) {
      selectorFilters.forEach(function (item) {
        if (item.value !== 'any') {
          if (item.id !== 'housing-price') {
            filteredOffers = filterByValue(item, filterRules[item.id]);
          } else {
            filteredOffers = filterByPrice(item);
          }
        }
      });
    }
    if (featuresFilters !== null) {
      featuresFilters.forEach(function (item) {
        filteredOffers = filterByFeatures(item);
      });
    }
    if (filteredOffers.length) {
      window.pin.remove();
      window.pin.render(filteredOffers);
    }
  };
  window.filters = {
    updatePins: function (offers) {
      updatePins(offers);
    },
    mapFilters: mapFilters
  };
})();
