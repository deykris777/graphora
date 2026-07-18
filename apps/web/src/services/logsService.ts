import { apiClient } from "./apiClient";
import { LogRecord } from "../types/log";

export const fetchLogs = (projectId: string, authToken?: string) =>
  apiClient<LogRecord[]>(`/api/logs?projectId=${projectId}`, { authToken });
