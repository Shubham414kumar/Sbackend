const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vacancyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacancy',
        required: false, // Optional: users can track apps without linking to a specific DB vacancy if we allow custom
    },
    title: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Applied', 'Under Review', 'Admit Card', 'Exam Done', 'Result Out'],
        default: 'Applied',
    },
    regNo: {
        type: String,
        required: false,
    },
    examDate: {
        type: Date,
        required: false,
    },
    icon: {
        type: String,
        default: '📋',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Update the updatedAt field before saving
ApplicationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Application', ApplicationSchema);
