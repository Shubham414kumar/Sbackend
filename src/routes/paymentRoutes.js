const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.post('/create-order', protect, paymentController.createOrder);
router.post('/verify', protect, paymentController.verifyPayment);
router.get('/orders', protect, admin, paymentController.getAllOrders);

module.exports = router;
