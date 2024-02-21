import jwt from "jsonwebtoken";
import config from "../config";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { DateTime } from "luxon";
import AsyncHandler from "../utils/asyncHandler";
import User from "../models/userModel";
import BadRequestError from "../Errors/badRequestError";
import Email from "../utils/Email";
import crypto from "crypto";
import { createRandomUsername } from "../utils/commons";

interface CustomRequest extends Request {
  currentUser?: any;
}

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

// Signup a new user and send verification link to their email
export const signup: RequestHandler = AsyncHandler(async (req, res, next) => {
  // Collect user's details
  const { name, email, password, confirmPassword } = req.body;

  // Check if password and confirmPassword is a match
  if (password !== confirmPassword)
    throw new BadRequestError(
      "Passwords do not match, please check and try again"
    );

  //   Check if user  exists and if user is active
  const existingUser: any = await User.findOne({ email });
  if (existingUser)
    throw new BadRequestError(
      "User email already exists, please try another email,"
    );

  const newUser = new User({
    name,
    email,
    password,
    role: "user",
    username: createRandomUsername(name, 12),
  });

  // Generate a verification token for the user
  const verificationToken = newUser.createVerificationToken();

  const url = `${config.APP_URL}/auth/email-verification/${verificationToken}`;

  await new Email(newUser, url).sendEmailVerification();

  //  Save the user to the database
  await newUser.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      message: "We sent a verification to your email address",
    },
  });
});

// Log in an existing user and Send welcome back mail after succesful login
export const login: RequestHandler = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email }).select(
    "+password +active"
  );
  if (!existingUser) throw new BadRequestError("Email or password incorrect");

  // Check if user has verified email
  if (!existingUser.isVerified)
    throw new BadRequestError(
      "We sent a verification to your email, please verify your email or proceed to resend verification."
    );

  // Check if user's account has been deactivated
  if (!existingUser.active)
    throw new BadRequestError(
      "Your account has been deactivated, please contact support"
    );

  // Check if password is correct
  const correctPassword = await existingUser.checkPassword(
    password,
    existingUser.password
  );

  if (!correctPassword)
    throw new BadRequestError("Email or password incorrect");

  await new Email(existingUser, "").welcomeBack();

  createSendToken(existingUser, 200, res);
});

// Re-send email verification link to user email
export const resendVerification: RequestHandler = AsyncHandler(
  async (req, res, next) => {
    const { email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      throw new BadRequestError(
        "Email does not exist, please proceed to signup"
      );

    const verificationToken = existingUser.createVerificationToken();

    const url = `${config.APP_URL}/auth/email-verification/${verificationToken}`;

    await new Email(existingUser, url).sendEmailVerification();

    await existingUser.save();

    res.status(200).json({
      status: "success",
      data: {
        message: "We sent a verification to your email",
      },
    });
  }
);

// Login a user after verifying their email and send welcome (new user) email
export const emailVerification: RequestHandler = AsyncHandler(
  async (req, res, next) => {
    const { token } = req.body;
    if (!token) throw new BadRequestError("Token is required");

    const verifiedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: verifiedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user)
      throw new BadRequestError("Invalid Token. Token may have expired.");

    if (user.isVerified)
      throw new BadRequestError(
        "User is already verified, please proceed to login"
      );

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await new Email(user, "").welcome();

    await user.save();

    createSendToken(user, 200, res);
  }
);

//Forgot password and send password reset link
export const forgotPassword: RequestHandler = AsyncHandler(
  async (req, res, next) => {
    const { email } = req.body;
    if (!email) throw new BadRequestError("Email is required");

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError("User with email not found");

    const passwordResetToken = existingUser.createPasswordResetToken();

    const url = `${config.APP_URL}/auth/email-verification/${passwordResetToken}`;

    await new Email(existingUser, url).sendForgotPassword();

    await existingUser.save();

    res.status(200).json({
      status: "success",
      data: {
        message: "A password reset link was sent to your email",
      },
    });
  }
);

// Reset password using email
export const resetPassword: RequestHandler = AsyncHandler(
  async (req, res, next) => {
    const { password, confirmPassword, token } = req.body;

    if (!password) throw new BadRequestError("Password is required");
    if (!confirmPassword)
      throw new BadRequestError("Confirm password is required");
    if (!token) throw new BadRequestError("Token is required");

    if (password !== confirmPassword)
      throw new BadRequestError(
        "Passwords do not match, please check and try again "
      );

    // Check if token is valid
    const verifiedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: verifiedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
      throw new BadRequestError("Token invalid. Token may have expired");

    user.password = password;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await new Email(user, "").sendPasswordResetSuccess();

    res.status(200).json({
      status: "success",
      data: {
        message: "Password reset successful",
      },
    });
  }
);

// Change user password
export const updatePassword = AsyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { password, newPassword, confirmNewPassword } = req.body;

    if (!password) throw new BadRequestError("Password is required");
    if (!newPassword) throw new BadRequestError("New password is required");
    if (!confirmNewPassword)
      throw new BadRequestError("Confirm password is required");
    if (newPassword !== confirmNewPassword)
      throw new BadRequestError("Passwords do not match");

    const { currentUser } = req;
    if (!currentUser)
      throw new BadRequestError("Invalid token, please login again.");

    const user = await User.findOne({ email: req.currentUser.email }).select(
      "+password"
    );
    if (!user) throw new BadRequestError("Invalid token, please log in again.");

    // check if old password is correct
    const passwordCheck = user.checkPassword(password, user.password);
    if (!passwordCheck) throw new BadRequestError("Password is incorrect");

    user.password = newPassword;
    user.passwordChangedAt = Date.now();

    await new Email(user, "").sendPasswordResetSuccess();

    await user.save();

    createSendToken(user, 200, res);
  }
);

// Send test email
export const sendTestEmail: RequestHandler = AsyncHandler(
  async (req, res, next) => {
    const user = {
      name: "Dola Agba",
      email: "dolabomi_enuzh@mailsac.com",
      username: "Dola Baba",
      slug: "dola-agba",
      role: "user",
    };

    // await new Email(user, "").welcomeBack();
    // await new Email(user, "").welcome();
    // await new Email(user, "").sendEmailVerification();
    // await new Email(user, "").sendPasswordResetSuccess();
    // await new Email(user, "").sendForgotPassword();

    res.status(200).json({
      status: "success",
      data: {
        message: "Test email sent succesfully.",
      },
    });
  }
);
