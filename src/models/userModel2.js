// get db connection
const db = require('../database/sqlite_conn');
const bcrypt = require('bcrypt');

// add user function
const addUser = (email, username, password, verificationToken) => {
    // hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // prepare sql statement 
    const stmt = db.prepare(`
            INSERT INTO Users (email, username, password_hash, verification_token)
            VALUES (?, ?, ?, ?)
        `);

    // run sql stmt
    stmt.run(email, username, passwordHash, verificationToken);
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
    const user = findUserByVerificationToken(token);

    if (!user) {
        return false;
    }
    // update db
    verifyUserInDB(user.id);

    return true;
};

// search db for a token match
const findUserByVerificationToken = (token) => {
    return db.prepare(`
                SELECT * FROM Users WHERE verification_token = ? 
            `).get(token);
};

// search db for a token match
const findUserByUsername = (username) => {
    return db.prepare(`
                SELECT * FROM Users WHERE username = ? 
            `).get(username);
};

// search db for a token match
const findUserByEmail = (email) => {
    return db.prepare(`
                SELECT * FROM Users WHERE email = ? 
            `).get(email);
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

// update user's password_token field
const updatePasswordToken = (userId, token) => {
    return db.prepare(`
            UPDATE Users
            SET password_token = ?
            WHERE id = ? 
        `).run(token, userId);
};

// updatePassword
const updatePassword = (token, newPassword) => {
    // hash password
    const passwordHash = bcrypt.hashSync(newPassword, 10);

    // update password
    return db.prepare(`
            UPDATE Users
            SET password_hash = ?, password_token = null
            WHERE password_token = ? 
        `).run(passwordHash, token);

};

// find user by password_token
const findUserByPasswordToken = (passwordToken) => {
    return db.prepare(`
                SELECT * FROM Users WHERE password_token = ? 
            `).get(passwordToken);
}


module.exports = {
    addUser,
    isEmailUnique,
    isUsernameUnique,
    verifyUser,
    findUserByUsername,
    findUserByEmail,
    updatePasswordToken,
    updatePassword,
    findUserByPasswordToken
};