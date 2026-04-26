const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    class: {
        type: String,
        enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'dropper', 'graduate', 'ssc', 'banking', 'railway', 'defence', 'teaching', 'upsc', 'state', 'engineering'],
        required: false,
    },
    examGoal: {
        type: String, // e.g., 'JEE', 'NEET', 'CUET', 'Foundations'
        required: false,
    },
    examCategory: {
        type: String,
        enum: ['SSC', 'Railway', 'Banking', 'Defence', 'Teaching', 'UPSC', 'State', 'JEE', 'NEET', 'CUET', 'Engineering (BEU)', 'Foundations'],
        required: false,
    },
    branch: {
        type: String,
        required: false,
    },
    semester: {
        type: String,
        required: false,
    },
    profileImage: {
        type: String,
        default: null,
    },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streakCount: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: null },
    badges: [{ type: String }], // Array of badge IDs or names
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    bookmarks: [
        {
            id: { type: String, required: true },
            type: { type: String, enum: ['course', 'vacancy', 'study'], required: true },
            bookmarkedAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
