import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import type { Server as HttpServer } from "node:http";
import { env } from "../config/env";
import { AUTH_COOKIE_NAME } from "../middleware/auth";

let io: Server | undefined;

const cookieValue = (header: string | undefined, name: string) => header?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);

export const initializeRealtime = (server: HttpServer) => {
  io = new Server(server, { cors: { origin: env.clientUrl ?? true, credentials: true } });
  io.use((socket, next) => {
    const token = cookieValue(socket.handshake.headers.cookie, AUTH_COOKIE_NAME);
    if (!token || !env.jwtSecret) return next(new Error("Authentication required"));
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      if (typeof payload === "string" || typeof payload.sub !== "string") return next(new Error("Authentication required"));
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error("Authentication required"));
    }
  });
  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.userId}`);
  });
  return io;
};

export const emitToUser = (userId: string, event: string, payload: unknown) => {
  io?.to(`user:${userId}`).emit(event, payload);
};
