import { Schema, model } from "mongoose";

const analyticsSchema = new Schema(
  {
    projectId: { type: String, required: true, index: true },
    bucket: { type: Date, required: true },
    requestCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    totalLatency: { type: Number, default: 0 },
    avgLatency: { type: Number, default: 0 },
    p95Latency: { type: Number, default: 0 },
    throughput: { type: Number, default: 0 }
  },
  { timestamps: true }
);

analyticsSchema.index({ projectId: 1, bucket: 1 }, { unique: true });

export const AnalyticsModel = model("Analytics", analyticsSchema);
