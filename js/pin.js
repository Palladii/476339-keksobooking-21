'use strict';

(function () {
  const MIN_MAP_X = -30;
  const MAX_MAP_X = 1170;
  const MIN_MAP_Y = 45;
  const MAX_MAP_Y = 547;

  // перемещает pin
  window.map.mainPin.addEventListener(`mousedown`, (evt) => {
    evt.preventDefault(); // обработаем событие начала перетаскивания нашего диалога mousedown

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    }; // Запоминает координаты точки, с которой начали перемещать диалог

    let dragged = false;

    const onMouseMove = (moveEvt) => {
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
      const newOffsetTop = window.map.mainPin.offsetTop - shift.y;
      const newOffsetLeft = window.map.mainPin.offsetLeft - shift.x;

      if (newOffsetTop > MIN_MAP_Y && newOffsetTop < MAX_MAP_Y) {
        window.map.mainPin.style.top = newOffsetTop + `px`;
      }

      if (newOffsetLeft > MIN_MAP_X && newOffsetLeft < MAX_MAP_X) {
        window.map.mainPin.style.left = newOffsetLeft + `px`;
      }
      window.map.address.value = `${parseInt(window.map.mainPin.style.left, 10) + window.map.PIN_WIDTH / 2}, ${parseInt(window.map.mainPin.style.top, 10) + window.map.PIN_HEIGHT + window.map.PIN_TIP}`;
    }; // При каждом движении мыши обновляет смещение относительно первоначальной точки, чтобы диалог смещался на необходимую величину

    const onMouseUp = (upEvt) => {
      upEvt.preventDefault();

      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp); // при отпускании кнопки мыши нужно переставать слушать события движения мыши

      if (dragged) {
        //  отменяет действие по умолчанию, если перемещение имело место.
        const onClickPreventDefault = (clickEvt) => {
          clickEvt.preventDefault();
          window.map.mainPin.removeEventListener(`click`, onClickPreventDefault);
        };
        window.map.mainPin.addEventListener(`click`, onClickPreventDefault);
      }
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp); // обработчики события передвижения мыши и отпускания кнопки мыши
  });
})();
