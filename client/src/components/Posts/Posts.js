import React, { useMemo, useRef, useEffect, forwardRef } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import queryString from "query-string";
import { useLocation } from "react-router-dom";

import "./post.css";

import Post from "./Post/Post";
import useStyles from "./styles";

const Posts = ({ setCurrentId, posts, getDetail }) => {
  console.log("list post", posts);
  const classes = useStyles();
  const { search } = useLocation();
  const { keyword } = queryString.parse(search);

  return keyword && !posts.length ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          color: "rgba(0,0,0,0.7)",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        No search result, try again !!!!
      </div>
    </div>
  ) : !posts.length ? (
    <Grid container justify="center">
      <CircularProgress />
    </Grid>
  ) : (
    <Grid className={classes.mainContainer} container alignItems="stretch" spacing={3}>
      {posts.map((post, index) => (
        <Grid key={index.toString()} item xs={12} sm={6} className="post__item__container">
          <Post post={post} setCurrentId={setCurrentId} getDetail={getDetail} />
        </Grid>
      ))}
    </Grid>
  );
};

export default React.memo(Posts);
