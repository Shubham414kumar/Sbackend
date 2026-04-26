const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/authMiddleware');

// All application routes require authentication
router.use(auth);

router.route('/')
    .get(applicationController.getApplications)
    .post(applicationController.addApplication);

router.route('/:id')
    .put(applicationController.updateApplication)
    .delete(applicationController.deleteApplication);

module.exports = router;
