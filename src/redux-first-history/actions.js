//代表一个动作类型 调用历史对象的方法
export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
//当路径发生改变之后派发的动作类型
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

// 给 createRouterReducer 识别
export const locationChangeAction = (location, action) => {
  return {
      type: LOCATION_CHANGE,
      payload: { action, location }
  }
}

// 给 createRouterMiddleware 中间件识别
function updateLocation(method) {
  return (...args) => {
      return {
          type: CALL_HISTORY_METHOD,
          payload: { method, args }
      }
  }
}
export const push = updateLocation('push');// push('/counter');
export const replace = updateLocation('replace');