import express from "express";
import { 
    loginUser,
    getUserProfile, 
    getUserItems, 
    getUserClaims, 
    registerUser, 
    updateUser, 
    deleteUser,
    getPublicUserProfile  
} from "./userController.js";


const router = express.Router();
router.post("/login", loginUser);
router.get("/profile/:userID", getUserProfile);
router.get("/items/:userID", getUserItems);
router.get("/claims/:userID", getUserClaims);
router.post("/register", registerUser);
router.put("/update/:userID", updateUser);
router.delete("/delete/:userID", deleteUser);
router.get("/profile/public/:userID", getPublicUserProfile); 

export default router;
