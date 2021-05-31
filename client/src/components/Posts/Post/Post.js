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
import Reactions from "./Reactions ";

import imgLike from "../../../images/like.svg";
import imgLove from "../../../images/love.svg";
import imgHaha from "../../../images/haha.svg";
import imgWow from "../../../images/wow.svg";
import imgSad from "../../../images/sad.svg";
import imgAngry from "../../../images/angry.svg";
import imgLovelove from "../../../images/lovelove.svg";

import useStyles from "./styles";
import "./post.css";

const images = [
  { id: "like", description: "Like", img: "http://i.imgur.com/LwCYmcM.gif" },
  { id: "love", description: "Love", img: "http://i.imgur.com/k5jMsaH.gif" },
  { id: "haha", description: "Haha", img: "http://i.imgur.com/f93vCxM.gif" },
  { id: "lovelove", description: "lovelove", img: "https://i.pinimg.com/originals/1e/c6/ff/1ec6ffa47799defdcd397a84f9b19f41.gif" },
  { id: "wow", description: "Wow", img: "http://i.imgur.com/9xTkN93.gif" },
  { id: "sad", description: "Sad", img: "http://i.imgur.com/tFOrN5d.gif" },
  { id: "angry", description: "Angry", img: "http://i.imgur.com/1MgcQg0.gif" },
];

const listIcon = [
  { id: "like", description: "like", img: imgLike },
  { id: "love", description: "love", img: imgLove },
  { id: "haha", description: "Haha", img: imgHaha },
  { id: "lovelove", description: "care", img: imgLovelove },
  { id: "wow", description: "wow", img: imgWow },
  { id: "sad", description: "sad", img: imgSad },
  { id: "angry", description: "angry", img: imgAngry },
];

const Post = ({ post, setCurrentId, getDetail }) => {
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

  const Check = () => {
    if (post.reactions.length > 0) {
      const IlikePost = post.reactions.find((reaction) => reaction.userId === (user?.googleId || user?._id)); // dont have => undefined
      const statusLike = IlikePost ? listIcon.find((img) => img.id === IlikePost.typeLike) : { img: "https://img.icons8.com/wired/344/good-quality.png", id: "like", description: "Like" };
      let count = { like: 0, love: 0, haha: 0, lovelove: 0, wow: 0, sad: 0, angry: 0 };
      post.reactions.forEach((reaction) => {
        if (reaction.typeLike === "like") {
          count.like++;
        }
        if (reaction.typeLike === "love") {
          count.love++;
        }
        if (reaction.typeLike === "haha") {
          count.haha++;
        }
        if (reaction.typeLike === "lovelove") {
          count.lovelove++;
        }
        if (reaction.typeLike === "wow") {
          count.wow++;
        }
        if (reaction.typeLike === "sad") {
          count.sad++;
        }
        if (reaction.typeLike === "angry") {
          count.angry++;
        }
      });

      return (
        <>
          <div style={{ display: "flex", margin: "2px 2px 0px 10px", padding: "8px 0", borderBottom: "2px solid pink" }}>
            {count.like > 0 && <img alt="img" style={{ width: "20px", height: "20px" }} src={imgLike} />}
            {count.love > 0 && <img alt="img" style={{ width: "20px", height: "20px" }} src={imgLove} />}
            {count.haha > 0 && <img alt="img" style={{ width: "20px", height: "20px" }} src={imgHaha} />}
            {count.lovelove > 0 && <img alt="img" style={{ width: "20px", height: "20px" }} src={imgLovelove} />}
            {count.wow > 0 && <img alt="img" style={{ width: "20px", height: "20px" }} src={imgWow} />}
            {count.sad > 0 && <img alt="img" style={{ width: "20px", height: "20px" }} src={imgSad} />}
            {count.angry > 0 && <img alt="img" style={{ width: "20px", height: "20px" }} src={imgAngry} />}
            <span style={{ marginLeft: "6px", color: "rgba(0,0,0,0.6)" }}>{IlikePost && post.reactions.length > 3 ? `You and ${post.reactions.length - 1}` : post.reactions.length}</span>
          </div>
          {
            <div style={{ display: "flex", alignItems: "center", color: "rgba(0, 0, 0, 0.5)", padding: "10px 0px" }}>
              <img onClick={() => (IlikePost ? onUpdateIcon("unlike") : onUpdateIcon("like"))} alt="img" style={{ width: "25px", height: "25px", margin: "5px 5px 5px 20px" }} src={statusLike.img} />
              <span>{statusLike.description}</span>
            </div>
          }
        </>
      );
    }
    return (
      <div style={{ display: "flex", alignItems: "center", margin: "5px 20px", color: "#3f51b5" }}>
        <ThumbUpAltOutlined fontSize="small" onClick={() => onUpdateIcon("like")} />
        <span>Thích</span>
      </div>
    );
  };

  const handeChangePost = (e) => {
    e.stopPropagation();
    setCurrentId(post._id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deletePost(post._id));
  };

  const onUpdateIcon = (type) => {
    dispatch(likePost({ post_id: post._id, type }));
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

      <CardContent className="post__item_card_content">
        <div className={classes.details}>
          <Typography variant="body2" style={{ color: "#fff" }}>
            {post.tags.map((tag, i) => (
              <span key={i.toString()}>{`#${tag} `}</span>
            ))}
          </Typography>
        </div>
        <Typography noWrap className={`${classes.title} titlePosts`} variant="h5" gutterBottom>
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
      <div style={{ display: "flex", position: "relative" }}>
        <Reactions items={images} onUpdateIcon={onUpdateIcon}>
          <Check />
        </Reactions>
        {(user?.googleId === post?.creator || user?._id === post?.creator) && (
          <Button size="small" color="primary" onClick={handleDelete}>
            <DeleteIcon fontSize="small" />
          </Button>
        )}
      </div>
    </Card>
  );
};
export default React.memo(Post);
