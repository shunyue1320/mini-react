import { createStore, applyMiddleware } from '../packages/redux';
import combinedReducer from './reducers';
// 3个中间件
import logger from './redux-logger'; // 日志中间件
import thunk from './redux-thunk';
import promise from './redux-promise';

// 没有中间件的写法
// const store = createStore(combinedReducer);
// 有中间件的写法 作用：重写 store.dispatch，重写后的 dispatch 会依次执行 thunk, promise, logger 中间件，如果所有中间件都顺利执行 next，则最后执行原始的 dispatch
const store = applyMiddleware(thunk, promise, logger)(createStore)(combinedReducer)

window.store = store;
export default store;