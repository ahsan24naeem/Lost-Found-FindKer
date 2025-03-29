import express from "express";
import { loginUser } from "./userController.js";
import { registerUser } from "./userController.js";

const router = express.Router();
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
