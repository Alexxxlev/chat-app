import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";

const SidebarToggle = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  // Функция для обработки клика вне sidebar и toggleButton
  const handleClickOutside = useCallback((event) => {
    if (
      window.innerWidth <= 768 &&
      !event.target.closest(".chat__sidebar") &&
      !event.target.closest(".burger")
    ) {
      setIsSidebarHidden(true);
    }
  }, []);

  // Функция для обработки изменения размера окна
  const handleWindowResize = useCallback(() => {
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        setIsSidebarHidden(true);
      }, 1500);
    } else {
      setIsSidebarHidden(false);
    }
  }, []);

  useEffect(() => {
    // Добавляем обработчики событий
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleWindowResize);

    // Вызов функции при монтировании компонента
    handleWindowResize();

    // Убираем обработчики при размонтировании компонента
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [handleClickOutside, handleWindowResize]);

  const toggleSidebar = (event) => {
    event.stopPropagation();
    setIsSidebarHidden((prevState) => !prevState);
  };

  return (
    <>
      <button className="burger" onClick={toggleSidebar}>
        <svg
          fill="none"
          height="28"
          viewBox="0 0 28 28"
          width="28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 7C3 6.44771 3.44772 6 4 6H24C24.5523 6 25 6.44771 25 7C25 7.55229 24.5523 8 24 8H4C3.44772 8 3 7.55229 3 7Z"
            fill="#5e503f"
          />
          <path
            d="M3 14C3 13.4477 3.44772 13 4 13H24C24.5523 13 25 13.4477 25 14C25 14.5523 24.5523 15 24 15H4C3.44772 15 3 14.5523 3 14Z"
            fill="#5e503f"
          />
          <path
            d="M4 20C3.44772 20 3 20.4477 3 21C3 21.5523 3.44772 22 4 22H24C24.5523 22 25 21.5523 25 21C25 20.4477 24.5523 20 24 20H4Z"
            fill="#5e503f"
          />
        </svg>
      </button>

      <Sidebar isSidebarHidden={isSidebarHidden} />
    </>
  );
};

export default SidebarToggle;
