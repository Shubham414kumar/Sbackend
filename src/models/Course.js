const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String, // URL
        required: true,
    },
    category: {
        type: String,
        required: true, // e.g., 'Physics', 'JEE'
    },
    class: [{
        type: String,
        enum: ['6', '7', '8', '9', '10', '11', '12', 'dropper'],
    }],
    instructor: {
        type: String,
        default: 'SaarthiPrep Team',
    },
    price: {
        type: Number,
        default: 0, // Free for now
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Course', CourseSchema);
