import React, { useEffect } from "react";
import "../assets/styles/style.scss"; // Подключаем стили

const WelcomePage = () => {
  useEffect(() => {
    document.title = "Чат | Авторизация";
  }, []);

  return (
    <div className="intro">
      <div className="welcome">
        <div className="welcome__content">
          <p className="welcome__text">Данное приложение - однокомнатный чат</p>
          <p className="welcome__text">
            При нажатии на "Вход" вам будет присвоено случайное имя, после чего
            вы сможете общаться с другими участниками чата
          </p>
        </div>

        <a className="welcome__btn" href="/main">
          Вход
        </a>
      </div>
    </div>
  );
};

export default WelcomePage;
