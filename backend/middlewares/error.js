
export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Ensure err is an instance of Error
  if (!(err instanceof Error)) {
    // If not, create a new Error object with the err message
    err = new Error(err);
  }

  // Set default message and status code
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle specific error types
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message).join(", ");
    return res.status(400).json({
      success: false,
      message: message,
    });
  }
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    return res.status(400).json({
      success: false,
      message: message,
    });
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    return res.status(400).json({
      success: false,
      message: message,
    });
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    return res.status(400).json({
      success: false,
      message: message,
    });
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    return res.status(400).json({
      success: false,
      message: message,
    });
  }

  // For other errors, handle as Internal Server Error
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};


export default ErrorHandler;