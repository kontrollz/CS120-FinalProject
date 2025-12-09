// connect to the database
const db = require('../database/connection.js');

const functions  = {
    async getUserPreference(user, preference) {
        const sql = "SELECT ?           \
                     FROM   preferences \
                     WHERE  user_id = ? ";
        return db.query(sql, [preference, user]);
    },

    async updateUserPreference(user, preference, value) {
        const sql = "UPDATE preferences \
                     SET    ?       = ? \
                     WHERE  user_id = ? ";
        return db.query(sql, [preference, value, user]);
    }
};

// EXPORT functions for use elsewhere
module.exports = functions;