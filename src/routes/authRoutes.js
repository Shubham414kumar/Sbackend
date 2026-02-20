const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile, getAllUsers } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/register', signup); // Alias — client calls /register
router.post('/login', login);
router.get('/me', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/users', auth, require('../middleware/adminMiddleware'), getAllUsers);

module.exports = router;
