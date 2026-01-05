// import type { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import { sendSuccess, sendError } from "../Utils/Response";
// import { Messages } from "../Utils/Messages";
// import { StatusCode } from "../Utils/Statuscode";
// import { Authservice } from "../Services/AuthService";
// import { LoginSchema, RegisterSchema } from "../Utils/Schema";
// import { ZodError } from "zod";


// export default class Authcontrol {

//   // REGISTER
//   static async register(req: Request, res: Response) {
//     try {
//       const { email, password, name, phone, location } = req.body;
//       const validation = RegisterSchema.safeParse(req.body);
//       console.log(validation);
//       if (!validation.success) {
//         const zodError = validation.error as ZodError;
//         const errorMessages = zodError.map((err) => err.message).join(", ");
//         return sendError(res, StatusCode.BAD_REQUEST, errorMessages, null);
//       }
       



//       const exist = await Authservice.checkEmailExist(email);
//       if (exist)
//         return sendError(res, StatusCode.CONFLICT, Messages.EMAIL_EXISTS, null);

//       const hashed = await bcrypt.hash(password, 10);

//       const user = await Authservice.insertUser({
//         email,
//         password: hashed,
//         name,
//         phone,
//         location
//       });
//       return sendSuccess(res, Messages.REGISTER_SUCCESS,);
//     } catch (err) {
//       console.log(err);
//       return sendError(res, StatusCode.SERVER_ERROR, Messages.DB_ERROR, err);
//     }
//   }

//   // LOGIN
//   static async login(req: Request, res: Response) {
//     try {
//       const { email, password } = req.body;
//       const params = LoginSchema.parse(req.body);
//       if (!params)
//         return (StatusCode.BAD_REQUEST, null);

//       const user = await Authservice.findUser(email);

//       if (!user)
//         return sendError(res, StatusCode.UNAUTHORIZED, Messages.USER_NOT_FOUND, null);

//       const match = await bcrypt.compare(password, user.password);
//       if (!match)
//         return sendError(res, StatusCode.UNAUTHORIZED, Messages.INVALID_CREDENTIALS, null);

//       return sendSuccess(res, Messages.LOGIN_SUCCESS, {
//         id: user.id,
//         email: user.email,
//         profile: user.profile,
//       },
//       );
//     } catch (err) {
//       return sendError(res, StatusCode.SERVER_ERROR, Messages.DB_ERROR, err);
//     }
//   }

//   // UPDATE PROFILE 
//   static async updateProfile(req: Request, res: Response) {
//     try {
//       const userId = Number(req.query.userId);
//       const { name, phone, location, email } = req.body;

//       if (!name && !phone && !location && !email)
//         return sendError(res, StatusCode.BAD_REQUEST, Messages.NO_UPDATE_FIELDS, null);

//       const profile = await Authservice.updateProfile(Number(userId), {
//         email,
//         name,
//         phone,
//         location
//       });
//       const user = await Authservice.updateProfile(Number(userId), {
//         email,
//         name,
//       });
//       return sendSuccess(res, Messages.PROFILE_UPDATED, profile, user);
//     } catch {
//       return sendError(res, StatusCode.SERVER_ERROR, Messages.UPDATE_FAILED, null);
//     }
//   }

//   // DELETE USER
//   static async deleteUser(req: Request, res: Response) {
//     try {
//       const userId = Number(req.query.userId);

//       const profile = await Authservice.deleteUser(Number(userId));
//       return sendSuccess(res, Messages.USER_DELETED, profile);

//     } catch {
//       return sendError(res, StatusCode.SERVER_ERROR, Messages.DELETE_FAILED, null);
//     }
//   }

// }



import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { sendSuccess, sendError } from "../Utils/Response";
import { Messages } from "../Utils/Messages";
import { StatusCode } from "../Utils/Statuscode";
import { Authservice } from "../Services/AuthService";
import { LoginSchema, RegisterSchema} from "../Utils/Schema";
import { ZodError } from "zod";

export default class Authcontrol {

  // REGISTER
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, phone, location } = req.body;
      const data = RegisterSchema.parse(req.body);

      const exists = await Authservice.checkEmailExist(data.email);
      if (exists)
        return sendError(res, StatusCode.CONFLICT, Messages.EMAIL_EXISTS, null);

      const hashed = await bcrypt.hash(data.password, 10);

      const user = await Authservice.insertUser({
                email,
                password: hashed,
                name,
                phone,
               location
        });

      return sendSuccess(res, Messages.REGISTER_SUCCESS, null);

    } catch (err) {

      if (err instanceof ZodError) {
        return sendError(
          res,
          StatusCode.BAD_REQUEST,
          err.issues[0].message,
          null
        );
      }

      return sendError(res, StatusCode.SERVER_ERROR, Messages.DB_ERROR, err);
    }
  }

  // LOGIN
  static async login(req: Request, res: Response) {
    try {
      const data = LoginSchema.parse(req.body);

      const user = await Authservice.findUser(data.email);
      if (!user)
        return sendError(res, StatusCode.UNAUTHORIZED, Messages.USER_NOT_FOUND, null);

      const match = await bcrypt.compare(data.password, user.password);
      if (!match)
        return sendError(res, StatusCode.UNAUTHORIZED, Messages.INVALID_CREDENTIALS, null);

      return sendSuccess(res, Messages.LOGIN_SUCCESS, {
        id: user.id,
        email: user.email,
        profile: user.profile
      });

    } catch (err) {

      if (err instanceof ZodError)
        return sendError(res, StatusCode.BAD_REQUEST, err.issues[0].message, null);

      return sendError(res, StatusCode.SERVER_ERROR, Messages.DB_ERROR, err);
    }
  }

  // // UPDATE PROFILE (Query Param userId)
  // static async updateProfile(req: Request, res: Response) {
  //   try {
  //     const userId = Number(req.query.userId);

  //     if (!userId)
  //       return sendError(res, StatusCode.BAD_REQUEST, "userId is required", null);

  //     const data = UpdateSchema.parse(req.body);

  //     const profile = await Authservice.updateProfile(userId, data);

  //     return sendSuccess(res, Messages.PROFILE_UPDATED, profile);

  //   } catch (err) {

  //     if (err instanceof ZodError)
  //       return sendError(res, StatusCode.BAD_REQUEST, err.issues[0].message, null);

  //     return sendError(res, StatusCode.SERVER_ERROR, Messages.UPDATE_FAILED, err);
  //   }
  // }

  // DELETE USER
  static async deleteUser(req: Request, res: Response) {
    try {
      const userId = Number(req.query.userId);

      if (!userId)
        return sendError(res, StatusCode.BAD_REQUEST, "userId is required", null);

      await Authservice.deleteUser(userId);

      return sendSuccess(res, Messages.USER_DELETED, null);

    } catch (err) {
      return sendError(res, StatusCode.SERVER_ERROR, Messages.DELETE_FAILED, err);
    }
  }
}


