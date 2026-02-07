


import { updateProfileModel,getUserById } from "../models/user.model.js";
import { getNotesModel, } from "../models/note.model.js";
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stats = await getNotesModel(userId);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      totalNotes: stats.totalNotes || 0,
      pinnedNotes: stats.pinnedNotes || 0
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};




export const updateProfile = async (req, res) => {
  const { name } = req.body;

  await updateProfileModel(req.user.id, name);

  res.json({ message: "Profile updated" });
};

