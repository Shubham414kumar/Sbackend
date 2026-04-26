const Note = require('../models/Note');

// Get all notes for a specific topic (or all for user)
exports.getNotes = async (req, res) => {
    try {
        const { topicId } = req.query;
        const query = { userId: req.user.id };
        
        if (topicId) {
            query.topicId = topicId;
        }

        const notes = await Note.find(query).sort({ timestamp: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new note
exports.addNote = async (req, res) => {
    try {
        const { topicId, content, color, timestamp } = req.body;
        
        if (!topicId || !content) {
            return res.status(400).json({ message: 'topicId and content are required' });
        }

        const newNote = new Note({
            userId: req.user.id,
            topicId,
            content,
            color,
            timestamp: timestamp || Date.now()
        });

        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a note
exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, color } = req.body;
        
        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        
        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        note.content = content || note.content;
        note.color = color || note.color;
        
        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        
        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        
        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Note.findByIdAndDelete(id);
        res.json({ message: 'Note removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
