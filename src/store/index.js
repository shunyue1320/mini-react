import { createStore } from '../packages/redux';
import combinedReducer from './reducers';
let store = createStore(combinedReducer);
window.store = store;
export default store;