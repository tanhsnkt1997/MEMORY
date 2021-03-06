import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";
import multer from "multer";
import googleApi from "../server/googleDrive.js";
import fs from "fs";
import sharp from "sharp";
import upload from "../utils/uploadAsync.js";
import Notification from "../models/notification.js";

sharp.cache({ files: 0 });

export const getPosts = async (req, res) => {
  try {
    const postMessage = await PostMessage.find();
    return res.status(200).json(postMessage);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

let imgResizeAndUpload = (listFile) => {
  return new Promise(async (resolve, rejects) => {
    try {
      let arrImageUploadedPromise = listFile.map(async (file) => {
        //Sharp
        let resizeResult = await sharp("./images/" + file.filename)
          .resize(null, 300, {
            kernel: sharp.kernel.kernel,
            // fit: sharp.fit.inside,
            // withoutEnlargement: true,
            fastShrinkOnLoad: true,
          })
          .jpeg({
            quality: 100,
            chromaSubsampling: "4:4:4",
            kernel: sharp.kernel.kernel,
          })
          .toFile("./images/" + "224x224-" + file.filename);

        removeImg(file.filename);
        let googleFileData = await googleApi.uploadFile({ mimetype: file.mimetype, filename: "224x224-" + file.filename });

        //remove
        removeImg("224x224-" + file.filename);
        //check bug Cannot read property 'id' of undefined
        //cấp quyền truy cập công khai
        await googleApi.generatePublic(googleFileData.id);
        //return `https://drive.google.com/uc?export=view&id=${googleFileData.id}`;
        // googleApi.deleteFile(googleFileData.id);
        return `https://lh3.googleusercontent.com/d/${googleFileData.id}`;
      });

      let arrImageUploaded = await Promise.all(arrImageUploadedPromise);
      return resolve(arrImageUploaded);
    } catch (error) {
      return rejects("Bug in resize and upload", error);
    }
  });
};

let imageMessageUploadFile = multer({
  storage: storage,
  limits: { fileSize: 10485760 },
}).array("image"); // formData.append("image", fileData);

let removeImg = (filename) => {
  fs.unlink("./images/" + filename, (err) => {
    if (err) throw err;
  });
};

export const creatPost = async (req, res) => {
  try {
    await upload.uploadAsynAnyFile(req, res);

    if (!req.files.length && !req.body.title && !req.body.tags && !req.body.message) {
      // return res.status(500).send("Body cant empty");
      let err = new Error('"Body cant empty');
      err.statusCode = 400;
      throw err;
    }

    let arrImageUploaded = await imgResizeAndUpload(req.files);
    //chu y
    const newPost = new PostMessage({
      ...req.body,
      selectedFile: arrImageUploaded,
      creator: req.userId,
    }); //them creator
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    console.log("error creat post", error);
    //https://www.restapitutorial.com/httpstatuscodes.html
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");
    await upload.uploadAsynAnyFile(req, res);
    //object destructuring can also rename our properties
    //---------------------------------------------------------
    let [listImgUploaded, postWithId] = await Promise.all([imgResizeAndUpload(req.files), PostMessage.findById(_id)]);

    if (postWithId.selectedFile.length > 0) {
      postWithId.selectedFile.map((img) => {
        let imgGoogleDriveId = img.split("/");
        googleApi.deleteFile(imgGoogleDriveId[imgGoogleDriveId.length - 1]);
      });
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...req.body, selectedFile: listImgUploaded }, { new: true });
    return res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: `error update post: ${error}` });
    console.log("error update post", error);
  }
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");

  await PostMessage.findByIdAndRemove(_id);
  return res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  //Emit event
  const eventEmitter = req.app.get("eventEmitter"); //set in server.js
  const { id } = req.params;

  //
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No post with that id");
  }
  const post = await PostMessage.findById(id);
  const index = post.reactions.findIndex((info) => info.userId === String(req.userId)); //chu y String
  console.log("indexxx", index);

  if (index === -1) {
    //Like a post
    post.reactions.push({ typeLike: req.body.type, userId: String(req.userId) });
  } else {
    if (req.body.type === "unlike") {
      console.log("vo dung r");
      //unLike a post
      post.reactions = post.reactions.filter((info) => info.userId !== String(req.userId));
    } else {
      post.reactions[index] = { typeLike: req.body.type, userId: String(req.userId) };
    }
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
  const notification = await Notification.create({ notification: `${req.userEmail} đã bài viết của bạn`, senderId: req.userId, receiverId: post.creator });
  console.log("vao ========================== kho hieu");
  eventEmitter.emit("likeUpdated", notification);
  res.json(updatedPost);
};

export const searchPost = async (req, res) => {
  const { key } = req.query;
  const page = +req.query.page;
  const limit = +req.query.limit;
  try {
    if (key) {
      // console.log(await PostMessage.listIndexes());
      let dataSearch = await PostMessage.find({
        $text: { $search: key.trim() },
      })
        .sort({ updatedAt: -1 })
        .skip(page * limit)
        .limit(limit);
      return res.json({ dataSearch });
    }
    return res.status(404).json({ message: "cannot search with params" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "error with search" });
  }
};

export const pagination = async (req, res) => {
  let limit = +req.query.limit;
  let page = +req.query.page;
  try {
    if (!limit && page) {
      return res.status(404).json({ message: "Can't not get list with query" });
    }
    let data = await PostMessage.find()
      .sort({ updatedAt: -1 })
      .skip(page * limit)
      .limit(limit);
    return res.json({ list: data, limit, page, limit });
  } catch (error) {
    return res.status(404).json({ message: "Can't not get list with query" });
  }
};

const filterBy = (sortBy, userId, keyword) => {
  if (!keyword) {
    if (sortBy === "ofme") {
      return { creator: userId };
    }
    return {};
  } else {
    if (sortBy === "ofme") {
      return {
        $and: [{ creator: userId }, { $text: { $search: keyword } }],
      };
    } else {
      console.log("vo 3");
      return {
        $text: { $search: keyword },
      };
    }
  }
};

export const filter = async (req, res) => {
  try {
    const keyword = req.query.keyword.trim();
    const limit = +req.query.limit;
    const page = +req.query.page;
    const sortBy = req.query.sortBy;
    const userId = req?.userId;

    const tmpFilter = {
      asc: { updatedAt: -1 },
      dsc: { updatedAt: 1 },
    };
    if (!limit || page < 0 || isNaN(page) || !sortBy || !userId) {
      return res.status(404).json({ message: "Can't not get list with param" });
    }
    let data = await PostMessage.find(filterBy(sortBy, userId, keyword))
      .sort(tmpFilter[sortBy] ? tmpFilter[sortBy] : { updatedAt: -1 })
      .skip(page * limit)
      .limit(limit);

    return res.json({ list: data, limit, page, limit });
  } catch (error) {
    return res.status(404).json({ message: "Can't not get list with param" });
  }
};
