import type { RequestHandler } from "express";
import type { ApiResponse, Endorsement, Skill, UserEndorsementsResponse, UserSkill } from "@workspace/shared";
import { z } from "zod";
import { addEndorsement, listEndorsements, removeEndorsement } from "../services/endorsementService";
import { addUserSkill, listSkills, listUserSkills, removeUserSkill } from "../services/skillService";
import { AppError } from "../utils/appError";

const uuid = z.string().uuid();
const parseId = (value: unknown, label: string) => { const result = uuid.safeParse(value); if (!result.success) throw new AppError(400, `Invalid ${label}`); return result.data; };
const currentUser = (req: Parameters<RequestHandler>[0]) => { if (!req.user) throw new AppError(401, "Authentication required"); return req.user.id; };

export const skills: RequestHandler = async (_req, res) => res.json({ success: true, data: await listSkills(), message: "Skills retrieved successfully" } satisfies ApiResponse<Skill[]>);
export const userSkills: RequestHandler = async (req, res) => res.json({ success: true, data: await listUserSkills(parseId(req.params.userId, "user ID")), message: "User skills retrieved successfully" } satisfies ApiResponse<UserSkill[]>);
export const addSkill: RequestHandler = async (req, res) => res.status(201).json({ success: true, data: await addUserSkill(currentUser(req), parseId(req.body?.skillId, "skill ID")), message: "Skill added to profile" } satisfies ApiResponse<UserSkill>);
export const deleteSkill: RequestHandler = async (req, res) => { await removeUserSkill(currentUser(req), parseId(req.params.skillId, "skill ID")); res.json({ success: true, data: null, message: "Skill removed from profile" }); };
export const endorsements: RequestHandler = async (req, res) => res.json({ success: true, data: await listEndorsements(parseId(req.params.userId, "user ID"), req.user?.id), message: "Endorsements retrieved successfully" } satisfies ApiResponse<UserEndorsementsResponse>);
export const add: RequestHandler = async (req, res) => res.status(201).json({ success: true, data: await addEndorsement(currentUser(req), parseId(req.params.userId, "user ID"), parseId(req.body?.skillId, "skill ID")), message: "Endorsement added" } satisfies ApiResponse<Endorsement>);
export const remove: RequestHandler = async (req, res) => { await removeEndorsement(currentUser(req), parseId(req.params.userId, "user ID"), parseId(req.params.skillId, "skill ID")); res.json({ success: true, data: null, message: "Endorsement removed" }); };