const express = require('express');
const router = express.Router();
const vacancyController = require('../controllers/vacancyController');

// Public routes
router.get('/', vacancyController.getVacancies);
router.get('/:id', vacancyController.getVacancy);

// Admin routes (add auth middleware later)
router.post('/', vacancyController.createVacancy);
router.put('/:id', vacancyController.updateVacancy);
router.delete('/:id', vacancyController.deleteVacancy);

module.exports = router;
