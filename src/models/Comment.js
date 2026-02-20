const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    entityId: {
        type: String,
        required: true,
        index: true, // Links to Vacancy ID, Course ID, etc.
    },
    entityType: {
        type: String,
        required: true,
        enum: ['vacancy', 'course', 'quiz'],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comment', commentSchema);
