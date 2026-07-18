import { apiClient } from "./apiClient";
export const fetchAnalytics = (projectId, authToken) => apiClient(`/api/analytics?projectId=${projectId}`, { authToken });
export const fetchAnalysis = (projectId, authToken) => apiClient(`/api/analysis?projectId=${projectId}`, { authToken });
