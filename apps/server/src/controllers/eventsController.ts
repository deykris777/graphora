import { Request, Response } from "express";
import { traceEventSchema } from "../validation/eventSchema";
import { ingestTraceEvent } from "../services/eventIngestionService";
import { getIO } from "../websocket";
import { getAnalyticsSnapshot } from "../services/analyticsService";

export const createEvent = async (req: Request, res: Response) => {
  const parsedResult = traceEventSchema.safeParse(req.body);
  if (!parsedResult.success) {
    return res.status(400).json({
      error: "Invalid event payload",
      issues: parsedResult.error.flatten()
    });
  }

  try {
    const parsed = parsedResult.data;
    const result = await ingestTraceEvent(parsed);
    const io = getIO();

    const metricsSnapshot = await getAnalyticsSnapshot(parsed.projectId);

    io.emit("traffic:event", {
      traceId: parsed.traceId,
      service: parsed.service.name,
      latency: parsed.metrics.latency,
      status: parsed.status,
      timestamp: parsed.timestamp ?? Date.now()
    });

    io.emit("services:update", result.service);
    io.emit("metrics:update", metricsSnapshot);

    if (result.alert) {
      io.emit("alerts:new", result.alert);
    }

    res.status(201).json({ traceId: parsed.traceId });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Ingestion error", error);
    res.status(500).json({ error: "Failed to ingest event" });
  }
};
