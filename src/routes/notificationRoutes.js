const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Register push token (authenticated users only)
router.post('/register', auth, notificationController.registerToken);

// Get prefs (authenticated users only)
router.get('/prefs/:token', auth, notificationController.getPrefs);

// Send notification (admin only)
router.post('/send', auth, admin, notificationController.sendNotification);

// History (admin only)
router.get('/history', auth, admin, notificationController.getHistory);

// Deregister token (authenticated users only)
router.post('/deregister', auth, notificationController.deregisterToken);

module.exports = router;
