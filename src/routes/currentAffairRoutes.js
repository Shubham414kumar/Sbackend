const express = require('express');
const router = express.Router();
const { getAffairs, generateDailyAffairs } = require('../controllers/currentAffairController');

router.get('/', getAffairs);
router.post('/generate', generateDailyAffairs);

module.exports = router;
