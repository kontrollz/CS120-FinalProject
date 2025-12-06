const path = require('path');
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');

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

    // email and password are unique, proceed
    token = userModel.addUser(email, username, password);

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

const sendConfirmationEmail = (email, username, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const url = `http://localhost:8080/confirm/${token}`

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Starview Email Confirmation",
        html: `<h1> Hello, ${username}!</h1>
               <p> Click <a href=${url}>here</a> to confirm your email.</p>`
    }

    return transporter.sendMail(mailOptions);
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
            })
        }


    } catch (e) {
        console.error(e);
        return res.json({
            success: false, 
            error: e
        });
    }
};

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

module.exports = {
    showSignup,
    userSignup,
    showLogin,
    userLogin,
    sendConfirmationEmail, 
    confirmEmail,
    checkSessionStatus,
    logout
}