const PushToken = require('../models/PushToken');
const NotificationLog = require('../models/NotificationLog');

// Register or update push token
exports.registerToken = async (req, res) => {
    try {
        const { token, examCategories, alertPrefs, platform, userId } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Push token is required' });
        }

        const existing = await PushToken.findOne({ token });
        if (existing) {
            // Update existing token
            existing.examCategories = examCategories || existing.examCategories;
            existing.alertPrefs = alertPrefs || existing.alertPrefs;
            existing.platform = platform || existing.platform;
            existing.userId = userId || existing.userId;
            existing.isActive = true;
            await existing.save();
            return res.json({ message: 'Token updated', token: existing });
        }

        const pushToken = new PushToken({
            token,
            examCategories: examCategories || ['SSC', 'Railway', 'Banking', 'Defence', 'Teaching', 'UPSC', 'State', 'JEE', 'NEET', 'CUET'],
            alertPrefs: alertPrefs || {},
            platform: platform || 'android',
            userId,
        });
        await pushToken.save();
        res.status(201).json({ message: 'Token registered', token: pushToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Send notification to matching tokens (admin)
exports.sendNotification = async (req, res) => {
    try {
        const { title, body, examCategory, alertType } = req.body;

        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body are required' });
        }

        // Find matching tokens
        let query = { isActive: true };
        if (examCategory) {
            query.examCategories = examCategory;
        }
        if (alertType) {
            query[`alertPrefs.${alertType}`] = true;
        }

        const tokens = await PushToken.find(query).select('token');
        const pushTokens = tokens.map(t => t.token);

        if (pushTokens.length === 0) {
            return res.json({ message: 'No matching tokens found', sent: 0 });
        }

        // Send via Expo Push API
        const messages = pushTokens.map(token => ({
            to: token,
            sound: 'default',
            title,
            body,
            data: { examCategory, alertType },
        }));

        // Batch send (max 100 per request to Expo)
        const chunks = [];
        for (let i = 0; i < messages.length; i += 100) {
            chunks.push(messages.slice(i, i + 100));
        }

        let totalSent = 0;
        for (const chunk of chunks) {
            try {
                const response = await fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(chunk),
                });
                const result = await response.json();
                totalSent += chunk.length;
            } catch (e) {
                console.error('Push send error:', e);
            }
        }

        res.json({ message: `Notifications sent to ${totalSent} devices`, sent: totalSent });

        // Log the notification to DB after pushing
        const logEntry = new NotificationLog({
            title,
            body,
            examCategory: examCategory || 'All',
            alertType,
            devices: totalSent
        });
        await logEntry.save();

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get notification history (admin)
exports.getHistory = async (req, res) => {
    try {
        const history = await NotificationLog.find().sort({ sentAt: -1 }).limit(50);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Deregister token
exports.deregisterToken = async (req, res) => {
    try {
        const { token } = req.body;
        await PushToken.findOneAndUpdate({ token }, { isActive: false });
        res.json({ message: 'Token deregistered' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
