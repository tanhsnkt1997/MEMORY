import { AUTH, LOGOUT, AUTH_FAILED, RESET_MESSAGE_AUTH } from "../constants/actionTypes";

const authReducer = (state = { authData: null, error: null }, action) => {
  switch (action.type) {
    case AUTH:
      localStorage.setItem("profile", JSON.stringify({ ...action?.data?.result }));
      localStorage.setItem("token", JSON.stringify(action?.data?.token));
      localStorage.setItem("freshToken", JSON.stringify(action?.data?.refreshToken));
      return { ...state, authData: action?.data, isSignIn: true };
    case AUTH_FAILED:
      return { ...state, error: { ...action.error } };
    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };
    case RESET_MESSAGE_AUTH:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default authReducer;

// localStorage.getItem("token")
