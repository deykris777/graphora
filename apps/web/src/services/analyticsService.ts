import { apiClient } from "./apiClient";
import { AnalyticsPoint } from "../types/analytics";

export const fetchAnalytics = (projectId: string, authToken?: string) =>
  apiClient<AnalyticsPoint[]>(`/api/analytics?projectId=${projectId}`, { authToken });

export const fetchAnalysis = (projectId: string, authToken?: string) =>
  apiClient<{ summary: string; recommendations: string[] }>(
    `/api/analysis?projectId=${projectId}`,
    { authToken }
  );
