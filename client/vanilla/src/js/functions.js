import {
  htmlNameMainUser,
  htmlAvaMainUser,
  htmlTempUser,
  htmlTempMessage,
  htmlListUsers,
  htmlListMessage,
  htmlTempImg,
  htmlNumberUsers,
} from "./constants-html.js";

import {
  selAvaMainUser,
  selMessageText,
  selMessageTime,
  selMessageUser,
  selMessage,
  selMessageContent,
  textForBeginYourName,
  selItemText,
  selAvaMini,
  selUser,
  selMessageOtherUser,
  selSrcImg,
} from "./constants-string.js";

import { openImagePopup } from "./popup.js";
import { state } from "./state.js";

// Функция для безопасного доступа к элементам DOM
const safeQuerySelector = (parent, selector) => parent?.querySelector(selector);

// Функция для добавления изображения в сообщение
export const addImgInPage = (image, newMessage) => {
  if (!image || !newMessage) return;

  const newImg = htmlTempImg?.content?.cloneNode(true);
  if (!newImg) return;

  const imgElement = safeQuerySelector(newImg, selSrcImg);
  if (imgElement) {
    imgElement.setAttribute("src", image);
    imgElement.addEventListener("click", (event) => {
      event.stopPropagation();
      openImagePopup(image);
    });
    safeQuerySelector(newMessage, selMessageContent)?.append(newImg);
  }
};

// Устанавливает информацию о пользователе
export const setUser = ({ avatar, id, name }) => {
  if (!name || !id || !avatar) return;

  if (htmlNameMainUser) {
    htmlNameMainUser.textContent = `${textForBeginYourName} ${name}`;
  }

  if (htmlAvaMainUser) {
    htmlAvaMainUser.src = avatar;
  }

  Object.assign(state.mainUser, { name, id, avatar });
};

// Получает список пользователей
export const getListNowUsers = (users) => {
  users?.forEach(addUserToList);
  updateUserCount();
};

// Добавляет нового пользователя в список
export const addNewUser = (user) => {
  addUserToList(user);
  updateUserCount();
};

// Обновляет количество пользователей
const updateUserCount = () => {
  if (htmlNumberUsers) {
    htmlNumberUsers.textContent = state.usersList.size;
  }
};

// Добавляет пользователя в список
const addUserToList = ({ id, name, avatar }) => {
  if (!id || state.usersList.has(id)) return;

  const newUser = htmlTempUser?.content?.cloneNode(true);
  if (!newUser) return;

  const userNameElement = safeQuerySelector(newUser, selItemText);
  const userAvatarElement = safeQuerySelector(newUser, selAvaMini);

  if (userNameElement) userNameElement.textContent = name;
  if (userAvatarElement) userAvatarElement.src = avatar;

  htmlListUsers.append(newUser);
  state.usersList.set(id, { name, avatar });
};

// Удаляет пользователя из списка
export const removeUser = (idUser) => {
  const userName = state.usersList.get(idUser)?.name;
  if (!userName) return;

  document.querySelectorAll(selUser).forEach((el) => {
    const userText = safeQuerySelector(el, selItemText)?.textContent;
    if (userText === userName) {
      el.remove();
    }
  });

  state.usersList.delete(idUser);
  updateUserCount();
};

// Добавляет новое сообщение
export const addNewMessage = async ({
  avatar,
  id,
  imageFile,
  message,
  name,
  messageTime,
}) => {
  if (!avatar || !id || !message || !name || !messageTime) return;
  if (id === state.mainUser.id) return;

  const newMessage = htmlTempMessage?.content?.cloneNode(true);
  if (!newMessage) return;

  const messageTextElement = safeQuerySelector(newMessage, selMessageText);
  const messageUserElement = safeQuerySelector(newMessage, selMessageUser);
  const messageTimeElement = safeQuerySelector(newMessage, selMessageTime);
  const messageAvatarElement = safeQuerySelector(newMessage, selAvaMainUser);

  if (messageTextElement) messageTextElement.textContent = message;
  if (messageUserElement) messageUserElement.textContent = name;
  if (messageTimeElement) messageTimeElement.textContent = messageTime;
  if (messageAvatarElement) messageAvatarElement.src = avatar;

  safeQuerySelector(newMessage, selMessage)?.classList.add(selMessageOtherUser);

  if (imageFile) {
    try {
      const imgSrc = await fetchImage(imageFile);
      addImgInPage(imgSrc, newMessage);
    } catch (error) {
      console.error("Error loading image:", error);
    }
  }

  htmlListMessage.append(newMessage);
};

// Функция для загрузки изображения
const fetchImage = async (imageFile) => {
  try {
    const res = await fetch(imageFile);
    if (!res.ok) throw new Error("Ошибка загрузки изображения");
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
};

// Отключение превью
export const offPrev = (event) => event?.preventDefault?.();
