const express = require('express');
const router = express.Router();
const { getQuizzes, getQuizById, createQuiz, submitQuiz } = require('../controllers/quizController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Public/Student Routes
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/submit', auth, submitQuiz);

// Protected Admin Routes
router.post('/', auth, admin, createQuiz);

module.exports = router;
