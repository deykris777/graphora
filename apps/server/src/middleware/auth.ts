import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export const requireAuth = () => {
  if (!env.clerkSecretKey) {
    return (_req: Request, _res: Response, next: NextFunction) => next();
  }

  return ClerkExpressRequireAuth({});
};

export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  if (!env.apiKey) {
    return next();
  }

  const apiKey = req.header("x-api-key");
  if (apiKey !== env.apiKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  return next();
};
