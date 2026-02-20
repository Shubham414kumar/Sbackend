const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true }, // e.g., 'Physics', 'Full Test'
    class: { type: String }, // Optional
    duration: { type: Number, required: true }, // in minutes
    totalMarks: { type: Number, required: true },
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctOption: { type: Number, required: true }, // Index 0-3
            marks: { type: Number, default: 4 },
            explanation: { type: String }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
