import { io, Socket } from "socket.io-client";
import { env } from "../lib/env";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(env.socketUrl, {
      transports: ["websocket"],
      autoConnect: true
    });
  }
  return socket;
};
