// 作用：将多个 reducer 合并成一个

function bindActionCreator(actionCreator, dispatch) {
  //返回一个新的函数，执行新函数 派发老的actionCreator返回的action
  return function () {
      return dispatch(actionCreator.apply(this, arguments));
  }
}

function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }
  const boundActions = {}
  for (const key in actionCreators) {
    boundActions[key] = bindActionCreator(actionCreators[key], dispatch)
  }

  return boundActions
}

export default bindActionCreators;