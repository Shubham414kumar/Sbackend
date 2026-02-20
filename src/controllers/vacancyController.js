const Vacancy = require('../models/Vacancy');

// Get vacancies with optional examCategory filter
exports.getVacancies = async (req, res) => {
    try {
        const { examCategory, status } = req.query;
        let query = {};
        if (examCategory) query.examCategory = examCategory;
        if (status) query.status = status;

        const vacancies = await Vacancy.find(query).sort({ createdAt: -1 });
        res.json(vacancies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single vacancy by ID
exports.getVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.findById(req.params.id);
        if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' });
        res.json(vacancy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create vacancy (admin)
exports.createVacancy = async (req, res) => {
    try {
        const vacancy = new Vacancy(req.body);
        await vacancy.save();
        res.status(201).json(vacancy);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update vacancy (admin)
exports.updateVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' });
        res.json(vacancy);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete vacancy (admin)
exports.deleteVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.findByIdAndDelete(req.params.id);
        if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' });
        res.json({ message: 'Vacancy deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
