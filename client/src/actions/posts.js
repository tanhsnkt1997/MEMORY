import * as api from "../api";
import { CREATE, UPDATE, DELETE, FETCHING_FAILED, FETCH_ALL, LIKE, SEARCH, FETCHING_POST, FILTER_POST } from "../constants/actionTypes";

//Action Creators
export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts();
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);
    console.log("nhan dc data khi tao post", data);
    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    dispatch({ type: FETCHING_FAILED, payload: error });
    console.log("error creat post", error.message);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    dispatch({ type: FETCHING_FAILED, payload: error });
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = (info) => async (dispatch) => {
  try {
    const { data } = await api.likePost(info);
    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.log(error);
  }
};
export const searchPost = (textSearch, page, limit, cancelToken) => async (dispatch) => {
  try {
    // window.history.pushState(null, null, `/posts/search?key=${textSearch}`);
    const { data } = await api.searchPost(textSearch, page, limit, cancelToken);
    dispatch({ type: SEARCH, payload: data });
  } catch (error) {
    dispatch({ type: FETCHING_FAILED, payload: error });
    console.log(error);
  }
};

export const getListWithPagination = (page, limit, cancelToken) => async (dispatch) => {
  try {
    const { data } = await api.getListWithPagination(page, limit, cancelToken);
    dispatch({ type: FETCHING_POST, posts: data });
    // console.log("data", data);
  } catch (error) {
    dispatch({ type: FETCHING_FAILED, payload: error });
    console.log("error get list with pagination", error);
  }
};

export const filterPost = (keyword, sortBy, page, limit) => async (dispatch) => {
  try {
    const { data } = await api.filterPost(sortBy, page, limit, keyword);
    dispatch({ type: FILTER_POST, posts: data });
  } catch (error) {
    dispatch({ type: FETCHING_FAILED, payload: error });
    console.log(error);
  }
};
