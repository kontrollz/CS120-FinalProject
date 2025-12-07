// SQL for reference
// CREATE TABLE users (
//     id          INT             AUTO_INCREMENT PRIMARY KEY,
//     user        VARCHAR(25)     NOT NULL UNIQUE,
//     pass        VARCHAR(255)    NOT NULL,
//     update_at   TIMESTAMP       DEFAULT     CURRENT_TIMESTAMP
//                                 ON UPDATE   CURRENT_TIMESTAMP,
//     email       VARCHAR(254)    NOT NULL,
//     confirmed   BOOLEAN         NOT NULL 
//                                 DEFAULT FALSE,
//     created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
// );

// connect to the database
const db = require('../database/connection.js');

const functions = {
    // get all users
    async getAllUsers() {
      const [rows] = await db.query("SELECT * FROM users");
      return rows;
    },
    
    // add user
    async addUser(username, password, email) {
        const sql = "INSERT INTO users  (user, pass, email) \
                     VALUES             (?,    ?,    ?)";
        return db.query(sql, [username, password, email]);
    },
    
    // remove user
    async removeUser(username) {
        const sql = "DELETE FROM    users \
                     WHERE          user = ?";
        return db.query(sql, [username]);
    },

    // updates user to reflect a 'confirmed' email
    async setConfirmed(username) {
        const sql = "UPDATE users                           \
                     SET    confirmed = TRUE,               \
                            update_at = CURRENT_TIMESTAMP   \
                     WHERE  user      = ?                   ";
        return db.query(sql, [username]);
    },

    // updates username
    async updateUsername(oldUsername, newUsername) {
        const sql = "UPDATE users                           \
                     SET    user      = ?,                  \
                            update_at = CURRENT_TIMESTAMP   \
                     WHERE  user      = ?                   ";
        return db.query(sql, [newUsername, oldUsername]);
    },

    // updates password
    async updatePassword(username, password) {
        const sql = "UPDATE users                           \
                     SET    pass      = ?,                  \
                            update_at = CURRENT_TIMESTAMP   \
                     WHERE  user      = ?                   ";
        return db.query(sql, [password, username]);
    },

    // updates email
    async updateEmail(username, email) {
        const sql = "UPDATE users                           \
                     SET    email     = ?,                  \
                            update_at = CURRENT_TIMESTAMP   \
                     WHERE  user      = ?                   ";
        return db.query(sql, [email, username]);
    }
};


// EXPORT functions for use elsewhere
module.exports = functions;
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

// search db for a token match
const findUserByUsername= (username) => {
    return db.prepare(`
                SELECT * FROM Users WHERE username = ? 
            `).get(username);
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
    verifyUser,
    findUserByUsername
};
