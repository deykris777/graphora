import { createServer } from "http";
import { connectDb } from "./config/db";
import { env } from "./config/env";
import { createApp } from "./app";
import { initSocket } from "./websocket";

const start = async () => {
  await connectDb();
  const app = createApp();
  const server = createServer(app);
  initSocket(server);

  app.get("/", (req, res) => {
    res.json({
      status: "ok",
      service: "Graphyn"
    });
  });

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Graphyn server running on port ${env.port}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", error);
  process.exit(1);
});
