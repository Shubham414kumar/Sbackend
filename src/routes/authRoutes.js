const express = require('express');
const router = express.Router();
const { signup, login, adminLogin, getProfile, updateProfile, getAllUsers, updateUserRole, deleteUser } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/signup', signup);
router.post('/register', signup); // Alias — client calls /register
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/me', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/users', auth, adminMiddleware, getAllUsers);
router.put('/users/:id/role', auth, adminMiddleware, updateUserRole);
router.delete('/users/:id', auth, adminMiddleware, deleteUser);

module.exports = router;
