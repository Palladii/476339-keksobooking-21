'use strict';

(function () {
  const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

  const avatarChooser = document.querySelector(`.ad-form-header__input`);
  const houseChooser = document.querySelector(`.ad-form__input`);
  const avatarPreview = document.querySelector(`.ad-form-header__preview img`);
  const photoContainer = document.querySelector(`.ad-form__photo-container`);
  const previewHouseBlockTemplate = document.querySelector(`.ad-form__photo`).cloneNode(true);

  let rightAvatar = true;

  avatarChooser.addEventListener(`change`, () => {
    const file = avatarChooser.files[0];
    const fileName = file.name.toLowerCase();
    avatarPreview.src = ``;
    rightAvatar = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (rightAvatar) {
      const reader = new FileReader();
      reader.addEventListener(`load`, () => {
        avatarPreview.src = reader.result;
      });
      reader.addEventListener(`error`, window.map.errorHandler);
      reader.readAsDataURL(file);
    } else {
      window.map.errorHandler();
    }
  });

  let rightHouse = true;
  houseChooser.addEventListener(`change`, () => {
    const file = houseChooser.files[0];
    const fileName = file.name.toLowerCase();
    const prevUpload = document.getElementById(`photo-preview`);
    if (prevUpload !== null) {
      prevUpload.remove();
    }

    const previewHouse = document.createElement(`img`);
    previewHouse.width = `70`;
    previewHouse.height = `70`;
    previewHouse.src = ``;
    previewHouse.alt = `Превью`;
    const previewHouseBlock = previewHouseBlockTemplate.cloneNode(true);
    previewHouseBlock.setAttribute(`id`, `photo-preview`);
    previewHouseBlock.append(previewHouse);
    photoContainer.append(previewHouseBlock);

    rightHouse = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (rightHouse) {
      const reader = new FileReader();

      reader.addEventListener(`load`, () => {
        previewHouse.src = reader.result;
      });
      reader.addEventListener(`error`, window.error.onLoadErrorMessage);
      reader.readAsDataURL(file);
    } else {
      window.map.errorHandler();
    }
  });
})();
