const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order');
const Vacancy = require('../models/Vacancy');

exports.getDashboardStats = async (req, res) => {
    try {
        // Basic Counts
        const totalStudents = await User.countDocuments({ role: { $ne: 'admin' } });
        const activeCourses = await Course.countDocuments();

        // Calculate Revenue from successful orders
        const orders = await Order.find({ status: 'successful' });
        const revenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0) / 100; // Assuming amount is in paise

        const activeVacancies = await Vacancy.countDocuments({ status: 'Active' });

        // Placeholder for items not explicitly tracked yet
        const notificationsSent = 150;
        const pyqDownloads = 300;

        // Exam Distribution (Aggregating users by examCategory)
        const examDistributionData = await User.aggregate([
            { $match: { role: { $ne: 'admin' }, examCategory: { $exists: true, $ne: null } } },
            { $group: { _id: "$examCategory", value: { $sum: 1 } } },
            { $project: { name: "$_id", value: 1, _id: 0 } }
        ]);

        // Fallback if empty
        const examDistribution = examDistributionData.length > 0 ? examDistributionData : [
            { name: 'SSC', value: 320 },
            { name: 'Railway', value: 250 },
            { name: 'Banking', value: 200 },
        ];

        // Monthly Data (Mocked structure but with some real hints if possible, 
        // keeping it simple for dry run)
        const monthlyData = [
            { name: 'Jan', users: 40, revenue: 2400, vacancies: 2 },
            { name: 'Feb', users: 120, revenue: 3100, vacancies: 5 },
            { name: 'Mar', users: totalStudents, revenue: revenue || 4200, vacancies: activeVacancies },
        ];

        // Recent Activity (Fetching latest users)
        const recentUsers = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).limit(5);
        const recentActivity = recentUsers.map(u => ({
            time: new Date(u.createdAt).toLocaleDateString(),
            msg: `New user registered — ${u.name} (${u.examCategory || 'General'})`,
            icon: '👤'
        }));

        if (recentActivity.length === 0) {
            recentActivity.push({ time: 'Just now', msg: 'System initialized', icon: '🚀' });
        }

        res.json({
            stats: {
                totalStudents,
                activeCourses,
                revenue,
                activeVacancies,
                notificationsSent,
                pyqDownloads
            },
            monthlyData,
            examDistribution,
            recentActivity
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error in Analytics' });
    }
};
