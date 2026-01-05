import express, { type Request, type Response, type NextFunction } from "express";
import { Messages } from "../Utils/Messages";
import { Regex } from "../Utils/Regex";

export const validateAuth = (
  req:  Request,
  res:  Response,
  next: NextFunction
) => {
  const { email, password,phone } = req.body;

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
  if (!Regex.PHONE_NUMBER.test(phone)) {
    return res.status(400).json({
      message: Messages.INVALID_PHONE,
    });
  }
  next();
};