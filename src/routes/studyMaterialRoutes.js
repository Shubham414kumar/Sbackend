const express = require('express');
const router = express.Router();
const {
    getBooks, createBook,
    getSyllabus, createSyllabus,
    getPYQs, createPYQ
} = require('../controllers/studyMaterialController');

// Books
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Books
router.get('/books', auth, getBooks);
router.post('/books', auth, admin, createBook);

// Syllabus
router.get('/syllabus', auth, getSyllabus);
router.post('/syllabus', auth, admin, createSyllabus);

// PYQs
router.get('/pyqs', auth, getPYQs);
router.post('/pyqs', auth, admin, createPYQ);

module.exports = router;
