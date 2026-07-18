import { Router } from "express";
import { getTraces, replayTrace } from "../controllers/tracesController";
import { requireAuth } from "../middleware/auth";

export const tracesRoutes = Router();

tracesRoutes.get("/", requireAuth(), getTraces);
tracesRoutes.get("/:traceId/replay", requireAuth(), replayTrace);
