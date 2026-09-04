import { prisma } from "@workspace/db";
import type {
  CreateProjectRequest,
  Project,
  ProjectOwner,
  UpdateProjectRequest,
} from "@workspace/shared";
import { AppError } from "../utils/appError";

const projectInclude = {
  owner: {
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
    },
  },
} as const;

type ProjectWithOwner = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: ProjectOwner;
};

const toProject = (project: ProjectWithOwner): Project => ({
  id: project.id,
  title: project.title,
  description: project.description,
  techStack: project.techStack,
  githubUrl: project.repoUrl,
  liveUrl: project.liveUrl,
  imageUrl: project.imageUrl,
  ownerId: project.ownerId,
  owner: project.owner,
  createdAt: project.createdAt.toISOString(),
  updatedAt: project.updatedAt.toISOString(),
});

const getProjectOrThrow = async (id: string): Promise<ProjectWithOwner> => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });

  if (!project) {
    throw new AppError(404, "Project not found");
  }

  return project;
};

const assertOwner = (project: ProjectWithOwner, ownerId: string) => {
  if (project.ownerId !== ownerId) {
    throw new AppError(403, "You can only manage your own projects");
  }
};

export const listProjects = async (ownerId: string): Promise<Project[]> => {
  const projects = await prisma.project.findMany({
    where: { ownerId },
    include: projectInclude,
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
  });

  return projects.map(toProject);
};

export const getProject = async (id: string, viewerId: string): Promise<Project> => {
  const project = await getProjectOrThrow(id);
  if (project.ownerId !== viewerId) {
    throw new AppError(403, "You can only view your own projects");
  }
  return toProject(project);
};

export const createProject = async (
  ownerId: string,
  input: CreateProjectRequest,
): Promise<Project> => {
  const project = await prisma.project.create({
    data: {
      ownerId,
      title: input.title,
      description: input.description,
      techStack: input.techStack,
      repoUrl: input.githubUrl ?? null,
      liveUrl: input.liveUrl ?? null,
      imageUrl: input.imageUrl ?? null,
    },
    include: projectInclude,
  });

  return toProject(project);
};

export const updateProject = async (
  id: string,
  ownerId: string,
  input: UpdateProjectRequest,
): Promise<Project> => {
  const existing = await getProjectOrThrow(id);
  assertOwner(existing, ownerId);

  const data: {
    title?: string;
    description?: string;
    techStack?: string[];
    repoUrl?: string | null;
    liveUrl?: string | null;
    imageUrl?: string | null;
  } = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.techStack !== undefined) data.techStack = input.techStack;
  if (input.githubUrl !== undefined) data.repoUrl = input.githubUrl;
  if (input.liveUrl !== undefined) data.liveUrl = input.liveUrl;
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;

  const project = await prisma.project.update({
    where: { id },
    data,
    include: projectInclude,
  });

  return toProject(project);
};

export const deleteProject = async (id: string, ownerId: string): Promise<void> => {
  const project = await getProjectOrThrow(id);
  assertOwner(project, ownerId);
  await prisma.project.delete({ where: { id } });
};