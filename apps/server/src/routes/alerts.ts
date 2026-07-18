import { Router } from "express";
import { getAlerts } from "../controllers/alertsController";
import { requireAuth } from "../middleware/auth";

export const alertsRoutes = Router();

alertsRoutes.get("/", requireAuth(), getAlerts);
