import express from "express";
import { getNotification } from "./../controllers/notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.get("/list/:id", auth, getNotification);

export default router;
