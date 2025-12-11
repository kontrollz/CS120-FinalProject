// connect to the database
const db = require('../database/connection');

// whitelist of columns that can be updated/read
const VALID_PREFS = new Set([
    'cloudcover',
    'seeing',
    'transparency',
    'lifted_index',
    'rh2m',
    'wind10m',
    'temp2m',
    'prec_type',
    'city',
    'latitude',
    'longitude',
]);

function assertValidPref(preference) {
    if (!VALID_PREFS.has(preference)) {
        throw new Error('Invalid preference name');
    }
}

const functions  = {
    async getUserPreference(user, preference) {
        assertValidPref(preference);

        const sql = `
            SELECT ${preference}
            FROM   preferences
            WHERE  user_id = $1
        `;
        const result = await db.query(sql, [user]);

        // return just the value (matches your test expectations)
        return result.rows[0]?.[preference];
    },

    async updateUserPreference(user, preference, value) {
        assertValidPref(preference);

        const sql = `
            UPDATE preferences
            SET    ${preference} = $1
            WHERE  user_id       = $2
        `;
        await db.query(sql, [value, user]);
    }
};

// EXPORT functions for use elsewhere
module.exports = functions;