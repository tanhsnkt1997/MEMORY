import { UPDATE_FROFILE } from "../constants/actionTypes";
const initState = {
  fetching: false,
  profile: JSON.parse(localStorage.getItem("profile")),
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_FROFILE:
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      console.log("_______nhna dc data", action.payload);
      return { ...state, fetching: false };
    default:
      return state;
  }
};

export default authReducer;

// localStorage.getItem("token")
