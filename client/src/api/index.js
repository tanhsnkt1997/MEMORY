import axios from "axios";
import { RESET_FROFILE, LOGOUT } from "../constants/actionTypes";
import { useDispatch, useSelector } from "react-redux";

const API = axios.create({ baseURL: "http://localhost:5000" });
//chu y
API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("token"))}`;
  }
  return req;
});

const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("freshToken");
  localStorage.removeItem("profile");
};

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("ERROR KHI GOI REQUSET", error);
    console.log("error.response.url", error.response);
    //Cancel request
    if (error.message === "Cancelling in cleanup") {
      return Promise.reject(error);
    }
    const originalRequest = error.config;
    // Prevent infinite loops
    if (error.response.status === 403 && error.config.url === "/user/refreshToken") {
      window.location.href = "/auth/";
      useDispatch({ type: LOGOUT });
      useDispatch({ type: RESET_FROFILE });
      return Promise.reject(error);
    }
    if (error.response.data.message === "Error token" && error.response.status === 401 && error.response.statusText === "Unauthorized") {
      // response parse
      const refreshToken = JSON.parse(localStorage.getItem("freshToken"));
      if (refreshToken) {
        return API.post("/user/refreshToken", { refreshToken }).then((response) => {
          localStorage.setItem("token", JSON.stringify(response.data.token));
          // originalRequest.headers["Authorization"] = `Bearer ${response.data.token}`;
          // originalRequest.baseURL = undefined;
          // return axios.request(originalRequest);
          API.defaults.headers["Authorization"] = `Bearer ${response.data.token}`;
          originalRequest.headers["Authorization"] = `Bearer ${response.data.token}`;
          return API(originalRequest);
        });
      } else {
        console.log("Refresh token is expired");
        useDispatch({ type: LOGOUT });
        useDispatch({ type: RESET_FROFILE });
        window.location.href = "/auth/";
      }
    }
    // specific error handling done elsewhere
    return Promise.reject(error.response);
  }
);

export const fetchPosts = () => API.get("/posts");
export const createPost = (newPost) => API.post("/posts", newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (info) => API.patch(`/posts/${info.post_id}/likePost`, info);

export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
export const searchPost = (textSearch, page, limit, cancelToken) => API.get(`/posts/search?key=${textSearch}&page=${page}&limit=${limit}`, { cancelToken });
export const getListWithPagination = (page, limit, cancelToken) => API.get(`/posts/list?page=${page}&limit=${limit}`, { cancelToken });
// export const filterPost = (sortBy, page, limit, keyword) => API.get(`/posts/filter?keyword=${keyword}&sortBy=${sortBy}&page=${page}&limit=${limit}`);
export const filterPost = (sortBy, page, limit, keyword) => API.get(`/posts/filter`, { params: { keyword, sortBy, page, limit } });

//Profile
export const updateProfile = (id, profile) => API.patch(`/user/profile/${id}`, profile);

//Notification
export const getNotification = (userId) => API.get(`/notifications/list/${userId}`);
