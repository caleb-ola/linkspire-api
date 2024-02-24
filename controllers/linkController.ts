import { NextFunction, Request, RequestHandler, Response } from "express";
import BadRequestError from "../Errors/badRequestError";
import Link from "../models/linkModel";
import AsyncHandler from "../utils/asyncHandler";
import User from "../models/userModel";

interface CustomRequest extends Request {
  currentUser?: any;
}

export const createLink: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { title, url, description } = req.body;
    if (!url) throw new BadRequestError("url is required");

    const { currentUser } = req;
    if (!currentUser) throw new BadRequestError("You are not logged in");

    const usr = await User.findById(currentUser.id);
    if (!usr) throw new BadRequestError("User not found");

    const newLink = new Link({
      title,
      url,
      description,
      user: currentUser.id,
    });

    await newLink.save();

    usr.links.push(newLink.id);

    res.status(200).json({
      status: "success",
      data: {
        message: "Link added successfully",
        data: newLink,
      },
    });
  }
);
