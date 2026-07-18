import { ServiceModel } from "../models/Service";
import { TraceEventInput } from "../types/event";
import { calculateAverage, calculateP95 } from "../utils/metrics";

const MAX_LATENCY_SAMPLES = 120;

export const upsertServiceMetrics = async (event: TraceEventInput) => {
  const existing = await ServiceModel.findOne({
    projectId: event.projectId,
    serviceId: event.service.id
  });

  if (!existing) {
    const created = await ServiceModel.create({
      projectId: event.projectId,
      serviceId: event.service.id,
      name: event.service.name,
      type: event.service.type,
      requestCount: 1,
      errorCount: event.status === "error" ? 1 : 0,
      totalLatency: event.metrics.latency,
      avgLatency: event.metrics.latency,
      p95Latency: event.metrics.latency,
      latencySamples: [event.metrics.latency],
      lastSeen: new Date(event.timestamp ?? Date.now())
    });

    return created;
  }

  existing.requestCount += 1;
  existing.errorCount += event.status === "error" ? 1 : 0;
  existing.totalLatency += event.metrics.latency;
  existing.latencySamples.push(event.metrics.latency);

  if (existing.latencySamples.length > MAX_LATENCY_SAMPLES) {
    existing.latencySamples = existing.latencySamples.slice(-MAX_LATENCY_SAMPLES);
  }

  existing.avgLatency = calculateAverage(existing.totalLatency, existing.requestCount);
  existing.p95Latency = calculateP95(existing.latencySamples);
  existing.lastSeen = new Date(event.timestamp ?? Date.now());

  await existing.save();

  return existing;
};

export const listServices = async (projectId: string) => {
  return ServiceModel.find({ projectId }).sort({ requestCount: -1 }).lean();
};
