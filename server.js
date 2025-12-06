// server.js
// entry-point to app

// load .env variables
require('dotenv').config();

// import packages
const express = require('express');
const authRouter = require('./src/routes/authRoutes.js')
const path = require('path');
const session = require('express-session');


// create express app
const app = express();

// middleware to parse json and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware to set up sessions (for when users log in)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}))

// serve static files from 'public' folder. Without this,
// browser doesn't know where to find the linked CSS and JS 
// files inside our html
app.use(express.static(path.join(__dirname, 'public')));

// use auth routes
app.use('/', authRouter);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
