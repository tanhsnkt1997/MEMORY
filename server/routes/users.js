import express from "express";
import { signin, signup, refreshToken, updateProfile } from "./../controllers/users.js";

const router = express.Router();
router.post("/signin", signin);
router.post("/signup", signup);
router.post("/refreshToken", refreshToken);
router.patch("/profile/:id", updateProfile);

export default router;
