# mini-react

迷你版本 react 用于学习

## useCallback

把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新  
简要：参数2没值改变，则返回的函数内存地址不变  
`（如果每次更新父组件执行返回不同内存地址的函数，该函数传递给子组件，子组件检测到参数改变就要触发更新了）`

## useMemo

把创建函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算   
简要：参数2有值发生改变，执行参数1函数，返回参数1函数执行的结果

```js
import React from "./react";
import ReactDOM from "./react-dom";

let Child = ({ data, handleClick }) => {
  console.log("Child render");
  return <button onClick={handleClick}>{data.number}</button>;
};
Child = React.memo(Child);

function App() {
  console.log("App render");
  const [name, setName] = React.useState("小明");
  const [number, setNumber] = React.useState(0);

  const data = React.useMemo(() => {
    console.log('run useMemo')
    return { number }
  }, [number]);

  const handleClick = React.useCallback(() => {
    console.log('run useCallback')
    setNumber(number + 1)
  }, [number]);
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Child data={data} handleClick={handleClick} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

```


## memo
浅比较函数参数， 参数不变不触发函数更新

## PureComponent
内部通过 shouldComponentUpdate 实现， 众所周知当 shouldComponentUpdate 返回 true 时更新组件
通过对新旧 state 和 新旧 props 浅对比，不相等时返回 true 更新组件