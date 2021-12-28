
function combineReducers(reducers) {
  return function (state = {}, action) {
    const nextState = {}
    for (const key in reducers) {
      nextState[key] = reducers[key](state[key], action)
    }
    return nextState
  }
}

export default combineReducers;