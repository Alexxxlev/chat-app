import { io } from "socket.io-client";
import { urlSocket, socketOptions } from "../config";
import {
  setUser,
  addMessage,
  addUser,
  removeUser,
  clearUsers,
} from "../store/chatSlice";

const socketMiddleware = (store) => {
  let socket;

  return (next) => (action) => {
    switch (action.type) {
      case "SOCKET_CONNECT":
        if (!socket) {
          socket = io(urlSocket, { transports: ["websocket"] });

          socket.emit(socketOptions.giveName); // Запрашиваем имя пользователя

          socket.on(socketOptions.giveName, (user) => {
            store.dispatch(setUser(user));
            socket.emit(socketOptions.giveAllUsers); // Запрос списка пользователей сразу после получения user
          });

          socket.on(socketOptions.getNewMessage, (message) => {
            store.dispatch(addMessage(message));
          });

          socket.on(socketOptions.giveAllUsers, (users) => {
            store.dispatch(clearUsers());
            users.forEach((user) => store.dispatch(addUser(user)));
          });

          socket.on(socketOptions.getNewUser, (user) => {
            store.dispatch(addUser(user));
          });

          socket.on(socketOptions.getOldUser, (userId) => {
            store.dispatch(removeUser(userId));
          });
        }
        break;

      case "SEND_MESSAGE":
        if (socket) {
          socket.emit(socketOptions.sendChatMessage, action.payload);
        }
        break;

      case "SOCKET_DISCONNECT":
        if (socket) {
          socket.disconnect();
          socket = null;
        }
        break;

      default:
        break;
    }

    return next(action);
  };
};

export default socketMiddleware;
