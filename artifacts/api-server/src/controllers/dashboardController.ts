import type { RequestHandler } from "express";
import type { ApiResponse, DashboardData } from "@workspace/shared";
import { AppError } from "../utils/appError";
import { getDashboard } from "../services/dashboardService";

export const dashboard: RequestHandler = async (req, res) => { if (!req.user) throw new AppError(401, "Authentication required"); res.json({ success: true, data: await getDashboard(req.user.id), message: "Dashboard retrieved successfully" } satisfies ApiResponse<DashboardData>); };