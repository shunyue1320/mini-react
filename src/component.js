import { findDOM, compareTwoVdom } from "./react-dom";
import { shallowEqual } from "./utils.js";
export const updateQueue = {
  isBatchingUpdate: false,
  updaters: new Set(),
  batchUpdate() {
    // 批量更新
    for (const updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.isBatchingUpdate = false;
    updateQueue.updaters.clear();
  },
};

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
    this.callbacks = [];
  }
  addState(partialState, callback) {
    this.pendingStates.push(partialState);
    if (typeof callback === "function") {
      this.callbacks.push(callback);
    }
    this.emitUpdate(); // 触发更新
  }
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this);
    } else {
      this.updateComponent();
    }
  }
  updateComponent() {
    const { classInstance, pendingStates } = this;
    if (this.nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, this.nextProps, this.getState());
    }
  }
  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      if (typeof nextState === "function") {
        nextState = nextState(state);
      }
      state = { ...state, ...nextState };
    });
    pendingStates.length = 0;
    return state;
  }
}

function shouldUpdate(classInstance, nextProps, nextState) {
  if (nextProps) {
    classInstance.props = nextProps;
  }
  classInstance.state = nextState;
  classInstance.forceUpdate();

  let willUpdate = true;
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false;
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }
  if (nextProps) {
    classInstance.props = nextProps;
  }
  classInstance.state = nextState;
  if (willUpdate) {
    classInstance.forceUpdate();
  }
}

export class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  // + 更新状态的方法
  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }
  // + 添加强制更新组件
  forceUpdate() {
    const oldRenderVdom = this.oldRenderVdom; // 旧的vdom
    const oldDOM = findDOM(oldRenderVdom); // 旧的dom
    if (this.constructor.contextType) {
      this.context = this.constructor.contextType._currentValue;
    }
    if (this.constructor.getDerivedStateFromProps) {
      const newState = this.constructor.getDerivedStateFromProps(
        this.props,
        this.state
      );
      if (newState) {
        this.state = { ...this.state, ...newState };
      }
    }
    const newRenderVdom = this.render(); // 其实就是执行 React.createElement 生成新的 vdom
    const snapshot =
      this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate();
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom); // (父节点，旧dom， 新dom) 给两个 vdom 进行 diff 对比渲染页面
    this.oldRenderVdom = newRenderVdom;

    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, snapshot);
    }
  }
}

export class PureComponent extends Component {
  shouldComponentUpdate(newProps, nextState) {
      // 如果新属性和老属性不相等 或者新状态和老状态不相等 就更新组件
      return !shallowEqual(this.props, newProps) || !shallowEqual(this.state, nextState)
  }
}
