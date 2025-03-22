let url;
if (process.env.NODE_ENV === "production") {
  url = "https://chat-node-js-backend.glitch.me/";
} else {
  url = "http://localhost:3001/";
}
export const urlSocket = url;

// class
export const selNameMainUser = ".chat__user-name";
export const selAvaMainUser = ".chat__user-avatar";
export const selTempUser = ".chat__user-template";
export const selTempMessage = ".chat__message-template";
export const selListUsers = ".chat__user-list";
export const selSendMessage = "send-message";
export const selSendImg = ".chat__file-label";
export const selTextarea = ".chat__message-input";
export const selListMessages = ".chat__messages";
export const selListMessagesWrapper = ".chat__messages-wrapper";
export const selMessageText = ".chat__message-text";
export const selMessageTime = ".chat__message-time";
export const selMessageUser = ".chat__message-user";
export const selMessage = ".chat__message";
export const selMessageContent = ".chat__message-content";
export const selItemText = ".chat__user-name";
export const selAvaMini = ".chat__user-avatar--mini";
export const selInput = ".chat__file-input";
export const selPrev = ".chat__file-preview";
export const selImg = ".chat__image-template";
export const selSrcImg = ".chat__image-preview";
export const selPopupImg = ".popup__image";
export const selPopup = ".popup";
export const selPopupButtonClose = ".popup__close";
export const selNumberUsers = ".chat__online-count";

// other
export const selMessageMainUser = "chat__message--self";
export const selUser = "li.chat__user";
export const textForBeginYourName = "Вы: ";
export const selMessageOtherUser = "chat__message--other";
export const popupIsOpen = "popup--open";

// socket io
export const socketOptions = {
  sendChatMessage: "chat message",
  giveName: "give a name",
  giveAllUsers: "now list users",
  getNewUser: "add new user",
  getOldUser: "remove user",
  getNewMessage: "message for all",
};
