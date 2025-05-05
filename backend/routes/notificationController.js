import sql from "mssql";
import dbConfig from "../dbConfig.js";

// Get notifications for a specific user
export const getUserNotifications = async (req, res) => {
    const { userID } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('UserID', sql.Int, userID)
            .execute('GetUserNotifications');

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const markAllAsRead = async (req, res) => {
    const { userID } = req.params;
    try {
        console.log("Marking all notifications as read for user:", userID);
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('UserID', sql.Int, userID)
            .query('UPDATE Notifications SET isread = 1 WHERE UserID = @UserID');
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ error: 'Server error' });
    }
};