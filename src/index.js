import React from "./react";
import ReactDOM from "./react-dom";

function Counter() {
  const [number, setNumber] = React.useState(0);
  React.useEffect(() => {
    console.log("开启一个新的定时器");
    const $timer = setInterval(() => {
      setNumber(number + 1);
    }, 1000);
    return () => {
      console.log("销毁老的定时器");
      clearInterval($timer);
    };
  });

  React.useEffect(() => {
    console.log("number - 改变");
    return () => {
      console.log("销毁");
    };
  }, [ number ]);
  return <p>{number}</p>;
}
ReactDOM.render(<Counter />, document.getElementById("root"));
