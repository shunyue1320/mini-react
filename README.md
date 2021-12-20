# mini-react

迷你版本 react 用于学习

## 新生命周期
![dom diff](https://github.com/shunyue1320/mini-react/blob/react-10/newLifeCycle.jpeg)

### getDerivedStateFromProps

static getDerivedStateFromProps(props, state) 这个生命周期的功能实际上就是将传入的 props 映射到 state 上面

```js
import React from "react";
import ReactDOM from "react-dom";
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
```

### getSnapshotBeforeUpdate

getSnapshotBeforeUpdate() 被调用于 render 之后，可以读取但无法使用 DOM 的时候。它使您的组件可以在可能更改之前从 DOM 捕获一些信息（例如滚动位置）。此生命周期返回的任何值都将作为参数传递给 componentDidUpdate()

```js
import React from "./react";
import ReactDOM from "./react-dom";
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.wrapper = React.createRef();
  }

  addMessage() {
    this.setState((state) => ({
      messages: [`${state.messages.length}`, ...state.messages],
    }));
  }
  componentDidMount() {
    this.timeID = window.setInterval(() => {
      //设置定时器
      this.addMessage();
    }, 1000);
  }
  componentWillUnmount() {
    //清除定时器
    window.clearInterval(this.timeID);
  }
  getSnapshotBeforeUpdate() {
    //很关键的，我们获取当前rootNode的scrollHeight，传到componentDidUpdate 的参数perScrollHeight
    return {
      prevScrollTop: this.wrapper.current.scrollTop,
      prevScrollHeight: this.wrapper.current.scrollHeight,
    };
  }
  componentDidUpdate(
    pervProps,
    pervState,
    { prevScrollHeight, prevScrollTop }
  ) {
    //当前向上卷去的高度加上增加的内容高度
    this.wrapper.current.scrollTop =
      prevScrollTop + (this.wrapper.current.scrollHeight - prevScrollHeight);
  }
  render() {
    let style = {
      height: "100px",
      width: "200px",
      border: "1px solid red",
      overflow: "auto",
    };
    //<div key={index}>里不要加空格!
    return (
      <div style={style} ref={this.wrapper}>
        {this.state.messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    );
  }
}

ReactDOM.render(<ScrollingList />, document.getElementById("root"));
```
