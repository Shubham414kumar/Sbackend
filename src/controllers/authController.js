const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, class: studentClass, examGoal, examCategory, branch, semester } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        // Prevent role escalation — users cannot self-assign admin
        const safeRole = (role === 'admin') ? 'student' : (role || 'student');

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: safeRole,
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
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, class: user.class, examGoal: user.examGoal, examCategory: user.examCategory, branch: user.branch, semester: user.semester, profileImage: user.profileImage, xp: user.xp, level: user.level, streakCount: user.streakCount, badges: user.badges } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

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
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, class: user.class, examGoal: user.examGoal, examCategory: user.examCategory, branch: user.branch, semester: user.semester, profileImage: user.profileImage, xp: user.xp, level: user.level, streakCount: user.streakCount, badges: user.badges } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

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
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
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
        const { class: studentClass, examGoal, examCategory, name, branch, semester, profileImage } = req.body;
        const updateFields = {};

        if (studentClass) updateFields.class = studentClass;
        if (examGoal) updateFields.examGoal = examGoal;
        if (examCategory) updateFields.examCategory = examCategory;
        if (name) updateFields.name = name;
        if (branch) updateFields.branch = branch;
        if (semester) updateFields.semester = semester;
        if (profileImage) updateFields.profileImage = profileImage;

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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
        const total = await User.countDocuments(query);
        const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.json({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['student', 'admin'].includes(role)) {
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

// Forgot Password — generates a reset token
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account with that email' });

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();

        // In production, send email with reset link. For now, log the token.
        console.log(`[DEV ONLY] Password reset token for ${email}: ${resetToken}`);
        res.json({
            message: 'Password reset instructions sent to your email.'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password — uses the reset token
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password are required' });
        if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful. You can now login with your new password.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Change Password — for logged-in users
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords are required' });
        if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
