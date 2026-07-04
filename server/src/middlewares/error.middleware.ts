import { Request, Response, NextFunction } from "express";
import { env } from "@/config/env.js";
import ApiError from "@/utils/apiError.util.js";

export function globalErrorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const isCustomError = err instanceof ApiError;
  const statusCode = isCustomError ? err.statusCode : 500;
  const errorCode = isCustomError ? err.code : "INTERNAL_SERVER_ERROR";

  const message =
    isCustomError || env.NODE_ENV === "development"
      ? err.message
      : "An unexpected internal server error occurred.";

  if (env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      code: errorCode,
      message: message,
      timestamp: new Date().toISOString(),
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
}
