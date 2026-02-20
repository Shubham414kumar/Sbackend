const mongoose = require('mongoose');

const currentAffairSchema = new mongoose.Schema({
    date: {
        type: String, // Format: "DD MMMM YYYY" e.g., "20 February 2026"
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['National', 'International', 'Economy', 'Science & Tech', 'Sports', 'Polity', 'Environment', 'Art & Culture', 'Education', 'Other']
    },
    icon: {
        type: String,
        default: '📰'
    },
    important: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Prevent duplicate entries for same title on same day
currentAffairSchema.index({ date: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('CurrentAffair', currentAffairSchema);
