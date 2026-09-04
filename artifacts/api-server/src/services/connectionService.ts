import { prisma } from "@workspace/db";
import type { Connection, ConnectionsResponse } from "@workspace/shared";
import { AppError } from "../utils/appError";
import { createNotification } from "./notificationService";

const userSelect = { id: true, name: true, username: true, avatarUrl: true, headline: true } as const;
const include = { sender: { select: userSelect }, receiver: { select: userSelect } } as const;

const toConnection = (value: { id: string; senderId: string; receiverId: string; status: "PENDING" | "ACCEPTED" | "REJECTED"; createdAt: Date; updatedAt: Date; sender: Connection["sender"]; receiver: Connection["receiver"] }): Connection => ({ ...value, createdAt: value.createdAt.toISOString(), updatedAt: value.updatedAt.toISOString() });

const getConnection = async (id: string) => {
  const connection = await prisma.connection.findUnique({ where: { id }, include });
  if (!connection) throw new AppError(404, "Connection not found");
  return connection;
};

export const listConnections = async (userId: string): Promise<ConnectionsResponse> => {
  const [incoming, outgoing] = await Promise.all([
    prisma.connection.findMany({ where: { receiverId: userId }, include, orderBy: { createdAt: "desc" } }),
    prisma.connection.findMany({ where: { senderId: userId }, include, orderBy: { createdAt: "desc" } }),
  ]);
  const all = [...incoming, ...outgoing].map(toConnection);
  const accepted = all.filter((item) => item.status === "ACCEPTED");
  return { incoming: incoming.map(toConnection), outgoing: outgoing.map(toConnection), accepted, summary: { total: accepted.length, accepted: accepted.length, incomingPending: incoming.filter((item) => item.status === "PENDING").length, outgoingPending: outgoing.filter((item) => item.status === "PENDING").length } };
};

export const sendConnection = async (senderId: string, receiverId: string): Promise<Connection> => {
  if (senderId === receiverId) throw new AppError(400, "You cannot connect with yourself");
  const receiver = await prisma.user.findUnique({ where: { id: receiverId }, select: { id: true } });
  if (!receiver) throw new AppError(404, "Developer not found");
  const existing = await prisma.connection.findFirst({ where: { OR: [{ senderId, receiverId }, { senderId: receiverId, receiverId: senderId }] } });
  if (existing) throw new AppError(409, "A connection already exists between these developers");
  const connection = toConnection(await prisma.connection.create({ data: { senderId, receiverId }, include }));
  await createNotification({ recipientId: receiverId, actorId: senderId, type: "CONNECTION_REQUEST", entityId: connection.id });
  return connection;
};

export const updateConnection = async (id: string, userId: string, action: "ACCEPTED" | "REJECTED"): Promise<Connection> => {
  const connection = await getConnection(id);
  if (connection.receiverId !== userId) throw new AppError(403, "Only the receiver can update this request");
  if (connection.status !== "PENDING") throw new AppError(409, "This request is no longer pending");
  const updated = toConnection(await prisma.connection.update({ where: { id }, data: { status: action }, include }));
  if (action === "ACCEPTED") await createNotification({ recipientId: connection.senderId, actorId: userId, type: "CONNECTION_ACCEPTED", entityId: connection.id });
  return updated;
};

export const removeConnection = async (id: string, userId: string): Promise<void> => {
  const connection = await getConnection(id);
  if (connection.senderId !== userId && connection.receiverId !== userId) throw new AppError(403, "Only connection participants can remove this connection");
  await prisma.connection.delete({ where: { id } });
};