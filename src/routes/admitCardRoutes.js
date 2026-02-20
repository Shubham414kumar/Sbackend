const express = require('express');
const router = express.Router();
const { getAdmitCards, createAdmitCard, updateAdmitCard, deleteAdmitCard } = require('../controllers/admitCardController');
// potentially add auth middleware here if needed for create/update/delete
// const auth = require('../middleware/auth');

router.get('/', getAdmitCards);
router.post('/', createAdmitCard); // protect this later
router.put('/:id', updateAdmitCard); // protect this later
router.delete('/:id', deleteAdmitCard); // protect this later

module.exports = router;
