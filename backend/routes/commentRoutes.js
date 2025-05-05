import express from "express";
import { createComment, getCommentsByPost } from "./commentController.js";

const router = express.Router();

// POST: Add a new comment
router.post("/add-comment", createComment);

// GET: Get all comments for a post
router.get("/get-comments/:postID", getCommentsByPost);

export default router;
