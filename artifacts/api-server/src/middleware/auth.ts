import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AppError } from "../utils/appError";
import { env } from "../config/env";

export const AUTH_COOKIE_NAME = "devconnect_auth";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

const getJwtSecret = (): string => {
  if (!env.jwtSecret) {
    throw new AppError(500, "Authentication is not configured on the server");
  }
  return env.jwtSecret;
};

export const signAuthToken = (user: AuthenticatedUser): string =>
  jwt.sign({ sub: user.id, email: user.email }, getJwtSecret(), {
    expiresIn: "7d",
  });

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload === "string") {
      next();
      return;
    }

    const jwtPayload = payload as JwtPayload;
    if (typeof jwtPayload.sub !== "string" || typeof jwtPayload.email !== "string") {
      next();
      return;
    }

    req.user = { id: jwtPayload.sub, email: jwtPayload.email };
  } catch {
    req.user = undefined;
  }

  next();
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  next();
};