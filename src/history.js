import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "./redux-first-history";

const {
  routerReducer, // 合并reducers里的 reducer
  routerMiddleware, // 路由中间件
  createReduxHistory, // 创建 redux历史对象
} = createReduxHistoryContext({ history: createBrowserHistory() });

export {
  routerReducer,
  routerMiddleware,
  createReduxHistory,
};
