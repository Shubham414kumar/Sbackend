const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String, required: true }, // URL
    pdfUrl: { type: String, required: true }, // URL
    class: { type: String, required: true }, // e.g., '10', '12'
    subject: { type: String, required: true }, // e.g., 'Physics'
    category: { type: String, enum: ['NCERT', 'Reference', 'Notes'], default: 'Reference' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);
