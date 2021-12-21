import React from "./react";
import ReactDOM from "./react-dom";

let Child = ({ data, handleClick }) => {
  console.log("Child render");
  return <button onClick={handleClick}>{data.number}</button>;
};
Child = React.memo(Child);

function App() {
  console.log("App render");
  const [name, setName] = React.useState("小明");
  const [number, setNumber] = React.useState(0);

  const data = React.useMemo(() => {
    console.log('run useMemo')
    return { number }
  }, [number]);

  const handleClick = React.useCallback(() => {
    console.log('run useCallback')
    setNumber(number + 1)
  }, [number]);
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Child data={data} handleClick={handleClick} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
