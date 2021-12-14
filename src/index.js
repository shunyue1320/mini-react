import React from './react';
import ReactDOM from './react-dom';


const App = <div className="title" style={{color:'red'}}>hello world</div>
console.log('App', App)

ReactDOM.render(
  App,
  document.getElementById('root')
);
