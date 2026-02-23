const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    examCategory: { type: String, default: 'All' },
    alertType: { type: String, required: true },
    devices: { type: Number, required: true },
    sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
