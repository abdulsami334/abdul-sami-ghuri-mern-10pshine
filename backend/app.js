import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import { db } from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Notes App API Running 🚀" });
});

export default app;
