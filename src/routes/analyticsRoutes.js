const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');

// Add adminAuth in production, keeping auth to ensure only logged in users can access
router.get('/dashboard', auth, getDashboardStats);

module.exports = router;
