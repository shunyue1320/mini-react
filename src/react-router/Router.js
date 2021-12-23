import React from "react";
import RouterContext from "./RouterContext";

class Router extends React.Component {
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
    };
    return (
      <RouterContext.Provider value={value}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

export default Router;
