import sql from "mssql";
import dbConfig from "../dbConfig.js";

// Create a comment
export const createComment = async (req, res) => {
    const { postID, userID, commentText } = req.body;

    if (!postID || !userID || !commentText) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input("PostID", sql.Int, postID)
            .input("UserID", sql.Int, userID)
            .input("CommentText", sql.NVarChar, commentText)
            .execute("CreateComment");

        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Get comments for a specific post
export const getCommentsByPost = async (req, res) => {
    const { postID } = req.params;

    if (!postID) {
        return res.status(400).json({ error: "Missing postID parameter" });
    }

    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input("PostID", sql.Int, postID)
            .execute("GetCommentsByPost");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};
