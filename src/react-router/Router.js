import React from "react";
import RouterContext from "./RouterContext";

// 作用：将 props 中的 history 存储到 RouterContext
class Router extends React.Component {
  static computeRootMatch(pathname) {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
  }
  constructor(props) {
    super(props);
    this.state = {
      location: props.history.location,
    };
    this.unlisten = props.history.location.listen((location) => {
      this.setState({ location });
    });
  }
  render() {
    const value = {
      history: this.props.history,
      location: this.state.location,
      match: Router.computeRootMatch(this.state.location.pathname)
    };
    return (
      <RouterContext.Provider value={value}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

export default Router;
