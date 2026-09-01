import bcrypt from "bcryptjs";
import { prisma } from "@workspace/db";
import type {
  LoginRequest,
  ProfileUpdateRequest,
  RegisterRequest,
  SafeUser,
} from "@workspace/shared";
import { AppError } from "../utils/appError";

const registrationSchema = {
  name: (value: string) => value.trim().length >= 2 && value.trim().length <= 80,
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value: string) => value.length >= 8 && value.length <= 128,
};

const toSafeUser = (user: {
  id: string;
  email: string;
  name: string;
  username: string;
  bio: string | null;
  headline: string | null;
  location: string | null;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}): SafeUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  username: user.username,
  bio: user.bio,
  headline: user.headline,
  location: user.location,
  avatarUrl: user.avatarUrl,
  githubUrl: user.githubUrl,
  linkedinUrl: user.linkedinUrl,
  portfolioUrl: user.portfolioUrl,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const createUsernameBase = (name: string, email: string): string => {
  const fromName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  const fromEmail = email.split("@")[0]?.replace(/[^a-z0-9]+/gi, "").toLowerCase().slice(0, 24);
  return (fromName || fromEmail || "builder").slice(0, 24);
};

const createUniqueUsername = async (name: string, email: string): Promise<string> => {
  const base = createUsernameBase(name, email);
  let candidate = base;
  let suffix = 2;

  while (await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } })) {
    candidate = `${base.slice(0, 25 - String(suffix).length)}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

export const registerUser = async (input: RegisterRequest): Promise<SafeUser> => {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);

  if (!registrationSchema.name(name)) {
    throw new AppError(400, "Name must be between 2 and 80 characters");
  }
  if (!registrationSchema.email(email)) {
    throw new AppError(400, "Enter a valid email address");
  }
  if (!registrationSchema.password(input.password)) {
    throw new AppError(400, "Password must be between 8 and 128 characters");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(409, "An account with that email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const username = await createUniqueUsername(name, email);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, username },
  });

  return toSafeUser(user);
};

export const authenticateUser = async (input: LoginRequest): Promise<SafeUser> => {
  const email = normalizeEmail(input.email);
  if (!registrationSchema.email(email) || !input.password) {
    throw new AppError(401, "Invalid email or password");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = user?.passwordHash
    ? await bcrypt.compare(input.password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  return toSafeUser(user);
};

export const getUserById = async (id: string): Promise<SafeUser> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(401, "Authentication required");
  }
  return toSafeUser(user);
};

export const updateUserProfile = async (
  id: string,
  input: ProfileUpdateRequest,
): Promise<SafeUser> => {
  const data: ProfileUpdateRequest = {};
  if (input.name !== undefined) data.name = input.name.trim();
  if (input.bio !== undefined) data.bio = input.bio;
  if (input.headline !== undefined) data.headline = input.headline;
  if (input.location !== undefined) data.location = input.location;
  if (input.avatarUrl !== undefined) data.avatarUrl = input.avatarUrl;
  if (input.githubUrl !== undefined) data.githubUrl = input.githubUrl;
  if (input.linkedinUrl !== undefined) data.linkedinUrl = input.linkedinUrl;
  if (input.portfolioUrl !== undefined) data.portfolioUrl = input.portfolioUrl;

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  return toSafeUser(user);
};