'use strict';

(function () {
  const URL_GET = `https://21.javascript.pages.academy/keksobooking/data`;
  const URL_SEND = `https://21.javascript.pages.academy/keksobooking`;

  const TIMEOUT = 10000;

  const getAdsData = function (onSuccess, onError) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
      onSuccess(xhr.response);
    });
    xhr.addEventListener(`error`, function () {
      onError(`Ошибка загрузки данных`);
    });
    xhr.addEventListener(`timeout`, () => {
      onError(`Загрузка более ${xhr.timeout} мс`);
    });

    xhr.timeout = TIMEOUT;

    xhr.open(`GET`, URL_GET);
    xhr.send();
  };

  const upload = function (data, onSuccess, onError) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
      onSuccess(xhr.response);
    });
    xhr.addEventListener(`error`, function () {
      onError(`Ошибка загрузки данных`);
    });
    xhr.addEventListener(`timeout`, () => {
      onError(`Загрузка более ${xhr.timeout} мс`);
    });

    xhr.timeout = TIMEOUT;

    xhr.addEventListener(`load`, function () {
      onSuccess(xhr.response);
    });

    xhr.open(`POST`, URL_SEND);
    xhr.send(data);
  };

  window.download = {
    getAdsData,
    upload
  };
})();
