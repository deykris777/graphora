import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env";

let io: Server | null = null;
let activeConnections = 0;

/*
Example Socket Event: traffic:event
{
  "traceId": "trace_abc123",
  "service": "Auth Service",
  "latency": 42,
  "status": "success",
  "timestamp": 1715000000000
}
*/

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.corsOrigin,
      credentials: true
    },
    // Use polling for Vercel serverless compatibility
    transports: ["polling", "websocket"]
  });

  io.on("connection", (socket) => {
    activeConnections += 1;
    io?.emit("socket:stats", { connections: activeConnections });
    socket.emit("socket:ready", { ts: Date.now() });

    socket.on("disconnect", () => {
      activeConnections = Math.max(0, activeConnections - 1);
      io?.emit("socket:stats", { connections: activeConnections });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
