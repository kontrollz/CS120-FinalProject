require('dotenv').config();
authController = require('./authController');


authController.sendConfirmationEmail('doylesaez4@gmail.com', 'kontrollz', 'token1234');
