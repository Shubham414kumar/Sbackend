const mongoose = require('mongoose');

const SyllabusSchema = new mongoose.Schema({
    examGoal: { type: String, required: true }, // e.g., 'CBSE Class 10', 'JEE Main'
    subject: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    topics: [{ type: String }], // List of topics
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Syllabus', SyllabusSchema);
