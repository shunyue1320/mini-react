# mini-react

迷你版本 react 用于学习

## useLayoutEffect
1. 其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect
2. useEffect不会阻塞浏览器渲染，而 useLayoutEffect 会浏览器渲染
3. useEffect会在浏览器渲染结束后执行,useLayoutEffect 则是在 DOM 更新完成后,浏览器绘制之前执行
## useRef
1. useRef是一个方法，且useRef返回一个可变的ref对象（对象！！！）
2. initialValue被赋值给其返回值的.current对象
3. 可以保存任何类型的值:dom、对象等任何可辨值
4. ref对象与自建一个{current：‘’}对象的区别是：useRef会在每次渲染时返回同一个ref对象，即返回的ref对象在组件的整个生命周期内保持不变。自建对象每次渲染时都建立一个新的。
5. ref对象的值发生改变之后，不会触发组件重新渲染。有一个窍门，把它的改边动作放到useState()之前。
6. 本质上，useRef就是一个其.current属性保存着一个可变值“盒子”。目前我用到的是pageRef和sortRef分别用来保存分页信息和排序信息。


```js
import React from "react";
import ReactDOM from "react-dom";

const Animate = ()=>{
  const ref = React.useRef();
  // React.useEffect(() => {
  React.useLayoutEffect(() => {
    ref.current.style.transform = `translate(500px)`; //TODO
    ref.current.style.transition = `all 500ms`;
  });
  let style = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'red'
  }
  return (
    <div style={style} ref={ref}></div>
  )
}
ReactDOM.render(<Animate/>,document.getElementById('root'));
```

## 事件循环：
![事件循环](https://github.com/shunyue1320/mini-react/blob/react-17/useLayoutEffect.jpeg)

## queueMicrotask
[在 JavaScript 中通过 queueMicrotask() 使用微任务](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide)