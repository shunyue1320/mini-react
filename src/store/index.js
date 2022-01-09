import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "../redux-saga";
import rootSaga from "./rootSaga";
import reducer from "./reducer";

const sageMiddleware = createSagaMiddleware();
const store = applyMiddleware(sageMiddleware)(createStore)(reducer);

sageMiddleware.run(rootSaga);

export default store;
