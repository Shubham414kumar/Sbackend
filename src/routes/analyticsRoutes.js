const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');

// Admin only — requires both auth + admin role
router.get('/dashboard', auth, adminAuth, getDashboardStats);

module.exports = router;
