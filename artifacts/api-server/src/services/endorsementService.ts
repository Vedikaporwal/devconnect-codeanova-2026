import { prisma } from "@workspace/db";
import type { Endorsement, UserEndorsementsResponse } from "@workspace/shared";
import { AppError } from "../utils/appError";
import { createNotification } from "./notificationService";

const userSelect = { id: true, name: true, username: true, avatarUrl: true, headline: true } as const;
const skillSelect = { id: true, name: true, slug: true } as const;
const toEndorsement = (value: { id: string; createdAt: Date; skill: Endorsement["skill"]; endorser: Endorsement["endorser"] }): Endorsement => ({ ...value, createdAt: value.createdAt.toISOString() });

export const listEndorsements = async (targetUserId: string, viewerId?: string): Promise<UserEndorsementsResponse> => {
  const rows = await prisma.endorsement.findMany({ where: { endorsedUserId: targetUserId }, select: { id: true, createdAt: true, skill: { select: skillSelect }, endorser: { select: userSelect } }, orderBy: { createdAt: "desc" } });
  const counts = new Map<string, { skill: Endorsement["skill"]; count: number; endorsedByViewer: boolean }>();
  for (const row of rows) { const current = counts.get(row.skill.id) ?? { skill: row.skill, count: 0, endorsedByViewer: false }; current.count += 1; current.endorsedByViewer ||= viewerId === row.endorser.id; counts.set(row.skill.id, current); }
  return { summaries: [...counts.values()], endorsements: rows.map(toEndorsement) };
};

export const addEndorsement = async (endorserId: string, endorsedUserId: string, skillId: string): Promise<Endorsement> => {
  if (endorserId === endorsedUserId) throw new AppError(400, "You cannot endorse yourself");
  const target = await prisma.user.findUnique({ where: { id: endorsedUserId }, select: { id: true } });
  if (!target) throw new AppError(404, "Developer not found");
  const targetSkill = await prisma.userSkill.findUnique({ where: { userId_skillId: { userId: endorsedUserId, skillId } }, select: { skill: { select: skillSelect } } });
  if (!targetSkill) throw new AppError(400, "That skill is not on the developer profile");
  const duplicate = await prisma.endorsement.findUnique({ where: { endorserId_endorsedUserId_skillId: { endorserId, endorsedUserId, skillId } } });
  if (duplicate) throw new AppError(409, "You have already endorsed this skill");
  const endorsement = toEndorsement(await prisma.endorsement.create({ data: { endorserId, endorsedUserId, skillId }, select: { id: true, createdAt: true, skill: { select: skillSelect }, endorser: { select: userSelect } } }));
  await createNotification({ recipientId: endorsedUserId, actorId: endorserId, type: "ENDORSEMENT", entityId: endorsement.id });
  return endorsement;
};

export const removeEndorsement = async (endorserId: string, endorsedUserId: string, skillId: string): Promise<void> => {
  const existing = await prisma.endorsement.findUnique({ where: { endorserId_endorsedUserId_skillId: { endorserId, endorsedUserId, skillId } } });
  if (!existing) throw new AppError(404, "Endorsement not found");
  await prisma.endorsement.delete({ where: { id: existing.id } });
};