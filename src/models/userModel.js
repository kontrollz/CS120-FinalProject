// get db connection
const pool = require('../database/connection');
const bcrypt = require('bcrypt');

// add user function
const addUser = async (email, username, password, verificationToken) => {
    // hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // run sql statement 
    await pool.query(`
        INSERT INTO users (email, username, password_hash, verification_token)
        VALUES ($1, $2, $3, $4)
    `, [email, username, passwordHash, verificationToken]);

};

// is email unique -> boolean
const isEmailUnique = async (email) => {
    // run sql statement
    const result = await pool.query(
        `SELECT id FROM users WHERE email = $1`, 
        [email]
    );

    return result.rows.length === 0;


};


// is username unique -> boolean
const isUsernameUnique = async (username) => {
    // run sql statement
    const result = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
    );

    // return true if email not found in db
    return result.rows.length === 0;
}

// find user by token
const verifyUser = async (token) => {
    // find user by token
    const user = await findUserByVerificationToken(token);

    if (!user) {
        return false;
    }
    // update db
    await verifyUserInDB(user.id);

    return true;
};

// search db for a token match
const findUserByVerificationToken = async (token) => {
    const result = await pool.query(
        `SELECT * FROM users
         WHERE verification_token = $1`,
        [token]
    );

    return result.rows[0]; // undefined if not found
};

// search db for a username match
const findUserByUsername = async (username) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
    );

    return result.rows[0]; // undefined if not found
};

// search db for a email match
const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users
         WHERE email = $1`,
        [email]
    );
    
    return result.rows[0]; // undefined if not found
};

// update user's 'verified' field to TRUE and set
// verification_token to null
const verifyUserInDB = async (userId) => {
    await pool.query(`
            UPDATE users
            SET verified = TRUE, verification_token = NULL
            WHERE id = $1 
        `, [userId]);
};

// update user's password_token field
const updatePasswordToken = async (userId, token) => {
    await pool.query(`
        UPDATE users
        SET password_token = $1
        WHERE id = $2
    `, [token, userId]
    );
};

// updatePassword
const updatePassword = async (token, newPassword) => {
    // hash password
    const passwordHash = bcrypt.hashSync(newPassword, 10);

    // update password
    await pool.query(`
            UPDATE users
            SET password_hash = $1, password_token = NULL
            WHERE password_token = $2 
        `, [passwordHash, token]
    );
};

// find user by password_token
const findUserByPasswordToken = async (passwordToken) => {
    const result = await pool.query(`
            SELECT * FROM users
            WHERE password_token = $1
        `, [passwordToken]
    );

    return result.rows[0]; // undefined if not found
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