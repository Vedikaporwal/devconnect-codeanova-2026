import type { RequestHandler } from "express";
import type { ApiResponse } from "@workspace/shared";
import { getHealth } from "../services/healthService";

export const getHealthStatus: RequestHandler = (_req, res) => {
  const response: ApiResponse<ReturnType<typeof getHealth>> = {
    success: true,
    data: getHealth(),
    message: "DevConnect API is running",
  };

  res.status(200).json(response);
};