import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projectsController";

export const projectsRoutes = Router();

// Secure all endpoints with Clerk auth
projectsRoutes.use(requireAuth());

projectsRoutes.get("/", getProjects);
projectsRoutes.post("/", createProject);
projectsRoutes.put("/:projectId", updateProject);
projectsRoutes.delete("/:projectId", deleteProject);
