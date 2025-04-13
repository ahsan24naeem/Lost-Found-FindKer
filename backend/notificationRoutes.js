import express from 'express';
import { getUserNotifications } from './notificationController.js';

const router = express.Router();

// GET /api/notifications/:userID
router.get('/:userID', getUserNotifications);

export default router;
