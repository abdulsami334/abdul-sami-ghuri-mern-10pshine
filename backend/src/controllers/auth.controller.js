import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
  createUser,
  findUserByEmail,
  setResetToken,
  findUserByResetToken,
  updatePassword
} from "../models/user.model.js";

import { sendResetEmail } from "../utils/sendEmail.js";

/* ===================== SIGNUP ===================== */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    await createUser(name, email, hash);

    res.status(201).json({ message: "User created" });
  } catch (err) {
    next(err);
  }
};

/* ===================== LOGIN ===================== */
export const login = async (req, res, next) => {
  try {
    const user = await findUserByEmail(req.body.email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, 
        //email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

/* ===================== PROFILE ===================== */
// import { getUserById } from "../models/user.model.js";
// import { getUserNotesStats } from "../models/note.model.js";

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stats = await getUserNotesStats(userId);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      totalNotes: stats.totalNotes,
      pinnedNotes: stats.pinnedNotes
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


/* ===================== FORGOT PASSWORD (EMAIL) ===================== */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      // Security: don’t reveal user existence
      return res.json({ message: "If email exists, reset link sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await setResetToken(email, token, expiry);

    // 📧 SEND EMAIL
    await sendResetEmail(email, token);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    next(err);
  }
};

/* ===================== RESET PASSWORD ===================== */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and password required" });
    }

    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await updatePassword(user.id, hashed);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};
