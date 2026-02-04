const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// All routes require authentication
router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.put('/:notificationId/read', notificationController.markAsRead);

module.exports = router;

