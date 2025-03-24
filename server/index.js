import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config"; // Подключение переменных окружения
import moment from "moment-timezone";
import { socketOptions } from "./constants.js";
import {
  handleUserJoin,
  handleUserDisconnect,
  handleChatMessage,
  handleReconnectUser,
  sendAllUsers,
} from "./socket-functions.js";

// Утилита для генерации текущего времени
const getCurrentTime = () => moment.tz("Europe/Moscow").format("HH:mm");

// Инициализация сервера
const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  maxHttpBufferSize: 1e7,
});

const PORT = process.env.PORT || 3001; // Автоматический порт для деплоя
const users = new Map();

// Логирование и запуск сервера
console.info(`Server is running on port ${PORT}`);

// Обработчики событий сокетов
const handleSocketEvents = (socket) => {
  socket.on(socketOptions.giveName, () => handleUserJoin(socket, users, io));

  socket.on(socketOptions.disconnect, () =>
    handleUserDisconnect(socket, users, io)
  );

  socket.on(socketOptions.sendChatMessage, (msg) => {
    const messageWithTime = { ...msg, messageTime: getCurrentTime() };
    handleChatMessage(socket, users, io, messageWithTime);
  });

  socket.on(socketOptions.addOldUser, (user) =>
    handleReconnectUser(socket, users, io, user)
  );

  socket.on(socketOptions.giveAllUsers, () => sendAllUsers(users, io));

  socket.on(socketOptions.getNewUser, (user) => {
    console.info(`New user connected: ${user.name}`);
    io.emit(socketOptions.getNewUser, user);
  });
};

// Подключение сокетов
io.on(socketOptions.connect, handleSocketEvents);

// Запуск сервера
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
