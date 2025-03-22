import { useSelector } from "react-redux";
import UserItem from "../UserItem/UserItem";

const Sidebar = ({ isSidebarHidden }) => {
  const users = useSelector((state) => state.chat.usersList);
  const currentUser = useSelector((state) => state.chat.mainUser);

  return (
    <aside
      className={`chat__sidebar ${
        isSidebarHidden ? "chat__sidebar--hidden" : ""
      }`}
    >
      <header className="chat__header">
        <span className="chat__online-text">Online пользователей: </span>
        <span className="chat__online-count">{users.length}</span>
      </header>

      <div className="chat__user-list-wrapper">
        <ul className="chat__user-list">
          {users.map((user) => (
            <UserItem key={user.id} name={user.name} avatar={user.avatar} />
          ))}
        </ul>
      </div>

      <footer className="chat__current-user">
        <p className="chat__user-name">
          {currentUser?.name ? `Вы: ${currentUser.name}` : "Ваше имя"}
        </p>
        <img
          className="chat__user-avatar chat__user-avatar--normal"
          src={currentUser?.avatar || "/def-ava.png"}
          alt="аватарка"
        />
      </footer>
    </aside>
  );
};

export default Sidebar;
