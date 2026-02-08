import {
  createNoteModel,
  getNotesModel,
  getNoteByIdModel,
  updateNoteModel,
  deleteNoteModel,
  pinNoteModel,
  unpinNoteModel,
  getNotesStatsModel
} from "../models/note.model.js";

/* CREATE */
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    await createNoteModel(req.user.id, title, content);
    res.status(201).json({ message: "Note created" });
  } catch (err) {
    next(err);
  }
};

/* READ ALL */
export const getNotes = async (req, res, next) => {
  try {
    const notes = await getNotesModel(req.user.id);
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

/* READ ONE */
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

/* UPDATE */
export const updateNote = async (req, res, next) => {
  try {
    await updateNoteModel(
      req.params.id,
      req.user.id,
      req.body.title,
      req.body.content
    );
    res.json({ message: "Note updated" });
  } catch (err) {
    next(err);
  }
};

/* DELETE */
export const deleteNote = async (req, res, next) => {
  try {
    await deleteNoteModel(req.params.id, req.user.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};

/* PIN */
export const pinNoteController = async (req, res, next) => {
  try {
    await pinNoteModel(req.params.id, req.user.id);
    res.json({ message: "Note pinned" });
  } catch (err) {
    next(err);
  }
};

/* UNPIN */
export const unpinNoteController = async (req, res, next) => {
  try {
    await unpinNoteModel(req.params.id, req.user.id);
    res.json({ message: "Note unpinned" });
  } catch (err) {
    next(err);
  }
};


export const getNotesStatsController = async (req, res) => {
  try {
    const stats = await getNotesStatsModel(req.user.id);

    res.json({
      totalNotes: stats.totalNotes || 0,
      pinnedNotes: stats.pinnedNotes || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
