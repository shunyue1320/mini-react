import React from "./react";
import ReactDOM from "./react-dom";

class ClassComponent extends React.Component {
  render() {
    return (
      <div className="title" style={{ color: "red" }}>
        <h1>{this.props.name}</h1>
        <h3>{this.props.children}</h3>
      </div>
    );
  }
}

ReactDOM.render(
  <ClassComponent name="hello">world</ClassComponent>,
  document.getElementById("root")
);
