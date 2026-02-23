const express = require('express');
const router = express.Router();
const {
    getBooks, createBook, deleteBook,
    getSyllabus, createSyllabus, deleteSyllabus,
    getPYQs, createPYQ, deletePYQ
} = require('../controllers/studyMaterialController');

// Books
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Books
router.get('/books', auth, getBooks);
router.post('/books', auth, admin, createBook);
router.delete('/books/:id', auth, admin, deleteBook);

// Syllabus
router.get('/syllabus', auth, getSyllabus);
router.post('/syllabus', auth, admin, createSyllabus);
router.delete('/syllabus/:id', auth, admin, deleteSyllabus);

// PYQs
router.get('/pyqs', auth, getPYQs);
router.post('/pyqs', auth, admin, createPYQ);
router.delete('/pyqs/:id', auth, admin, deletePYQ);

module.exports = router;
