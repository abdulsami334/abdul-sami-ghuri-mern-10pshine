import { db } from "../config/db.js";

/* ---------------- CREATE ---------------- */
export const createNoteModel = (userId, title, content) => {
  return new Promise((resolve, reject) => {
    const q =
      "INSERT INTO notes (user_id, title, content, is_pinned) VALUES (?, ?, ?, false)";
    db.query(q, [userId, title, content], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

/* ---------------- READ ALL (PIN FIRST) ---------------- */
export const getNotesModel = (userId) => {
  return new Promise((resolve, reject) => {
    const q =
       `
      SELECT 
        COUNT(*) as totalNotes,
        SUM(is_pinned = 1) as pinnedNotes
      FROM notes
      WHERE user_id = ?
      `;
    db.query(q, [userId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

/* ---------------- READ ONE ---------------- */
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

/* ---------------- UPDATE ---------------- */
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

/* ---------------- DELETE ---------------- */
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

/* ---------------- PIN / UNPIN ---------------- */
export const pinNoteModel = (noteId, userId) => {
  return new Promise((resolve, reject) => {
    const q =
      "UPDATE notes SET is_pinned = true WHERE id = ? AND user_id = ?";
    db.query(q, [noteId, userId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const unpinNoteModel = (noteId, userId) => {
  return new Promise((resolve, reject) => {
    const q =
      "UPDATE notes SET is_pinned = false WHERE id = ? AND user_id = ?";
    db.query(q, [noteId, userId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
