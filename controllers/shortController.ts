import { RequestHandler } from "express";
import AsyncHandler from "../utils/asyncHandler";
import Short from "../models/shortsModel";
import { CustomRequest } from "../utils/types";
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
