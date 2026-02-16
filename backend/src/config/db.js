import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();


export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
  
});

console.log(
  process.env.DB_HOST,
  process.env.DB_USER,
  process.env.DB_PASS === "" ? "(empty password)" : "(has password)"
);

db.connect(err => {
  if (err) console.log("DB error", err);
  else console.log("DB connected");
});