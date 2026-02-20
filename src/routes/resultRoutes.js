const express = require('express');
const router = express.Router();
const { checkResult, uploadResults, getResults } = require('../controllers/resultController');

router.post('/check', checkResult);
router.get('/', getResults); // Admin only ideal
router.post('/upload', uploadResults); // Admin only ideal

module.exports = router;
