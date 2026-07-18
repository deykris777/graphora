import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useAppStore } from "../store/useAppStore";
import { fetchAnalytics, fetchAnalysis } from "../services/analyticsService";
import { fetchServices } from "../services/servicesService";
import { fetchTraces } from "../services/tracesService";
import { fetchAlerts } from "../services/alertsService";
import { fetchLogs } from "../services/logsService";

export const useProjectData = (projectId: string) => {
  const { getToken } = useAuth();
  const setServices = useAppStore((state) => state.setServices);
  const setTraces = useAppStore((state) => state.setTraces);
  const setAlerts = useAppStore((state) => state.setAlerts);
  const setLogs = useAppStore((state) => state.setLogs);
  const setMetrics = useAppStore((state) => state.setMetrics);
  const setAnalytics = useAppStore((state) => state.setAnalytics);
  const [analysis, setAnalysis] = useState<{ summary: string; recommendations: string[] } | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      const authToken = await getToken();
      const [services, traces, alerts, logs, analytics, analysisResult] = await Promise.all([
        fetchServices(projectId, authToken ?? undefined),
        fetchTraces(projectId, authToken ?? undefined),
        fetchAlerts(projectId, authToken ?? undefined),
        fetchLogs(projectId, authToken ?? undefined),
        fetchAnalytics(projectId, authToken ?? undefined),
        fetchAnalysis(projectId, authToken ?? undefined)
      ]);

      const currentStore = useAppStore.getState();

      if (services && (services.length > 0 || currentStore.services.length === 0)) {
        setServices(services);
      }
      if (traces && (traces.length > 0 || currentStore.traces.length === 0)) {
        setTraces(traces);
      }
      if (alerts && (alerts.length > 0 || currentStore.alerts.length === 0)) {
        setAlerts(alerts);
      }
      if (logs && (logs.length > 0 || currentStore.logs.length === 0)) {
        setLogs(logs);
      }
      if (analytics && (analytics.length > 0 || currentStore.analytics.length === 0)) {
        setAnalytics(analytics);
        if (analytics[0]) {
          setMetrics(analytics[0]);
        }
      }
      setAnalysis(analysisResult);
    };

    load().catch(() => undefined);
  }, [getToken, projectId, setAlerts, setAnalytics, setLogs, setMetrics, setServices, setTraces]);

  return analysis;
};
