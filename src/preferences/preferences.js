// connect to the database
const db = require('../database/connection.js');

const functions  = {
    // // add a preference to user
    // async addUserPreference(preference, value) {
        
    // }

    async getUserPreference(user, preference) {
        const sql = "SELECT ?"
    }
};

// EXPORT functions for use elsewhere
module.exports = functions;