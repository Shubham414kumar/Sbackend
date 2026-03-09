const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
    title: { type: String, required: true },
    organization: { type: String, required: true },
    examCategory: {
        type: String,
        required: true,
        enum: ['SSC', 'Railway', 'Banking', 'Defence', 'Teaching', 'UPSC', 'State', 'JEE', 'NEET', 'CUET', 'Engineering (BEU)'],
    },
    lastDate: { type: Date, required: true },
    vacancies: { type: Number, default: 0 },
    eligibility: { type: String, required: true },
    salary: { type: String },
    applicationUrl: { type: String },
    status: {
        type: String,
        enum: ['Active', 'Upcoming', 'Expired'],
        default: 'Active',
    },
    syllabus: { type: String },
    notificationPdfUrl: { type: String },
    description: { type: String },
    documentsRequired: { type: [String], default: [] },
    // New fields for the Calendar feature
    admitCardDate: { type: Date },
    examDate: { type: Date },
    resultDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Vacancy', vacancySchema);
