import React from "react";
import ReactContext from "./RouterContext";
import matchPath from './matchPath';

// 作用：从 RouterContext 中获取 history 并传递给子元素
class Route extends React.Component {
  static contextType = ReactContext; // 拿到 Router 内的 ReactContext
  render() {
    const { history, location } = this.context;
    const { component: RouteComponent } = this.props;
    const match = matchPath(location.pathname, this.props);
    const routeProps = { history, location };
    let element = null;
    if (match) {
      routeProps.match = match;
      return <RouteComponent {...routeProps} />;
    }
    return element;
  }
}

export default Route;
