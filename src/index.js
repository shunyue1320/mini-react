import React from "./react";
import ReactDOM from "./react-dom";

const Animate = ()=>{
  const ref = React.useRef();
  // React.useEffect(() => {
  React.useLayoutEffect(() => { // 等待 dom 渲染完成后更新页面
    ref.current.style.transform = `translate(500px)`; //TODO
    ref.current.style.transition = `all 500ms`;
  });
  let style = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'red'
  }
  return (
    <div style={style} ref={ref}></div>
  )
}
ReactDOM.render(<Animate/>,document.getElementById('root'));