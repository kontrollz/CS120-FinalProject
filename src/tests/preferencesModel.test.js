// src/models/preferencesModel.test.js

require('dotenv').config();
const pool = require('../database/connection');
const prefs = require('../models/preferencesModel');
const { addUser, findUserByEmail } = require('../models/userModel');

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