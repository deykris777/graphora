import { apiClient } from "./apiClient";
import { TraceRecord } from "../types/trace";

export const fetchTraces = (projectId: string, authToken?: string) =>
  apiClient<TraceRecord[]>(`/api/traces?projectId=${projectId}`, { authToken });

export const replayTrace = (projectId: string, traceId: string, authToken?: string) =>
  apiClient<{ replayed: number }>(`/api/traces/${traceId}/replay?projectId=${projectId}`,
    { authToken }
  );
