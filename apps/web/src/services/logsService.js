import { apiClient } from "./apiClient";
export const fetchLogs = (projectId, authToken) => apiClient(`/api/logs?projectId=${projectId}`, { authToken });
