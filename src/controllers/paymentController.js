const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

exports.createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt, courseId } = req.body;

        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);

        // Save to DB
        await Order.create({
            userId: req.user.id, // Assumes auth middleware populates req.user
            courseId: courseId || 'unknown_course',
            amount,
            razorpayOrderId: order.id,
            status: 'created'
        });

        res.json(order);
    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Update Order status
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'paid', paymentId: razorpay_payment_id }
            );
            res.json({ message: "Payment verified successfully" });
        } else {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'failed' }
            );
            res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Fetch Orders Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
