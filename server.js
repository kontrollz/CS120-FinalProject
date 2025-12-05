// server.js
// entry-point to app

// load .env variables
require('dotenv').config();

// import packages
const express = require('express');
const db = require('./src/database/connection.js');
const authRouter = require('./src/routes/authRoutes.js')
const path = require('path');

// create express app
const app = express();

// middleware to parse json and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
