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
    class: {
        type: String,
        enum: ['9', '10', '11', '12', 'dropper'],
        required: false,
    },
    instructor: {
        type: String,
        default: 'Vidyalaya Team',
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
