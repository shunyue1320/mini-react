# mini-react
迷你版本 react 用于学习

## 为 DOM 元素添加 ref
1. 可以使用 ref 去存储 DOM 节点的引用
2. 当 ref 属性用于 HTML 元素时，构造函数中使用 React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性

## Ref转发
1. 你不能在函数组件上使用 ref 属性，因为他们没有实例
2. Ref 转发是一项将 ref 自动地通过组件传递到其一子组件的技巧
3. Ref 转发允许某些组件接收 ref，并将其向下传递给子组件