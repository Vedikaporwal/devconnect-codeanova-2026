import { prisma } from "@workspace/db";
import type { DashboardActivity, DashboardData } from "@workspace/shared";
import { discoverDevelopers } from "./discoveryService";

export const getDashboard = async (userId: string): Promise<DashboardData> => {
  const [projects, publishedBlogs, connections, endorsementsReceived, incomingPending, recentProjects, recentBlogs, recentConnections, recentEndorsements, suggestions, trendingBlogs] = await Promise.all([
    prisma.project.count({ where: { ownerId: userId } }),
    prisma.blogPost.count({ where: { authorId: userId, published: true } }),
    prisma.connection.count({ where: { status: "ACCEPTED", OR: [{ senderId: userId }, { receiverId: userId }] } }),
    prisma.endorsement.count({ where: { endorsedUserId: userId } }),
    prisma.connection.count({ where: { receiverId: userId, status: "PENDING" } }),
    prisma.project.findMany({ where: { ownerId: userId }, select: { id: true, title: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.blogPost.findMany({ where: { authorId: userId, published: true }, select: { id: true, title: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.connection.findMany({ where: { status: "ACCEPTED", OR: [{ senderId: userId }, { receiverId: userId }] }, select: { id: true, updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.endorsement.findMany({ where: { endorsedUserId: userId }, select: { id: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    discoverDevelopers({}),
    prisma.blogPost.findMany({ where: { published: true }, select: { id: true, title: true, slug: true, content: true, excerpt: true, published: true, authorId: true, createdAt: true, updatedAt: true, author: { select: { id: true, name: true, username: true, avatarUrl: true } } }, orderBy: [{ createdAt: "desc" }], take: 5 }),
  ]);
  const activity: DashboardActivity[] = [
    ...recentProjects.map((item) => ({ id: `project-${item.id}`, type: "PROJECT_CREATED" as const, label: `Project created: ${item.title}`, createdAt: item.createdAt.toISOString() })),
    ...recentBlogs.map((item) => ({ id: `blog-${item.id}`, type: "BLOG_PUBLISHED" as const, label: `Blog published: ${item.title}`, createdAt: item.createdAt.toISOString() })),
    ...recentConnections.map((item) => ({ id: `connection-${item.id}`, type: "CONNECTION_ACCEPTED" as const, label: "Connection accepted", createdAt: item.updatedAt.toISOString() })),
    ...recentEndorsements.map((item) => ({ id: `endorsement-${item.id}`, type: "ENDORSEMENT_RECEIVED" as const, label: "Skill endorsement received", createdAt: item.createdAt.toISOString() })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
  return { stats: { projects, publishedBlogs, connections, endorsementsReceived, incomingPending }, activity, suggestions: suggestions.filter((item) => item.id !== userId).slice(0, 6), trendingBlogs: trendingBlogs.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() })) };
};