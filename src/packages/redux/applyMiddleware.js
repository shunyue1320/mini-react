import compose from "./compose";

function applyMiddleware(...middlewares) {
  return function (createStore) {
    return function (reducer) {
      //创建原始的仓库 store.dispatch 是改造前的 dispatch
      const store = createStore(reducer);
      let dispatch;
      let middlewareAPI = {
        getState: store.getState,
        // 为什么不直接执行 dispatch 而是用函数包裹一下执行? 因为：通过闭包动态取改造后的 dispatch
        dispatch: (action) => dispatch(action),
      };

      // 先把所有的中间件执行一次，把外层的store用middlewareAPI去掉
      const chain = middlewares.map((middleware) => middleware(middlewareAPI));
      // 把这些中间件进行组合，得到一个新的函数
      dispatch = compose(...chain)(store.dispatch); // 先 321 解除 next，剩下就是传 action 的方法。（321解next，123传action）
      return {
        ...store,
        dispatch,
      };
    };
  };
}

export default applyMiddleware;
