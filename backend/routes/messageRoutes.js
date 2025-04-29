import express from "express";
import { sendMessage, getMessagesBetweenUsers, getMessageContacts } from "./messageController.js";

const router = express.Router();

// Send a message
router.post("/send-message", sendMessage);
// Get messages between two users
router.get("/messagesBetweenUsers/:userID1/:userID2", getMessagesBetweenUsers);

router.get("/contacts/:userID", getMessageContacts);

export default router;