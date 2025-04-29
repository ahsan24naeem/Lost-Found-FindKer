import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Upload route is working' })
})

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads'
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'))
    } else {
      cb(null, true)
    }
  }
})

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err)
    return res.status(400).json({ 
      error: 'File upload error',
      details: err.message 
    })
  } else if (err) {
    console.error('Upload error:', err)
    return res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    })
  }
  next()
}

// Upload route - protected with verifyToken middleware
router.post('/', upload.single('image'), handleUploadError, (req, res) => {
  try {
    console.log('Received upload request:', {
      file: req.file,
      headers: req.headers,
      body: req.body
    })

    if (!req.file) {
      console.error('No file received in upload request')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`
    console.log('Successfully processed upload:', imageUrl)
    res.json({ imageUrl })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message 
    })
  }
})

export default router
