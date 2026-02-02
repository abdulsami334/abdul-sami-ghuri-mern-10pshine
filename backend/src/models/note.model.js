import { db } from "../config/db.js";

// Create note
export const createNoteModel = (userId, title, content) => {
  return new Promise((resolve, reject) => {
    const q =
      "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)";
    db.query(q, [userId, title, content], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get all notes of user
export const getNotesModel = (userId) => {
  return new Promise((resolve, reject) => {
    const q = "SELECT * FROM notes WHERE user_id = ?";
    db.query(q, [userId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get single note
export const getNoteByIdModel = (noteId, userId) => {
  return new Promise((resolve, reject) => {
    const q =
      "SELECT * FROM notes WHERE id = ? AND user_id = ?";
    db.query(q, [noteId, userId], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// Update note
export const updateNoteModel = (noteId, userId, title, content) => {
  return new Promise((resolve, reject) => {
    const q =
      "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?";
    db.query(q, [title, content, noteId, userId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Delete note
export const deleteNoteModel = (noteId, userId) => {
  return new Promise((resolve, reject) => {
    const q =
      "DELETE FROM notes WHERE id = ? AND user_id = ?";
    db.query(q, [noteId, userId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
