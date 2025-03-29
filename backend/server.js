// backend/server.js
import connectDB from './dbConfig.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './userRoutes.js';
import postRoutes from './postRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/user', userRoutes); // Use user routes
app.use('/api/post', postRoutes);

// Test API Route
app.get('/', (req, res) => {
  res.json({ message: 'Lost and Found Portal API is running...' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
