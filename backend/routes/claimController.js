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

// Acknowledge a claim (item owner)
export const acknowledgeClaim = async (req, res) => {
    const { itemID, claimID, userID } = req.body;
    
    if (!itemID || !claimID || !userID) {
        return res.status(400).json({ 
            error: "Missing required parameters: itemID, claimID, and userID are required" 
        });
    }
    
    try {
        let pool = await sql.connect(dbConfig);
        
        // Execute the stored procedure
        const result = await pool.request()
            .input("ItemID", sql.Int, itemID)
            .input("PosterID", sql.Int, userID)
            .input("ClaimID", sql.Int, claimID)
            .execute("AcknowledgeClaim");
        
        // Check if the procedure returned any error messages
        if (result.returnValue !== 0) {
            return res.status(400).json({ 
                error: "Failed to acknowledge claim. Please verify you are the item owner and the claim is pending." 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Claim acknowledged successfully" 
        });
    } catch (error) {
        console.error("Error acknowledging claim:", error);
        res.status(500).json({ 
            error: "Server error while acknowledging claim",
            details: error.message 
        });
    }
};

// Admin process claim (admin only)
export const adminProcessClaim = async (req, res) => {
    const { claimID, status } = req.body;
    console.log(claimID, status);
    
    try {
        let pool = await sql.connect(dbConfig);
        
        // Execute the stored procedure
        await pool.request()
            .input("ClaimID", sql.Int, claimID)
            .input("Status", sql.NVarChar, status)
            .execute("AdminProcessClaim");
        
        res.status(200).json({ success: true, message: "Claim processed successfully" });
    } catch (error) {
        console.error("Error processing claim:", error);
        res.status(500).json({ error: "Server error" });
    }
};
