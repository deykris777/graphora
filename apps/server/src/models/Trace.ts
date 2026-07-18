import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }
  },
  { _id: false }
);

const metricsSchema = new Schema(
  {
    latency: { type: Number, required: true },
    method: String,
    path: String,
    statusCode: Number,
    size: Number
  },
  { _id: false }
);

const spanSchema = new Schema(
  {
    spanId: { type: String, required: true },
    parentSpanId: { type: String, default: null },
    service: { type: serviceSchema, required: true },
    metrics: { type: metricsSchema, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, required: true }
  },
  { _id: false }
);

const traceSchema = new Schema(
  {
    projectId: { type: String, required: true, index: true },
    traceId: { type: String, required: true },
    rootSpanId: { type: String, required: true },
    spans: { type: [spanSchema], default: [] }
  },
  { timestamps: true }
);

traceSchema.index({ projectId: 1, traceId: 1 }, { unique: true });

export const TraceModel = model("Trace", traceSchema);
