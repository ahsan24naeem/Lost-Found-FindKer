import express from 'express';
import { getUserNotifications, markAllAsRead } from './notificationController.js';

const router = express.Router();

// GET /api/notifications/:userID
router.get('/:userID', getUserNotifications);

// POST /api/notifications/markAllAsRead/:userID
router.post('/markAllAsRead/:userID', markAllAsRead);

export default router;
