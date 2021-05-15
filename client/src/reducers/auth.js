import { AUTH, LOGOUT } from "../constants/actionTypes";

const authReducer = (state = { authData: null }, action) => {
  switch (action.type) {
    case AUTH:
      console.log("vao auth");
      localStorage.setItem("profile", JSON.stringify({ ...action?.data?.result }));
      localStorage.setItem("token", JSON.stringify(action?.data?.token));
      localStorage.setItem("freshToken", JSON.stringify(action?.data?.refreshToken));
      return { ...state, authData: action?.data };
    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };
    default:
      return state;
  }
};

export default authReducer;

// localStorage.getItem("token")
