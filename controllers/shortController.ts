import { CustomRequest } from "./../utils/types";
import { RequestHandler } from "express";
import AsyncHandler from "../utils/asyncHandler";
import Short from "../models/shortsModel";
import { generateUniqueShortUrl } from "../utils/casuals";
import BadRequestError from "../Errors/badRequestError";

export const createShort: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { destination, customAlias, addToLinks, title } = req.body;
    if (!destination) return new BadRequestError("Destination is required");

    const { currentUser } = req;

    const shortExist = await Short.findOne({
      destination,
      user: currentUser._id,
    });
    if (shortExist) {
      res.status(200).json({
        status: "success",
        data: {
          data: shortExist,
        },
      });
    } else {
      const newShort = new Short({
        destination,
        shortUrl: generateUniqueShortUrl(
          customAlias || currentUser.slug,
          currentUser._id.toString()
        ),
        title,
        addToLinks,
        user: currentUser._id,
      });
      await newShort.save();

      res.status(200).json({
        status: "success",
        data: {
          data: newShort,
        },
      });
    }
  }
);

export const getAllShorts: RequestHandler = AsyncHandler(
  async (req, res, next) => {
    const shorts = await Short.find();

    res.status(200).json({
      status: "success",
      results: shorts.length,
      data: {
        data: shorts,
      },
    });
  }
);

export const getShort: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { id } = req.params;

    const { currentUser } = req;

    const short = await Short.findOne({ _id: id, user: currentUser._id });
    if (!short) throw new BadRequestError("Shortened link not found");

    res.status(200).json({
      status: "success",
      data: {
        data: short,
      },
    });
  }
);

export const updateShort: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { id } = req.params;
    const { destination, title, customAlias, addToLinks } = req.body;
    const { currentUser } = req;

    const short = await Short.findOne({
      _id: id,
      user: currentUser._id,
    });
    if (!short) throw new BadRequestError("Shortened link not found.");

    short.destination = destination;
    short.title = title;
    short.addToLinks = addToLinks;

    short.save();

    res.status(200).json({
      status: "success",
      data: {
        data: short,
      },
    });
  }
);

export const deleteShort: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const { id } = req.params;

    const { currentUser } = req;

    const deleteShort = await Short.findOneAndDelete({
      _id: id,
      user: currentUser._id,
    });
    if (!deleteShort) throw new BadRequestError("Shortened link not found");

    res.status(204).json({
      status: "success",
    });
  }
);
