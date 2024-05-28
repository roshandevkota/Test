const express = require('express');
const { getHistoricalData, getCurrentData } = require('../controllers/neoController');

const router = express.Router();

router.get('/historical', getHistoricalData);
router.get('/current', getCurrentData);

module.exports = router;
