const Quiz = require('../models/Quiz');

exports.getQuizzes = async (req, res) => {
    try {
        const { class: studentClass } = req.query;
        let query = {};
        if (studentClass) query.class = studentClass;

        const quizzes = await Quiz.find(query).select('-questions.correctOption -questions.explanation');
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createQuiz = async (req, res) => {
    try {
        const quiz = new Quiz(req.body);
        await quiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body; // answers: { questionId: selectedOptionIndex }
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let score = 0;
        let correctCount = 0;
        let incorrectCount = 0;

        // Simple evaluation logic (assuming answers array matches questions array index for MVP simplicity)
        // Real implementation would map by ID.

        // For MVP, assume answers is an array of selected indices
        answers.forEach((selectedOption, index) => {
            if (selectedOption === quiz.questions[index].correctOption) {
                score += quiz.questions[index].marks;
                correctCount++;
            } else if (selectedOption !== null && selectedOption !== -1) {
                incorrectCount++;
                // Negative marking logic could go here
            }
        });

        res.json({ score, totalMarks: quiz.totalMarks, correctCount, incorrectCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
