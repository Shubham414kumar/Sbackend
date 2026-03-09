const express = require('express');
const router = express.Router();
const { getLeaderboard, addXP } = require('../controllers/gamificationController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/leaderboard', auth, getLeaderboard);
router.post('/add-xp', auth, admin, addXP); // Admin only

module.exports = router;
