import { create } from "zustand";
export const useAppStore = create((set) => ({
    traffic: [],
    metrics: null,
    services: [],
    alerts: [],
    traces: [],
    logs: [],
    socketConnections: 0,
    analytics: [],
    setTraffic: (events) => set({ traffic: events }),
    addTraffic: (event) => set((state) => ({ traffic: [event, ...state.traffic].slice(0, 120) })),
    setMetrics: (metrics) => set({ metrics }),
    setAnalytics: (analytics) => set({ analytics }),
    addAnalyticsPoint: (point) => set((state) => ({ analytics: [point, ...state.analytics].slice(0, 30) })),
    setServices: (services) => set({ services }),
    updateService: (service) => set((state) => ({
        services: [service, ...state.services.filter((s) => s.serviceId !== service.serviceId)]
    })),
    setAlerts: (alerts) => set({ alerts }),
    addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
    setTraces: (traces) => set({ traces }),
    setLogs: (logs) => set({ logs }),
    setSocketConnections: (count) => set({ socketConnections: count })
}));
