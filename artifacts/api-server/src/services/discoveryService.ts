import { prisma } from "@workspace/db";
import type { PublicDeveloper } from "@workspace/shared";

export const discoverDevelopers = async (filters: { search?: string; skill?: string; location?: string }): Promise<PublicDeveloper[]> => {
  const search = filters.search?.trim();
  const skill = filters.skill?.trim();
  const location = filters.location?.trim();
  const users = await prisma.user.findMany({
    where: {
      ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { username: { contains: search, mode: "insensitive" } }, { headline: { contains: search, mode: "insensitive" } }, { bio: { contains: search, mode: "insensitive" } }, { location: { contains: search, mode: "insensitive" } }] } : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(skill ? { userSkills: { some: { skill: { name: { contains: skill, mode: "insensitive" } } } } } : {}),
    },
    select: { id: true, name: true, username: true, avatarUrl: true, headline: true, bio: true, location: true, githubUrl: true, linkedinUrl: true, portfolioUrl: true, userSkills: { select: { skill: { select: { name: true } } }, orderBy: { createdAt: "asc" }, take: 8 }, projects: { select: { id: true, title: true, description: true, techStack: true, repoUrl: true, liveUrl: true, imageUrl: true }, orderBy: { createdAt: "desc" }, take: 6 } },
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    take: 50,
  });
  return users.map(({ userSkills, projects, ...user }) => ({ ...user, skills: userSkills.map(({ skill }) => skill.name), projects: projects.map(({ repoUrl, ...project }) => ({ ...project, githubUrl: repoUrl })) }));
};

export const getPublicDeveloper = async (id: string): Promise<PublicDeveloper | null> => {
  const users = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, username: true, avatarUrl: true, headline: true, bio: true, location: true, githubUrl: true, linkedinUrl: true, portfolioUrl: true, userSkills: { select: { skill: { select: { name: true } } }, orderBy: { createdAt: "asc" }, take: 8 }, projects: { select: { id: true, title: true, description: true, techStack: true, repoUrl: true, liveUrl: true, imageUrl: true }, orderBy: { createdAt: "desc" }, take: 6 } } });
  if (!users) return null;
  const { userSkills, projects, ...user } = users;
  return { ...user, skills: userSkills.map(({ skill }) => skill.name), projects: projects.map(({ repoUrl, ...project }) => ({ ...project, githubUrl: repoUrl })) };
};