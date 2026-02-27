const express = require('express');
const router = express.Router();
const vacancyController = require('../controllers/vacancyController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Public routes
router.get('/', vacancyController.getVacancies);
router.get('/:id', vacancyController.getVacancy);

// Protected Admin routes
router.post('/', auth, admin, vacancyController.createVacancy);
router.put('/:id', auth, admin, vacancyController.updateVacancy);
router.delete('/:id', auth, admin, vacancyController.deleteVacancy);

module.exports = router;
