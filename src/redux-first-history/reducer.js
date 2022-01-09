import { LOCATION_CHANGE } from "./actions";

export const createRouterReducer = (history) => {
  const initialState = {
    action: history.action,
    location: history.location,
  };

  return function (state = initialState, { type, payload }) {
    if (type === LOCATION_CHANGE) {
      return { ...state, action: payload.action, location: payload.location };
    }
    return state;
  };
};
