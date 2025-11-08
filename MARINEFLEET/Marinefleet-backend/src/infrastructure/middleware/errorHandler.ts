// Error Handling Middleware

import { Request, Response, NextFunction } from "express";
import { AppError } from "../../core/errors/AppError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  // Default error
  console.error("Unexpected error:", err);
  res.status(500).json({
    message: "Internal server error",
    statusCode: 500,
  });
};


