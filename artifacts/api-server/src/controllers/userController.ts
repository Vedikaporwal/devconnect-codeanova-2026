import type { RequestHandler } from "express";
import type { ApiResponse, ProfileUpdateRequest, SafeUser } from "@workspace/shared";
import { getUserById, updateUserProfile } from "../services/userService";
import { AppError } from "../utils/appError";

const optionalText = (value: unknown, maxLength: number): string | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value !== "string" || value.trim().length > maxLength) {
    throw new AppError(400, `Text fields must be at most ${maxLength} characters`);
  }
  return value.trim();
};

const optionalUrl = (value: unknown): string | null => {
  const normalized = optionalText(value, 500);
  if (!normalized) return null;
  try {
    const url = new URL(normalized);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
  } catch {
    throw new AppError(400, "Profile links must be valid HTTP or HTTPS URLs");
  }
  return normalized;
};

const parseProfileInput = (body: unknown): ProfileUpdateRequest => {
  if (!body || typeof body !== "object") {
    throw new AppError(400, "Profile data is required");
  }
  const input = body as Record<string, unknown>;
  const profile: ProfileUpdateRequest = {};

  if (input.name !== undefined) {
    if (
      typeof input.name !== "string" ||
      input.name.trim().length < 2 ||
      input.name.trim().length > 80
    ) {
      throw new AppError(400, "Name must be between 2 and 80 characters");
    }
    profile.name = input.name.trim();
  }
  if (input.bio !== undefined) profile.bio = optionalText(input.bio, 500);
  if (input.headline !== undefined) profile.headline = optionalText(input.headline, 120);
  if (input.location !== undefined) profile.location = optionalText(input.location, 120);
  if (input.avatarUrl !== undefined) profile.avatarUrl = optionalUrl(input.avatarUrl);
  if (input.githubUrl !== undefined) profile.githubUrl = optionalUrl(input.githubUrl);
  if (input.linkedinUrl !== undefined) profile.linkedinUrl = optionalUrl(input.linkedinUrl);
  if (input.portfolioUrl !== undefined) profile.portfolioUrl = optionalUrl(input.portfolioUrl);

  if (Object.keys(profile).length === 0) {
    throw new AppError(400, "At least one profile field is required");
  }

  return profile;
};

export const getMyProfile: RequestHandler = async (req, res) => {
  if (!req.user) throw new AppError(401, "Authentication required");
  const user = await getUserById(req.user.id);
  const response: ApiResponse<SafeUser> = {
    success: true,
    data: user,
    message: "Profile retrieved successfully",
  };
  res.status(200).json(response);
};

export const updateMyProfile: RequestHandler = async (req, res) => {
  if (!req.user) throw new AppError(401, "Authentication required");
  const user = await updateUserProfile(req.user.id, parseProfileInput(req.body));
  const response: ApiResponse<SafeUser> = {
    success: true,
    data: user,
    message: "Profile updated successfully",
  };
  res.status(200).json(response);
};