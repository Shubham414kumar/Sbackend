const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
        index: true, // Index for fast lookup
    },
    candidateName: {
        type: String,
        required: true,
    },
    dob: {
        type: String, // Optional, for verification
    },
    score: {
        type: String,
        required: true,
    },
    rank: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Qualified', 'Not Qualified', 'Pending'],
        default: 'Pending',
    },
    details: {
        type: Object, // Flexible field for subject-wise marks
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Composite index to ensure unique roll number per exam if needed, 
// or just index rollNumber for now.
resultSchema.index({ rollNumber: 1, examName: 1 });

module.exports = mongoose.model('Result', resultSchema);
