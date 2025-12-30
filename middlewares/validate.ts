import express, { type Request, type Response, type NextFunction } from "express";
import { Messages } from "../utils/messages.ts";
import { Regex } from "../utils/regex.ts";

export const validateAuth = (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
) => {
  const { email, password } = req.body;

  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

  if (!email || !password) {
    return res.status(400).json({
        message: Messages.REQUIRED_FIELDS,
    });
  }

  if (!Regex.EMAIL.test(email)) {
    return res.status(400).json({
      message: Messages.INVALID_EMAIL,
    });
  }

  if (!Regex.PASSWORD.test(password)) {
    return res.status(400).json({
      message: Messages.INVALID_PASSWORD,
        
    });
  }

  next();
};