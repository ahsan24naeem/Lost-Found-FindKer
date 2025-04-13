import express from "express";
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

router.get("/all", getAllPosts);
router.get("/recent", getRecentPosts);
router.get("/category/:categoryName", getCategorizedPosts);
router.get("/:postID/comments", getPostComments);
router.post("/create", createPost);
router.delete("/:itemID", deletePost);
router.get("/search", searchPosts);

export default router;


