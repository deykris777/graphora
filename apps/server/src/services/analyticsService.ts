import { AnalyticsModel } from "../models/Analytics";
import { TraceEventInput } from "../types/event";
import { calculateAverage, calculateP95 } from "../utils/metrics";

const getBucketStart = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  return date;
};

export const updateAnalytics = async (event: TraceEventInput) => {
  const bucket = getBucketStart(event.timestamp ?? Date.now());

  const analytics = await AnalyticsModel.findOne({
    projectId: event.projectId,
    bucket
  });

  if (!analytics) {
    const created = await AnalyticsModel.create({
      projectId: event.projectId,
      bucket,
      requestCount: 1,
      errorCount: event.status === "error" ? 1 : 0,
      totalLatency: event.metrics.latency,
      avgLatency: event.metrics.latency,
      p95Latency: event.metrics.latency,
      throughput: 1
    });

    return created;
  }

  analytics.requestCount += 1;
  analytics.errorCount += event.status === "error" ? 1 : 0;
  analytics.totalLatency += event.metrics.latency;
  analytics.avgLatency = calculateAverage(analytics.totalLatency, analytics.requestCount);

  const samples = [analytics.p95Latency, event.metrics.latency];
  analytics.p95Latency = calculateP95(samples);
  analytics.throughput = analytics.requestCount;

  await analytics.save();
  return analytics;
};

export const listAnalytics = async (projectId: string, limit = 30) => {
  return AnalyticsModel.find({ projectId }).sort({ bucket: -1 }).limit(limit).lean();
};

export const getAnalyticsSnapshot = async (projectId: string) => {
  const latest = await AnalyticsModel.findOne({ projectId }).sort({ bucket: -1 }).lean();
  return (
    latest ?? {
      projectId,
      requestCount: 0,
      errorCount: 0,
      avgLatency: 0,
      p95Latency: 0,
      throughput: 0
    }
  );
};
