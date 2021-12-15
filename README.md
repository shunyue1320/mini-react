# mini-react
迷你版本 react 用于学习


**State 的更新会被合并 当你调用 setState() 的时候，React 会把你提供的对象合并到当前的 state**


### State 的更新可能是异步的
1. 出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用
2. 因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态
3. 可以让 setState() 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数


### 事件处理
1. React 事件的命名采用小驼峰式(camelCase),而不是纯小写
2. 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串
3. 你不能通过返回 false 的方式阻止默认行为。你必须显式的使用preventDefault