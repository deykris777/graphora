import { Request, Response } from "express";
import { listAnalytics } from "../services/analyticsService";

export const getAnalytics = async (req: Request, res: Response) => {
  const projectId = (req.query.projectId as string) ?? "default";
  const analytics = await listAnalytics(projectId);
  res.json(analytics);
};
