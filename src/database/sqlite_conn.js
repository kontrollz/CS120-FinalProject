// connect to sqlite db
const Database = require('better-sqlite3');
const path = require('path');

// path to db file
const dbPath = path.join(__dirname, 'users_db.sqlite');

// create and export a single shared db instance
const db = new Database(dbPath);

module.exports = db;
