import { REACT_TEXT } from "./constants";
import { addEvent } from "./event";

function render(vdom, container) {
  mount(vdom, container);
}
export function mount(vdom, container) {
  const newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}
export function createDOM(vdom) {
  const { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) {
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
  return dom;
}

// 添加一个方法：执行这个类函数组件上的 render 方法
function mountClassComponent(vdom) {
  const { type, props } = vdom;
  const classInstance = new type(props);
  const renderVdom = classInstance.render();
  // + 缓存旧的 vdom 方便后续 diff 对比
  classInstance.oldRenderVdom = renderVdom;
  const dom = createDOM(renderVdom);
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
    const renderVdom = vdom.oldRenderVdom;
    return findDOM(renderVdom);
  }
}

// + diff 对比新旧dom 渲染页面
export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
  // + 后续会进行 diff 对比
  const oldDOM = findDOM(oldVdom);
  const newDOM = createDOM(newVdom);
  parentDOM.replaceChild(newDOM, oldDOM);
}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    let childVdom = childrenVdom[i];
    mount(childVdom, parentDOM);
  }
}
const ReactDOM = {
  render,
};

export default ReactDOM;
