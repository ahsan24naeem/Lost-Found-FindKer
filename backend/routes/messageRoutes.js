import express from "express";
import { sendMessage, getMessagesBetweenUsers } from "./messageController.js";

const router = express.Router();

// Send a message
router.post("/message", sendMessage);

// Get messages between two users
router.get("/messages/:userID1/:userID2", getMessagesBetweenUsers);

export default router;
