import * as actionTypes from "../action-types";
function add1(amount) {
  return { type: actionTypes.ADD1, payload: { amount } };
}
function minus1() {
  return { type: actionTypes.MINUS1 };
}

function thunkAdd1() {
  // dispatch, getState 是哪来的？ 是 redux-thunk 中间件给的
  return function (dispatch, getState) {
    setTimeout(() => {
      dispatch({ type: actionTypes.ADD1, payload: { amount: 1 } });
    }, 1000);
  };
}
function promise1Add() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ type: actionTypes.ADD1, payload: { amount: 1 } });
    }, 1000);
  });
}
function promise2Add() {
  return {
    type: actionTypes.ADD1,
    payload: new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          //如果成功了，传递新的payload
          resolve({ amount: 1 });
        } else {
          //如果失败了，传递新的payload为负数
          reject({ amount: -1 });
        }
      }, 10);
    }),
  };
}

const actionCreators = { add1, minus1, thunkAdd1, promise1Add, promise2Add };
export default actionCreators;
