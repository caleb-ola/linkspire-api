import { NextFunction, Request, Response } from "express";
import multer from "multer";
import BadRequestError from "../Errors/badRequestError";
import { CustomRequest } from "../utils/types";
import sharp from "sharp";

// Handle image uploads
const multerStorage = multer.memoryStorage();

const multerFilter: any = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image"))
    cb(new BadRequestError("You are only allowed to upload an image"));

  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 5000000 },
});

export const uploadImage = upload.single("image");

// Resize user avatar
export const resizeUserAvatar = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    sharp(req.file.buffer).resize(2000, 1333);
  }
  next();
};

// Resize user banner image
export const resizeUserBanner = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    sharp(req.file.buffer).resize(1584, 396);
  }
  next();
};
