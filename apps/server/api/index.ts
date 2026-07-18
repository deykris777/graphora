import { createServer } from "http";
import { connectDb } from "../src/config/db";
import { createApp } from "../src/app";
import { initSocket } from "../src/websocket";

let isDbConnected = false;

const app = createApp();
const server = createServer(app);
initSocket(server);

// Connect DB once (reused across warm invocations)
const ensureDb = async () => {
  if (!isDbConnected) {
    await connectDb();
    isDbConnected = true;
  }
};

export default async function handler(req: any, res: any) {
  await ensureDb();
  return app(req, res);
}
