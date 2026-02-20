const Result = require('../models/Result');

exports.checkResult = async (req, res) => {
    try {
        const { rollNumber, examName } = req.body;

        // Find result matching roll number and optionally exam name
        const query = { rollNumber };
        if (examName) query.examName = examName;

        const result = await Result.findOne(query);

        if (!result) {
            return res.status(404).json({ message: 'Result not found. Please check your roll number.' });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadResults = async (req, res) => {
    try {
        // Expects an array of result objects
        const results = req.body;
        if (!Array.isArray(results)) {
            return res.status(400).json({ error: 'Input must be an array of results' });
        }

        const inserted = await Result.insertMany(results);
        res.status(201).json({ message: `Successfully uploaded ${inserted.length} results` });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const results = await Result.find().sort({ createdAt: -1 }).limit(50);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
