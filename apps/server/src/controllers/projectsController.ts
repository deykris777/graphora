import { Request, Response } from "express";
import { ProjectModel } from "../models/Project";
import crypto from "crypto";

// Get all projects for the authenticated owner
export const getProjects = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).auth?.userId ?? "default_owner";
    const projects = await ProjectModel.find({ ownerId });
    res.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Create a new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Project name is required" });
    }

    const ownerId = (req as any).auth?.userId ?? "default_owner";
    const projectId = `proj_${crypto.randomBytes(8).toString("hex")}`;
    const apiKey = `gph_${crypto.randomBytes(16).toString("hex")}`;

    const project = new ProjectModel({
      projectId,
      name,
      ownerId,
      apiKey
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("Failed to create project", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

// Update an existing project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, apiKey } = req.body;
    const ownerId = (req as any).auth?.userId ?? "default_owner";

    const updateData: any = {};
    if (name) updateData.name = name;
    if (apiKey) updateData.apiKey = apiKey;

    const project = await ProjectModel.findOneAndUpdate(
      { projectId, ownerId },
      updateData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Failed to update project", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const ownerId = (req as any).auth?.userId ?? "default_owner";

    const project = await ProjectModel.findOneAndDelete({ projectId, ownerId });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Failed to delete project", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};
