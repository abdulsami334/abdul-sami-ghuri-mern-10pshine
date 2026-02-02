import {
  createNoteModel,
  getNotesModel,
  getNoteByIdModel,
  updateNoteModel,
  deleteNoteModel
} from "../models/note.model.js";

// Create note
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    await createNoteModel(userId, title, content);
    res.status(201).json({ message: "Note created" });
  } catch (err) {
    next(err);
  }
};

// Get all notes
export const getNotes = async (req, res, next) => {
  try {
    const notes = await getNotesModel(req.user.id);
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

// Get single note
export const getNoteById = async (req, res, next) => {
  try {
    const note = await getNoteByIdModel(req.params.id, req.user.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
};

// Update note
export const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    await updateNoteModel(
      req.params.id,
      req.user.id,
      title,
      content
    );
    res.json({ message: "Note updated" });
  } catch (err) {
    next(err);
  }
};

// Delete note
export const deleteNote = async (req, res, next) => {
  try {
    await deleteNoteModel(req.params.id, req.user.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};
