import { io } from "socket.io-client";
import {
  urlSocket,
  selAvaMainUser,
  selMessageMainUser,
  selMessage,
  selMessageText,
  selMessageTime,
  selMessageUser,
  selPopupButtonClose,
  socketOptions,
} from "./constants-string.js";

import {
  htmlTempMessage,
  buttonSendMessage,
  buttonSendImg,
  htmlTextMessage,
  htmlListMessage,
  htmlListMessageWrapper,
  htmlInput,
  htmlPrev,
} from "./constants-html.js";

import {
  addImgInPage,
  setUser,
  getListNowUsers,
  addNewUser,
  removeUser,
  addNewMessage,
  offPrev,
} from "./functions.js";

import { closePopup } from "./popup.js";

import { state } from "./state.js";
import { initSidebar } from "./sidebar.js";

const socket = io(urlSocket);

// === Обработчики ===

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  htmlPrev.textContent = file.name;
  state.srcImg = URL.createObjectURL(file);

  const reader = new FileReader();
  reader.onload = () => {
    state.imgInBase64 = reader.result;
  };
  reader.readAsDataURL(file);
};

const sendMessage = () => {
  const messageText = htmlTextMessage.value.trim();

  // Разрешаем отправку сообщения, если есть либо текст, либо картинка
  if (!messageText && !state.imgInBase64) return;

  const newMessage = createMessageElement(
    messageText || " ",
    state.mainUser,
    new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  // Если есть изображение, добавляем его
  if (state.imgInBase64) {
    addImgInPage(state.srcImg, newMessage);
  }

  // Отправляем сообщение через сокет
  socket.emit(socketOptions.sendChatMessage, {
    message: messageText || " ",
    imageFile: state.imgInBase64,
    messageTime: new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  resetMessageInput(newMessage);
};

// Создает DOM-элемент сообщения
const createMessageElement = (text, user, messageTime) => {
  const newMessage = htmlTempMessage.content.cloneNode(true);
  newMessage.querySelector(selMessageText).textContent = text;
  newMessage.querySelector(selMessageUser).textContent = user.name;
  newMessage.querySelector(selMessage).classList.add(selMessageMainUser);
  newMessage.querySelector(selAvaMainUser).src = user.avatar;
  newMessage.querySelector(selMessageTime).textContent = messageTime;

  return newMessage;
};

// Сбрасывает поля ввода после отправки сообщения
const resetMessageInput = (newMessage) => {
  htmlTextMessage.value = "";
  state.imgInBase64 = "";
  htmlPrev.textContent = "";
  htmlInput.value = "";
  htmlListMessage.append(newMessage);
  scrollToBottom();
};

// Функция для прокрутки списка сообщений в самый низ
const scrollToBottom = () => {
  setTimeout(() => {
    htmlListMessageWrapper.scroll({
      top: htmlListMessageWrapper.scrollHeight,
      behavior: "smooth",
    });
  }, 100);
};

// === WebSocket ===
const setupSocketListeners = () => {
  socket.emit(socketOptions.giveName);

  socket.on(socketOptions.giveName, setUser);
  socket.on(socketOptions.giveAllUsers, getListNowUsers);
  socket.on(socketOptions.getNewUser, addNewUser);
  socket.on(socketOptions.getOldUser, removeUser);
  socket.on(socketOptions.getNewMessage, (message) => {
    addNewMessage(message);
    scrollToBottom();
  });
};

// === Инициализация ===

const initUI = () => {
  // Обработчик для textarea (отправка по Enter)
  if (htmlTextMessage) {
    htmlTextMessage.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });
  }

  if (buttonSendMessage) {
    buttonSendMessage.addEventListener("click", (event) => {
      event.preventDefault();
      sendMessage();
    });
  }

  if (buttonSendImg) {
    buttonSendImg.addEventListener("click", (event) => {
      event.preventDefault();
      htmlInput.click();
    });
  }

  if (buttonSendMessage) {
    buttonSendMessage.addEventListener("click", offPrev);
  }

  if (htmlInput) {
    htmlInput.addEventListener("change", handleFileChange);
  }

  const closeButton = document.querySelector(selPopupButtonClose);
  if (closeButton) {
    closeButton.addEventListener("click", closePopup);
  }
};

const initApp = () => {
  setupSocketListeners();
  initUI();
  initSidebar();
};

document.addEventListener("DOMContentLoaded", initApp);
