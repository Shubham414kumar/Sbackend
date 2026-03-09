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

        // Support for object mapping: { questionId: selectedOptionIndex }
        // and legacy array of indices: [selectedOptionIndex, ...]
        if (Array.isArray(answers)) {
            answers.forEach((item, index) => {
                let selectedOption = typeof item === 'object' && item !== null ? item.selectedOption : item;
                let question = (typeof item === 'object' && item !== null && item.questionId)
                    ? quiz.questions.id(item.questionId)
                    : quiz.questions[index];

                if (question) {
                    if (selectedOption === question.correctOption) {
                        score += question.marks;
                        correctCount++;
                    } else if (selectedOption !== null && selectedOption !== -1 && selectedOption !== undefined) {
                        incorrectCount++;
                    }
                }
            });
        } else if (typeof answers === 'object' && answers !== null) {
            for (const [questionId, selectedOption] of Object.entries(answers)) {
                const question = quiz.questions.id(questionId);
                if (question) {
                    if (selectedOption === question.correctOption) {
                        score += question.marks;
                        correctCount++;
                    } else if (selectedOption !== null && selectedOption !== -1 && selectedOption !== undefined) {
                        incorrectCount++;
                    }
                }
            }
        }

        res.json({ score, totalMarks: quiz.totalMarks, correctCount, incorrectCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
