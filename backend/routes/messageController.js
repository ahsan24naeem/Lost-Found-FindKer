import sql from "mssql";
import dbConfig from "../dbConfig.js";

// Send a message
export const sendMessage = async (req, res) => {
    const { senderID, receiverID, postID, messageText } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input("SenderID", sql.Int, senderID)
            .input("ReceiverID", sql.Int, receiverID)
            .input("PostID", sql.Int, postID)
            .input("MessageText", sql.NVarChar, messageText)
            .execute("SendMessage");

        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get messages between two users
export const getMessagesBetweenUsers = async (req, res) => {
    const { userID1, userID2 } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input("UserID1", sql.Int, userID1)
            .input("UserID2", sql.Int, userID2)
            .execute("GetMessagesBetweenUsers");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Server error" });
    }
};
