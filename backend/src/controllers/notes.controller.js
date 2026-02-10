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
import logger from "../utils/logger.js";

/* CREATE */
export const createNote = async (req, res, next) => {
  try {
    logger.info(`Creating note for user ${req.user.id}`);

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    // IMPORTANT: result capture karo
    const result = await createNoteModel(req.user.id, title, content);

    logger.info("Note created successfully");

    // ID response me bhejo
    res.status(201).json({
      message: "Note created",
      id: result.insertId
    });

  } catch (err) {
    next(err);
  }
};

/* READ ALL */
export const getNotes = async (req, res, next) => {

  try {
      logger.info(`Fetching notes for user ${req.user.id}`);
    const notes = await getNotesModel(req.user.id);
      logger.info(`Fetched ${notes.length} notes for user ${req.user.id}`);
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
    logger.info(`Found note with ID ${req.params.id} for user ${req.user.id}`);
    res.json(note);
  } catch (err) {
    next(err);
  }
};

/* UPDATE */
export const updateNote = async (req, res, next) => {
  try {
     logger.info(`Updating note for user ${req.user.id}`);
    await updateNoteModel(
      req.params.id,
      req.user.id,
      req.body.title,
      req.body.content
    );
      logger.info("Note updated successfully");
    res.json({ message: "Note updated" });
  } catch (err) {
    next(err);
  }
};

/* DELETE */
/* DELETE */
export const deleteNote = async (req, res, next) => {
  try {
    logger.info(`Deleting note for user ${req.user.id}`);

    const result = await deleteNoteModel(req.params.id, req.user.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    logger.info("Note deleted successfully");

    res.status(200).json({
      message: "Note deleted successfully"
    });

  } catch (err) {
    next(err);
  }
};


/* PIN */
export const pinNoteController = async (req, res, next) => {
  try {
      logger.info(`Pinning note for user ${req.user.id}`);
    await pinNoteModel(req.params.id, req.user.id);
      logger.info("Note pinned successfully");
    res.json({ message: "Note pinned" });
  } catch (err) {
    next(err);
  }
};

/* UNPIN */
export const unpinNoteController = async (req, res, next) => {
  try {
      logger.info(`Unpinning note for user ${req.user.id}`);
    await unpinNoteModel(req.params.id, req.user.id);
      logger.info("Note unpinned successfully");
    res.json({ message: "Note unpinned" });
  } catch (err) {
    next(err);
  }
};


export const getNotesStatsController = async (req, res) => {
  try {
      logger.info(`Getting notes stats for user ${req.user.id}`);
    const stats = await getNotesStatsModel(req.user.id);
      logger.info("Notes stats retrieved successfully");
    res.json({
      totalNotes: stats.totalNotes || 0,
      pinnedNotes: stats.pinnedNotes || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
