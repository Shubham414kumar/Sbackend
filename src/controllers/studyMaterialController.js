const Book = require('../models/Book');
const Syllabus = require('../models/Syllabus');
const PYQ = require('../models/PYQ');

// --- Books ---
exports.getBooks = async (req, res) => {
    try {
        const { search, class: studentClass, subject } = req.query;
        let query = {};
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        if (studentClass) query.class = studentClass;
        if (subject) query.subject = subject;

        const books = await Book.find(query);
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBook = async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Syllabus ---
exports.getSyllabus = async (req, res) => {
    try {
        const { examGoal } = req.query;
        const syllabus = await Syllabus.find({ examGoal });
        res.json(syllabus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createSyllabus = async (req, res) => {
    try {
        const syllabus = new Syllabus(req.body);
        await syllabus.save();
        res.status(201).json(syllabus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteSyllabus = async (req, res) => {
    try {
        await Syllabus.findByIdAndDelete(req.params.id);
        res.json({ message: 'Syllabus deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- PYQs ---
exports.getPYQs = async (req, res) => {
    try {
        const { search, exam, year } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { exam: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }

        if (exam) query.exam = exam;
        if (year) query.year = year;

        const pyqs = await PYQ.find(query).sort({ year: -1 });
        res.json(pyqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPYQ = async (req, res) => {
    try {
        const pyq = new PYQ(req.body);
        await pyq.save();
        res.status(201).json(pyq);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deletePYQ = async (req, res) => {
    try {
        await PYQ.findByIdAndDelete(req.params.id);
        res.json({ message: 'PYQ deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
