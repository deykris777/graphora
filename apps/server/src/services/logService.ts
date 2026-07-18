import { LogModel } from "../models/Log";
import { TraceEventInput } from "../types/event";

export const createLogEntry = async (event: TraceEventInput) => {
  const level = event.status === "error" ? "error" : "info";

  return LogModel.create({
    projectId: event.projectId,
    traceId: event.traceId,
    serviceId: event.service.id,
    level,
    message: `${event.service.name} handled ${event.metrics.method ?? "request"}`,
    timestamp: new Date(event.timestamp ?? Date.now())
  });
};

export const listLogs = async (projectId: string, limit = 50) => {
  return LogModel.find({ projectId }).sort({ createdAt: -1 }).limit(limit).lean();
};
