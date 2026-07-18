import { Router } from "express";
import { getLogs } from "../controllers/logsController";
import { requireAuth } from "../middleware/auth";

export const logsRoutes = Router();

logsRoutes.get("/", requireAuth(), getLogs);
