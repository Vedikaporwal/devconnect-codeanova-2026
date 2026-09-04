import type { RequestHandler } from "express";
import type { ApiResponse, PublicDeveloper } from "@workspace/shared";
import { discoverDevelopers, getPublicDeveloper } from "../services/discoveryService";
import { AppError } from "../utils/appError";

export const discover: RequestHandler = async (req, res) => {
  const developers = await discoverDevelopers({
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    skill: typeof req.query.skill === "string" ? req.query.skill : undefined,
    location: typeof req.query.location === "string" ? req.query.location : undefined,
  });
  res.json({ success: true, data: developers, message: "Developers retrieved successfully" } satisfies ApiResponse<PublicDeveloper[]>);
};

export const publicProfile: RequestHandler = async (req, res) => {
  const developer = await getPublicDeveloper(req.params.id);
  if (!developer) throw new AppError(404, "Developer not found");
  res.json({ success: true, data: developer, message: "Developer profile retrieved successfully" } satisfies ApiResponse<PublicDeveloper>);
};