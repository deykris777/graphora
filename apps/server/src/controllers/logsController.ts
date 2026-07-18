import { Request, Response } from "express";
import { listLogs } from "../services/logService";

export const getLogs = async (req: Request, res: Response) => {
  const projectId = (req.query.projectId as string) ?? "default";
  const logs = await listLogs(projectId);
  res.json(logs);
};
