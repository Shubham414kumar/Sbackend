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
        enum: ['6', '7', '8', '9', '10', '11', '12', 'dropper'],
        required: false,
    },
    examGoal: {
        type: String, // e.g., 'JEE', 'NEET', 'CUET', 'Foundations'
        required: false,
    },
    examCategory: {
        type: String,
        enum: ['SSC', 'Railway', 'Banking', 'Defence', 'Teaching', 'UPSC', 'State', 'JEE', 'NEET', 'CUET'],
        required: false,
    },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{ type: String }], // Array of badge IDs or names
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
