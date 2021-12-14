import React from './react';
import ReactDOM from './react-dom';

function FunctionComponent(props){
  return <div className="title" style={{ color: 'red' }}>
    <h1>{props.name}</h1>
    <h3>{props.children}</h3>
  </div>
}
console.log(FunctionComponent({name: 1, children: 2}))

ReactDOM.render(
  <FunctionComponent name="hello">world</FunctionComponent>,
  document.getElementById('root')
);
