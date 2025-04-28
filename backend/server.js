// backend/server.js
import connectDB from './dbConfig.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadImageRoutes from './routes/uploadImageRoute.js';
import notificationRoutes from './routes/notificationRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Serve static files from the uploads directory
app.use('/uploads', (req, res, next) => {
  console.log(`Image request: ${req.path}`);
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'public, max-age=31536000');
  },
  fallthrough: false,
  index: false
}), (err, req, res, next) => {
  if (err) {
    console.error('Error serving static file:', err);
    res.status(404).json({ error: 'File not found' });
  }
});

// Routes
app.use('/api/user', userRoutes); // Use user routes
app.use('/api/post', postRoutes);
app.use('/api/claim', claimRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload-image', uploadImageRoutes);
app.use('/api/notification', notificationRoutes);

// Test API Route
app.get('/', (req, res) => {
  res.json({ message: 'Lost and Found Portal API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
