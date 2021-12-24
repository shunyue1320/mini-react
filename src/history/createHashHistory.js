/**
 * 前言：
 * 使用 hash 路由跳转页面不会发起请求 不会刷新页面
 * 浏览器的 history 对象是通过发起请求渲染返回的 html 实现的适用 ssr 渲染
 */

// 作用： 实现一套监听 hash 路由变化的类似 history 的机制
function createHashHistory() {
  //历史栈
  let historyStack = [];
  //栈顶指针
  let historyIndex = -1;
  //动作类型
  let action = "POP";
  //路径中的状态
  let state;
  //存放所有的监听函数
  let listeners = [];

  function go(N) {
    action = "POP";
    historyIndex += N;
    let nextLocation = historyStack[historyIndex];
    state = nextLocation.state;
    window.location.hash = nextLocation.pathname;
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }

  /**
   * 添加或者说跳转路径
   * @param {*} pathname 路径名，可能是字符串，也可能是{pathname,state}
   * @param {*} nextState
   */
  function push(pathname, nextState) {
    action = "PUSH";
    if (typeof pathname === "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    // 修改 hash 之后会触发 hashchange
    window.location.hash = pathname;
    Object.assign(history, { action, location: { pathname, state } });
    if (action === "PUSH") {
      historyStack[++historyIndex] = history.location;
    }
  }
  function hashchangeHandler() {
    let pathname = window.location.hash.slice(1);
    Object.assign(history, { action, location: { pathname, state } });
    if (action === "PUSH") {
      historyStack[++historyIndex] = history.location;
    }
    listeners.forEach((listener) =>
      listeners({ location: history.location, action: history.action })
    );
  }
  // 监听 hash 变化触发订阅
  window.addEventListener("hashchange", hashchangeHandler);

  function listen(listener) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(item => item !== listener)
    }
  }

  const history = {
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

  if (window.location.hash) {
    // #....
    action = "PUSH";
    hashchangeHandler();
  } else {
    window.location.hash = "/"; // ...#/
  }
  
  return history;
}

export default createHashHistory;
