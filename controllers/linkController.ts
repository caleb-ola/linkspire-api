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

    res.status(201).json({
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

    const userLink = await Link.findOne({ _id: id, user: currentUser.id });
    if (!userLink) throw new BadRequestError("Link not found");

    res.status(200).json({
      status: "success",
      data: {
        data: userLink,
      },
    });
  }
);

export const updateUserLink: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { title, url, description } = req.body;
    const { id } = req.params;

    const { currentUser } = req;
    if (!currentUser) throw new BadRequestError("You are not logged in");

    const updatedLink = await Link.findOneAndUpdate(
      { _id: id, user: currentUser.id },
      {
        title,
        url,
        description,
      },
      {
        new: true,
      }
    );
    if (!updatedLink) throw new BadRequestError("Link not found");

    await updatedLink.save();

    res.status(200).json({
      status: "success",
      data: {
        data: updatedLink,
      },
    });
  }
);

export const deleteUserLink: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { id } = req.params;
    const { currentUser } = req;

    const deletedLink = await Link.findOneAndDelete({
      _id: id,
      user: currentUser.id,
    });
    if (!deletedLink) throw new BadRequestError("Link not found");

    res.status(204).json({
      status: "success",
    });
  }
);
