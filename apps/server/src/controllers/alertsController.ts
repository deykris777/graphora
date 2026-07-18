import { Request, Response } from "express";
import { listAlerts } from "../services/alertService";

export const getAlerts = async (req: Request, res: Response) => {
  const projectId = (req.query.projectId as string) ?? "default";
  const alerts = await listAlerts(projectId);
  res.json(alerts);
};
