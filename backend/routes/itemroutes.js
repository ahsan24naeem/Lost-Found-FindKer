import express from 'express';
import { sql, poolPromise } from '../dbConfig.js'; // Import MSSQL connection

const router = express.Router();

// 📌 **1️⃣ Get All Lost & Found Items**
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Items ORDER BY DateReported DESC');
    
    res.json(result.recordset); // Send records to frontend
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
});

// 📌 **2️⃣ Add a New Lost/Found Item**
router.post('/create', async (req, res) => {
  const { UserID, Title, ItemDescription, CategoryID, ItemStatus, ItemLocation, ImageURL } = req.body;
  
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('UserID', sql.Int, UserID)
      .input('Title', sql.NVarChar, Title)
      .input('ItemDescription', sql.NVarChar, ItemDescription)
      .input('CategoryID', sql.Int, CategoryID)
      .input('ItemStatus', sql.NVarChar, ItemStatus)
      .input('ItemLocation', sql.NVarChar, ItemLocation)
      .input('ImageURL', sql.NVarChar, ImageURL)
      .query(`
        INSERT INTO Items (UserID, Title, ItemDescription, CategoryID, ItemStatus, ItemLocation, ImageURL)
        VALUES (@UserID, @Title, @ItemDescription, @CategoryID, @ItemStatus, @ItemLocation, @ImageURL)
      `);
    
    res.json({ message: 'Item added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item', error });
  }
});

export default router;
