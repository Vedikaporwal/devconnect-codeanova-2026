import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  logger.error({ err: error, method: req.method, url: req.originalUrl }, "Unhandled request error");

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      data: null,
      message: error.issues.map((issue) => `${issue.path.join(".") || "request"}: ${issue.message}`).join("; "),
    });
    return;
  }

  if (error instanceof Error && "statusCode" in error && typeof error.statusCode === "number") {
    res.status(error.statusCode).json({
      success: false,
      data: null,
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    data: null,
    message: "An unexpected server error occurred",
  });
};