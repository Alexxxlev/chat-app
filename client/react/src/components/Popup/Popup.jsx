import React, { useEffect } from "react";

const Popup = ({ isOpen, onClose, srcImg }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      const popupContainer = document.querySelector(".popup__container");

      if (popupContainer && !popupContainer.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`popup ${isOpen ? "popup--open" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="popup__container" role="document">
        <button
          className="popup__close"
          aria-label="Закрыть попап"
          onClick={onClose}
        >
          ×
        </button>
        <img
          className="popup__image"
          src={srcImg}
          alt="Увеличенное изображение для просмотра"
        />
      </div>
    </div>
  );
};

export default Popup;
