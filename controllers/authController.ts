import jwt from "jsonwebtoken";
import config from "../config";
import { Response } from "express";
import { DateTime } from "luxon";

// Generate a token
const generateToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

// Create and send a token after successful login
const createSendToken = async (
  user: any,
  statusCode: number,
  res: Response
) => {
  const token = generateToken(user.id, user.email);

  user.lastLogin = DateTime.now().toISO();
  await user.save();

  res.status(200).json({
    status: "success",
    token,
    data: {
      data: user,
    },
  });
};

// Signup a new user and send confirmation to their email
