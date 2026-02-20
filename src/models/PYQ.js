const mongoose = require('mongoose');

const PYQSchema = new mongoose.Schema({
    exam: { type: String, required: true }, // e.g., 'JEE Advanced'
    year: { type: Number, required: true },
    subject: { type: String }, // Optional if it's a full paper
    questionPaperUrl: { type: String, required: true },
    solutionUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PYQ', PYQSchema);
