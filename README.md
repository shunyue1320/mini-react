# mini-react

迷你版本 react 用于学习

## useState
1. useState 就是一个 Hook
2. 通过在函数组件里调用它来给组件添加一些内部 state,React 会在重复渲染时保留这个 state
3. useState 会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 this.setState，但是它不会把新的 state 和旧的 state 进行合并
4. useState 唯一的参数就是初始 state
5. 返回一个 state，以及更新 state 的函数
6. 在初始渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同
7. setState 函数用于更新 state。它接收一个新的 state 值并将组件的一次重新渲染加入队列
```js
import React from "./react";
import ReactDOM from "./react-dom";


function App(){
  const[number,setNumber]=React.useState(0);
  let handleClick = ()=> setNumber(number+1)
  return (
    <div>
      <p>{number}</p>
      <button onClick={handleClick}>+</button>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```
