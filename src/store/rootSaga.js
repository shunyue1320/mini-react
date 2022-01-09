import { put, take, fork, takeEvery, call, cps, all, delay, cancel } from '../redux-saga/effects';
import * as actionTypes from './action-types';

function* add() {
  while (true) {
    console.log('等待 1000 ms')
    yield delay(1000);
    yield put({ type: actionTypes.ADD })
  }
}

function* addWatcher() {
  // 开启一个新的子进程执行add
  const task = yield fork(add);
  // 等待STOP_ADD动作类型，等到取消task任务
  yield take(actionTypes.STOP_ADD);
  // 告诉 saga中间件请帮我取消task任务
  yield cancel(task);
}

function* request(action) {
  let url = action.payload;
  let promise = fetch(url).then(res => res.json());;
  let res = yield promise;
  console.log(res);
}

function* requestWatcher() {
  //action = {type,url}
  const requestAction = yield take(actionTypes.REQUEST);
  //开启一个新的子进程发起请求
  const requestTask = yield fork(request, requestAction);
  //立刻开始等待停止请求的动作类型
  const stopAction = yield take(actionTypes.STOP_REQUEST);
  yield cancel(requestTask);//在axios里，是通过 调用promise的reject方法来实出任务取消
}

function* rootSaga() {
  yield addWatcher();
}

export default rootSaga;