const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });


const createMailOptions = (email, subject, html) => {
    const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: html
        }
    return mailOptions
};

const sendEmail = (mailOptions) => {
    return transporter.sendMail(mailOptions);
}

module.exports = {
    createMailOptions,
    sendEmail
}