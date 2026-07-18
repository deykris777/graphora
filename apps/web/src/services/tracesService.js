import { apiClient } from "./apiClient";
export const fetchTraces = (projectId, authToken) => apiClient(`/api/traces?projectId=${projectId}`, { authToken });
export const replayTrace = (projectId, traceId, authToken) => apiClient(`/api/traces/${traceId}/replay?projectId=${projectId}`, { authToken });
