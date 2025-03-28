import {
  selNameMainUser,
  selAvaMainUser,
  selTempUser,
  selTempMessage,
  selListUsers,
  selSendMessage,
  selSendImg,
  selTextarea,
  selListMessages,
  selListMessagesWrapper,
  selInput,
  selPrev,
  selImg,
  selPopupImg,
  selPopup,
  selNumberUsers,
} from "./constants-string.js";

export const htmlNameMainUser = document.querySelector(selNameMainUser);
export const htmlAvaMainUser = document.querySelector(selAvaMainUser);
export const htmlTempUser = document.querySelector(selTempUser);
export const htmlTempMessage = document.querySelector(selTempMessage);
export const htmlListUsers = document.querySelector(selListUsers);
export const buttonSendMessage = document.getElementById(selSendMessage);
export const buttonSendImg = document.querySelector(selSendImg);
export const htmlTextMessage = document.querySelector(selTextarea);
export const htmlListMessage = document.querySelector(selListMessages);
export const htmlListMessageWrapper = document.querySelector(selListMessagesWrapper);
export const htmlInput = document.querySelector(selInput);
export const htmlPrev = document.querySelector(selPrev);
export const htmlTempImg = document.querySelector(selImg);
export const htmlPopupImg = document.querySelector(selPopupImg);
export const htmlPopup = document.querySelector(selPopup);
export const htmlNumberUsers = document.querySelector(selNumberUsers);
