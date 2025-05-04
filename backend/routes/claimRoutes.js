import express from "express";
import {
    claimItem,
    getClaimsOnItem,
    voteClaim,
    getClaimVotes,
    deleteClaim,
    adminProcessClaim,
    acknowledgeClaim 
} from "./claimController.js";

const router = express.Router();

// Create a new claim
router.post("/create-Claim", claimItem);

// Get all claims for a specific item
router.get("/getClaimsOnItem/:itemID", getClaimsOnItem);

// Upvote or downvote a claim
router.post("/vote", voteClaim);

// Get verification votes on a claim
router.get("/votes/:claimID", getClaimVotes);

// Delete a claim
router.delete("/deleteClaim", deleteClaim);

//process a claim
router.post('/admin/process-claim', adminProcessClaim);

router.post('/acknowledge-claim', acknowledgeClaim);


export default router;
