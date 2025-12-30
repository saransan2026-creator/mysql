// import express from "express";
// import type { Request, Response } from "express";
// import mysql from "mysql";
// import { db } from "../config/db.ts";
// import bcrypt from "bcryptjs";
// import { Messages } from "../utils/messages.ts";
// import { sendError,sendSuccess } from "../utils/response.ts";



// export class Authcontrol {

//   static async register(req: Request, res: Response) {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "Email & Password required" });

//     const checkSql = "SELECT email FROM users WHERE email = ?";

//     db.query(checkSql, [email], async (err, results: any[]) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({ message: "DB Error" });
//       }

//       if (results.length > 0) {
//         return res.status(409).json({ message: "Email already registered" });
//       }

//       const hashed = await bcrypt.hash(password, 10);
//       const insertSql =
//         "INSERT INTO users (email, password) VALUES (?, ?)";

//       db.query(insertSql, [email, hashed], (err2) => {
//         if (err2) {
//           console.log(err2);
//           return res.status(500).json({ message: "Insert failed" });
//         }

//         return res
//           .status(200)
//           .json({ message: "User registered successfully" });
//       });
//     });
//   }

//   static async login(req: Request, res: Response) {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "Email & Password required" });

//     const sql = "SELECT * FROM users WHERE email = ?";

//     db.query(sql, [email], async (err, results: any[]) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({ message: "DB Error" });
//       }

//       if (!results || results.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const user = results[0];
//       const isMatch = await bcrypt.compare(password, user.password);

//       if (!isMatch) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       return res.json({
//         message: "Login successful",
//         userId: user.id,
//         email: user.email
//       });
//     });
//   }
// }


import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../config/db.ts";
import { sendSuccess, sendError } from "../utils/response.ts";
import { Messages } from "../utils/messages.ts";

export class Authcontrol {

  // REGISTER
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password)
      return sendError(res, 400, Messages.REQUIRED_FIELDS);

    const checkSql = "SELECT email FROM users WHERE email = ?";

    db.query(checkSql, [email], async (err, results: any[]) => {
      if (err) return sendError(res, 500, Messages.DB_ERROR);

      if (results.length > 0)
        return sendError(res, 409, Messages.EMAIL_EXISTS);

      const hashed = await bcrypt.hash(password, 10);

      const insertSql =
        "INSERT INTO users (email, password) VALUES (?, ?)";

      db.query(insertSql, [email, hashed], (err2) => {
        if (err2) return sendError(res, 500, Messages.INSERT_FAILED);

        return sendSuccess(res, Messages.REGISTER_SUCCESS);
      });
    });
  }

  // LOGIN
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password)
      return sendError(res, 400, Messages.REQUIRED_FIELDS);

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results: any[]) => {
      if (err) return sendError(res, 500, Messages.DB_ERROR);

      if (!results || results.length === 0)
        return sendError(res, 404, Messages.USER_NOT_FOUND);

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return sendError(res, 401, Messages.INVALID_CREDENTIALS);

      return sendSuccess(res, Messages.LOGIN_SUCCESS, {
        email: user.email,
      });
    });
  }
}

