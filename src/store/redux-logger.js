//实现一个日志中间件，中间件的结构都是定死
function logger({ getState, dispatch }) {
  return function (next) {
    //调用下一个中间件
    return function (action) {
      //改造后dispatch方法
      console.log("prev state", getState());
      next(action); // store.dispatch(action) 执行原始 dispatch
      console.log("next state", getState());
    };
  };
}

export default logger;
