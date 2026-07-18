import { Schema, model } from "mongoose";

const alertSchema = new Schema(
  {
    projectId: { type: String, required: true, index: true },
    traceId: { type: String },
    serviceId: { type: String },
    type: { type: String, required: true },
    severity: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "open" }
  },
  { timestamps: true }
);

export const AlertModel = model("Alert", alertSchema);
