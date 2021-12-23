import React from "react";
import ReactContext from "./RouterContext";

class Route extends React.Component {
  static contextType = ReactContext;
  render() {
    const { history, location } = this.context;
    const { path, component: RouteComponent } = this.props;
    const match = location.pathname === path;
    const routeProps = { history, location };
    let element = null;
    if (match) {
      return <RouteComponent {...routeProps} />;
    }
    return element;
  }
}

export default Route;
