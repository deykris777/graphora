import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController";
import { requireAuth } from "../middleware/auth";

export const analyticsRoutes = Router();

analyticsRoutes.get("/", requireAuth(), getAnalytics);
