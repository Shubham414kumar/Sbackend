const express = require('express');
const router = express.Router();
const { getQuizzes, getQuizById, getQuizByIdAdmin, createQuiz, updateQuiz, deleteQuiz, submitQuiz } = require('../controllers/quizController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Public/Student Routes
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/submit', auth, submitQuiz);

// Protected Admin Routes
router.post('/', auth, admin, createQuiz);
router.put('/:id', auth, admin, updateQuiz);
router.delete('/:id', auth, admin, deleteQuiz);
router.get('/:id/admin', auth, admin, getQuizByIdAdmin);

module.exports = router;
