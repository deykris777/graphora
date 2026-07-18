import { apiClient } from "./apiClient";
export const fetchServices = (projectId, authToken) => apiClient(`/api/services?projectId=${projectId}`, { authToken });
