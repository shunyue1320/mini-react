import * as effectTypes from "./effectTypes";

export function take(actionType) {
  return { type: effectTypes.TAKE, actionType };
}
export function put(action) {
  return { type: effectTypes.PUT, action };
}
export function fork(saga, ...args) {
  return { type: effectTypes.FORK, saga, args };
}
export function takeEvery(actionType, saga) {
  function* takeEveryHelper() {
    while (true) {
      //监听actionType
      const action = yield take(actionType);
      //开启一个新的子进程执行saga
      yield fork(saga, action);
    }
  }
  return fork(takeEveryHelper);
}
export function call(fn, ...args) {
  return { type: effectTypes.CALL, fn, args };
}
export function cps(fn, ...args) {
  return { type: effectTypes.CPS, fn, args };
}
/**
 * 传入一个迭代器
 * @param {*} iterators 可能是一个对象，也可能是一个数组
 */
export function all(iterators) {
  return { type: effectTypes.ALL, iterators };
}

export function cancel(task) {
  return { type: effectTypes.CANCEL, task };
}
//TODO
const delayFn = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
export function delay(...args) {
  return call(delayFn, ...args);
}
