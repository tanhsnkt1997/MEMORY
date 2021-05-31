import express from "express";
import { getPosts, creatPost, updatePost, deletePost, likePost, searchPost, pagination, filter } from "./../controllers/post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", auth, creatPost); //cần có id
router.patch("/:id", auth, updatePost); //auth check quyền có đc cập nhật hay không
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost); //không có quyền thích 2 hay 3 lần
router.get("/search", searchPost);
router.get("/list", pagination);
router.get("/filter", auth, filter);

export default router;
