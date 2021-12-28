import * as actionTypes from '../action-types';
function add1(amount) {
    return { type: actionTypes.ADD1, payload: { amount } };
}
function minus1() {
    return { type: actionTypes.MINUS1 };
}
const actionCreators = { add1, minus1 };
export default actionCreators;