import React from "react";
import { Router } from "react-router";

export function HistoryRouter({ history, children }) {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  // 当 history 改变时重新渲染页面
  React.useLayoutEffect(() => {
    history.listen(setState);
  }, [history]);

  return (
    <Router
      action={state.action}
      location={state.location}
      navigator={history}
      navigationType={state.action}
    >
      {children}
    </Router>
  );
}
