// create a sqlite db for users (
// for development only - will use Helena's db once it's ready

// sqlite functions: 
// - exec() only for schema creation
// - run() for INSERT/UPDATE/DELETE
// - get() to fetch 1 row
// - all() to fetch multiple rows
// - prepare() to safely bind user inputs

const db = require('./sqlite_conn.js');

db.exec(`
CREATE TABLE IF NOT EXISTS Users(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    verified INTEGER DEFAULT 0,
    verification_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

console.log('Users table initialized');