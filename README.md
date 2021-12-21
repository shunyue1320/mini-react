# mini-react

迷你版本 react 用于学习

## useEffect
1. 在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性
2. 使用 useEffect 完成副作用操作。赋值给 useEffect 的函数会在组件渲染到屏幕之后执行。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道
3. useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API
4. 该 Hook 接收一个包含命令式、且可能有副作用代码的函数

```js
function Counter() {
  const [number, setNumber] = React.useState(0);
  React.useEffect(() => {
    console.log("开启一个新的定时器");
    const $timer = setInterval(() => {
      setNumber(number + 1);
    }, 1000);
    return () => {
      console.log("销毁老的定时器");
      clearInterval($timer);
    };
  });

  React.useEffect(() => {
    console.log("number - 改变");
    return () => {
      console.log("销毁");
    };
  }, [ number ]);
  return <p>{number}</p>;
}
ReactDOM.render(<Counter />, document.getElementById("root"));

```
