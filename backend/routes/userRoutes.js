import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { 
    loginUser,
    getUserProfile, 
    getUserItems, 
    getUserClaims, 
    registerUser, 
    updateUser, 
    deleteUser,
    getPublicUserProfile, 
    verifyUserToken,
    logout
} from "./userController.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/verify", verifyToken, verifyUserToken);

// Protected routes - require authentication
router.get("/profile:userID", verifyToken, getUserProfile);
router.put("/update:userID", verifyToken, updateUser);
router.delete("/delete:userID", verifyToken, deleteUser);

router.get("/items/:userID", getUserItems);
router.get("/claims/:userID", getUserClaims);
router.get("/profile/public/:userID", getPublicUserProfile); 

export default router;
