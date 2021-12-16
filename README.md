# mini-react
迷你版本 react 用于学习

## DOM-DIFF算法
1. 只对同级节点进行对比，如果DOM节点跨层级移动，则React不会复用
2. 不同类型的元素会产出不同的结构 ，会销毁老结构，创建新结构
3. 可以通过key标识移动的元素

![dom diff](https://github.com/shunyue1320/mini-react/blob/react-09/diff.jpeg)