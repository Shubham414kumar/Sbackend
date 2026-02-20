const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
    try {
        // Get top 10 users by XP
        const leaderboard = await User.find()
            .sort({ xp: -1 })
            .limit(10)
            .select('name xp level badges');

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addXP = async (req, res) => {
    try {
        const { userId, xpAmount } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.xp += xpAmount;

        // Level up logic: Level = 1 + floor(sqrt(XP / 100))
        const newLevel = 1 + Math.floor(Math.sqrt(user.xp / 100));
        if (newLevel > user.level) {
            user.level = newLevel;
            // You could add logic here to award a badge or notify user
        }

        await user.save();
        res.json({ xp: user.xp, level: user.level });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
