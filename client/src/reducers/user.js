import { UPDATE_FROFILE, RESET_FROFILE, GET_FROFILE } from "../constants/actionTypes";
import { coverTimeStampToDMY } from "../helper/helper";

const initState = {
  fetching: false,
  profile: null,
};

console.log("chay vao day");

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_FROFILE:
      const profileAsync = JSON.parse(localStorage.getItem("profile"));
      const jsDate = new Date(profileAsync.birthDay);
      //profileAsync.imageUrl is google account
      // profileAsync.imageUrl is normal account
      return { fetching: false, profile: { day: jsDate.getDate(), month: jsDate.getMonth(), year: jsDate.getFullYear(), avatar: profileAsync.imageUrl ? profileAsync.imageUrl : profileAsync.avatar, name: profileAsync.name, gender: profileAsync.gender, phoneNumber: profileAsync.phoneNumber } };
    case UPDATE_FROFILE:
      const { name, phoneNumber, gender, birthDay, avatar } = action.payload;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      // console.log("_______nhna dc data", action.payload);
      return { ...state, fetching: false, profile: { day: coverTimeStampToDMY(birthDay).day, month: coverTimeStampToDMY(birthDay).month, year: coverTimeStampToDMY(birthDay).year, avatar, gender, phoneNumber, name } };
    case RESET_FROFILE:
      return { ...state, profile: null };
    default:
      return state;
  }
};

export default authReducer;

// localStorage.getItem("token")
