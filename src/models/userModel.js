// get db connection
const db = require('../database/sqlite_conn');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // to generate token
const { json } = require('express');

// add user function
const addUser = (email, username, password) => {
    // hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // generate a random verification token
    const verificationToken = crypto.randomUUID();

    // prepare sql statement 
    const stmt = db.prepare(`
            INSERT INTO Users (email, username, password_hash, verification_token)
            VALUES (?, ?, ?, ?)
        `);

    // run sql stmt
    stmt.run(email, username, passwordHash, verificationToken);
    return verificationToken;

};

// is email unique -> boolean
const isEmailUnique = (email) => {
    // prepare sql statement
    const stmt = db.prepare("SELECT id FROM Users WHERE email = ?");

    // get first matching row
    const row = stmt.get(email);

    // return false if row exists, true otherwise
    return row ? false : true;
};


// is username unique -> boolean
const isUsernameUnique = (username) => {
    // prepare sql statement
    const stmt = db.prepare("SELECT id FROM Users WHERE username = ?");

    // get first matching row
    const row = stmt.get(username); 

    // return false if row exists, true otherwise
    return row ? false : true;
}

// find user by token
const verifyUser = (token) => {
    // find user by token
    const user = findUserByToken(token);

    if (!user) {
        return false;
    }
    // update db
    verifyUserInDB(user.id);

    return true;
};

// search db for a token match
const findUserByToken = (token) => {
    return db.prepare(`
                SELECT * FROM Users WHERE verification_token = ? 
            `).get(token);
};

// update user's 'verified' field to 1 (true) and set
// verification_token to null
const verifyUserInDB = (userId) => {
    return db.prepare(`
            UPDATE Users
            SET verified = 1, verification_token = null
            WHERE id = ? 
        `).run(userId);
};





module.exports = {
    addUser,
    isEmailUnique,
    isUsernameUnique,
    verifyUser
};