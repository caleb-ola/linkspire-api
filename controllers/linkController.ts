import { NextFunction, Request, RequestHandler, Response } from "express";
import BadRequestError from "../Errors/badRequestError";
import Link from "../models/linkModel";
import AsyncHandler from "../utils/asyncHandler";
import User from "../models/userModel";
import NotAuthorizedError from "../Errors/notAuthorizedError";

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
    await usr.save();

    res.status(200).json({
      status: "success",
      data: {
        message: "Link added successfully",
        data: newLink,
      },
    });
  }
);

export const getUserLinks: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { currentUser } = req;
    if (!currentUser) throw new BadRequestError("You are not logged in");

    const userLinks = await Link.find({ user: currentUser.id });

    res.status(200).json({
      status: "success",
      results: userLinks.length,
      data: {
        data: userLinks,
      },
    });
  }
);

export const getSingleUserLink: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { id } = req.params;
    const { currentUser } = req;
    if (!currentUser) throw new BadRequestError("You are not logged in");

    if (!currentUser.links.includes(id))
      throw new NotAuthorizedError("You can only view your links");

    const userLink = await Link.findById(id);
    if (!userLink) throw new BadRequestError("Link not found");

    res.status(200).json({
      status: "success",
      data: {
        data: userLink,
      },
    });
  }
);

export const updateLink: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { title, url, description } = req.body;
    const { id } = req.params;

    const { currentUser } = req;
    if (!currentUser) throw new BadRequestError("You are not logged in");
  }
);
