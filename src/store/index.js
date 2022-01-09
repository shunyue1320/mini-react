import { createStore, applyMiddleware } from "redux";
import combinedReducer from "./reducers";
import { createReduxHistory, routerMiddleware } from "../history";

// 没有中间件的写法
// const store = createStore(combinedReducer);
export const store = applyMiddleware(routerMiddleware)(createStore)(combinedReducer);

// 返回 新history，重写 push replace 方法
export const history = createReduxHistory(store);

window.store = store;
