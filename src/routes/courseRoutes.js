const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, addLesson, updateCourse, deleteCourse, deleteLesson } = require('../controllers/courseController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Public Routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected Admin Routes
router.post('/', auth, admin, createCourse);
router.post('/lesson', auth, admin, addLesson);

// Missing CRUD endpoints added
router.put('/:id', auth, admin, updateCourse);
router.delete('/:id', auth, admin, deleteCourse);
router.delete('/lesson/:id', auth, admin, deleteLesson);

module.exports = router;
