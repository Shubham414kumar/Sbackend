const Quiz = require('../models/Quiz');

// Get all quizzes (hide answers from students)
exports.getQuizzes = async (req, res) => {
    try {
        const { class: studentClass } = req.query;
        let query = {};
        if (studentClass) query.class = studentClass;

        const quizzes = await Quiz.find(query).select('-questions.correctOption -questions.explanation -questions.expectedAnswer');
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get quiz by ID (for students taking quiz — hide answers)
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).select('-questions.correctOption -questions.explanation -questions.expectedAnswer');
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get quiz by ID for admin (includes answers & explanations)
exports.getQuizByIdAdmin = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new quiz
exports.createQuiz = async (req, res) => {
    try {
        const { title, category, duration, totalMarks, questions } = req.body;

        // Basic validation
        if (!title || !category || !duration || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: 'title, category, duration, and questions array are required' });
        }

        // Validate each question based on type
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText || !q.questionText.trim()) {
                return res.status(400).json({ message: `Question ${i + 1}: questionText is required` });
            }

            const qType = q.questionType || 'objective';

            if (qType === 'objective') {
                if (!q.options || !Array.isArray(q.options) || q.options.filter(o => o && o.trim()).length < 2) {
                    return res.status(400).json({ message: `Question ${i + 1}: At least 2 options are required for objective questions` });
                }
                if (q.correctOption === null || q.correctOption === undefined || q.correctOption < 0) {
                    return res.status(400).json({ message: `Question ${i + 1}: correctOption is required for objective questions` });
                }
            }

            if (!q.marks || q.marks <= 0) {
                return res.status(400).json({ message: `Question ${i + 1}: marks must be greater than 0` });
            }
        }

        // Calculate totalMarks if not provided
        const calcTotalMarks = totalMarks || questions.reduce((sum, q) => sum + (q.marks || 4), 0);

        const quiz = new Quiz({
            ...req.body,
            totalMarks: calcTotalMarks,
        });
        await quiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        // Update allowed fields
        const allowedFields = ['title', 'description', 'category', 'class', 'difficulty', 'duration', 'totalMarks', 'questions'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                quiz[field] = req.body[field];
            }
        });

        // Recalculate totalMarks from questions if questions were updated
        if (req.body.questions) {
            quiz.totalMarks = req.body.totalMarks || quiz.questions.reduce((sum, q) => sum + (q.marks || 4), 0);
        }

        const updatedQuiz = await quiz.save();
        res.json(updatedQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Submit quiz answers (auto-grade objective, collect subjective)
exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        // answers format (array): [{ questionId, selectedOption, textAnswer }]
        // or legacy: [selectedOptionIndex, ...]
        // or object: { questionId: selectedOptionIndex }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let score = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let skippedCount = 0;
        let subjectiveCount = 0;
        let subjectiveMarks = 0;
        const questionResults = [];

        if (Array.isArray(answers)) {
            answers.forEach((item, index) => {
                let selectedOption = typeof item === 'object' && item !== null ? item.selectedOption : item;
                let textAnswer = typeof item === 'object' && item !== null ? item.textAnswer : null;
                let question = (typeof item === 'object' && item !== null && item.questionId)
                    ? quiz.questions.id(item.questionId)
                    : quiz.questions[index];

                if (!question) return;

                const qType = question.questionType || 'objective';

                if (qType === 'objective') {
                    // Auto-grade objective
                    if (selectedOption === null || selectedOption === -1 || selectedOption === undefined) {
                        skippedCount++;
                        questionResults.push({
                            questionId: question._id,
                            questionType: 'objective',
                            status: 'skipped',
                            marks: 0,
                            maxMarks: question.marks,
                            correctOption: question.correctOption,
                            explanation: question.explanation,
                        });
                    } else if (selectedOption === question.correctOption) {
                        score += question.marks;
                        correctCount++;
                        questionResults.push({
                            questionId: question._id,
                            questionType: 'objective',
                            status: 'correct',
                            marks: question.marks,
                            maxMarks: question.marks,
                            correctOption: question.correctOption,
                            explanation: question.explanation,
                        });
                    } else {
                        incorrectCount++;
                        questionResults.push({
                            questionId: question._id,
                            questionType: 'objective',
                            status: 'incorrect',
                            marks: 0,
                            maxMarks: question.marks,
                            selectedOption,
                            correctOption: question.correctOption,
                            explanation: question.explanation,
                        });
                    }
                } else {
                    // Subjective — cannot auto-grade, mark as pending
                    subjectiveCount++;
                    subjectiveMarks += question.marks;
                    questionResults.push({
                        questionId: question._id,
                        questionType: 'subjective',
                        status: 'pending_review',
                        textAnswer: textAnswer || '',
                        marks: 0,
                        maxMarks: question.marks,
                        expectedAnswer: question.expectedAnswer,
                    });
                }
            });
        } else if (typeof answers === 'object' && answers !== null) {
            // Legacy object format: { questionId: selectedOption }
            for (const [questionId, selectedOption] of Object.entries(answers)) {
                const question = quiz.questions.id(questionId);
                if (!question) continue;

                const qType = question.questionType || 'objective';

                if (qType === 'objective') {
                    if (selectedOption === question.correctOption) {
                        score += question.marks;
                        correctCount++;
                    } else if (selectedOption !== null && selectedOption !== -1 && selectedOption !== undefined) {
                        incorrectCount++;
                    } else {
                        skippedCount++;
                    }
                } else {
                    subjectiveCount++;
                    subjectiveMarks += question.marks;
                }
            }
        }

        res.json({
            score,
            totalMarks: quiz.totalMarks,
            objectiveMarks: quiz.totalMarks - subjectiveMarks,
            correctCount,
            incorrectCount,
            skippedCount,
            subjectiveCount,
            subjectiveMarks,
            questionResults,
            message: subjectiveCount > 0
                ? `Objective score: ${score}/${quiz.totalMarks - subjectiveMarks}. ${subjectiveCount} subjective question(s) worth ${subjectiveMarks} marks pending review.`
                : undefined,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
