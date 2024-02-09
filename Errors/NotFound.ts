import AppError from "../utils/appError";

const NotFound = (message: string = "Not found") => {
  throw new AppError(message, 404);
};

export default NotFound;
