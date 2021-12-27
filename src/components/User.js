import React from "react";

import { Link } from "../react-router-dom";
function User() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/user/list">用户列表</Link>
        </li>
        <li>
          <Link to="/user/add">新增用户</Link>
        </li>
      </ul>
      <div></div>
    </div>
  );
}
export default User;
