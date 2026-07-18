import { AlertModel } from "../models/Alert";
import { TraceEventInput } from "../types/event";

const LATENCY_THRESHOLD = 500;

export const evaluateAlert = async (event: TraceEventInput) => {
  if (event.status === "error") {
    return AlertModel.create({
      projectId: event.projectId,
      traceId: event.traceId,
      serviceId: event.service.id,
      type: "error",
      severity: "high",
      message: `${event.service.name} reported an error`
    });
  }

  if (event.metrics.latency >= LATENCY_THRESHOLD) {
    return AlertModel.create({
      projectId: event.projectId,
      traceId: event.traceId,
      serviceId: event.service.id,
      type: "latency",
      severity: "medium",
      message: `${event.service.name} latency exceeded ${LATENCY_THRESHOLD}ms`
    });
  }

  return null;
};

export const listAlerts = async (projectId: string, limit = 30) => {
  return AlertModel.find({ projectId }).sort({ createdAt: -1 }).limit(limit).lean();
};
