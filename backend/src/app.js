import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";
// import aiRoutes from "./routes/ai.routes.js";
// import errorHandler from "./middleware/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
// app.use("/api/ai", aiRoutes);

// app.use(errorHandler);

export default app;
