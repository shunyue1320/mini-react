import React from "react";
import actionCreators from "../store/actionCreators/counter1";
import {
  connect,
  useSelector,
  useDispatch,
  useBoundDispatch,
} from "../packages/react-redux";

// 方案一：
function Counter1() {
  const state = useSelector((state) => state.counter1);
  const boundActionCreators = useBoundDispatch(actionCreators);

  return (
    <div>
      <p>{state.number}</p>
      <button onClick={() => boundActionCreators.add1(5)}>+</button>
      <button onClick={boundActionCreators.minus1}>-</button>
      <button onClick={boundActionCreators.thunkAdd1}>thunkAdd</button>
      <button onClick={boundActionCreators.promise1Add}>promise1Add</button>
      <button onClick={boundActionCreators.promise2Add}>promise2Add</button>
    </div>
  );
}

export default Counter1;

/*
方案二：
class ClassCounter1 extends React.Component {
    render() {
        return (
            <div>
                <p>{this.props.number}</p>
                <button onClick={() => this.props.add1(5)}>+</button>
                <button onClick={this.props.minus1}>-</button>
            </div >
        )
    }
}
//把仓库中的状态映射为此组件的属性对象
const mapStateToProps = (state) => state.counter1;//{number:0}
export default connect(mapStateToProps, actionCreators)(ClassCounter1);
*/

/**
 * 方案三：
 * 组件和仓库有两种关系
 * 一种输入  组件可以从仓库中读取状态数据进行渲染和显示
 * 一种叫输出 可以在组件派发动作，修改仓库中的状态
 */

/**
class ClassCounter1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
    }
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState(store.getState());
        });
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={() => store.dispatch({ type: actionTypes.ADD })}>+</button>
                <button onClick={() => store.dispatch({ type: actionTypes.MINUS })}>-</button>
            </div >
        )
    }
}
 */
