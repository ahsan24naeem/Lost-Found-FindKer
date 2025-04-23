// backend/server.js
import connectDB from './dbConfig.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './userRoutes.js';
import postRoutes from './postRoutes.js';
import claimRoutes from './claimRoutes.js';
import messageRoutes from './messageRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the uploads directory
app.use('/uploads', (req, res, next) => {
  console.log(`Image request: ${req.path}`);
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/user', userRoutes); // Use user routes
app.use('/api/post', postRoutes);
app.use('/api/claim', claimRoutes);
app.use('/api/message', messageRoutes);

// Test API Route
app.get('/', (req, res) => {
  res.json({ message: 'Lost and Found Portal API is running...' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
