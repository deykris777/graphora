import { Schema, model } from "mongoose";

const logSchema = new Schema(
  {
    projectId: { type: String, required: true, index: true },
    traceId: { type: String },
    serviceId: { type: String },
    level: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, required: true }
  },
  { timestamps: true }
);

export const LogModel = model("Log", logSchema);
