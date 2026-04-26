const express = require('express');
const router = express.Router();
const studyPlanController = require('../controllers/studyPlanController');
const auth = require('../middleware/authMiddleware');

// All study plan routes require authentication
router.use(auth);

router.get('/', studyPlanController.getPlanForDate);
router.post('/toggle', studyPlanController.toggleTask);

module.exports = router;
