// 作用： 利用 window.history 前进后退，通过 popstate 事件监听路径变化通知路由
function createBrowserHistory() {
  const globalHistory = window.history;
  let state = "";
  let listeners = []; //存放所有的监听函数
  function go(N) {
    globalHistory.go(N);
  }
  function goBack() {
    globalHistory.goBack();
  }
  function goForward() {
    globalHistory.forward();
  }

  /**
   * 添加或者说跳转路径
   * @param {*} pathname 路径名，可能是字符串，也可能是{pathname,state}
   * @param {*} nextState
   */
  function push(pathname, nextState) {
    const action = "PUSH";
    if (typeof pathname === "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    // pushState 用法： https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState
    globalHistory.pushState(state, null, pathname);
    notify({ location: { pathname, state }, action });
  }
  function listen(listener) {
    listeners.push(listener);
    // 返回卸载监听函数
    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  }
  window.addEventListener("popstate", () => {
    // TODO
    let location = {
      state: globalHistory.state,
      pathname: window.location.pathname,
    };
    // 当路径改变之后应该让history的监听函数执行，重新刷新组件
    notify({ action: "POP", location });
  });
  function notify(newState) {
    // 把 newState 上的属性都拷贝到 history 上
    Object.assign(history, newState);
    history.length = globalHistory.length;
    listeners.forEach((listener) =>
      listener({
        location: history.location,
        action: history.action,
      })
    );
  }

  let history = {
    action: "POP",
    go,
    goBack,
    goForward,
    push,
    listen,
    location: {
      pathname: window.location.pathname,
      state: window.location.state,
    },
  };

  return history;
}

export default createBrowserHistory;
