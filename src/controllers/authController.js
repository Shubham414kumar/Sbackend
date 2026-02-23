const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, class: studentClass, examGoal, examCategory, branch, semester } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            class: studentClass,
            examGoal,
            examCategory,
            branch,
            semester
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, class: user.class, examGoal: user.examGoal, examCategory: user.examCategory, branch: user.branch, semester: user.semester, xp: user.xp, level: user.level, streakCount: user.streakCount, badges: user.badges } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // --- Daily Streak & XP Logic ---
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let streakUpdated = false;

        if (user.lastLoginDate) {
            const lastLoginDate = new Date(user.lastLoginDate);
            const startOfLastLogin = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());

            // Calculate difference in whole days
            const diffTime = Math.abs(startOfToday - startOfLastLogin);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Logged in exactly yesterday: Increment Streak!
                user.streakCount = (user.streakCount || 0) + 1;
                user.xp = (user.xp || 0) + 10; // Award 10 XP for daily login
                streakUpdated = true;
            } else if (diffDays > 1) {
                // Missed a day: Reset Streak
                user.streakCount = 1;
                user.xp = (user.xp || 0) + 10;
                streakUpdated = true;
            }
            // If diffDays === 0, they already logged in today. Do nothing.
        } else {
            // First ever login via this system
            user.streakCount = 1;
            user.xp = (user.xp || 0) + 10;
            streakUpdated = true;
        }

        user.lastLoginDate = now;

        // Level up logic check if XP was added
        if (streakUpdated) {
            const newLevel = 1 + Math.floor(Math.sqrt(user.xp / 100));
            if (newLevel > user.level) user.level = newLevel;
        }

        await user.save();
        // --- End Streak Logic ---

        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, class: user.class, examGoal: user.examGoal, examCategory: user.examCategory, branch: user.branch, semester: user.semester, xp: user.xp, level: user.level, streakCount: user.streakCount, badges: user.badges } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied: Admin role required' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: { id: user.id, role: user.role }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { class: studentClass, examGoal, examCategory, name, branch, semester } = req.body;
        const updateFields = {};

        if (studentClass) updateFields.class = studentClass;
        if (examGoal) updateFields.examGoal = examGoal;
        if (examCategory) updateFields.examCategory = examCategory;
        if (name) updateFields.name = name;
        if (branch) updateFields.branch = branch;
        if (semester) updateFields.semester = semester;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
