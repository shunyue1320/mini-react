import React from 'react';
import * as actionTypes from '../store/action-types';
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
	const number = useSelector(state => state.number);
	const dispatch = useDispatch();
	return (
		<div>
			<p>{number}</p>
			<button onClick={() => dispatch({ type: actionTypes.ADD })}>+</button>
			<button onClick={() => dispatch({ type: actionTypes.ASYNC_ADD })}>ASYNC_ADD +</button>
			<button onClick={() => dispatch({ type: actionTypes.STOP_ADD })}>stop</button>
			<button onClick={() => dispatch({ type: actionTypes.REQUEST, payload: '/users.json' })}>request</button>
			<button onClick={() => dispatch({ type: actionTypes.STOP_REQUEST })}>stopRequest</button>
		</div>
	)
}

export default Counter;