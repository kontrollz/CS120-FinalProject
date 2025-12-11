const express = require('express');
const router = express.Router();
const path = require('path');
const genController = require('../controllers/generalController.js');


// landing page for website
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'dashboard.html'));
});

// forecast page
router.get('/forecast', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'forecast.html'));
});

router.get('/forecast/api', genController.fetchAPI);

// dashboard, will prob update this to what John makes
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'dashboard.html'));
});

module.exports = router;