import * as api from "../api";
import { UPDATE_FROFILE } from "../constants/actionTypes";

//Action Creators
export const updateProfile = (id, profile) => async (dispatch) => {
  try {
    const { data } = await api.updateProfile(id, profile);
    console.log("nhan dc action", data);
    dispatch({ type: UPDATE_FROFILE, payload: data });
  } catch (error) {
    console.log(error);
  }
};
