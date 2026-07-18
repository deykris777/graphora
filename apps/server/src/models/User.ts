import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);
