import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { apiRoutes } from "./routes";
import { errorHandler, notFound } from "./middleware/error";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true
    })
  );
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", name: "graphyn" });
  });

  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
