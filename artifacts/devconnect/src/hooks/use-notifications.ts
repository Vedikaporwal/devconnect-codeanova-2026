import { useEffect } from "react";
import { io } from "socket.io-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Notification, NotificationsResponse } from "@workspace/shared";
import { notificationsApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export const notificationsQueryKey = ["notifications"] as const;
export const useNotifications = () => {
  const client = useQueryClient();
  const enabled = useAuthStore((state) => state.isAuthenticated);
  const query = useQuery({ queryKey: notificationsQueryKey, queryFn: notificationsApi.list, enabled, staleTime: 15_000, retry: 1 });
  useEffect(() => {
    if (!enabled) return;
    const socketUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || undefined;
    const socket = io(socketUrl, { withCredentials: true, transports: ["websocket", "polling"] });
    const handleNotification = (notification: Notification) => {
      client.setQueryData<NotificationsResponse>(notificationsQueryKey, (current) => ({ items: [notification, ...(current?.items ?? [])].slice(0, 50), unreadCount: (current?.unreadCount ?? 0) + 1 }));
    };
    socket.on("notification:new", handleNotification);
    return () => { socket.off("notification:new", handleNotification); socket.disconnect(); };
  }, [client, enabled]);
  return query;
};

export const useNotificationMutations = () => {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: notificationsQueryKey });
  return { markRead: useMutation({ mutationFn: notificationsApi.markRead, onSuccess: refresh }), markAllRead: useMutation({ mutationFn: notificationsApi.markAllRead, onSuccess: refresh }) };
};