import type { RequestHandler, Response } from "express";
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  SafeUser,
} from "@workspace/shared";
import { authenticateUser, getUserById, registerUser } from "../services/userService";
import { AUTH_COOKIE_NAME, signAuthToken } from "../middleware/auth";
import { AppError } from "../utils/appError";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const setAuthCookie = (res: Response, user: SafeUser) => {
  res.cookie(AUTH_COOKIE_NAME, signAuthToken({ id: user.id, email: user.email }), cookieOptions);
};

export const register: RequestHandler = async (req, res) => {
  const user = await registerUser(req.body as RegisterRequest);
  setAuthCookie(res, user);
  const response: ApiResponse<SafeUser> = {
    success: true,
    data: user,
    message: "Account created successfully",
  };
  res.status(201).json(response);
};

export const login: RequestHandler = async (req, res) => {
  const user = await authenticateUser(req.body as LoginRequest);
  setAuthCookie(res, user);
  const response: ApiResponse<SafeUser> = {
    success: true,
    data: user,
    message: "Logged in successfully",
  };
  res.status(200).json(response);
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
  res.status(200).json({
    success: true,
    data: null,
    message: "Logged out successfully",
  });
};

export const me: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required");
  }

  const user = await getUserById(req.user.id);
  const response: ApiResponse<SafeUser> = {
    success: true,
    data: user,
    message: "Current user retrieved successfully",
  };
  res.status(200).json(response);
};