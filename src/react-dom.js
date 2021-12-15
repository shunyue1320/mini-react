import { REACT_TEXT, REACT_FORWARD_REF_TYPE } from "./constants";
import { addEvent } from "./event";

function render(vdom, container) {
  mount(vdom, container);
}
export function mount(vdom, container) {
  const newDOM = createDOM(vdom);
  if (newDOM) {
    //把子DOM挂载到父DOM
    container.appendChild(newDOM);
    //执行子DOM的挂载完成事件
    if (newDOM.componentDidMount) newDOM.componentDidMount();
  }
}
export function createDOM(vdom) {
  const { type, props, ref } = vdom;
  let dom;
  // 是 react.forwardRef 组件
  if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
    // 判断：ReactDOM.render 参数1 是函数
  } else if (typeof type === "function") {
    // 添加一个是继承 React.Component 类函数的判断
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    dom = document.createElement(type);
  }
  if (props) {
    updateProps(dom, {}, props);
    if (typeof props.children == "object" && props.children.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  vdom.dom = dom;
  if (ref) {
    ref.current = dom; // 给 React.createRef() 放上 dom
  }

  return dom;
}

// 挂载 react.forwardRef 组件
function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

// 添加一个方法：执行这个类函数组件上的 render 方法
function mountClassComponent(vdom) {
  const { type, props, ref } = vdom;
  const classInstance = new type(props);
  //给虚拟DOM添加一个属性classInstance
  vdom.classInstance = classInstance;
  if (ref) {
    ref.current = classInstance; // 给 React.createRef() 放上 class组件实例
  }
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
  }
  const renderVdom = classInstance.render();
  // + 缓存旧的 vdom 方便后续 diff 对比
  classInstance.oldRenderVdom = renderVdom;
  const dom = createDOM(renderVdom);
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(this);
  }
  return dom;
}

// 执行这个函数组件 传递组件上的参数
function mountFunctionComponent(vdom) {
  const { type, props } = vdom;
  const renderVdom = type(props); // type 就是 FunctionComponent 组件函数
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function updateProps(dom, oldProps = {}, newProps = {}) {
  for (let key in newProps) {
    if (key === "children") {
      continue;
    } else if (key === "style") {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
  for (let key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      dom[key] = null;
    }
  }
}

// + 取dom，先取新 dom 没有才取 旧 vdom 内的 dom
export function findDOM(vdom) {
  if (!vdom) {
    return null;
  }
  if (vdom.dom) {
    return vdom.dom;
  } else {
    // 如果是类组件，从vdom.classInstance.oldRenderVdom取要渲染的虚拟DOM
    // 如果是函数组件，从vdom.oldRenderVdom取要渲染的虚拟DOM
    const oldRenderVdom = vdom.classInstance
      ? vdom.classInstance.oldRenderVdom
      : vdom.oldRenderVdom;
    return findDOM(oldRenderVdom);
  }
}

// 对比新旧dom 渲染页面
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
  if (!oldVdom && !newVdom) {
    // 1. 老和新都是没有
    return;
  } else if (!!oldVdom && !newVdom) {
    // 2. 老有新没有
    unMountVdom(oldVdom);
  } else if (!oldVdom && !!newVdom) {
    // 3. 老没有新的有
    let newDOM = createDOM(newVdom);
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM);
    }
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }
    return;
  } else if (!!oldVdom && !!newVdom && oldVdom.type !== newVdom.type) {
    // 4. 新老都有，但类型不同
    let newDOM = createDOM(newVdom);
    unMountVdom(oldVdom);
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }
  } else {
    // 5. 新老都有，类型相同
    updateElement(oldVdom, newVdom);
  }
}

// 作用： 删除子节点 触发 componentWillUnmount 生命周期
function unMountVdom(vdom) {
  const { type, props, ref } = vdom;
  const currentDOM = findDOM(vdom); // 获取此虚拟DOM对应的真实DOM
  // vdom可能是原生组件span 类组件 classComponent 也可能是函数组件Function
  if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
    vdom.classInstance.componentWillUnmount();
  }
  if (ref) {
    ref.current = null;
  }
  // 如果此虚拟DOM有子节点的话，递归全部删除
  if (props.children) {
    //得到儿子的数组
    const children = Array.isArray(props.children)
      ? props.children
      : [props.children];
    children.forEach(unMountVdom);
  }
  // 把自己这个虚拟DOM对应的真实DOM从界面删除
  if (currentDOM) {
    currentDOM.parentNode.removeChild(currentDOM);
  }
}

// 作用： 对比更新 新老节点
function updateElement(oldVdom, newVdom) {
  if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
    const currentDOM = (newVdom.dom = findDOM(oldVdom));
    if (oldVdom.props.content !== newVdom.props.content) {
      currentDOM.textContent = newVdom.props.content;
    }
    return;
  } else if (typeof oldVdom.type === "string") {
    const currentDOM = (newVdom.dom = findDOM(oldVdom));
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === "function") {
    if (oldVdom.type.isReactComponent) {
      newVdom.classInstance = oldVdom.classInstance;
      updateClassComponent(oldVdom, newVdom);
    } else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

// 作用： 更新子元素 子元素继续 compareTwoVdom 递归对比
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = oldVChildren
    ? (Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]).filter(
        (item) => item
      )
    : [];

  newVChildren = newVChildren
    ? (Array.isArray(newVChildren) ? newVChildren : [newVChildren]).filter(
        (item) => item
      )
    : [];

  let maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    let nextVdom = oldVChildren.find(
      (item, index) => index > i && item && findDOM(item)
    );
    compareTwoVdom(
      parentDOM,
      oldVChildren[i],
      newVChildren[i],
      nextVdom && findDOM(nextVdom)
    );
  }
}

// 更新类函数组件 React.Component
function updateClassComponent(oldVdom, newVdom) {
  const classInstance = (newVdom.classInstance = oldVdom.classInstance);
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVdom.props);
  }
  classInstance.updater.emitUpdate(newVdom.props);
}

// 更新函数组件
function updateFunctionComponent(oldVdom, newVdom) {
  const parentDOM = findDOM(oldVdom).parentNode;
  const { type, props } = newVdom;
  const newRenderVdom = type(props);
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    const childVdom = childrenVdom[i];
    mount(childVdom, parentDOM);
  }
}
const ReactDOM = {
  render,
};

export default ReactDOM;
