import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    projectId: { type: String, required: true, index: true },
    serviceId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    requestCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    totalLatency: { type: Number, default: 0 },
    avgLatency: { type: Number, default: 0 },
    p95Latency: { type: Number, default: 0 },
    latencySamples: { type: [Number], default: [] },
    lastSeen: { type: Date }
  },
  { timestamps: true }
);

serviceSchema.index({ projectId: 1, serviceId: 1 }, { unique: true });

export const ServiceModel = model("Service", serviceSchema);
