import express from "express";
import { verifyToken, optionalAuth } from "../middleware/auth.js";
import { 
    getAllPosts, 
    getRecentPosts, 
    getCategorizedPosts, 
    getPostComments, 
    createPost, 
    deletePost,
    searchPosts  
} from "./postController.js";

const router = express.Router();

// Public routes - can be viewed by anyone
router.get("/all", optionalAuth, getAllPosts);
// Protected routes - require authentication
router.post("/create", verifyToken, createPost);
router.delete("/:itemID", verifyToken, deletePost);

router.get("/recent", getRecentPosts);
//router.get("/category", getCategories);
router.get("/category/:categoryName", getCategorizedPosts);
router.get("/:postID/comments", getPostComments);
router.get("/search", searchPosts);

export default router;


