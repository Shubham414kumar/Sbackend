const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    pdfUrl: {
        type: String,
    },
    duration: {
        type: String, // e.g., '45 mins'
    },
    order: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Lesson', LessonSchema);
