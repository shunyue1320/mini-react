# mini-react

迷你版本 react 用于学习

## 1. Redux 应用场景

1. 随着 JavaScript 单页应用开发日趋复杂,管理不断变化的 state 非常困难
2. Redux 的出现就是为了解决 state 里的数据问题
3. 在 React 中，数据在组件中是单向流动的
4. 数据从一个方向父组件流向子组件(通过 props)，由于这个特征，两个非父子关系的组件（或者称作兄弟组件）之间的通信就比较麻烦

## 2. Redux 设计思想

1. Redux 是将整个应用状态存储到到一个地方，称为 store
2. 里面保存一棵状态树 state tree
3. 组件可以派发 dispatch 行为 action 给 store,而不是直接通知其它组件
4. 其它组件可以通过订阅 store 中的状态(state)来刷新自己的视图

# 3. Redux 三大原则

1. 整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中
2. State 是只读的，惟一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象 使用纯函数来执行修改，为了描述 3
3. action 如何改变 state tree ，你需要编写 reducers
4. 单一数据源的设计让 React 的组件之间的通信更加方便，同时也便于状态的统一管理

## bindActionCreators 实现：

```js
function bindActionCreator(actionCreator, dispatch) {
  return function (...args) {
    return dispatch(actionCreator.apply(this, args));
  };
}

export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  }
  const boundActionCreators = {};
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
```

## combineReducers 实现：

```js
function combineReducers(reducers) {
  return function combination(state = {}, action) {
    let nextState = {};
    for (let key in reducers) {
      //key=x
      nextState[key] = reducers[key](state[key], action);
    }
    return nextState;
  };
}
export default combineReducers;
```
