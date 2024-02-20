import { NextFunction, Request, RequestHandler, Response } from "express";
import AsyncHandler from "../utils/asyncHandler";
import User from "../models/userModel";
import BadRequestError from "../Errors/badRequestError";

interface CustomRequest extends Request {
  currentUser?: any;
}

export const getCurrentUser = AsyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { currentUser } = req;

    const user = await User.findOne({ email: currentUser.email });
    if (!user) throw new BadRequestError("User not found");

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);

export const getAllUsers: RequestHandler = AsyncHandler(
  async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      data: {
        data: users,
      },
    });
  }
);

export const getUserById: RequestHandler = AsyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) throw new BadRequestError("User not found");

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);

export const getUserByEmail: RequestHandler = AsyncHandler(
  async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new BadRequestError("User not found");

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);

export const getUserByUsername: RequestHandler = AsyncHandler(
  async (req, res, next) => {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) throw new BadRequestError("User not found");

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);
