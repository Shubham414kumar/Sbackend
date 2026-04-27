const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    examCategories: [{
        type: String,
        enum: ['SSC', 'Railway', 'Banking', 'Defence', 'Teaching', 'UPSC', 'State', 'JEE', 'NEET', 'CUET', 'Engineering (BEU)', 'Foundations', 'Technical Subject'],
    }],
    alertPrefs: {
        newVacancies: { type: Boolean, default: true },
        results: { type: Boolean, default: true },
        admitCards: { type: Boolean, default: true },
        deadlines: { type: Boolean, default: true },
    },
    platform: { type: String, enum: ['ios', 'android', 'web'] },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('PushToken', pushTokenSchema);
