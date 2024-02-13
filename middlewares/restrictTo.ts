import { NextFunction, Request, Response } from "express";
import NotAuthorizedError from "../Errors/notAuthorizedError";

interface CustomRequest extends Request {
  currentUser?: any;
}

const restrictTo = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser.role)) {
      throw new NotAuthorizedError(
        "You are not authorized to perform this action"
      );
    }
    next();
  };
};

export default restrictTo;
