import { Router } from "express";
import { getAnalysis } from "../controllers/analysisController";
import { requireAuth } from "../middleware/auth";

export const analysisRoutes = Router();

analysisRoutes.get("/", requireAuth(), getAnalysis);
