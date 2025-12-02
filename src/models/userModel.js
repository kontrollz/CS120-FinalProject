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
const db = require('./connection');

// get all users
async function getAllUsers() {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
}

// add user
async function addUser(username, password, email) {
    let str = "INSERT INTO user (user, pass, email) \
               VALUES (" + username + ", " + password + ", " + email + ");"
    db.query(str)
}

// EXPORT functions for use elsewhere
module.exports = {
    getAllUsers,
    addUser
};