const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage using Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folderName = 'saarthiprep/others';
        let resourceType = 'auto'; // Important for uploading videos and raw files (PDFs)

        // Determine folder and resource_type based on file mimetype
        if (file.mimetype.startsWith('video/')) {
            folderName = 'saarthiprep/videos';
            resourceType = 'video';
        } else if (file.mimetype === 'application/pdf') {
            folderName = 'saarthiprep/pdfs';
            resourceType = 'auto'; 
        } else if (file.mimetype.startsWith('image/')) {
            folderName = 'saarthiprep/images';
            resourceType = 'image';
        }

        // Format is not strictly required.
        // If not specified, Cloudinary retains original extension or optimizes it based on account settings
        return {
            folder: folderName,
            resource_type: resourceType,
            public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}` // remove extension from public_id to prevent double extensions
        };
    },
});

// Init Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for videos.
});

module.exports = {
    upload,
    cloudinary
};
