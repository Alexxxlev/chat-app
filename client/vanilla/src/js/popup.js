import { htmlPopup, htmlPopupImg } from "./constants-html.js";
import { popupIsOpen } from "./constants-string.js";

// Закрывает попап по клику вне его области
let popupClickListenerAdded = false;

const closePopupOnClickOutside = (event) => {
  if (!htmlPopupImg.contains(event.target)) {
    closePopup();
  }
};

const addClosePopupListener = () => {
  if (!popupClickListenerAdded) {
    document.addEventListener("click", closePopupOnClickOutside);
    popupClickListenerAdded = true;
  }
};

// Закрывает попап
export const closePopup = () => {
  htmlPopup.classList.remove(popupIsOpen);
};

/**
 * Открывает попап с изображением
 * @param {string} imageSrc - URL или Base64 изображения
 */
export const openImagePopup = (imageSrc) => {
  if (htmlPopupImg && htmlPopup) {
    htmlPopupImg.src = imageSrc;
    htmlPopup.classList.add(popupIsOpen);

    addClosePopupListener();
  }
};
