import sql from "mssql";
import dbConfig from "../dbConfig.js";

export const getCategories = async (req, res) => {
    try {
        // 1. Connect to DB
        const pool = await sql.connect(dbConfig);
        
        // 2. Run simple query
        const result = await pool.request()
            .query("SELECT CategoryID, CategoryName FROM Categories");
        
        // 3. Send response
        res.json(result.recordset);
        
    } catch (error) {
        // 4. Basic error handling
        console.error("Error:", error);
        res.status(500).send("Server error");
    }
};