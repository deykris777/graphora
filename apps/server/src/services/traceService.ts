import { TraceModel } from "../models/Trace";
import { TraceEventInput } from "../types/event";

export const upsertTraceSpan = async (event: TraceEventInput) => {
  const rootSpanId = event.parentSpanId ? event.parentSpanId : event.spanId;
  const trace = await TraceModel.findOne({
    projectId: event.projectId,
    traceId: event.traceId
  });

  if (!trace) {
    return TraceModel.create({
      projectId: event.projectId,
      traceId: event.traceId,
      rootSpanId,
      spans: [
        {
          spanId: event.spanId,
          parentSpanId: event.parentSpanId ?? null,
          service: event.service,
          metrics: event.metrics,
          status: event.status,
          timestamp: new Date(event.timestamp ?? Date.now())
        }
      ]
    });
  }

  trace.spans.push({
    spanId: event.spanId,
    parentSpanId: event.parentSpanId ?? null,
    service: event.service,
    metrics: event.metrics,
    status: event.status,
    timestamp: new Date(event.timestamp ?? Date.now())
  });

  await trace.save();
  return trace;
};

export const listTraces = async (projectId: string, limit = 20) => {
  return TraceModel.find({ projectId }).sort({ updatedAt: -1 }).limit(limit).lean();
};

export const getTraceById = async (projectId: string, traceId: string) => {
  return TraceModel.findOne({ projectId, traceId }).lean();
};

export const buildTraceGraph = (trace: { traceId: string; spans: any[] }) => {
  const spanById = new Map(trace.spans.map((span) => [span.spanId, span]));
  const depthCache = new Map<string, number>();

  const getDepth = (spanId: string): number => {
    if (depthCache.has(spanId)) {
      return depthCache.get(spanId) ?? 0;
    }
    const span = spanById.get(spanId);
    if (!span || !span.parentSpanId) {
      depthCache.set(spanId, 0);
      return 0;
    }
    const depth = getDepth(span.parentSpanId) + 1;
    depthCache.set(spanId, depth);
    return depth;
  };

  const depthBuckets = new Map<number, any[]>();
  trace.spans.forEach((span) => {
    const depth = getDepth(span.spanId);
    const bucket = depthBuckets.get(depth) ?? [];
    bucket.push(span);
    depthBuckets.set(depth, bucket);
  });

  const nodes = trace.spans.map((span) => {
    const depth = getDepth(span.spanId);
    const bucket = depthBuckets.get(depth) ?? [];
    const index = bucket.findIndex((item) => item.spanId === span.spanId);

    return {
    id: span.spanId,
    data: {
      label: span.service.name,
      latency: span.metrics.latency,
      status: span.status
    },
    position: {
      x: depth * 240,
      y: index * 90
    }
    };
  });

  const edges = trace.spans
    .filter((span) => span.parentSpanId)
    .map((span) => ({
      id: `${span.parentSpanId}-${span.spanId}`,
      source: span.parentSpanId,
      target: span.spanId,
      label: `${span.metrics.latency}ms`
    }));

  return { nodes, edges };
};
