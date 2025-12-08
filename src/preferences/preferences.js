// connect to the database
const db = require('../database/connection.js');

const functions  = {
    // // add a preference to user
    // async addUserPreference(preference, value) {
        
    // }    

    async getUserPreference(user, preference) {
        const sql = "SELECT ?           \
                     FROM   preferences \
                     WHERE  user_id = ? ";
        return db.query(sql, [preference, user]);
    }
};

// EXPORT functions for use elsewhere
module.exports = functions;