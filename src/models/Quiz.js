const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true }, // e.g., 'Physics', 'Full Test'
    class: [{
        type: String,
        enum: ['6', '7', '8', '9', '10', '11', '12', 'dropper']
    }],
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    duration: { type: Number, required: true }, // in minutes
    totalMarks: { type: Number, required: true },
    questions: [
        {
            questionText: { type: String, required: true },
            questionType: { 
                type: String, 
                enum: ['objective', 'subjective'], 
                default: 'objective' 
            },
            // Objective fields
            options: [{ type: String }],
            correctOption: { type: Number }, // Index 0-3 for objective
            // Common fields
            marks: { type: Number, default: 4 },
            explanation: { type: String },
            // Subjective fields
            expectedAnswer: { type: String }, // Model answer for subjective
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
