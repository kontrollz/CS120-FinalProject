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
        const sql = "UPDATE users               \
                     SET    confirmed = TRUE    \
                     WHERE  user      = ?       ";
        return db.query(sql, [username]);
    }
};


// EXPORT functions for use elsewhere
module.exports = functions;