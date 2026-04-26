const mongoose = require('mongoose');

const StudyTaskSchema = new mongoose.Schema({
    id: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    duration: { type: String, required: true },
    done: { type: Boolean, default: false },
    icon: { type: String, default: '📚' }
});

const StudyPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    date: {
        type: String, // 'YYYY-MM-DD'
        required: true,
        index: true,
    },
    tasks: [StudyTaskSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Compound index to quickly find a user's plan for a specific day
StudyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

StudyPlanSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
