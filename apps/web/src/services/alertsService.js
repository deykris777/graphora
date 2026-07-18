import { apiClient } from "./apiClient";
export const fetchAlerts = (projectId, authToken) => apiClient(`/api/alerts?projectId=${projectId}`, { authToken });
