const express = require('express');
const router = express.Router();
const { getComments, addComment, toggleLike, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

router.get('/', getComments);
router.post('/', auth, addComment);
router.put('/:id/like', auth, toggleLike);
router.delete('/:id', auth, deleteComment);

module.exports = router;
