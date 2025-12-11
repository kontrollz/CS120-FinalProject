require('dotenv').config();
const pool = require('../database/connection');
const {
  addUser,
  isEmailUnique,
  isUsernameUnique,
  verifyUser,
  findUserByUsername,
  findUserByEmail,
  updatePasswordToken,
  updatePassword,
  findUserByPasswordToken,
} = require('./userModel'); // adjust path

describe('userModel integration', () => {
  const email = 'jest_user@example.com';
  const username = 'jestuser';
  const password = 'secret123';
  const verificationToken = 'jest-verification-token';

  afterAll(async () => {
    // clean up: delete the test user
    await pool.query('DELETE FROM users WHERE email = $1', [email]);
    await pool.end();
  });

  test('email and username are initially unique', async () => {
    const emailUnique = await isEmailUnique(email);
    const usernameUnique = await isUsernameUnique(username);
    expect(emailUnique).toBe(true);
    expect(usernameUnique).toBe(true);
  });

  test('addUser inserts a row and flips uniqueness', async () => {
    await addUser(email, username, password, verificationToken);

    const emailUnique = await isEmailUnique(email);
    const usernameUnique = await isUsernameUnique(username);
    expect(emailUnique).toBe(false);
    expect(usernameUnique).toBe(false);

    const userByUsername = await findUserByUsername(username);
    const userByEmail = await findUserByEmail(email);
    expect(userByUsername).toBeDefined();
    expect(userByEmail).toBeDefined();
    expect(userByUsername.id).toBe(userByEmail.id);
  });

  test('verifyUser sets verified=true and clears verification_token', async () => {
    const ok = await verifyUser(verificationToken);
    expect(ok).toBe(true);

    const user = await findUserByUsername(username);
    expect(user.verified).toBe(true);
    expect(user.verification_token).toBeNull();
  });

  test('password reset flow works', async () => {
    const user = await findUserByUsername(username);
    const token = 'jest-password-reset-token';

    await updatePasswordToken(user.id, token);

    const u2 = await findUserByPasswordToken(token);
    expect(u2).toBeDefined();
    expect(u2.id).toBe(user.id);

    await updatePassword(token, 'newPassword123');

    const u3 = await findUserByUsername(username);
    expect(u3.password_token).toBeNull();
    // you can optionally verify the hash with bcrypt.compare if you want
  });
});