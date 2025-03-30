import express from "express";
import { getUserNotifications } from "./notificationController.js";

const router = express.Router();

// Route to get user notifications
router.get("/:userID", getUserNotifications);

export default router;
