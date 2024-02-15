import jwt from "jsonwebtoken";
import config from "../config";
import { RequestHandler, Response } from "express";
import { DateTime } from "luxon";
import AsyncHandler from "../utils/asyncHandler";
import User from "../models/userModel";
import BadRequestError from "../Errors/badRequestError";
import Email from "../utils/Email";

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
export const signup: RequestHandler = AsyncHandler(async (req, res, next) => {
  // Collect user's details
  const { name, email, password, confirmPassword } = req.body;

  // Check if password and confirmPassword is a match
  if (password !== confirmPassword)
    throw new BadRequestError(
      "Passwords do not match, please check and try again"
    );

  // Check if user still exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new BadRequestError();

  const newUser = new User({
    name,
    email,
    password,
    role: "user",
  });

  // Generate a verification token for the user
  const verificationToken = newUser.createVerificationToken();

  const url = `${req.protocol}//:${req.get(
    "host"
  )}/auth/email-verification/${verificationToken}`;

  await new Email(newUser, url).sendEmailVerification();

  //  Save the user to the database
  await newUser.save();

  res.status(200).json({
    status: "success",
    message: "We sent a confirmation code to your email address",
  });
});
