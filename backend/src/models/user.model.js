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
    const query = "SELECT id, name, email FROM users WHERE id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result[0]);
    });
  });
};
