import { CREATE, UPDATE, DELETE, LIKE, SEARCH, STACK_POST, FETCHING_POST, FETCHING, FETCHING_FAILED, ADVANCE_PAGE, RESET_POST, FILTER_POST } from "../constants/actionTypes";

const initialState = {
  posts: [],
  fetching: true,
  page: 0,
  after: 0,
  perPage: 10,
  more: true,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  switch (action.type) {
    case DELETE:
      return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
    case UPDATE:
    case LIKE:
      return { ...state, fetching: false, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) }; //action.payload is the updated post
    case CREATE:
      return { ...state, fetching: false, posts: [action.payload, ...state.posts] };
    case SEARCH:
      //check neu k con data de push vao mang
      return !action.payload.dataSearch.length ? { ...state, more: false } : { ...state, posts: [...state.posts, ...action.payload.dataSearch], fetching: false };
    case STACK_POST:
      return;
    case FETCHING_POST:
      return !action.posts.list.length ? { ...state, more: false } : { ...state, posts: [...state.posts, ...action.posts.list], fetching: false };
    case FILTER_POST:
      return !action.posts.list.length ? { ...state, more: false } : { ...state, posts: [...state.posts, ...action.posts.list], fetching: false };
    case ADVANCE_PAGE:
      return { ...state, page: state.page + 1, fetching: true };
    case RESET_POST:
      return { posts: [], fetching: true, page: 0, more: true };
    case FETCHING:
      return { ...state, fetching: true };
    case FETCHING_FAILED:
      return { ...state, fetching: false };
    default:
      return state;
  }
};
