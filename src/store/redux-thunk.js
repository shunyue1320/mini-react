// 手写一个接收函数类型 action 的中间件
function thunk({ dispatch, getState }) {
  return function (next) {
    //最终返回的，也就是说store新的dispatch方法就指向最左边的中间件的dispatch
    return function (action) {
      //如果说派发的action是一个函数的话
      if (typeof action === "function") {
        //执行这个函数，传入dispatch和getState
        return action(dispatch, getState);
      } else {
        return next(action);
      }
    };
  };
}
export default thunk;
