// SQL for reference
// CREATE TABLE user (
//     id          INT             AUTO_INCREMENT PRIMARY KEY,
//     user        VARCHAR(25)     NOT NULL UNIQUE,
//     pass        VARCHAR(255)    NOT NULL,
//     update_at   TIMESTAMP       DEFAULT     CURRENT_TIMESTAMP
//                                 ON UPDATE   CURRENT_TIMESTAMP,
//     email       VARCHAR(254)    NOT NULL,
//     created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
// );

// connect to the database
const db = require('../database/connection.js');

// get all users
async function getAllUsers() {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
}

// add user
async function addUser(username, password, email) {
    const sql = "INSERT INTO user (user, pass, email) VALUES (?, ?, ?)";
    return db.query(sql, [username, password, email]);
}

// EXPORT functions for use elsewhere
module.exports = {
    getAllUsers,
    addUser
};