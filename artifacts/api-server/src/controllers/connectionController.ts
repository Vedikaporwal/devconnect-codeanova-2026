import type { RequestHandler } from "express";
import type { ApiResponse, Connection, ConnectionsResponse } from "@workspace/shared";
import { z } from "zod";
import { listConnections, removeConnection, sendConnection, updateConnection } from "../services/connectionService";
import { AppError } from "../utils/appError";

const uuid = z.string().uuid();
const getId = (value: unknown, label: string) => { const result = uuid.safeParse(value); if (!result.success) throw new AppError(400, `Invalid ${label}`); return result.data; };
const userId = (req: Parameters<RequestHandler>[0]) => { if (!req.user) throw new AppError(401, "Authentication required"); return req.user.id; };

export const list: RequestHandler = async (req, res) => res.json({ success: true, data: await listConnections(userId(req)), message: "Connections retrieved successfully" } satisfies ApiResponse<ConnectionsResponse>);
export const create: RequestHandler = async (req, res) => res.status(201).json({ success: true, data: await sendConnection(userId(req), getId(req.params.userId, "user ID")), message: "Connection request sent" } satisfies ApiResponse<Connection>);
export const accept: RequestHandler = async (req, res) => res.json({ success: true, data: await updateConnection(getId(req.params.id, "connection ID"), userId(req), "ACCEPTED"), message: "Connection accepted" } satisfies ApiResponse<Connection>);
export const reject: RequestHandler = async (req, res) => res.json({ success: true, data: await updateConnection(getId(req.params.id, "connection ID"), userId(req), "REJECTED"), message: "Connection rejected" } satisfies ApiResponse<Connection>);
export const remove: RequestHandler = async (req, res) => { await removeConnection(getId(req.params.id, "connection ID"), userId(req)); res.json({ success: true, data: null, message: "Connection removed" }); };