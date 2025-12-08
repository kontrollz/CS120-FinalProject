const path = require('path');
const userModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const tokenUtils = require('../utils/token.js');
const emailUtils = require('../utils/email.js')

// signup page - get, display page
const showSignup = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'signup.html'));
};

// signup page - post, sign user up
const userSignup = (req, res) => {
    try {
    // the request from frontend should have three things:
    // email, user, pass
    const {email, username, password} = req.body;

    // check if email and password are unique
    const credentialsAreUnique = userModel.isEmailUnique(email) && userModel.isUsernameUnique(username)
    if (!credentialsAreUnique) {
        return res.json({
            success: false,
            message: "Email and/or username taken!"
        });
    }

    // generate random token for confirmation email
    token = tokenUtils.generateToken();
    
    // add user to db
    userModel.addUser(email, username, password, token);

    // send confirmation email
    sendConfirmationEmail(email, username, token);

    // send success message and have frontend prompt user to check email
    return res.json({
        success: true, 
        message: "User successfully added to database. Awaiting email confirmation."
    });

    } catch (e) {
        return res.json({
            success: false, 
            error: e
        });
    }
};

// send email confirmation link to user's email
const sendConfirmationEmail = (email, username, token) => {

    const url = `http://localhost:8080/confirm/${token}`
    const subject = "Starview Email Confirmation";
    const html = `<h1> Hello, ${username}!</h1>
                  <p> Click <a href=${url}>here</a> to confirm your email.</p>`

    // create email options object 
    const mailOptions = emailUtils.createMailOptions(email, subject, html);

    // send email
    emailUtils.sendEmail(mailOptions);
}



// login page - get, display page
const showLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'login.html'));
};

// login page - post, log user in
const userLogin = async (req, res) => {
    const {username, password} = req.body;

    const user = userModel.findUserByUsername(username);

    // return failure message if username not found
    if (!user) {
        return res.json({
            success: false, 
            message: "username not found"
        });
    }

    // check if pass is valid
    const validPass = await bcrypt.compare(password, user.password_hash);

    // failure message if incorect password
    if (!validPass) {
        return res.json({
            success: false, 
            message: "incorrect password"
        });
    }

    // create session
    req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email
    }

    return res.json({
        success: true,
        message: "login successful!"
    })

};

// TODO: need to come back and make sure token has
//       expiration date, and that you don't rewrite 
//       db if user clicks link a second time

// confirm email logic
const confirmEmail = (req, res) => {
    const token = req.params.token;

    // ensure we have a token as a route parameter
    if (!token) {
        return res.json({
            success: false,
            message: "missing token"
        });
    }

    try {
        // find user in db, update 'verified' field
        if (userModel.verifyUser(token)) {
            return res.sendFile(path.join(__dirname, '../../public', 'confirmed.html'));
        } else {
            return res.json({
                success: false, 
                message: "Invalid/expired token"
            });
        }


    } catch (e) {
        console.error(e);
        return res.json({
            success: false, 
            error: e
        });
    }
};

// returns true if there exists a session
const checkSessionStatus = (req, res) => {
    if (req.session.user) {
        return res.json({
            loggedIn: true,
            user: req.session.user
        });
    } 

    return res.json({
        loggedIn: false
    });
};

// destroys session and browser cookie
const logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("error destroying session: ", error);
            return res.json({
                success: false,
                error: error
            });
        };

        res.clearCookie('connect.sid');
        return res.json({
            success: true,
            message: "logged out successfully!"        
        });
    });
}

// serve forgot-password.html page
const showForgotPasswordPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'forgot_password.html'));
};

// main logic for forgot-password route
const sendPasswordResetEmail = (req, res) => {
    try {
        const email = req.body.email;
        const user = userModel.findUserByEmail(email);
        const token = tokenUtils.generateToken();
        
        userModel.updatePasswordToken(user.id, token);

        sendPassResetEmail(user.email, user.username, token);

        // send success message and have frontend prompt user to check email
        return res.json({
            success: true, 
            message: "Reset password link sent!"
        });

    } catch (e) {
        return res.json({
            success: false,
            error: e
        });
    }


};

// send email confirmation link to user's email
const sendPassResetEmail = (email, username, token) => {
    const url = `http://localhost:8080/reset-password/${token}`
    const subject = "Starview Password Reset";
    const html = `<h1> Hello, ${username}!</h1>
                  <p> Click <a href=${url}>here</a> to reset your password.</p>`

    // create email options object
    const mailOptions = emailUtils.createMailOptions(email, subject, html);

    // send email
    emailUtils.sendEmail(mailOptions);
}



// serve reset-password.html page
const showResetPage = (req, res) => {
    // get token
    const token = req.params.token;

    // ensure we have a token as a route parameter
    if (!token) {
        return res.json({
            success: false,
            message: "missing token"
        });
    }

    // verify token matches
    try {
        // find user in db, update 'verified' field
        if (userModel.findUserByPasswordToken(token)) {
            return res.sendFile(path.join(__dirname, '../../public', 'reset_password.html'));
        } else {
            return res.json({
                success: false, 
                message: "Invalid/expired token"
            });
        }
    
    } catch (e) {
        console.error(e);
        return res.json({
            success: false, 
            error: e
        });
    }

};

const resetPassword = (req, res) => {
    // get token and password from request
    token = req.body.token;
    newPassword = req.body.password

    // find user by password_token
    user = userModel.findUserByPasswordToken(token);

    if (!user) {
        return res.json({
            success: false, 
            message: "Invalid/expired token"
        });
    }
    try {
        // update password
        userModel.updatePassword(token, newPassword);

        return res.json({
            success: true, 
            message: "successfully updated password in db"
        }); 

    } catch (e) {
        console.error(e);
        return res.json({
            success: false, 
            error: e
        });
    }
}



module.exports = {
    showSignup,
    userSignup,
    showLogin,
    userLogin,
    sendConfirmationEmail, 
    confirmEmail,
    checkSessionStatus,
    logout,
    showForgotPasswordPage, 
    showResetPage,
    sendPasswordResetEmail,
    resetPassword
}