import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImage, setSrcImg } from "../store/chatSlice";
import "../assets/styles/style.scss";
import Message from "../components/Message/Message";
import SidebarToggle from "../components/Sidebar/SidebarToggle";
import Popup from "../components/Popup/Popup";

const Chat = () => {
  const dispatch = useDispatch();
  const { messages, imgInBase64, mainUser } = useSelector(
    (state) => state.chat
  );

  const [messageText, setMessageText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [inputKey, setInputKey] = useState(Date.now());

  // Подключаем сокет при монтировании
  useEffect(() => {
    document.title = "Чат | Общение";
    dispatch({ type: "SOCKET_CONNECT" });
  }, [dispatch]);

  // Авто-прокрутка вниз при новом сообщении
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };

    const timeout = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeout);
  }, [messages]);

  // Обработчик выбора файла
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      dispatch(setImage(reader.result));
      dispatch(setSrcImg(URL.createObjectURL(file)));
      setFileName(file.name);
      setInputKey(Date.now());
    };
    reader.readAsDataURL(file);
  };

  // Открытие и закрытие popup
  const openPopup = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsPopupOpen(true);
  };
  const closePopup = () => setIsPopupOpen(false);

  // Отправка сообщения
  const sendMessage = useCallback(() => {
    if (!messageText.trim() && !imgInBase64) return;

    dispatch({
      type: "SEND_MESSAGE",
      payload: {
        message: messageText,
        imageFile: imgInBase64,
        userId: mainUser.id,
      },
    });

    setMessageText("");
    dispatch(setImage(""));
    dispatch(setSrcImg(""));
    setFileName("");
  }, [messageText, imgInBase64, dispatch, mainUser]);

  // Обработчик нажатия Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat">
      <SidebarToggle />

      <main className="chat__content">
        <div className="chat__messages-wrapper">
          <ul className="chat__messages">
            {messages.map((msg) => {
              return (
                <Message
                  key={msg.messageId}
                  id={msg.id}
                  avatar={msg.avatar}
                  userName={msg.name}
                  messageText={msg.message || msg.messageText}
                  messageTime={msg.messageTime}
                  imageFile={msg.imageFile}
                  onImageClick={openPopup}
                />
              );
            })}
            <div ref={messagesEndRef} /> {/* Этот элемент вызывает прокрутку */}
          </ul>
        </div>

        <div className="chat__composer">
          <form
            className="chat__message-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              className="chat__message-input"
              name="text"
              placeholder="Напишите сообщение..."
              aria-label="Поле для ввода сообщения"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
            ></textarea>
            <div className="chat__actions">
              <div className="chat__file-upload">
                <p className="chat__file-preview">{fileName}</p>
                <label
                  className="chat__file-label"
                  htmlFor="send-image"
                  aria-label="Прикрепить картинку"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 14 20"
                    fill="none"
                  >
                    <path
                      d="M7 20c-1.856-.002-3.635-.7-4.947-1.94C.74 16.819.003 15.137 0 13.383V4.828a4.536 4.536 0 0 1 .365-1.843 4.75 4.75 0 0 1 1.087-1.567A5.065 5.065 0 0 1 3.096.368a5.293 5.293 0 0 1 3.888 0c.616.244 1.174.6 1.643 1.05.469.45.839.982 1.088 1.567.25.586.373 1.212.364 1.843v8.555a2.837 2.837 0 0 1-.92 2.027A3.174 3.174 0 0 1 7 16.245c-.807 0-1.582-.3-2.158-.835a2.837 2.837 0 0 1-.92-2.027v-6.22a1.119 1.119 0 1 1 2.237 0v6.22a.777.777 0 0 0 .256.547.868.868 0 0 0 .585.224c.219 0 .429-.08.586-.224a.777.777 0 0 0 .256-.546V4.828A2.522 2.522 0 0 0 7.643 3.8a2.64 2.64 0 0 0-.604-.876 2.816 2.816 0 0 0-.915-.587 2.943 2.943 0 0 0-2.168 0 2.816 2.816 0 0 0-.916.587 2.64 2.64 0 0 0-.604.876 2.522 2.522 0 0 0-.198 1.028v8.555c0 1.194.501 2.339 1.394 3.183A4.906 4.906 0 0 0 7 17.885a4.906 4.906 0 0 0 3.367-1.319 4.382 4.382 0 0 0 1.395-3.183v-6.22a1.119 1.119 0 0 1 2.237 0v6.22c-.002 1.754-.74 3.436-2.052 4.677C10.635 19.3 8.856 19.998 7 20z"
                      fill="#5e503f"
                    ></path>
                  </svg>
                </label>
                <input
                  key={inputKey}
                  className="chat__file-input"
                  id="send-image"
                  type="file"
                  accept=".png,.jpeg,.ico,.gif,.jpg"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              <button
                className="chat__send-button"
                id="send-message"
                aria-label="Отправить сообщение"
                type="submit"
              >
                <div className="chat__send-button-icon">
                  <svg
                    width="14"
                    height="16"
                    viewBox="0 0 14 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7 16c-.595 0-1.077-.462-1.077-1.032V1.032C5.923.462 6.405 0 7 0s1.077.462 1.077 1.032v13.936C8.077 15.538 7.595 16 7 16z"
                      fill="#fff"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M.315 7.44a1.002 1.002 0 0 1 0-1.46L6.238.302a1.11 1.11 0 0 1 1.523 0c.421.403.421 1.057 0 1.46L1.838 7.44a1.11 1.11 0 0 1-1.523 0z"
                      fill="#fff"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.685 7.44a1.11 1.11 0 0 1-1.523 0L6.238 1.762a1.002 1.002 0 0 1 0-1.46 1.11 1.11 0 0 1 1.523 0l5.924 5.678c.42.403.42 1.056 0 1.46z"
                      fill="#fff"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Popup isOpen={isPopupOpen} onClose={closePopup} srcImg={selectedImage} />
    </div>
  );
};

export default Chat;
