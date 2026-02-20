const express = require('express');
const router = express.Router();
const { getLeaderboard, addXP } = require('../controllers/gamificationController');

const auth = require('../middleware/authMiddleware');

router.get('/leaderboard', auth, getLeaderboard);
router.post('/add-xp', auth, addXP); // Note: In production, XP should be added server-side on events, not via API.

module.exports = router;
