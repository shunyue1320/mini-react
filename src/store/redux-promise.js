// 手写一个接收 action 类型为 promise 的中间件
function promise({ dispatch, getState }) {
  return function (next) {
    // 最终返回的，也就是说store新的dispatch方法就指向最左边的中间件的dispatch
    return function (action) {
      // 如果一个对象有then属性，并且then属性的类型是一个函数
      if (action.then && typeof action.then === "function") {
        action.then((action) => dispatch(action)).catch(dispatch);
      } else if (action.payload && typeof action.payload.then === "function") {
        action.payload //如果成功了，则重新派发一个action,把payload修改为返回的值 1
          .then((result) => dispatch({ ...action, payload: result }))
          .catch((error) => {
            dispatch({ ...action, error: true, payload: error });
            return Promise.reject(error);
          });
      } else {
        next(action);
      }
    };
  };
}

export default promise;