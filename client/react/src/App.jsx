import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Welcome from "./pages/Welcome";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/main" element={<Chat />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
