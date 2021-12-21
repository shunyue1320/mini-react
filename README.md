# mini-react

迷你版本 react 用于学习

## useContext
1. 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值
2. 当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 value prop 决定
3. 当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context value 值
4. useContext(MyContext) 相当于 class 组件中的 static contextType = MyContext 或者 `<MyContext.Consumer>`
5. useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 `<MyContext.Provider>` 来为下层组件提供 context

```js
import React from "./react";
import ReactDOM from "./react-dom";

const CounterContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { number: state.number + 1 };
    case "minus":
      return { number: state.number - 1 };
    default:
      return state;
  }
}

function Counter() {
  let { state, dispatch } = React.useContext(CounterContext);
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: "add" })}>+</button>
      <button onClick={() => dispatch({ type: "minus" })}>-</button>
    </div>
  );
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, { number: 0 });
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Counter />
    </CounterContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```
