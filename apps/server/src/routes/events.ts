import { Router } from "express";
import { createEvent } from "../controllers/eventsController";
import { requireApiKey } from "../middleware/auth";

export const eventsRoutes = Router();

eventsRoutes.post("/", requireApiKey, createEvent);
