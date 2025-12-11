INSERT INTO users (email, username, password_hash, verification_token)
VALUES ($1, $2, $3, $4)
```  [oai_citation:1‡userModel.js](sediment://file_00000000cfbc71fdb67532194f6f7b1c)  

So we should:

1. Stop manually inserting into `users` with wrong columns / `?`.
2. Use the existing `addUser` / `findUserByEmail` helpers from `userModel`.  [oai_citation:2‡userMode.test.js](sediment://file_00000000ce8071f8b3b194e9cedc994c)  
3. Use Postgres placeholders (`$1`, `$2`, …).
4. Match `preferencesModel.js`, which now returns the value directly and throws `"Invalid preference name"` for bad columns.  [oai_citation:3‡preferencesModel.js](sediment://file_00000000707071f8bdbaba860d286771)  

Right now your `preferencesModel.js` looks good. The only thing causing the syntax error is the **test file**.

---

## Replace `src/models/preferencesModel.test.js` with this

```js
// src/models/preferencesModel.test.js
require('dotenv').config();
const pool = require('../database/connection');
const prefs = require('./preferencesModel');
const {
  addUser,
  findUserByEmail,
} = require('./userModel');

// Test user info
const email = 'prefs_jest_user@example.com';
const username = 'prefs_jestuser';
const password = 'secret123';
const verificationToken = 'prefs-jest-token';

let TEST_USER_ID;

beforeAll(async () => {
  // Create a test user using the real model
  await addUser(email, username, password, verificationToken);
  const user = await findUserByEmail(email);
  TEST_USER_ID = user.id;

  // Create a preferences row for that user
  await pool.query(
    `
      INSERT INTO preferences (user_id)
      VALUES ($1)
    `,
    [TEST_USER_ID]
  );
});

afterAll(async () => {
  // Clean up: delete prefs row and user, then close the pool
  await pool.query('DELETE FROM preferences WHERE user_id = $1', [TEST_USER_ID]);
  await pool.query('DELETE FROM users WHERE id = $1', [TEST_USER_ID]);
  await pool.end();
});

describe('preferences model', () => {
  test('updateUserPreference updates a boolean preference', async () => {
    await prefs.updateUserPreference(TEST_USER_ID, 'cloudcover', false);

    const val = await prefs.getUserPreference(TEST_USER_ID, 'cloudcover');
    // In Postgres, booleans come back as true/false
    expect(val).toBe(false);
  });

  test('updateUserPreference updates a string preference', async () => {
    await prefs.updateUserPreference(TEST_USER_ID, 'city', 'Boston');

    const val = await prefs.getUserPreference(TEST_USER_ID, 'city');
    expect(val).toBe('Boston');
  });

  test('invalid preference name throws an error', async () => {
    await expect(
      prefs.updateUserPreference(TEST_USER_ID, 'DROP TABLE users', true)
    ).rejects.toThrow('Invalid preference name');
  });
});