import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "./react-router-dom";

import Home from "./components/Home";
import User from "./components/User";
import Profile from "./components/Profile";

const activeStyle = { backgroundColor: "red" };

ReactDOM.render(
  <BrowserRouter>
    <NavLink
      to="/"
      style={({ isActive }) => (isActive ? activeStyle : {})}
      className={({ isActive }) => (isActive ? "active" : "")}
    >
      首页
    </NavLink>
    <NavLink
      to="/user"
      style={({ isActive }) => (isActive ? activeStyle : {})}
      className={({ isActive }) => (isActive ? "active" : "")}
    >
      用户管理
    </NavLink>
    <NavLink
      to="/profile"
      style={({ isActive }) => (isActive ? activeStyle : {})}
      className={({ isActive }) => (isActive ? "active" : "")}
    >
      个人中心
    </NavLink>

    <Routes>
      <Route path="/" component={Home} exact />
      <Route path="/user" component={User} />
      <Route path="/profile" component={Profile} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
