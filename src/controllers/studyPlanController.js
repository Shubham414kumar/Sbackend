const StudyPlan = require('../models/StudyPlan');
const User = require('../models/User');

// Helper templates
const PLAN_TEMPLATES = {
    SSC: [
        { id: 't1', subject: 'Quantitative Aptitude', topic: 'Percentage & Ratio', duration: '90m', icon: '➗' },
        { id: 't2', subject: 'General Intelligence', topic: 'Coding Decoding', duration: '60m', icon: '🧠' },
        { id: 't3', subject: 'General Awareness', topic: 'Current Affairs', duration: '45m', icon: '📰' },
    ],
    Banking: [
        { id: 't1', subject: 'Data Interpretation', topic: 'Tabular DI', duration: '90m', icon: '📊' },
        { id: 't2', subject: 'Reasoning', topic: 'Puzzles & Seating', duration: '90m', icon: '🧩' },
        { id: 't3', subject: 'English', topic: 'Reading Comprehension', duration: '45m', icon: '📖' },
    ],
    UPSC: [
        { id: 't1', subject: 'History', topic: 'Modern Indian History', duration: '120m', icon: '🏛️' },
        { id: 't2', subject: 'Polity', topic: 'Fundamental Rights', duration: '120m', icon: '⚖️' },
        { id: 't3', subject: 'Current Affairs', topic: 'Daily News Analysis', duration: '60m', icon: '📰' },
    ],
    JEE: [
        { id: 't1', subject: 'Physics', topic: 'Mechanics', duration: '120m', icon: '⚛️' },
        { id: 't2', subject: 'Mathematics', topic: 'Calculus', duration: '120m', icon: '📐' },
        { id: 't3', subject: 'Chemistry', topic: 'Organic Reactions', duration: '90m', icon: '🧪' },
    ],
    NEET: [
        { id: 't1', subject: 'Biology', topic: 'Human Physiology', duration: '120m', icon: '🧬' },
        { id: 't2', subject: 'Physics', topic: 'Optics', duration: '90m', icon: '⚛️' },
        { id: 't3', subject: 'Chemistry', topic: 'Inorganic Chemistry', duration: '90m', icon: '🧪' },
    ],
    Default: [
        { id: 't1', subject: 'General Knowledge', topic: 'Static GK', duration: '45m', icon: '🌎' },
        { id: 't2', subject: 'Aptitude', topic: 'Basic Math', duration: '60m', icon: '➕' },
        { id: 't3', subject: 'Reasoning', topic: 'Logical Sequence', duration: '45m', icon: '🧠' },
    ]
};

exports.getPlanForDate = async (req, res) => {
    try {
        const { date } = req.query; // 'YYYY-MM-DD'
        if (!date) return res.status(400).json({ message: 'Date is required' });

        let plan = await StudyPlan.findOne({ userId: req.user.id, date });

        if (!plan) {
            // Generate a plan based on the user's exam category
            const user = await User.findById(req.user.id);
            const category = user.examCategory || user.examGoal || 'Default';
            
            let template = PLAN_TEMPLATES[category];
            if (!template) {
                template = PLAN_TEMPLATES['Default'];
            }

            // Clone and ensure unique IDs just in case
            const newTasks = template.map((t, idx) => ({ ...t, id: `task_${Date.now()}_${idx}`, done: false }));

            plan = new StudyPlan({
                userId: req.user.id,
                date: date,
                tasks: newTasks
            });

            await plan.save();
        }

        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.toggleTask = async (req, res) => {
    try {
        const { planId, taskId } = req.body;
        
        const plan = await StudyPlan.findOne({ _id: planId, userId: req.user.id });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const task = plan.tasks.find(t => t.id === taskId);
        if (!task) return res.status(404).json({ message: 'Task not found in plan' });

        task.done = !task.done;
        await plan.save();

        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
