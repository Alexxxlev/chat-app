import React from "react";
import { useSelector } from "react-redux";

const Message = ({
  id,
  avatar,
  userName,
  messageText,
  messageTime,
  imageFile,
  onImageClick,
}) => {
  const mainUser = useSelector((state) => state.chat.mainUser);

  const isSelf = id === mainUser.id;
  const messageClass = `chat__message ${
    isSelf ? "chat__message--self" : "chat__message--other"
  }`;

  return (
    <li className={messageClass}>
      <div className="chat__message-avatar">
        <img
          className="chat__user-avatar chat__user-avatar--mini"
          src={avatar}
          alt="аватарка"
        />
      </div>
      <div className="chat__message-content">
        <div className="chat__message-header">
          <p className="chat__message-user">{userName}</p>
        </div>
        <div className="chat__message-body">
          <p className="chat__message-text">{messageText}</p>
        </div>
        <span className="chat__message-time">{messageTime}</span>

        {imageFile && (
          <div className="chat__image">
            <p className="chat__image-title">Прикрепленное изображение:</p>
            <img
              className="chat__image-preview"
              src={imageFile}
              alt="изображение, которое прикрепил пользователь"
              onClick={() => onImageClick(imageFile)}
            />
          </div>
        )}
      </div>
    </li>
  );
};

export default Message;
