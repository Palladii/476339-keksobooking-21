'use strict';

(function () {
  // двигаем pin

  window.map.mainMapPin.addEventListener(`mousedown`, function (evt) {
    evt.preventDefault(); // обработаем событие начала перетаскивания нашего диалога mousedown

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    }; // Запомним координаты точки, с которой мы начали перемещать диалог

    let dragged = false;

    const onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      dragged = true;

      let shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      const newOffsetTop = window.map.mainMapPin.offsetTop - shift.y;
      const newOffsetLeft = window.map.mainMapPin.offsetLeft - shift.x;

      if (newOffsetTop > window.map.minMapY && newOffsetTop < window.map.maxMapY) {
        window.map.mainMapPin.style.top = newOffsetTop + `px`;
      }

      if (newOffsetLeft > window.map.minMapX && newOffsetLeft < window.map.maxMapX) {
        window.map.mainMapPin.style.left = newOffsetLeft + `px`;
      }

    }; // При каждом движении мыши нам нужно обновлять смещение относительно первоначальной точки, чтобы диалог смещался на необходимую величину

    const onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp); // При отпускании кнопки мыши нужно переставать слушать события движения мыши

      if (dragged) {
        //  отменяем действие по умолчанию, если перемещение имело место.
        const onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          window.map.mainMapPin.removeEventListener(`click`, onClickPreventDefault);
        };
        window.map.mainMapPin.addEventListener(`click`, onClickPreventDefault);
      }

      window.map.address.value = `${parseInt(window.map.mainMapPin.style.left, 10)}, ${parseInt(window.map.mainMapPin.style.top, 10) + window.map.PIN_TIP}`;
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp); // обработчики события передвижения мыши и отпускания кнопки мыши
  });
})();
