const express = require('express');
const router = express.Router();
const { unifiedSearch } = require('../controllers/searchController');

// Public search route
router.get('/', unifiedSearch);

module.exports = router;
