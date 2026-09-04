import { prisma } from "@workspace/db";
import type { Skill, UserSkill } from "@workspace/shared";
import { AppError } from "../utils/appError";

export const listSkills = async (): Promise<Skill[]> => prisma.skill.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } });

export const listUserSkills = async (userId: string): Promise<UserSkill[]> => {
  const rows = await prisma.userSkill.findMany({ where: { userId }, select: { createdAt: true, skill: { select: { id: true, name: true, slug: true } } }, orderBy: { createdAt: "asc" } });
  return rows.map(({ createdAt, skill }) => ({ ...skill, createdAt: createdAt.toISOString() }));
};

export const addUserSkill = async (userId: string, skillId: string): Promise<UserSkill> => {
  const skill = await prisma.skill.findUnique({ where: { id: skillId }, select: { id: true, name: true, slug: true } });
  if (!skill) throw new AppError(404, "Skill not found");
  const existing = await prisma.userSkill.findUnique({ where: { userId_skillId: { userId, skillId } } });
  if (existing) throw new AppError(409, "Skill is already on this profile");
  const row = await prisma.userSkill.create({ data: { userId, skillId }, select: { createdAt: true } });
  return { ...skill, createdAt: row.createdAt.toISOString() };
};

export const removeUserSkill = async (userId: string, skillId: string): Promise<void> => {
  const existing = await prisma.userSkill.findUnique({ where: { userId_skillId: { userId, skillId } } });
  if (!existing) throw new AppError(404, "Skill is not on this profile");
  await prisma.userSkill.delete({ where: { userId_skillId: { userId, skillId } } });
};