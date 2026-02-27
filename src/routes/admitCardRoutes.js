const express = require('express');
const router = express.Router();
const { getAdmitCards, createAdmitCard, updateAdmitCard, deleteAdmitCard } = require('../controllers/admitCardController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', getAdmitCards);
router.post('/', auth, admin, createAdmitCard);
router.put('/:id', auth, admin, updateAdmitCard);
router.delete('/:id', auth, admin, deleteAdmitCard);

module.exports = router;
