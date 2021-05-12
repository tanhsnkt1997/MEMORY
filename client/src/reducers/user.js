import { UPDATE_FROFILE } from "../constants/actionTypes";

const authReducer = (state = { authData: null }, action) => {
  switch (action.type) {
    case UPDATE_FROFILE:
      return;
    default:
      return state;
  }
};

export default authReducer;

// localStorage.getItem("token")
