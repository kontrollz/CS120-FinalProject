const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/authController.js');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

// login route, will eventually need POST too
router.get('/login', authController.showLogin);

// signup route, will eventually need POST too
router.get('/signup', authController.showSignup);

module.exports = router;