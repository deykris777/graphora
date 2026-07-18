import { apiClient } from "./apiClient";
import { AlertRecord } from "../types/alert";

export const fetchAlerts = (projectId: string, authToken?: string) =>
  apiClient<AlertRecord[]>(`/api/alerts?projectId=${projectId}`, { authToken });
