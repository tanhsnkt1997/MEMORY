import { combineReducers } from "redux";

import posts from "./posts";
import auth from "./auth";
import user from "./user";
import notif from "./notification";

export default combineReducers({
  posts,
  auth,
  user,
  notif,
});
