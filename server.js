// server.js
// entry-point to app

// load .env variables
require('dotenv').config();

// import packages
const express = require('express');
const db = require('./src/database/connection.js');
const userModel = require('./src/models/userModel.js');


console.log("server.js loaded requires successfully");

// TEST that db connection works
(async () => {
    try {
        const [rows] = await db.query('SELECT 1+1 AS result');
        console.log('DB OK:', rows);
    } catch (err) {
        console.error('DB ERROR:', err.message);
    }
})();

// TEST addUser and getAllUsers
(async () => {
    try {
        const result = await userModel.addUser("testuser", "testpass", "test@example.com");
        console.log("addUser OK:", result);
        
        const users = await userModel.getAllUsers();
        console.log("All users:", users);
    } catch (err) {
        console.error("DB ERROR:", err.message);
    }
})();

// create express app
const app = express();

// middleware
app.use(express.json());
app.use(express.static('public'));

// TODO: will eventually import and use routes


// testing
app.get('/', (req, res) => {
  res.send('hello world');
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
