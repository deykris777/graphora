import { Request, Response } from "express";
import { listServices } from "../services/serviceService";

export const getServices = async (req: Request, res: Response) => {
  const projectId = (req.query.projectId as string) ?? "default";
  const services = await listServices(projectId);
  res.json(services);
};
