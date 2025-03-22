import { v4 as uuidv4 } from "uuid";
import {
  arrFirstName,
  arrSecondName,
  socketOptions,
  URL_API_IMAGE_FIRST,
  URL_API_IMAGE_SECOND,
  TEXT_BASE64,
} from "./constants.js";
import { getImgFromFetch, getRandomInt } from "./utils.js";
import fs from "fs/promises";

let defaultAvatarBase64;

// Загрузка дефолтного аватара при старте сервера
const loadDefaultAvatar = async () => {
  try {
    const defaultAvatar = await fs.readFile("./default-avatar.png");
    defaultAvatarBase64 =
      TEXT_BASE64 + Buffer.from(defaultAvatar).toString("base64");
  } catch (error) {
    console.error("Error loading default avatar:", error);
  }
};

// Запуск сервера и предварительная загрузка аватара
const startServer = async () => {
  await loadDefaultAvatar();
};

startServer().catch((error) => console.error("Server start error:", error));

// Функция для получения случайного аватара
const fetchAvatar = async () => {
  const randomSeed = getRandomInt(10000);
  try {
    // Пробуем получить аватар с первого источника
    const avatar = await getImgFromFetch(
      `${URL_API_IMAGE_FIRST}${randomSeed}.png?size=100x100`
    );
    return avatar;
  } catch (error) {
    console.error("Error fetching avatar from RoboHash:", error);
    try {
      // Пробуем получить аватар со второго источника
      return await getImgFromFetch(`${URL_API_IMAGE_SECOND}${randomSeed}`);
    } catch (error) {
      console.error("Error fetching avatar from DiceBear:", error);
      return null;
    }
  }
};

// Генерация случайного имени
const generateRandomName = () => {
  const firstName = arrFirstName[getRandomInt(arrFirstName.length)];
  const lastName = arrSecondName[getRandomInt(arrSecondName.length)];
  return `${firstName} ${lastName}`;
};

// Обработка подключения пользователя
export const handleUserJoin = async (socket, users, io) => {
  const user = {
    id: socket.id,
    name: generateRandomName(),
    avatar: defaultAvatarBase64,
  };

  // Подгружаем случайный аватар, если доступен
  user.avatar = (await fetchAvatar()) || user.avatar;

  // Добавляем пользователя в Map
  users.set(socket.id, user);

  // Отправляем информацию о пользователе клиенту
  socket.emit(socketOptions.giveName, user);

  // Отправляем информацию о новом пользователе всем клиентам
  io.emit(socketOptions.getNewUser, user);

  // Отправка списка всех пользователей
  sendAllUsers(users, io);
};

// Обработка отключения пользователя
export const handleUserDisconnect = (socket, users, io) => {
  if (users.has(socket.id)) {
    io.emit(socketOptions.getOldUser, socket.id);
    users.delete(socket.id);
  }
};

// Обработка входящего сообщения
export const handleChatMessage = (socket, users, io, msg) => {
  try {
    const user = users.get(socket.id);
    if (!user) {
      throw new Error(`User not found for socket ID: ${socket.id}`);
    }

    const messageId = uuidv4();
    const message = {
      messageId,
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      message: msg.message,
      imageFile: msg.imageFile,
      messageTime: msg.messageTime,
    };

    // Отправляем сообщение всем клиентам
    io.emit(socketOptions.getNewMessage, message);
  } catch (error) {
    console.error("Error handling chat message:", error);
  }
};

// Обработка переподключения пользователя
export const handleReconnectUser = (socket, users, io, user) => {
  // Проверяем, есть ли такой пользователь в списке
  if (!users.has(user.id)) {
    users.set(user.id, user); // Если нет, добавляем пользователя
  }

  // Обновляем связь сокета с userId
  socket.userId = user.id;

  // Отправляем информацию о восстановленном пользователе
  io.emit(socketOptions.addOldUser, user);

  // Отправляем событие для всех клиентов с обновленной информацией о пользователе
  io.emit(socketOptions.getNewUser, user);
};

// Отправка списка всех пользователей
export const sendAllUsers = (users, io) => {
  io.emit(socketOptions.giveAllUsers, Array.from(users.values()));
};
