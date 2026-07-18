import { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    projectId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    apiKey: { type: String, required: true }
  },
  { timestamps: true }
);

export const ProjectModel = model("Project", projectSchema);
