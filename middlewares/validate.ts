// import express from "express";
// // import { Request, Response, NextFunction } from "express";
// import { Request, Response, NextFunction } from "express";


// export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and Password are required" });
//   }

//   if (!email.includes("@","com","net","org")) {
//     return res.status(400).json({ message: "Please enter a valid email" });
//   }

//   if (password.length < 6) {
//     return res.status(400).json({
//       message: "Password must be at least 6 characters long",
//     });
//   }

//   next();
// };


import express from "express";

const { Request, Response, NextFunction } = express;

export const validateAuth = (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required",
    });
  }

  if (!email.includes("@", "com", "net", "org","in")) {
    return res.status(400).json({
      message: "Please enter a valid email",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  next();
};
