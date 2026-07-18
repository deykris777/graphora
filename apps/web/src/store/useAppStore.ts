import { create } from "zustand";
import { TrafficEvent } from "../types/event";
import { AnalyticsPoint } from "../types/analytics";
import { ServiceSnapshot } from "../types/service";
import { AlertRecord } from "../types/alert";
import { TraceRecord } from "../types/trace";
import { LogRecord } from "../types/log";

interface AppState {
  traffic: TrafficEvent[];
  metrics: AnalyticsPoint | null;
  analytics: AnalyticsPoint[];
  services: ServiceSnapshot[];
  alerts: AlertRecord[];
  traces: TraceRecord[];
  logs: LogRecord[];
  socketConnections: number;
  setTraffic: (events: TrafficEvent[]) => void;
  addTraffic: (event: TrafficEvent) => void;
  setMetrics: (metrics: AnalyticsPoint) => void;
  setAnalytics: (analytics: AnalyticsPoint[]) => void;
  addAnalyticsPoint: (point: AnalyticsPoint) => void;
  setServices: (services: ServiceSnapshot[]) => void;
  updateService: (service: ServiceSnapshot) => void;
  setAlerts: (alerts: AlertRecord[]) => void;
  addAlert: (alert: AlertRecord) => void;
  setTraces: (traces: TraceRecord[]) => void;
  setLogs: (logs: LogRecord[]) => void;
  setSocketConnections: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  traffic: [],
  metrics: null,
  services: [],
  alerts: [],
  traces: [],
  logs: [],
  socketConnections: 0,
  analytics: [],
  setTraffic: (events) => set({ traffic: events }),
  addTraffic: (event) =>
    set((state) => ({ traffic: [event, ...state.traffic].slice(0, 120) })),
  setMetrics: (metrics) => set({ metrics }),
  setAnalytics: (analytics) => set({ analytics }),
  addAnalyticsPoint: (point) =>
    set((state) => ({ analytics: [point, ...state.analytics].slice(0, 30) })),
  setServices: (services) => set({ services }),
  updateService: (service) =>
    set((state) => ({
      services: [service, ...state.services.filter((s) => s.serviceId !== service.serviceId)]
    })),
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  setTraces: (traces) => set({ traces }),
  setLogs: (logs) => set({ logs }),
  setSocketConnections: (count) => set({ socketConnections: count })
}));
