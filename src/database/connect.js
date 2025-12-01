// get connection to database
const db = require('./connection');

// get all users
async function getAllUsers() {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
}

// export the function so that we can use it in other files
module.exports = {
  getAllUsers
}