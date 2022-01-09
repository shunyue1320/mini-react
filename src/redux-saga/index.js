import EventEmitter from "events";
import runSaga from "./runSaga";

function createSagaMiddleware() {
  let channel = new EventEmitter();
  let boundRunSaga;

  function sagaMiddleware({ getState, dispatch }) {
    boundRunSaga = runSaga.bind(null, { channel, getState, dispatch });
    return function (next) {
      //dispatch({ type: actionTypes.ASYNC_ADD });
      return function (action) {
        const result = next(action);
        //触发一个事件，事件名称是动作类型，参数是动作对象
        channel.emit(action.type, action);
        return result;
      };
    };
  }
  sagaMiddleware.run = (saga) => boundRunSaga(saga);
  return sagaMiddleware;
}

export default createSagaMiddleware;
