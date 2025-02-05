// const CustomAPIError = require("../errors/custom-error");
// const { StatusCodes } = require("http-status-codes");

// const errorHandlerMiddleware = (err, req, res, next) => {
//   if (err instanceof CustomAPIError) {
//     return res.status(err.statusCode).json({ msg: err.message });
//   }
//   return res
//     .status(StatusCodes.INTERNAL_SERVER_ERROR)
//     .send("Something went wrong try again later");
// };

// module.exports = errorHandlerMiddleware;

const CustomAPIError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong. Please try again later.";

  // Handle known custom errors
  if (err instanceof CustomAPIError) {
    return res.status(statusCode).json({ msg: message });
  }

  // Log full error details (useful for debugging in development)
  console.error(err);

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = Object.values(err.errors).map((item) => item.message).join(", ");
  }

  // Handle Mongoose duplicate key errors
  if (err.code && err.code === 11000) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
  }

  // Handle JWT Authentication Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Invalid token, authentication failed.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Token expired, please log in again.";
  }

  return res.status(statusCode).json({ msg: message });
};

module.exports = errorHandlerMiddleware;
