const express = require('express');
const router = express.Router();
const { askAI } = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

// AI requires authentication to prevent abuse of paid Anthropic API
router.post('/ask', auth, askAI);

module.exports = router;
