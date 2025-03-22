import React from "react";

const UserItem = ({
  name = "Аноним",
  avatar = "/def-ava.png",
}) => {
  return (
    <li className="chat__user">
      <img
        className="chat__user-avatar chat__user-avatar--mini"
        src={avatar}
        alt="аватарка"
        onError={(e) => (e.target.src = "/def-ava.png")}
      />
      <p className="chat__user-name">{name}</p>
    </li>
  );
};

export default UserItem;
