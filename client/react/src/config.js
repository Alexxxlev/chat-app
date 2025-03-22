const url =
  import.meta.env.VITE_NODE_ENV === "prod"
    ? import.meta.env.VITE_SOCKET_URL
    : import.meta.env.VITE_LOCAL_SOCKET_URL;

export const urlSocket = url;

// socket io
export const socketOptions = {
  sendChatMessage: "chat message",
  giveName: "give a name",
  giveAllUsers: "now list users",
  getNewUser: "add new user",
  getOldUser: "remove user",
  getNewMessage: "message for all",
};