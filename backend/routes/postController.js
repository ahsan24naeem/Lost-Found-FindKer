import sql from "mssql";
import dbConfig from "../dbConfig.js";

// Get all posts
export const getAllPosts = async (req, res) => {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT * FROM AllPosts");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching all posts:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get recent posts (1-day old)
export const getRecentPosts = async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT * FROM RecentPosts");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching recent posts:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get categorized posts
export const getCategorizedPosts = async (req, res) => {
    const { categoryName } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input("CategoryName", sql.NVarChar, categoryName)
            .execute("GetCategorizedPosts");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching categorized posts:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get comments for a specific post
export const getPostComments = async (req, res) => {
    const { postID } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input("PostID", sql.Int, postID)
            .execute("GetPostComments");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching post comments:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Create a new post
export const createPost = async (req, res) => {
    console.log('Received post creation request:', req.body);
    const { userID, title, itemDescription, categoryID, itemStatus, itemLocation, imageURL } = req.body;
    
    // Validate required fields
    if (!userID || !title || !itemDescription || !categoryID || !itemStatus || !itemLocation) {
        console.error('Missing required fields:', { userID, title, itemDescription, categoryID, itemStatus, itemLocation });
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    try {
        console.log('Connecting to database...');
        let pool = await sql.connect(dbConfig);
        console.log('Database connected successfully');
        
        console.log('Executing CreatePost stored procedure with params:', {
            UserID: userID,
            Title: title,
            ItemDescription: itemDescription,
            CategoryID: categoryID,
            ItemStatus: itemStatus,
            ItemLocation: itemLocation,
            ImageURL: imageURL
        });
        
        await pool.request()
            .input("UserID", sql.Int, userID)
            .input("Title", sql.NVarChar, title)
            .input("ItemDescription", sql.NVarChar, itemDescription)
            .input("CategoryID", sql.Int, categoryID)
            .input("ItemStatus", sql.NVarChar, itemStatus)
            .input("ItemLocation", sql.NVarChar, itemLocation)
            .input("ImageURL", sql.NVarChar, imageURL)
            .execute("CreatePost");
            
        console.log('Post created successfully');
        res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    const { itemID } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input("ItemID", sql.Int, itemID)
            .execute("DeletePost");
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const searchPosts = async (req, res) => {
    const { term } = req.query;
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input("SearchTerm", sql.NVarChar, term)
            .execute("SearchPosts");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error searching posts:", error);
        res.status(500).json({ error: "Server error" });
    }
};

