# mini-react

迷你版本 react 用于学习

## useReducer
1. useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法
2. 在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等

```js
import React from "./react";
import ReactDOM from "./react-dom";

function reducer(state = { number: 0 }, action) {
  switch (action.type) {
    case "ADD":
      return { number: state.number + 1 };
    case "MINUS":
      return { number: state.number - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = React.useReducer(reducer, { number: 0 });
  return (
    <div>
      Count: {state.number}
      <button onClick={() => dispatch({ type: "ADD" })}>+</button>
      <button onClick={() => dispatch({ type: "MINUS" })}>-</button>
    </div>
  );
}
ReactDOM.render(<Counter />, document.getElementById("root"));
```
