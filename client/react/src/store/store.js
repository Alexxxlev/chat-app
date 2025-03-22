import { configureStore } from "@reduxjs/toolkit";
import socketMiddleware from "../middleware/socketMiddleware";
import chatReducer from "../store/chatSlice";

const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});

export default store;
