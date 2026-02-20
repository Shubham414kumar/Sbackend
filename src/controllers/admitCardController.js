const AdmitCard = require('../models/AdmitCard');

exports.getAdmitCards = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { examCategory: category } : {};
        const cards = await AdmitCard.find(filter).sort({ createdAt: -1 });
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAdmitCard = async (req, res) => {
    try {
        const card = new AdmitCard(req.body);
        await card.save();
        res.status(201).json(card);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateAdmitCard = async (req, res) => {
    try {
        const card = await AdmitCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(card);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteAdmitCard = async (req, res) => {
    try {
        await AdmitCard.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admit card deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
