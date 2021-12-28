import * as actionTypes from '../action-types';
function add2(amount) {
    return { type: actionTypes.ADD2, payload: { amount } };
}
function minus2() {
    return { type: actionTypes.MINUS2 };
}
const actionCreators = { add2, minus2 };
export default actionCreators;