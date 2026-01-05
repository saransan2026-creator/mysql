import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { sendSuccess, sendError } from "../Utils/Response";
import { Messages } from "../Utils/Messages";
import { StatusCode } from "../Utils/statuscode";
import { authService } from "../Services/AuthService";


export default class Authcontrol {

  // REGISTER
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, phone, location } = req.body;

      if (!email || !password || !name || !phone || !location)
        return sendError(res, StatusCode.BAD_REQUEST, Messages.REQUIRED_FIELDS, null);

      // Check email exists
      const exist = await authService.CHECK_EMAIL_EXISTS(email);

      if (exist)
        return sendError(res, StatusCode.CONFLICT, Messages.EMAIL_EXISTS, null);

      const hashed = await bcrypt.hash(password, 10);

      // Create user + profile
      const user = await authService.INSERT_USER({
        email,
        password: hashed,
        name,
        phone,
        location
      });
      return sendSuccess(res, Messages.REGISTER_SUCCESS, {});
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

      const user = await authService.FIND_UESER(email);

      if (!user)
        return sendError(res, StatusCode.NOT_FOUND, Messages.USER_NOT_FOUND, null);

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return sendError(res, StatusCode.UNAUTHORIZED, Messages.INVALID_CREDENTIALS, null);

      return sendSuccess(res, Messages.LOGIN_SUCCESS, {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
      
    );
    } catch (err) {
      return sendError(res, StatusCode.SERVER_ERROR, Messages.DB_ERROR, err);
    }
  }

 // UPDATE PROFILE 
 static async updateProfile(req: Request, res: Response) {
  try {
    const  userId  = Number(req.query.userId);
    const { name, phone, location,email } = req.body;

    if (!name && !phone && !location && !email)
      return sendError(res, StatusCode.BAD_REQUEST, Messages.NO_UPDATE_FIELDS,null);

    const profile = await authService.UPDATE_PROFILE(Number(userId), {
      email,
      name,
      phone,
      location
    });
    const user = await authService.UPDATE_PROFILE(Number(userId), {
      email,
      name,
});
    return sendSuccess(res, Messages.PROFILE_UPDATED, profile,user);
  } catch {
    return sendError(res, StatusCode.SERVER_ERROR, Messages.UPDATE_FAILED, null);
  }
}

// DELETE USER
static async deleteUser(req: Request, res: Response) {
  try {
    const  userId  = Number(req.query.userId);

    const profile = await authService.DELETE_USER(Number(userId));
    return sendSuccess(res, Messages.USER_DELETED, profile);

  } catch {
    return sendError(res, StatusCode.SERVER_ERROR, Messages.DELETE_FAILED, null);
  }
}

}


