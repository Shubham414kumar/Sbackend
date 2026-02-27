const express = require('express');
const router = express.Router();
const { getAffairs, generateDailyAffairs } = require('../controllers/currentAffairController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', getAffairs);
router.post('/generate', auth, admin, generateDailyAffairs);

module.exports = router;
