const Application = require('../models/Application');

// Get all applications for the logged-in user
exports.getApplications = async (req, res) => {
    try {
        const apps = await Application.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new application
exports.addApplication = async (req, res) => {
    try {
        const { vacancyId, title, organization, status, regNo, examDate, icon } = req.body;
        
        const newApp = new Application({
            userId: req.user.id,
            vacancyId,
            title,
            organization,
            status: status || 'Applied',
            regNo,
            examDate,
            icon: icon || '📋',
        });

        const savedApp = await newApp.save();
        res.status(201).json(savedApp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update an application (e.g., status, regNo)
exports.updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the application and ensure the user owns it
        const app = await Application.findById(id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        if (app.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedApp = await Application.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.json(updatedApp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an application
exports.deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        const app = await Application.findById(id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        if (app.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Application.findByIdAndDelete(id);
        res.json({ message: 'Application removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
