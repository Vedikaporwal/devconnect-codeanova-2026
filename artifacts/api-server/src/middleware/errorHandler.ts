import type { ErrorRequestHandler } from "express";
import { logger } from "../lib/logger";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  logger.error({ err: error, method: req.method, url: req.originalUrl }, "Unhandled request error");

  res.status(500).json({
    success: false,
    data: null,
    message: "An unexpected server error occurred",
  });
};