import { Request, Response } from "express";
import { analyzeProject } from "../services/aiAnalysisService";

export const getAnalysis = async (req: Request, res: Response) => {
  const projectId = (req.query.projectId as string) ?? "default";
  const analysis = await analyzeProject(projectId);
  res.json(analysis);
};
