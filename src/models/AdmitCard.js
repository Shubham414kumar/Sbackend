const mongoose = require('mongoose');

const admitCardSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
    },
    examDate: {
        type: String, // String for flexible formats like "24-30 Jan"
        required: true,
    },
    releaseDate: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Released', 'Upcoming'],
        default: 'Upcoming',
    },
    downloadUrl: {
        type: String,
    },
    examCategory: {
        type: String,
        required: true, // e.g., 'Teaching', 'Banking', 'SSC'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('AdmitCard', admitCardSchema);
