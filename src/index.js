import React from "react";
import ReactDOM from "react-dom";
import { Route, Link, Routes } from "react-router-dom";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { Provider } from "react-redux";
import { store, history } from "./store";
import Home from "./components/Home";
import Counter from "./components/Counter";

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/counter">Counter</Link></li>
      </ul>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/counter" element={<Counter />} />
      </Routes>

    </Router>
  </Provider>,
  document.getElementById("root")
);
