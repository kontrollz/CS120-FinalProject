const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/authController.js');

// landing page for website
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

// login route, will eventually need POST too
router.get('/login', authController.showLogin);
router.post('/login', authController.userLogin)

// signup route, will eventually need POST too
router.get('/signup', authController.showSignup);
router.post('/signup', authController.userSignup);

// email confirmation
router.get('/confirm/:token', authController.confirmEmail)

module.exports = router;


