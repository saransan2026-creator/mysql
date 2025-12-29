// import express from "express";
// import mysql from "mysql";
// import db from "mysql"
// import bcrypt from "bcryptjs";
// const app = express();
// app.use(express.json());

// export class Authcontrol {
//     static async register() {
//         app.post("/register", async (req, res) => {
//             const { email, password } = req.body;

//             if (!email || !password)
//                 return res.status(400).json({ message: "Email & Password required" });

//             const checkSql = "SELECT email FROM users WHERE email = ?";

//             db.query(checkSql, [email], async (err, results) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).json({ message: "DB Error" });
//                 }

//                 if (results.length > 0) {
//                     return res.status(409).json({ message: "Email already registered" });
//                 }

//                 const hashed = await bcrypt.hash(password, 10);
//                 const insertSql = "INSERT INTO users (email, password) VALUES (?, ?)";

//                 db.query(insertSql, [email, hashed], (err2, _result) => {
//                     if (err2) {
//                         console.log(err2);
//                         return res.status(500).json({ message: "Insert failed" });
//                     }

//                     return res.status(200).json({ message: "User registered Successfully" });
//                 });
//             });
//         });
//     }
//     static async login() {
//         app.post("/login", (req, res) => {
//             const { email, password } = req.body;

//             if (!email || !password) {
//                 return res.status(400).json({ message: "Email & Password required" });
//             }

//             const sql = "SELECT * FROM users WHERE email = ?";

//             db.query(sql, [email], async (err, results) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).json({ message: "User Already exists" });
//                 }
//                 const rows = results as any[];

//                 if (!rows || rows.length === 0) {
//                     return res.status(404).json({ message: "User not found" });
//                 }

//                 const user = rows[0];
//                 const isMatch = await bcrypt.compare(password, user.password);

//                 if (!isMatch) {
//                     return res.status(401).json({ message: "Invalid credentials" });
//                 }

//                 return res.json({
//                     message: "Login successful",
//                     userId: user.id,
//                     email: user.email
//                 });
//             });
//         });
//     }
// }


import express from "express";
import type { Request, Response } from "express";
import mysql from "mysql";
import { db } from "../config/db.ts";
import bcrypt from "bcryptjs";



export class Authcontrol {

  static async register(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & Password required" });

    const checkSql = "SELECT email FROM users WHERE email = ?";

    db.query(checkSql, [email], async (err, results: any[]) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "DB Error" });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const hashed = await bcrypt.hash(password, 10);
      const insertSql =
        "INSERT INTO users (email, password) VALUES (?, ?)";

      db.query(insertSql, [email, hashed], (err2) => {
        if (err2) {
          console.log(err2);
          return res.status(500).json({ message: "Insert failed" });
        }

        return res
          .status(200)
          .json({ message: "User registered successfully" });
      });
    });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & Password required" });

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results: any[]) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "DB Error" });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      return res.json({
        message: "Login successful",
        userId: user.id,
        email: user.email
      });
    });
  }
}
