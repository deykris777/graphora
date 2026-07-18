import { io } from "socket.io-client";
import { env } from "../lib/env";
let socket = null;
export const getSocket = () => {
    if (!socket) {
        socket = io(env.socketUrl, {
            transports: ["websocket"],
            autoConnect: true
        });
    }
    return socket;
};
