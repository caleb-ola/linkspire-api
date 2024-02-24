import { NextFunction, Request, RequestHandler, Response } from "express";
import AsyncHandler from "../utils/asyncHandler";
import User from "../models/userModel";
import BadRequestError from "../Errors/badRequestError";
import APIFeatures from "../utils/apiFeatures";

interface CustomRequest extends Request {
  currentUser?: any;
}

export const getCurrentUser = AsyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { currentUser } = req;

    const user = await User.findById(currentUser.id);
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

    const features = new APIFeatures(users, req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();

    const usersQuery = await features.query;

    res.status(200).json({
      status: "success",
      results: usersQuery.length,
      data: {
        data: usersQuery,
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
    if (!email) throw new BadRequestError("Email is required");

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

export const updateUserProfile: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { username, name, bio, gender } = req.body;

    const { currentUser } = req;

    const user = await User.findOne({ username: req.params.username });
    if (!user) throw new BadRequestError("User not found");

    if (username) user.username = username;
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;

    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);
