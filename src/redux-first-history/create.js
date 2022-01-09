import { push, replace, locationChangeAction } from "./actions";
import { createRouterReducer } from "./reducer";
import { createRouterMiddleware } from "./middleware";

export const createReduxHistoryContext = ({ history }) => {
  const routerReducer = createRouterReducer(history);
  const routerMiddleware = createRouterMiddleware(history);
  const createReduxHistory = (store) => {
    // 初始化 state
    store.dispatch(locationChangeAction(history.location, history.action));
    // 监听原始 history 变化更新 state
    history.listen(({ location, action }) => {
      store.dispatch(locationChangeAction(location, action));
    });

    return {
      ...history,
      push: (...args) => store.dispatch(push(...args)),
      replace: (...args) => store.dispatch(replace(...args)),
      get location() {
        return store.getState().router.location;
      },
      get action() {
        return store.getState().router.action;
      },
    };
  };

  return {
    routerReducer,
    routerMiddleware,
    createReduxHistory,
  };
};
