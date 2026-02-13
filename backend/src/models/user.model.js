import { db } from "../config/db.js";

/**
 * Create new user
 */
export const createUser = (name, email, password) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(query, [name, email, password], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

/**
 * Find user by email
 */
export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";[email]

    db.query(query, [email], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result[0]); // single user
    });
  });
};

/**
 * Find user by ID
 */
export const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id, name, email, created_at FROM users WHERE id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result[0]);
    });
  });
};
export const setResetToken = (email, token, expiry) => {
  return new Promise((resolve, reject) => {
    const q = `
      UPDATE users 
      SET reset_token = ?, reset_token_expiry = ? 
      WHERE email = ?
    `;
    db.query(q, [token, expiry, email], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const findUserByResetToken = (token) => {
  return new Promise((resolve, reject) => {
    const q = `
      SELECT * FROM users 
      WHERE reset_token = ? 
      AND reset_token_expiry > NOW()`;
    db.query(q, [token], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

export const updatePassword = (userId, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const q = `
      UPDATE users 
      SET password = ?, reset_token = NULL, reset_token_expiry = NULL 
      WHERE id = ?
    `;
    db.query(q, [hashedPassword, userId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
export const updateProfileModel = (userId, name) => {
  return new Promise((resolve, reject) => {
    const q = "UPDATE users SET name = ? WHERE id = ?";
    db.query(q, [name, userId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, name, email, updated_at  FROM users WHERE id = ?",
      [id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      }
    );
  });
};