import sql from "mssql";
import dbConfig from "../dbConfig.js";

export const processFlag = async (req, res) => {
    try {
        const { id } = req.params;
        const { review } = req.body; // 'Reviewed' or 'Dismissed'

        console.log(id, review);
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input("FlagID", sql.Int, id)
            .input("Review", sql.NVarChar, review)
            .execute("ProcessFlag");

        res.status(200).json({
            message: `Flag ${id} processed as ${review}`
        });
    } catch (error) {
        console.error("Error processing flag:", error);
        res.status(500).json({ error: "Error processing flag", details: error.message });
    }
};

export const getTotalReports = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query("SELECT COUNT(*) AS TotalReports FROM Flags where Status = 'Pending'");
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error fetching total reports:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getpendingflags = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query("SELECT * FROM View_FlagDetails where FlagStatus = 'Pending'");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching pending flags:", error);
        res.status(500).json({ error: "Server error" });
    }
}

export const reportItem = async (req, res) => {
    const { itemID, reason, userID } = req.body;

    if (!userID) {
        return res.status(401).json({ error: "Unauthorized", message: "Please log in to report items" });
    }
    
    if (!itemID || !reason) {
        return res.status(400).json({ error: "Bad Request", message: "Item ID and reason are required" });
    }
    
    try {
        let pool = await sql.connect(dbConfig);
        
        // Execute the stored procedure
        const result = await pool.request()
            .input("ItemID", sql.Int, itemID)
            .input("UserID", sql.Int, userID)
            .input("Reason", sql.NVarChar, reason)
            .execute("ReportItem");
        
        res.status(201).json({ 
            success: true, 
            message: "Item reported successfully",
        });
    } catch (error) {
        console.error("Error reporting item:", error);
        
        // Check for specific error messages from the stored procedure
        if (error.message?.includes("already reported")) {
            return res.status(400).json({ 
                error: "Already Reported", 
                message: "You have already reported this item" 
            });
        }
        
        if (error.message?.includes("does not exist")) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: "The item you are trying to report does not exist" 
            });
        }
        
        res.status(500).json({ 
            error: "Server Error", 
            message: "Failed to report item",
            details: error.message 
        });
    }
};


