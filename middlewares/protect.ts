import { NextFunction, Request, RequestHandler, Response } from "express";
import AsyncHandler from "../utils/asyncHandler";
import BadRequestError from "../Errors/badRequestError";
import config from "../config";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

interface JWTPayload {
  id: string;
  email: string;
  iat: number;
}

interface CustomRequest extends Request {
  currentUser?: any;
}

const protect = AsyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Read the token and check if it exists
    let token: string;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      throw new BadRequestError("No authentication token");
    }

    //   Decode the JWT
    const decodedToken = jwt.verify(token, config.JWT_SECRET) as JWTPayload;

    //   Check if user exists
    const user = await User.findById(decodedToken.id).where({ active: true });
    if (!user)
      throw new BadRequestError("User no longer exists, please log in again");

    // Check if user changed password after token was issued
    const userChanged = user.changedPasswordAfter(decodedToken.iat);
    if (userChanged)
      throw new BadRequestError(
        "Password changed by user, please log in again"
      );

    req.currentUser = user;
    next();
  }
);
