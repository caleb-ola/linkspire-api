interface AppErrorTypes {
  message: string;
  statusCode: number;
}

class AppError extends Error {
  public statusCode;
  public status;
  public isOerational;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error ";
    this.isOerational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
