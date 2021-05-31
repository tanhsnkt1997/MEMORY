import { GET_NOTIFICATION } from "../constants/actionTypes";

const init = {
  list: [],
};

const notification = (state = init, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return { ...state, list: action.payload.list };

    default:
      return state;
  }
};

export default notification;
