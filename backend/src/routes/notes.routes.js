import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  pinNoteController,
  unpinNoteController,
  getNotesStatsController
} from "../controllers/notes.controller.js";

const router = express.Router();
router.get("/stats", auth, getNotesStatsController);
router.get("/", auth, getNotes);
router.post("/", auth, createNote);

router.get("/:id", auth, getNoteById);
router.put("/:id", auth, updateNote);
router.delete("/:id", auth, deleteNote);

router.put("/:id/pin", auth, pinNoteController);
router.put("/:id/unpin", auth, unpinNoteController);



export default router;
