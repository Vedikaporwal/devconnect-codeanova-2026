import { prisma } from "@workspace/db";
import type { Notification as NotificationDto, NotificationsResponse, NotificationType } from "@workspace/shared";
import { emitToUser } from "../lib/realtime";

const actorSelect = { id: true, name: true, username: true, avatarUrl: true, headline: true } as const;
type NotificationWithActor = { id: string; type: "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED" | "ENDORSEMENT"; entityId: string | null; read: boolean; createdAt: Date; actor: NotificationDto["actor"] };

const toNotification = (item: NotificationWithActor): NotificationDto => ({ ...item, createdAt: item.createdAt.toISOString() });

export const createNotification = async (input: { recipientId: string; actorId: string; type: NotificationType; entityId?: string | null }) => {
  if (input.recipientId === input.actorId) return null;
  const item = await prisma.notification.create({ data: { recipientId: input.recipientId, actorId: input.actorId, type: input.type, entityId: input.entityId ?? null }, select: { id: true, type: true, entityId: true, read: true, createdAt: true, actor: { select: actorSelect } } });
  const notification = toNotification(item);
  emitToUser(input.recipientId, "notification:new", notification);
  return notification;
};

export const listNotifications = async (recipientId: string): Promise<NotificationsResponse> => {
  const [items, unreadCount] = await Promise.all([
    prisma.notification.findMany({ where: { recipientId }, select: { id: true, type: true, entityId: true, read: true, createdAt: true, actor: { select: actorSelect } }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.notification.count({ where: { recipientId, read: false } }),
  ]);
  return { items: items.map(toNotification), unreadCount };
};

export const markNotificationRead = async (recipientId: string, id: string) => {
  const result = await prisma.notification.updateMany({ where: { id, recipientId }, data: { read: true } });
  return result.count > 0;
};

export const markAllNotificationsRead = async (recipientId: string) => {
  await prisma.notification.updateMany({ where: { recipientId, read: false }, data: { read: true } });
};
