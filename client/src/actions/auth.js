import * as api from "../api";
import { AUTH, AUTH_FAILED } from "../constants/actionTypes";

export const signin = (formData, history) => async (dispatch) => {
  try {
    //login the user...
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
    history.push("/");
  } catch (error) {
    dispatch({ type: AUTH_FAILED, error: { message: error.data.message, auth: "signin", statusCode: error.status } });
    console.log("error signIn", error);
  }
};

export const signup = (formData, history) => async (dispatch) => {
  try {
    //signup the user...
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
    history.push("/");
  } catch (error) {
    dispatch({ type: AUTH_FAILED, error: { message: error.data.message, auth: "signup", statusCode: error.status } });
    console.log("error signUp", error);
  }
};
