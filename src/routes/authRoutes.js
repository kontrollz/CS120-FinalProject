const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/authController.js');

// landing page for website
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'dashboard.html'));
});

// forecast page
router.get('/forecast', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'forecast.html'));
});

// dashboard, will prob update this to what John makes
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'dashboard.html'));
});

// login route, will eventually need POST too
router.get('/login', authController.showLogin);
router.post('/login', authController.userLogin);

// signup route, will eventually need POST too
router.get('/signup', authController.showSignup);
router.post('/signup', authController.userSignup);

// email confirmation
router.get('/confirm/:token', authController.confirmEmail);

// check session status
router.get('/session', authController.checkSessionStatus);

// log user out
router.post('/logout', authController.logout);

// forgot password
router.get('/forgot-password', authController.showForgotPasswordPage);
router.post('/forgot-password', authController.sendPasswordResetEmail);

// reset password 
router.get('/reset-password/:token', authController.showResetPage);
router.post('/reset-password', authController.resetPassword);


module.exports = router;


