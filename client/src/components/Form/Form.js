import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import CancelIcon from "@material-ui/icons/Cancel";
import ImageSearchTwoToneIcon from "@material-ui/icons/ImageSearchTwoTone";
import "emoji-mart/css/emoji-mart.css";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import { Picker } from "emoji-mart";
import { FETCHING } from "../../constants/actionTypes";
import { useForm, ErrorMessage } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import useStyles from "./styles";
import { createPost, updatePost } from "../../actions/posts";
import "./style.css";

// form validation rules
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").max(100, "Title max 100 character"),
  message: Yup.string().required("Message is required").max(500, "Message max 500 character"),
  tags: Yup.string().required("Tags is required").max(50, "Title max 50 character"),
});

const Form = ({ currentId, setCurrentId, fetching }) => {
  console.log("render Form");
  const post = useSelector((state) => (currentId ? state.posts.posts.find((p) => p._id === currentId) : null)); // reducer/index
  const [postData, setPostData] = useState({ title: "", message: "", tags: "", selectedFile: "" });
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  const [isChangeImg, setIsChangeImg] = useState(false);
  const [isShowEmoji, setShowEmoji] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  //if have data post change
  useEffect(() => {
    if (post) {
      document.querySelector("#title").value = post.title;
      document.querySelector("#message").value = post.message;
      document.querySelector("#tags").value = post.tags;
      // setElement.current.disabled = false;
      setPostData(post);
      setIsChangeImg(true);
    }
  }, [post]);

  const onSubmit = (values) => {
    const { title, message, tags } = values;
    const { selectedFile } = postData;
    dispatch({ type: FETCHING });
    // form is valid
    let postFormmData = new FormData();
    Array.from(selectedFile).forEach((image) => {
      postFormmData.append("image", image);
    });
    postFormmData.append("title", title);
    postFormmData.append("tags", tags);
    postFormmData.append("message", message);

    if (currentId) {
      postFormmData.append("name", user?.name);
      dispatch(updatePost(currentId, postFormmData));
      document.querySelector(".clear").click();
    } else {
      dispatch(createPost(postFormmData));
      document.querySelector(".clear").click();
    }
  };

  //check session hết hạn hoặc chưa đăng nhập
  if (!user?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to creat your own memories and like other's memories
        </Typography>
      </Paper>
    );
  }

  const changeImgEdit = (isChange) => {
    if (currentId) {
      setIsChangeImg(isChange);
    }
  };

  const clear = () => {
    setCurrentId(null);
    setPostData({ selectedFile: "" });
  };

  const changeFile = (e) => {
    console.log("e.target.files", e.target.files);
    changeImgEdit(false);
    setPostData({ ...postData, selectedFile: e.target.files });
  };

  const addEmoji = (emoji) => {
    const textarea = document.getElementById("message");
    const cursorPositionStart = textarea.selectionStart;
    const cursorPositionEnd = textarea.selectionEnd;

    const start = textarea.value.substring(0, textarea.selectionStart);
    const end = textarea.value.substring(textarea.selectionStart);
    if (cursorPositionStart !== cursorPositionEnd) {
      const strSlice = postData.message.substring(cursorPositionStart, cursorPositionEnd);
      const stringReplaceStartToEnd = postData.message.replace(strSlice, emoji.native);
      textarea.value = stringReplaceStartToEnd;
      textarea.focus();
      setTimeout(() => {
        textarea.selectionEnd = textarea.selectionStart = cursorPositionEnd;
      }, 0);
      return;
    }
    const text = start + emoji.native + end;
    textarea.value = text;
    textarea.focus();
    setTimeout(() => {
      textarea.selectionEnd = textarea.selectionStart = cursorPositionEnd + emoji.native.length;
    }, 0);
  };

  const setShowEmojiIcon = (e) => {
    let targetTagName = e.target.tagName;
    if (targetTagName === "TEXTAREA" || targetTagName === "INPUT") {
      // setShowEmoji(false);
      return false;
    }
    setShowEmoji((isShow) => !isShow);
  };

  return (
    <>
      <Paper className={`${classes.root} ${classes.paper}`}>
        <form autoComplete="off" noValidate className={classes.form} onSubmit={handleSubmit(onSubmit)} onReset={reset}>
          <Typography variant="h6">{currentId ? "Editing" : "Creating"} a Memory</Typography>

          <p className={"validationErr"}>{errors.title?.message}</p>
          <input id="title" placeholder={"Title"} className={"input"} {...register("title")} />

          <p className={"validationErr"}>{errors.message?.message}</p>
          <textarea id="message" placeholder={"Message"} className={"textarea"} {...register("message")} />

          <div className="emojiWrap">
            <EmojiEmotionsIcon onClick={setShowEmojiIcon} className="emoji" />
          </div>

          {isShowEmoji && (
            <div className="emojiContainer">
              <Picker emoji="point_up" onSelect={addEmoji} showPreview={false} set="google" showSkinTones={false} style={{ width: "100%" }} />
            </div>
          )}

          <p className={"validationErr"}>{errors.tags?.message}</p>
          <input id="tags" placeholder={"Tags"} className={"input"} {...register("tags")} />
          {/* <TextField {...register("tags")} id="tags" title="tags" name="tags" variant="outlined" label="Tags (comma separated)" fullWidth value={postData.tags} onFocus={setShowEmojiIcon} /> */}

          <div className={classes.fileInput}>
            <input type="file" onChange={changeFile} multiple style={{ display: "none" }} />
            {/* Button fake click input choose image */}
            <div
              className="inputFake"
              onClick={() => {
                document.querySelector('input[type="file"]').value = null;
                // currentId && setPostData({ ...postData, selectedFile: [] });
                document.querySelector('input[type="file"]').click();
              }}
            >
              <ImageSearchTwoToneIcon />
            </div>
            {/* <FileBase type='file' multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /> */}
          </div>
          <div style={{ display: "flex", overflowX: "auto" }}>
            {Array.from(postData.selectedFile).map((e, index) => (
              <div key={index.toString()} style={{ position: "relative" }}>
                <img src={currentId && isChangeImg ? e : URL.createObjectURL(e)} className="imgItemPreview" />
                <div
                  style={{ position: "absolute", top: "13px", right: "12px", width: "20px", cursor: "pointer", color: "red" }}
                  onClick={() => {
                    setPostData({ ...postData, selectedFile: Array.from(postData.selectedFile).filter((img) => img.lastModified !== e.lastModified) });
                    URL.revokeObjectURL(e);
                  }}
                >
                  <CancelIcon />
                </div>
              </div>
            ))}
          </div>
          <Button className={fetching ? classes.buttonDisable : classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>
            Submit
          </Button>

          <button onClick={clear} className={`${fetching ? "btnDissable" : ""} clear btn btn-secondary`} type="reset">
            Reset
          </button>
        </form>
      </Paper>
    </>
  );
};

export default React.memo(Form);

// if (pos.posStart !== pos.posEnd) {
//   const strSlice = postData.message.slice(pos.posStart, pos.posEnd);
//   const stringReplaceStartToEnd = postData.message.replace(strSlice, e.native);
//   setPostData({ ...postData, message: stringReplaceStartToEnd });
//   return;
// }
