import { updateQueue } from './component';

export function addEvent(dom, eventType, handler) {
  const store = dom.store || (dom.store = {})
  store[eventType] = handler                    // 事件缓存起来
  if (!window.document[eventType]) {
    window.document[eventType] = dispatchEvent  // 事件都代理到 document 上
  }
}

// + 写一个高阶函数 先执行自己的逻辑 后执行触发绑定的回调
export function dispatchEvent(event) {
  let { target, type } = event;
  const eventType = `on${type}`;
  const syntheticEvent = createSyntheticEvent(event);
  updateQueue.isBatchingUpdate = true;      // 使 updateQueue 缓存操作dom队列
  while (target) {                          // 手动实现事件冒泡
    const { store } = target;
    const handler = store && store[eventType]
    handler && handler(syntheticEvent);     // 向上查找每一个父集 如果他们也绑定了此方法就执行
    //在执行handler的过程中有可能会阻止冒泡
    if (syntheticEvent.isPropagationStopped) {
      break;
    }
    target = target.parentNode;
  }
  updateQueue.isBatchingUpdate = false;
  updateQueue.batchUpdate();                // 所有都执行完成后出发组件更新
}

// + 创建一个合成的 event (原因：事件代理到 document 上后没有本身的 event)
function createSyntheticEvent(nativeEvent) {
  const syntheticEvent = {};
  for (let key in nativeEvent) {            // 把原生事件上的属性拷贝到合成事件对象上去
    let value = nativeEvent[key];
    if(typeof value === 'function')value=value.bind(nativeEvent);
    syntheticEvent[key] = nativeEvent[key];
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.isDefaultPrevented = false;
  syntheticEvent.isPropagationStopped = false;
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.stopPropagation = stopPropagation;
  return syntheticEvent;
}

function preventDefault() {
  this.defaultPrevented = true;
  const event = this.nativeEvent;
  if (event.preventDefault) {
    event.preventDefault();
  } else {//IE
    event.returnValue = false;
  }
  this.isDefaultPrevented = true;
}

function stopPropagation() {
  const event = this.nativeEvent;
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {//IE
    event.cancelBubble = true;
  }
  this.isPropagationStopped = true;
}