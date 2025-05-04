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
    verifyUserToken,
    logout,
    getAllUsers,
    getTotalUsers
} from "./userController.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/all", getAllUsers);
router.get("/verify", verifyUserToken);

// Protected routes - require authentication
router.get("/profile/:userID", getUserProfile);
router.put("/update/:userID", updateUser);
router.delete("/delete/:userID", deleteUser);
router.get("/items/:userID", getUserItems);
router.get("/userCount", getTotalUsers);

//router.get("/claims/:userID", getUserClaims); // extra you may allow the user to view their own claims
//router.get("/profile/public/:userID", getPublicUserProfile); 

export default router;

//localhost:5000/api/user/update/:userID