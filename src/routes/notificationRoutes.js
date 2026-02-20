const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Register push token
router.post('/register', notificationController.registerToken);

// Send notification (admin)
router.post('/send', notificationController.sendNotification);

// Deregister token
router.post('/deregister', notificationController.deregisterToken);

module.exports = router;
