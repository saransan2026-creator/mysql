import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../config/db";
import { sendSuccess, sendError } from "../utils/response";
import { Messages } from "../utils/messages";
import { Queries } from "../services/auth.Service";
import { StatusCode } from "../utils/statuscode";
import prisma from "../config/prisma";

// import { Request, Response } from "express";
// import prisma from "../config/prisma";
// import bcrypt from "bcrypt";
// import { sendError, sendSuccess } from "../utils/response";
// import { StatusCode, Messages } from "../constants";

export default class Authcontrol {

  // REGISTER
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, phone, location } = req.body;

      if (!email || !password || !name || !phone || !location)
        return sendError(res, StatusCode.BAD_REQUEST, Messages.REQUIRED_FIELDS, null);

      // Check email exists
      const exist = await prisma.user.findUnique({
        where: { email }
      });

      if (exist)
        return sendError(res, StatusCode.CONFLICT, Messages.EMAIL_EXISTS, null);

      const hashed = await bcrypt.hash(password, 10);

      // Create user + profile
      const user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          profile: {
            create: { name, phone, location }
          }
        },
        include: { profile: true }
      });

      return sendSuccess(res, Messages.REGISTER_SUCCESS, {
        id: user.id,
        email: user.email,
        profile: user.profile
      });

    } catch (err) {
      return sendError(res, StatusCode.SERVER_ERROR, Messages.DB_ERROR, err);
    }
  }

  // LOGIN
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return sendError(res, StatusCode.BAD_REQUEST, Messages.REQUIRED_FIELDS, null);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
      });

      if (!user)
        return sendError(res, StatusCode.NOT_FOUND, Messages.USER_NOT_FOUND, null);

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return sendError(res, StatusCode.UNAUTHORIZED, Messages.INVALID_CREDENTIALS, null);

      return sendSuccess(res, Messages.LOGIN_SUCCESS, {
        id: user.id,
        email: user.email,
        profile: user.profile
      });

    } catch (err) {
      return sendError(res, StatusCode.SERVER_ERROR, Messages.DB_ERROR, err);
    }
  }
}




