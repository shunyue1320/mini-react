import { combineReducers } from "redux";
import { routerReducer } from "../../history";
import counter from "./counter";

let reducers = {
  router: routerReducer,
  counter,
};
let combinedReducer = combineReducers(reducers);
export default combinedReducer;
