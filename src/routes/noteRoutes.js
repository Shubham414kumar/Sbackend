const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/authMiddleware');

// All note routes require authentication
router.use(auth);

router.route('/')
    .get(noteController.getNotes)
    .post(noteController.addNote);

router.route('/:id')
    .put(noteController.updateNote)
    .delete(noteController.deleteNote);

module.exports = router;
