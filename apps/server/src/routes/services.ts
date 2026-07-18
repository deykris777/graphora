import { Router } from "express";
import { getServices } from "../controllers/servicesController";
import { requireAuth } from "../middleware/auth";

export const servicesRoutes = Router();

servicesRoutes.get("/", requireAuth(), getServices);
