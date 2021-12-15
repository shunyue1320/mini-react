import { findDOM, compareTwoVdom } from './react-dom';

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
    this.callbacks = [];
  }
  addState(partialState, callback) {
    this.pendingStates.push(partialState)
    if (typeof callback === 'function') {
      this.callbacks.push(callback)
    }
    this.emitUpdate() // 触发更新
  }
  emitUpdate() {
    this.updateComponent()
  }
  updateComponent() {
    const { classInstance, pendingStates } = this
    if (pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState())
    }
  }
  getState() {
    const { classInstance, pendingStates } = this
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      if (typeof nextState === 'function') {
        nextState = nextState(state)
      }
      state = { ...state, ...nextState }
    })
    pendingStates.length = 0
    return state
  }
}

function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState
  classInstance.forceUpdate()
}

export class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this)
  }
  // + 更新状态的方法
  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }
  // + 添加强制更新组件
  forceUpdate() {
    const oldRenderVdom = this.oldRenderVdom; // 旧的vdom
    const oldDOM = findDOM(oldRenderVdom);    // 旧的dom
    const newRenderVdom = this.render()       // 其实就是执行 React.createElement 生成新的 vdom
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom); // (父节点，旧dom， 新dom) 给两个 vdom 进行 diff 对比渲染页面
    this.oldRenderVdom = newRenderVdom;
  }
}
