import { apiClient } from "./apiClient";
import { ServiceSnapshot } from "../types/service";

export const fetchServices = (projectId: string, authToken?: string) =>
  apiClient<ServiceSnapshot[]>(`/api/services?projectId=${projectId}`, { authToken });
