// want to display pages
const path = require('path');

// login page
const showLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'login.html'));
}

// signup page
const showSignup = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'signup.html'));
}


module.exports = {
    showLogin,
    showSignup
}