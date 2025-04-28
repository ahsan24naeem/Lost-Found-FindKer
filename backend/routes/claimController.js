import sql from "mssql";
import dbConfig from "../dbConfig.js";

// Claim an item
export const claimItem = async (req, res) => {
    const { itemID, userID, claimDetails } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input("ItemID", sql.Int, itemID)
            .input("UserID", sql.Int, userID)
            .input("ClaimDetails", sql.NVarChar, claimDetails)
            .execute("ClaimItem");

        res.status(201).json({ message: "Claim submitted successfully" });
    } catch (error) {
        console.error("Error claiming item:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all claims on a specific item
export const getClaimsOnItem = async (req, res) => {
    const { itemID } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input("ItemID", sql.Int, itemID)
            .execute("GetClaimsOnItem");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching claims:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Upvote or downvote a claim
export const voteClaim = async (req, res) => {
    const { claimID, userID, voteType } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input("ClaimID", sql.Int, claimID)
            .input("UserID", sql.Int, userID)
            .input("VoteType", sql.NVarChar, voteType)
            .execute("VoteClaim");

        res.status(200).json({ message: "Vote recorded successfully" });
    } catch (error) {
        console.error("Error voting on claim:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get claim verification votes (upvotes & downvotes)
export const getClaimVotes = async (req, res) => {
    const { claimID } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input("ClaimID", sql.Int, claimID)
            .execute("GetClaimVotes");

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error fetching claim votes:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a claim (only claimant or admin)
export const deleteClaim = async (req, res) => {
    const { claimID, userID } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input("ClaimID", sql.Int, claimID)
            .input("UserID", sql.Int, userID)
            .execute("DeleteClaim");

        res.status(200).json({ message: "Claim deleted successfully" });
    } catch (error) {
        console.error("Error deleting claim:", error);
        res.status(500).json({ error: "Server error" });
    }
};
