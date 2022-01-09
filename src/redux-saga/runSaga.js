import * as effectTypes from "./effectTypes";

//done callback
const TASK_CANCEL = "TASK_CANCEL";
function runSaga(env, saga, sagaDone) {
  const task = { cancel: () => next(TASK_CANCEL) };
  const { channel, dispatch } = env;
  const it = typeof saga === "function" ? saga() : saga;
  function next(value, isError) {
    let result;
    if (isError) {
      result = it.throw(value);
    } else if (value === TASK_CANCEL) {
      //如果调用next的时候传入了TASK_CANCEL,那么会让此迭代器直接结束
      result = it.return(value);
    } else {
      result = it.next(value);
    }
    let { done, value: effect } = result;
    if (!done) {
      //如果effect有Symbol.iterator属性的话，说明它是一个迭代器
      if (typeof effect[Symbol.iterator] == "function") {
        //如果effect是一个迭代器的话，会开启一个新的子进程运行effect
        runSaga(env, effect);
        //当前saga会继续向下执行
        next();
      } else if (effect instanceof Promise) {
        effect.then(next);
      } else {
        switch (effect.type) {
          //如果指令对象是TAKE类型，会监听一次actionType,监听到之后会执行next继续执行saga
          case effectTypes.TAKE:
            channel.once(effect.actionType, (action) => next(action));
            break;
          case effectTypes.PUT:
            dispatch(effect.action);
            next();
            break;
          case effectTypes.FORK:
            let forkTask = runSaga(env, effect.saga.bind(null, ...effect.args));
            next(forkTask);
            break;
          case effectTypes.CALL:
            effect.fn(...effect.args).then(next);
            break;
          case effectTypes.CPS:
            // delay is ok
            effect.fn(...effect.args, (err, data) => {
              if (err) {
                next(err, true);
              } else {
                next(data);
              }
            });
            break;
          case effectTypes.ALL:
            //获取迭代器的数组
            let { iterators } = effect;
            //声明结果对象，放置各个迭代器执行结束后的返回值
            let result = [];
            //完成任务的数量
            let completeCount = 0;
            //循环迭代器
            iterators.forEach((iterator, index) => {
              //开启了一个新的子进程执行iterator
              runSaga(env, iterator, (data) => {
                //TODO fork
                result[index] = data;
                if (++completeCount === iterators.length) {
                  next(result);
                }
              });
            });
            next();
            break;
          case effectTypes.CANCEL:
            effect.task.cancel();
            next();
            break;
          default:
            break;
        }
      }
    } else {
      //done=true
      sagaDone && sagaDone(effect);
    }
  }
  next();
  return task;
}

export default runSaga;
