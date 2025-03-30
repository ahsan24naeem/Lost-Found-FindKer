import sql from "mssql";
import dbConfig from "./dbConfig.js";

// Retrieve notifications for a user
export const getUserNotifications = async (req, res) => {
    const { userID } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input("UserID", sql.Int, userID)
            .execute("GetUserNotifications");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Add post notification (called internally after post creation)
export const addPostNotification = async (itemID, userID) => {
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input("ItemID", sql.Int, itemID)
            .input("UserID", sql.Int, userID)
            .execute("AddPostNotification");
    } catch (error) {
        console.error("Error adding post notification:", error);
    }
};
