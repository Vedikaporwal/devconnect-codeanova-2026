import type { RequestHandler } from "express";
import type { ApiResponse, NotificationsResponse } from "@workspace/shared";
import { z } from "zod";
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "../services/notificationService";
import { AppError } from "../utils/appError";

const userId = (req: Parameters<RequestHandler>[0]) => { if (!req.user) throw new AppError(401, "Authentication required"); return req.user.id; };
const notificationId = (value: unknown) => { const result = z.string().uuid().safeParse(value); if (!result.success) throw new AppError(400, "Invalid notification ID"); return result.data; };

export const list: RequestHandler = async (req, res) => res.json({ success: true, data: await listNotifications(userId(req)), message: "Notifications retrieved successfully" } satisfies ApiResponse<NotificationsResponse>);
export const markRead: RequestHandler = async (req, res) => { const updated = await markNotificationRead(userId(req), notificationId(req.params.id)); if (!updated) throw new AppError(404, "Notification not found"); res.json({ success: true, data: null, message: "Notification marked as read" }); };
export const markAllRead: RequestHandler = async (req, res) => { await markAllNotificationsRead(userId(req)); res.json({ success: true, data: null, message: "Notifications marked as read" }); };