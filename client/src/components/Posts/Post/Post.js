import React from "react";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ThumbUpAltOutlined from "@material-ui/icons/ThumbUpAltOutlined";
import moment from "moment";
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../actions/posts";
import { Card, CardActions, CardContent, Button, Typography } from "@material-ui/core";
import defaultImg from "../../../images/defaultLoad.gif";

import useStyles from "./styles";
import "./post.css";

const Post = ({ post, setCurrentId, getDetail }) => {
  console.log("render Post Con");

  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  const Likes = () => {
    if (post.likes.length > 0) {
      //check xem co like hay ch
      return post.likes.find(
        (like) => like === (user?.googleId || user?._id) // [googleId,_id] in list like
      ) ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {post.likes.length > 2 ? `You and ${post.likes.length - 1} others` : `${post.likes.length} like${post.likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  const handeChangePost = (e) => {
    e.stopPropagation();
    setCurrentId(post._id);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    dispatch(likePost(post._id));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deletePost(post._id));
  };

  return (
    <Card className={classes.card} onClick={() => getDetail(post)}>
      <div style={{ height: "210px" }}>
        <img
          alt={"img-memori"}
          className="card-img-top"
          data-src={post.selectedFile[0]}
          src={defaultImg}
          style={{
            height: "100%",
            width: "100%",
            // paddingTop: "56.25%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      </div>

      <div className={classes.overlay}>
        <div style={{ display: "flex" }}>
          {post.avatar && <img alt="post_avatar" src={post.avatar} className="img_avatarpost"></img>}

          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              color: "rgba(0,183,255, 1)",
              textShadow: "1px 1px #ff0000",
            }}
          >
            {post.name}
          </Typography>
        </div>

        <Typography
          variant="body2"
          style={{
            fontWeight: "500",
            color: "rgba(0,183,255, 1)",
            textShadow: "1px 1px #ff0000",
          }}
        >
          {moment(post.createdAt).fromNow()}
        </Typography>
      </div>

      {(user?.googleId === post?.creator || user?._id === post?.creator) && (
        <div className={classes.overlay2}>
          <Button size="small" onClick={handeChangePost}>
            <MoreHorizIcon fontSize="default" style={{ color: "rgb(25, 118, 210)" }} />
          </Button>
        </div>
      )}
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary">
          {post.tags.map((tag) => `#${tag} `)}
        </Typography>
      </div>

      <CardContent>
        <Typography noWrap className={classes.title} variant="h5" gutterBottom>
          {post.title}
        </Typography>

        <Typography
          style={{
            wordWrap: "break-word",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
          }}
          variant="body2"
          color="textSecondary"
          component="div"
        >
          {post.message}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" onClick={handleLike} disabled={!user}>
          <Likes />
        </Button>
        {/* check neu la minh thi hien nut xoa */}
        {(user?.googleId === post?.creator || user?._id === post?.creator) && (
          <Button size="small" color="primary" onClick={handleDelete}>
            <DeleteIcon fontSize="small" />
            &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
export default React.memo(Post);
