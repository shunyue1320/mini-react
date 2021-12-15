import React from "./react";
import ReactDOM from "./react-dom";
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  handleClick = () => {
    console.log('-----------------');
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
    });
  };
  render() {
    return (
      <div>
        <p>{this.props.title}</p>
        <p>number:{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

ReactDOM.render(<Counter title="计数器" />, document.getElementById("root"));
