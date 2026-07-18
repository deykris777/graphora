import { z } from "zod";

export const traceEventSchema = z.object({
  projectId: z.string().min(1),
  traceId: z.string().min(1),
  spanId: z.string().min(1),
  parentSpanId: z.string().nullable().optional(),
  service: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.string().min(1)
  }),
  metrics: z.object({
    latency: z.number().nonnegative(),
    method: z.string().optional(),
    path: z.string().optional(),
    statusCode: z.number().optional(),
    size: z.number().optional()
  }),
  status: z.enum(["success", "error"]),
  timestamp: z.number().optional(),
  tags: z.array(z.string()).optional()
});
