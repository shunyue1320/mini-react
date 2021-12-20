import React from "./react";
import ReactDOM from "./react-dom";
class Counter extends React.Component {
  static defaultProps = {
    name: "新生命周期",
  };
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  };

  render() {
    console.log("3.render");
    return (
      <div>
        <p>{this.state.number}</p>
        <ChildCounter number={this.state.number} />
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}
class ChildCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { number } = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (number % 2 === 0) {
      return { number: number * 2 };
    } else {
      return { number: number * 3 };
    }
  }
  render() {
    console.log("child-render", this.state);
    return <div>{this.state.number}</div>;
  }
}

ReactDOM.render(<Counter />, document.getElementById("root"));
