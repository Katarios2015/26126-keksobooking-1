'use strict';
(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var SUCCESS_CODE = 200;
  var TIMEOUT = 10000;

  var backend = function (onLoad, onError, cb) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIMEOUT; // 10s
    cb(xhr);
  };

  window.backend = {
    load: function (onLoad, onError) {
      backend(onLoad, onError, function (xhr) {
        xhr.open('GET', URL_LOAD);
        xhr.send();
      });
    },
    upload: function (onLoad, onError, data) {
      backend(onLoad, onError, function (xhr) {
        xhr.open('POST', URL_UPLOAD);
        xhr.send(data);
      });
    }
  };
})();
