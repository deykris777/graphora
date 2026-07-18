import { Request, Response } from "express";
import { buildTraceGraph, getTraceById, listTraces } from "../services/traceService";
import { getIO } from "../websocket";

export const getTraces = async (req: Request, res: Response) => {
  const projectId = (req.query.projectId as string) ?? "default";
  const traces = await listTraces(projectId);

  const enriched = traces.map((trace) => ({
    ...trace,
    graph: buildTraceGraph(trace)
  }));

  res.json(enriched);
};

export const replayTrace = async (req: Request, res: Response) => {
  const projectId = (req.query.projectId as string) ?? "default";
  const traceId = req.params.traceId;
  const trace = await getTraceById(projectId, traceId);

  if (!trace) {
    return res.status(404).json({ error: "Trace not found" });
  }

  const io = getIO();
  trace.spans.forEach((span) => {
    io.emit("trace:replay", {
      traceId: trace.traceId,
      spanId: span.spanId,
      service: span.service.name,
      latency: span.metrics.latency,
      status: span.status,
      timestamp: new Date(span.timestamp).getTime()
    });
  });

  return res.json({ replayed: trace.spans.length });
};
