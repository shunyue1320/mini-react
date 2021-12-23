import React from "react";
import { Router } from "../react-router";
import { createBrowserHistory } from "history";

class BrowserRouter extends React.Component {
  // 不管是哪种创建历史对象的方法，得到的history 长的都一样，都像window.history
  history = createBrowserHistory(this.props);
  render() {
    return <Router history={this.history}>{this.props.children}</Router>;
  }
}

export default BrowserRouter;
