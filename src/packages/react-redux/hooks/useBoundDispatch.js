import React from 'react';
import ReactReduxContext from '../ReactReduxContext';
import { bindActionCreators } from '../../redux';
function useBoundDispatch(actionCreators) {
    const { store } = React.useContext(ReactReduxContext);
    const boundActionCreators = bindActionCreators(actionCreators, store.dispatch);
    return boundActionCreators;
}
export default useBoundDispatch;