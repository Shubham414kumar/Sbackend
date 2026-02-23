const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Register push token (public/user accessible)
router.post('/register', notificationController.registerToken);

// Send notification (admin only)
router.post('/send', auth, admin, notificationController.sendNotification);

// History (admin only)
router.get('/history', auth, admin, notificationController.getHistory);

// Deregister token
router.post('/deregister', notificationController.deregisterToken);

module.exports = router;
