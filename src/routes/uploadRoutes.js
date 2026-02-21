const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// @route   POST /api/upload
// @desc    Upload a single file (pdf, video, image) to Cloudinary
// @access  Private/Admin
router.post('/', auth, admin, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        // Cloudinary returns the secure URL in req.file.path
        res.status(200).json({
            message: 'File uploaded successfully',
            url: req.file.path,
            public_id: req.file.filename,
            format: req.file.mimetype
        });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ message: 'Failed to upload file to Cloudinary' });
    }
});

module.exports = router;
