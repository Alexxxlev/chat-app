import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mainUser: { name: "", id: "", avatar: "" },
  imgInBase64: "",
  usersList: [],
  srcImg: "",
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (!state.mainUser.id) {
        state.mainUser = action.payload;
      }
    },
    setImage: (state, action) => {
      state.imgInBase64 = action.payload;
    },
    setSrcImg: (state, action) => {
      state.srcImg = action.payload;
    },
    addUser: (state, action) => {
      const { id, name, avatar } = action.payload;

      if (!state.usersList.some((user) => user.id === id)) {
        state.usersList.push({
          id,
          name,
          avatar: avatar || "/def-ava.png",
        });
      }
    },
    removeUser: (state, action) => {
      state.usersList = state.usersList.filter(
        (user) => user.id !== action.payload
      );
    },
    clearUsers: (state) => {
      state.usersList = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const {
  setUser,
  setImage,
  setSrcImg,
  addUser,
  removeUser,
  clearUsers,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
