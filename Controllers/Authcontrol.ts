import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../config/db.ts";
import { sendSuccess, sendError } from "../utils/response.ts";
import { Messages } from "../utils/messages.ts";
import { Queries } from "../services/auth.Service.ts";

export class Authcontrol {

  // REGISTER
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password)
      return sendError(res, 400, Messages.REQUIRED_FIELDS);

    // const checkSql = "SELECT email FROM users WHERE email = ?";

    db.query(Queries.CHECK_EMAIL, [email], async (err, results: any[]) => {
      if (err) return sendError(res, 500, Messages.DB_ERROR);

      if (results.length > 0)
        return sendError(res, 409, Messages.EMAIL_EXISTS);

      const hashed = await bcrypt.hash(password, 10);

      // const insertSql ="INSERT INTO users (email, password) VALUES (?, ?)";

      db.query(Queries.INSERT_USER, [email, hashed], (err2) => {
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

    // const sql = "SELECT * FROM users WHERE email = ?";

    db.query(Queries.FIND_USER, [email], async (err, results: any[]) => {
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

