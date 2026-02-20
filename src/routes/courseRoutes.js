const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, addLesson } = require('../controllers/courseController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Public Routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected Admin Routes
router.post('/', auth, admin, createCourse);
router.post('/lesson', auth, admin, addLesson);

module.exports = router;
