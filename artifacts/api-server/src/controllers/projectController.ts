import type { RequestHandler } from "express";
import type {
  ApiResponse,
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
} from "@workspace/shared";
import { z } from "zod";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "../services/projectService";
import { AppError } from "../utils/appError";

const httpUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .refine(
    (value) => {
      try {
        return ["http:", "https:"].includes(new URL(value).protocol);
      } catch {
        return false;
      }
    },
    { message: "Only HTTP and HTTPS URLs are supported" },
  );

const optionalUrl = httpUrl.nullable().optional();

const techStack = z
  .array(z.string().trim().min(1, "Technology tags cannot be empty").max(40))
  .min(1, "Add at least one technology")
  .max(12, "Use 12 technologies or fewer")
  .transform((values) => Array.from(new Set(values)));

const createProjectSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(120),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000),
  techStack,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  imageUrl: optionalUrl,
});

const updateProjectSchema = createProjectSchema.partial();

const projectIdSchema = z.string().uuid("Invalid project ID");

const parseProjectId = (value: unknown): string => {
  const result = projectIdSchema.safeParse(value);
  if (!result.success) throw new AppError(400, "Invalid project ID");
  return result.data;
};

const response = (data: Project, message: string): ApiResponse<Project> => ({
  success: true,
  data,
  message,
});

export const listMyProjects: RequestHandler = async (req, res) => {
  if (!req.user) throw new AppError(401, "Authentication required");
  const projects = await listProjects(req.user.id);
  res.status(200).json({
    success: true,
    data: projects,
    message: "Projects retrieved successfully",
  } satisfies ApiResponse<Project[]>);
};

export const getMyProject: RequestHandler = async (req, res) => {
  if (!req.user) throw new AppError(401, "Authentication required");
  const project = await getProject(parseProjectId(req.params.id), req.user.id);
  res.status(200).json(response(project, "Project retrieved successfully"));
};

export const createMyProject: RequestHandler = async (req, res) => {
  if (!req.user) throw new AppError(401, "Authentication required");
  const input = createProjectSchema.parse(req.body) as CreateProjectRequest;
  const project = await createProject(req.user.id, input);
  res.status(201).json(response(project, "Project created successfully"));
};

export const updateMyProject: RequestHandler = async (req, res) => {
  if (!req.user) throw new AppError(401, "Authentication required");
  const input = updateProjectSchema.parse(req.body) as UpdateProjectRequest;
  if (Object.keys(input).length === 0) {
    throw new AppError(400, "At least one project field is required");
  }
  const project = await updateProject(parseProjectId(req.params.id), req.user.id, input);
  res.status(200).json(response(project, "Project updated successfully"));
};

export const deleteMyProject: RequestHandler = async (req, res) => {
  if (!req.user) throw new AppError(401, "Authentication required");
  await deleteProject(parseProjectId(req.params.id), req.user.id);
  res.status(200).json({
    success: true,
    data: null,
    message: "Project deleted successfully",
  });
};