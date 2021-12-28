import React from "react";
import actionCreators from "../store/actionCreators/counter2";
import { connect } from "../packages/react-redux";

class ClassCounter2 extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.number}</p>
        <button onClick={() => this.props.add2(5)}>+</button>
        <button onClick={this.props.minus2}>-</button>
      </div>
    );
  }
}

//把仓库中的状态映射为此组件的属性对象
const mapStateToProps = (state) => state.counter2;
export default connect(mapStateToProps, actionCreators)(ClassCounter2);

/* function Counter2() {
    let [state, setState] = React.useState(store.getState().counter2);
    React.useEffect(() => {
        return store.subscribe(() => {
            setState(store.getState().counter2);
        });
    }, []);
    return (
        <div>
            <p>{state.number}</p>
            <button onClick={() => boundActions.add2(5)}>+</button>
            <button onClick={boundActions.minus2}>-</button>
        </div>
    )
}

export default Counter2; */
/**
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
