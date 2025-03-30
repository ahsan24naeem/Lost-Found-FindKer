import express from "express";
import {
    claimItem,
    getClaimsOnItem,
    voteClaim,
    getClaimVotes,
    deleteClaim
} from "./claimController.js";

const router = express.Router();

// Create a new claim
router.post("/claim", claimItem);

// Get all claims for a specific item
router.get("/claims/:itemID", getClaimsOnItem);

// Upvote or downvote a claim
router.post("/claim/vote", voteClaim);

// Get verification votes on a claim
router.get("/claim/votes/:claimID", getClaimVotes);

// Delete a claim
router.delete("/claim", deleteClaim);

export default router;
