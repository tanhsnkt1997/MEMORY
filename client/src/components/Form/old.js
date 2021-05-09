import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import CancelIcon from "@material-ui/icons/Cancel";
import ImageSearchTwoToneIcon from "@material-ui/icons/ImageSearchTwoTone";
import "emoji-mart/css/emoji-mart.css";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import { Picker } from "emoji-mart";
import { FETCHING } from "../../constants/actionTypes";
import { useForm, ErrorMessage } from "react-hook-form";

import useStyles from "./styles";
import { createPost, updatePost } from "../../actions/posts";
import "./style.css";

const Form = ({ currentId, setCurrentId, fetching }) => {
  console.log("render Form");
  const post = useSelector((state) => (currentId ? state.posts.posts.find((p) => p._id === currentId) : null)); // reducer/index
  const [postData, setPostData] = useState({ title: "", message: "", tags: "", selectedFile: "" });
  const [isEmptyFormData, setIsEmptyFormData] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  const [isChangeImg, setIsChangeImg] = useState(false);
  const [isShowEmoji, setShowEmoji] = useState(false);

  //if have data post change
  useEffect(() => {
    if (post) {
      // setElement.current.disabled = false;
      setPostData(post);
      setIsChangeImg(true);
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { selectedFile, title, tags, message } = postData;
    // if (!selectedFile.length && !title && !tags && !message) {
    //   setIsEmptyFormData(true);
    //   console.log("vo if");
    // } else {
    dispatch({ type: FETCHING });
    console.log("vo else", selectedFile.length, title, tags, message);
    //e is event
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
      clear();
    } else {
      dispatch(createPost(postFormmData));
      clear();
      // }
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
    setIsEmptyFormData(false);
    setPostData({
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
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
      setPostData({ ...postData, message: stringReplaceStartToEnd });
      textarea.focus();
      setTimeout(() => {
        textarea.selectionEnd = textarea.selectionStart = cursorPositionEnd;
      }, 0);
      return;
    }
    const text = start + emoji.native + end;
    setPostData({ ...postData, message: text });
    textarea.focus();
    setTimeout(() => {
      textarea.selectionEnd = textarea.selectionStart = cursorPositionEnd + emoji.native.length;
    }, 0);
  };

  const setShowEmojiIcon = (e) => {
    setIsEmptyFormData(false);
    let targetTagName = e.target.tagName;
    if (targetTagName === "TEXTAREA" || targetTagName === "INPUT") {
      // setShowEmoji(false);
      return false;
    }
    setShowEmoji((isShow) => !isShow);
  };

  const onChangeText = (e) => {
    switch (e.target.id) {
      case "title":
        setPostData({ ...postData, title: e.target.value });
        break;
      case "message":
        setPostData({ ...postData, message: e.target.value });
        break;
      case "tags":
        setPostData({ ...postData, tags: e.target.value.split(",") });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Paper className={`${classes.root} ${classes.paper}`}>
        <form autoComplete="off" noValidate className={classes.form} onSubmit={handleSubmit}>
          <Typography variant="h6">{currentId ? "Editing" : "Creating"} a Memory</Typography>

          {isEmptyFormData && <div style={{ width: "100%", padding: "5px 16px", color: "red", fontSize: "1.1rem" }}>Vui lòng nhập nội dung !!</div>}

          <TextField id="title" name="title" variant="outlined" label="Title" fullWidth value={postData.title} onFocus={setShowEmojiIcon} onChange={onChangeText} />

          <TextField id="message" name="message" variant="outlined" label="Message" fullWidth multiline rows={8} value={postData.message} onChange={onChangeText} onFocus={setShowEmojiIcon} className="inputMsg" />
          <div className="emojiWrap">
            <EmojiEmotionsIcon onClick={setShowEmojiIcon} className="emoji" />
          </div>

          {isShowEmoji && (
            <div className="emojiContainer">
              <Picker emoji="point_up" onSelect={addEmoji} showPreview={false} set="google" showSkinTones={false} style={{ width: "100%" }} />
            </div>
          )}

          <TextField id="tags" title="tags" name="tags" variant="outlined" label="Tags (comma separated)" fullWidth value={postData.tags} onChange={onChangeText} onFocus={setShowEmojiIcon} />

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
          <Button disabled={fetching} className={fetching ? classes.buttonDisable : classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>
            Submit
          </Button>
          <Button disabled={fetching} variant="contained" className={fetching ? classes.buttonDisable : null} color="secondary" size="small" onClick={clear} fullWidth>
            Clear
          </Button>
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
