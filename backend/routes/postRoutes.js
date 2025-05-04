import express from "express";
import { verifyToken, optionalAuth } from "../middleware/auth.js";
import { 
    getAllPosts, 
    getRecentPosts, 
    getCategorizedPosts, 
    createPost, 
    deletePost,
    searchPosts,
    markItemAsClaimed,
    getTotalPosts,
    getPendingItems
} from "./postController.js";

const router = express.Router();

// Public routes - can be viewed by anyone
router.get("/all", getAllPosts);
// Protected routes - require authentication
router.post("/mark-as-claimed", markItemAsClaimed);
router.post("/create", createPost);
router.delete("/delete/:itemID", deletePost);
router.get("/recent", getRecentPosts);
router.get("/category/:categoryName", getCategorizedPosts);
router.get("/search", searchPosts);
router.get("/postCount", getTotalPosts);
router.get('/pending-items', getPendingItems);


export default router;


