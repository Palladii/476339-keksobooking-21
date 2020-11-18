'use strict';

(function () {
  const TIMEOUT = 10000;

  const URL_GET = `https://21.javascript.pages.academy/keksobooking/data`;
  const URL_SEND = `https://21.javascript.pages.academy/keksobooking`;

  const handleRequest = (xhr, onSuccess, onError) => {
    xhr.addEventListener(`load`, () => {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError(`Ошибка загрузки данных`);
      }
    });

    xhr.addEventListener(`timeout`, () => {
      onError(`Загрузка более ${xhr.timeout} мс`);
    });

    xhr.timeout = TIMEOUT;
  };

  const getAdsData = (onSuccess, onError) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    handleRequest(xhr, onSuccess, onError);

    xhr.open(`GET`, URL_GET);
    xhr.send();
  };

  const upload = (data, onSuccess, onError) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    handleRequest(xhr, onSuccess, onError);

    xhr.open(`POST`, URL_SEND);
    xhr.send(data);
  };

  window.load = {
    getAdsData,
    upload
  };
})();
