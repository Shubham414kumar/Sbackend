const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
    try {
        const { entityId, entityType } = req.query;
        if (!entityId || !entityType) return res.status(400).json({ error: 'Missing entityId or entityType' });

        const comments = await Comment.find({ entityId, entityType })
            .populate('userId', 'name avatar')
            .populate({
                path: 'replies',
                populate: { path: 'userId', select: 'name avatar' }
            })
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { entityId, entityType, text } = req.body;
        const comment = new Comment({
            entityId,
            entityType,
            text,
            userId: req.user.id, // Assumes auth middleware populates req.user
        });

        await comment.save();
        // Populate user details for immediate display
        await comment.populate('userId', 'name avatar');

        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const userId = req.user.id;
        const index = comment.likes.indexOf(userId);

        if (index === -1) {
            comment.likes.push(userId);
        } else {
            comment.likes.splice(index, 1);
        }

        await comment.save();
        res.json({ likes: comment.likes.length, isLiked: index === -1 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!comment) return res.status(404).json({ error: "Comment not found or unauthorized" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
