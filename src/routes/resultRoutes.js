const express = require('express');
const router = express.Router();
const { checkResult, uploadResults, getResults } = require('../controllers/resultController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.post('/check', checkResult);
router.get('/', auth, admin, getResults);
router.post('/upload', auth, admin, uploadResults);

module.exports = router;
