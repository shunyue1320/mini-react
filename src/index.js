import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useRoutes,
} from "./react-router-dom";

import Home from "./components/Home";
import User from "./components/User";
import UserList from "./components/UserList";
import UserAdd from "./components/UserAdd";
import UserDetail from "./components/UserDetail";
import Foo from "./components/Foo";
const LazyFoo = React.lazy(() => import("./components/Foo"));
const activeStyle = { backgroundColor: "red" };

const routesConfig = [
  { path: "/", element: <Home />, index: 0 },
  {
    path: "/user/*",
    element: <User />,
    index: 1,
    children: [
      { path: "add", element: <UserAdd />, index: 0 },
      { path: "list", element: <UserList />, index: 1 },
      { path: "detail/:id", element: <UserDetail />, index: 2 },
    ],
  },
  { path: "/foo", element: <Foo /> },
];

function App() {
  let [routes, setRoutes] = React.useState(routesConfig);
  const addRoute = () => {
    setRoutes([
      ...routes,
      {
        path: "/foo",
        index: 1,
        element: (
          <React.Suspense fallback={<div>loading....</div>}>
            <LazyFoo />
          </React.Suspense>
        ),
      },
    ]);
  };
  return (
    <div>
      {useRoutes(routes)}
      <button onClick={addRoute}>addRoute</button>
    </div>
  );
}

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
    <App />
    {/* 
    <Routes>
      <Route path="/" element={<Home />} exact />
      <Route path="/user" element={<User />} />
      <Route path="/profile" element={<Profile />} />
    </Routes> */}
  </BrowserRouter>,
  document.getElementById("root")
);
