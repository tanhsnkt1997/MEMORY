import * as api from "../api";
import { GET_NOTIFICATION } from "../constants/actionTypes";

export const getNotif = (userId) => async (dispatch) => {
  try {
    const data = await api.getNotification(userId);
    console.log("action nhan dc", data.data);
    dispatch({ type: GET_NOTIFICATION, payload: data.data });
  } catch (error) {
    console.log("get notification error", error);
    // dispatch({ type: GET_NOTIFICATION, payload: data });
  }
};
