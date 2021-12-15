import React from "./react";
import ReactDOM from "./react-dom";
class Counter extends React.Component{ // 他会比较两个状态相等就不会刷新视图 PureComponent是浅比较
  static defaultProps = {
      name: '生命周期'
  };
  constructor(props) {
      super(props);
      this.state = { number: 0 }
      console.log('Counter 1.constructor')
  }
  componentWillMount() { // 取本地的数据 同步的方式：采用渲染之前获取数据，只渲染一次
      console.log('Counter 2.componentWillMount');
  }
  componentDidMount() {
      console.log('Counter 4.componentDidMount');
  }
  handleClick = () => {
      this.setState({ number: this.state.number + 1 });
  };
  // react可以shouldComponentUpdate方法中优化 PureComponent 可以帮我们做这件事
  shouldComponentUpdate(nextProps, nextState) { // 代表的是下一次的属性 和 下一次的状态
      console.log('Counter 5.shouldComponentUpdate');
      return nextState.number % 2 === 0;
      // return nextState.number!==this.state.number; //如果此函数种返回了false 就不会调用render方法了
  } //不要随便用setState 可能会死循环
  componentWillUpdate() {
      console.log('Counter 6.componentWillUpdate');
  }
  componentDidUpdate() {
      console.log('Counter 7.componentDidUpdate');
  }
  render() {
      console.log('Counter 3.render');
      return (
          <div>
              <p>{this.state.number}</p>
              <button onClick={this.handleClick}>+</button>
          </div>
      )
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));

/**
Counter 1.constructor
Counter 2.componentWillMount
Counter 3.render
Counter 4.componentDidMount
2 Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
Counter 7.componentDidUpdate
2 Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
Counter 7.componentDidUpdate
*/