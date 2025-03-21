// backend/server.js
import connectDB from './dbConfig.js';
connectDB();
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Test API Route
app.get('/', (req, res) => {
  res.json({ message: 'Lost and Found Portal API is running...' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
