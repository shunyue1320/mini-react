function compose(...funcs) {
  if (funcs.length === 0) {
    return (args) => args;
  } else if (funcs.length === 1) {
    return funcs[0];
  }

  // [a, b, c] => a(b(c()))
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export default compose;
