// import AppError from "./appError";

import AppError from "./appError";

// const NotFound = (message: string = "Not found") => {
//   throw new AppError(message, 404);
// };

// export default NotFound;

class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(message, 404);
  }
}
export default NotFoundError;
