// connect to the database
const db = require('./connection');

// get all users
async function getAllUsers() {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
}

console.log(getAllUsers);