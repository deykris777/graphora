import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useAppStore } from "../../store/useAppStore";
import { useToast } from "../../components/ToastProvider";

const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

const SAMPLE_SERVICES = [
  { id: "svc_auth", name: "Auth Service", type: "service" },
  { id: "svc_product", name: "Product Service", type: "service" },
  { id: "svc_payment", name: "Payment Service", type: "service" },
  { id: "svc_notify", name: "Notification Service", type: "service" },
  { id: "svc_db", name: "Database Service", type: "database" },
];

export const ConnectionTab = () => {
  const { connectionStatus, setConnectionStatus, incrementEventsToday, selectedProjectId, updateUsageStats, usageStats } = useControlCenterStore();
  const { 
    addTraffic, 
    updateService, 
    setMetrics, 
    addAnalyticsPoint, 
    setAnalytics, 
    setTraces, 
    setLogs, 
    setAlerts,
    traces: appTraces,
    logs: appLogs,
    alerts: appAlerts
  } = useAppStore();
  const { addToast } = useToast();
  const [sending, setSending] = useState(false);

  const timeSince = (iso: string | null) => {
    if (!iso) return "Never";
    const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (secs < 5) return "Just now";
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    return `${Math.floor(secs / 3600)}h ago`;
  };

  const sendTestEvent = useCallback(() => {
    setSending(true);
    const svc = SAMPLE_SERVICES[Math.floor(Math.random() * SAMPLE_SERVICES.length)];
    const latency = Math.floor(Math.random() * 200) + 10;
    const status = Math.random() > 0.15 ? "success" : "error";
    const traceId = `trace_test_${Date.now().toString(36)}`;

    // 1. Inject into main app store traffic
    addTraffic({
      traceId,
      service: svc.name,
      latency,
      status: status as "success" | "error",
      timestamp: Date.now(),
    });

    // 2. Inject service snapshot
    updateService({
      projectId: selectedProjectId ?? "default",
      serviceId: svc.id,
      name: svc.name,
      type: svc.type,
      requestCount: Math.floor(Math.random() * 500) + 150,
      errorCount: status === "error" ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 3),
      avgLatency: latency,
      p95Latency: latency * 2.5,
      lastSeen: new Date().toISOString(),
    });

    // 3. Set Metrics (Dashboard main cards)
    setMetrics({
      requestCount: 450 + Math.floor(Math.random() * 200),
      errorCount: status === "error" ? 14 : 5,
      avgLatency: latency,
      p95Latency: Math.round(latency * 1.8),
      throughput: 18.5,
    });

    // 4. Add Analytics points
    addAnalyticsPoint({
      requestCount: 450 + Math.floor(Math.random() * 200),
      errorCount: status === "error" ? 14 : 5,
      avgLatency: latency,
      p95Latency: Math.round(latency * 1.8),
      throughput: 18.5,
      bucket: new Date().toISOString(),
    });
    setAnalytics([
      { requestCount: 410, errorCount: 8, avgLatency: 72, p95Latency: 130, throughput: 13.2, bucket: new Date(Date.now() - 60000).toISOString() },
      { requestCount: 430, errorCount: 11, avgLatency: 75, p95Latency: 140, throughput: 14.8, bucket: new Date().toISOString() },
    ]);

    // 5. Add TraceRecord (Traces list & detail visualizations)
    const gatewayNode = { id: "1", type: "custom", data: { label: "API Gateway" }, position: { x: 250, y: 5 } };
    const svcNode = { id: "2", type: "custom", data: { label: svc.name }, position: { x: 100, y: 120 } };
    const dbNode = { id: "3", type: "custom", data: { label: "Postgres DB" }, position: { x: 400, y: 120 } };
    const traceRecord = {
      traceId,
      rootSpanId: "span_root",
      spans: [
        {
          spanId: "span_root",
          service: { id: "svc_gateway", name: "API Gateway", type: "gateway" },
          metrics: { latency: latency + 15, method: "POST", path: "/checkout", statusCode: status === "success" ? 200 : 500 },
          status: status,
          timestamp: new Date().toISOString(),
        },
        {
          spanId: "span_sub1",
          parentSpanId: "span_root",
          service: { id: svc.id, name: svc.name, type: svc.type },
          metrics: { latency: latency, method: "CALL", path: "/process" },
          status: status,
          timestamp: new Date().toISOString(),
        },
        {
          spanId: "span_sub2",
          parentSpanId: "span_sub1",
          service: { id: "svc_db", name: "Database Service", type: "database" },
          metrics: { latency: Math.floor(latency * 0.35), method: "QUERY", path: "SELECT * FROM users WHERE id = ?" },
          status: "success",
          timestamp: new Date().toISOString(),
        }
      ],
      graph: {
        nodes: [gatewayNode, svcNode, dbNode],
        edges: [
          { id: "e1-2", source: "1", target: "2", animated: true },
          { id: "e2-3", source: "2", target: "3", animated: true },
        ],
      }
    };
    setTraces([traceRecord, ...(appTraces || [])].slice(0, 15));

    // 6. Add LogRecord (Logs list)
    const logRecord = {
      traceId,
      serviceId: svc.id,
      level: status === "error" ? "error" : "info",
      message: status === "error" 
        ? `Failed processing payment for checkout. Status code: 500` 
        : `Successfully processed transaction in ${latency}ms`,
      timestamp: new Date().toISOString(),
    };
    setLogs([logRecord, ...(appLogs || [])].slice(0, 50));

    // 7. Add AlertRecord (Alerts list)
    if (status === "error" || latency > 150) {
      const alertRecord = {
        traceId,
        serviceId: svc.id,
        type: status === "error" ? "Error Rate Spike" : "High Latency Alert",
        severity: status === "error" ? "critical" : "warning",
        message: status === "error" 
          ? `Service ${svc.name} is returning 5xx responses.`
          : `Service ${svc.name} average latency exceeded threshold: ${latency}ms`,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      setAlerts([alertRecord, ...(appAlerts || [])].slice(0, 20));
    }

    // Update control center status
    setConnectionStatus({ connected: true, connectedServices: SAMPLE_SERVICES.length, lastEventAt: new Date().toISOString() });
    incrementEventsToday(1);
    updateUsageStats({
      totalEvents: usageStats.totalEvents + 1,
      totalTraces: usageStats.totalTraces + 1,
      totalServices: SAMPLE_SERVICES.length,
      errorRate: status === "error" ? Math.min(usageStats.errorRate + 0.5, 100) : Math.max(usageStats.errorRate - 0.1, 0),
      avgLatency: Math.round((usageStats.avgLatency * 0.9 + latency * 0.1)),
      peakTraffic: Math.max(usageStats.peakTraffic, usageStats.totalEvents),
    });

    setTimeout(() => {
      setSending(false);
      addToast(`Test event sent: ${svc.name} → ${latency}ms (${status})`, "success");
    }, 600);
  }, [addTraffic, updateService, setMetrics, addAnalyticsPoint, setAnalytics, setTraces, setLogs, setAlerts, appTraces, appLogs, appAlerts, setConnectionStatus, incrementEventsToday, updateUsageStats, usageStats, selectedProjectId, addToast]);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={rise}>
        <div className="cc-section-title">Live Connection Status</div>
        <div className="cc-section-desc">Monitor your SDK connection and send test events</div>
      </motion.div>

      {/* Status Cards */}
      <motion.div variants={rise} className="cc-grid-4">
        <div className="cc-card cc-card--sm">
          <div className="flex items-center gap-3 mb-3">
            <div className={`cc-status-dot ${connectionStatus.connected ? "cc-status-dot--connected" : "cc-status-dot--disconnected"}`} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</span>
          </div>
          <div className="text-xl font-bold" style={{ color: connectionStatus.connected ? "var(--badge-success-text)" : "var(--badge-error-text)" }}>
            {connectionStatus.connected ? "Connected" : "Disconnected"}
          </div>
        </div>
        <div className="cc-card cc-card--sm">
          <div className="cc-metric">
            <span className="cc-metric__label">Last Event</span>
            <span className="cc-metric__value" style={{ fontSize: "20px" }}>{timeSince(connectionStatus.lastEventAt)}</span>
          </div>
        </div>
        <div className="cc-card cc-card--sm">
          <div className="cc-metric">
            <span className="cc-metric__label">Events Today</span>
            <span className="cc-metric__value">{connectionStatus.eventsToday}</span>
          </div>
        </div>
        <div className="cc-card cc-card--sm">
          <div className="cc-metric">
            <span className="cc-metric__label">Services</span>
            <span className="cc-metric__value">{connectionStatus.connectedServices}</span>
          </div>
        </div>
      </motion.div>

      {/* Send Test Event */}
      <motion.div variants={rise} className="cc-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-heading)" }}>Test Event Generator</div>
            <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              Send a sample trace event to verify your setup. It will appear in Dashboard, Live Traffic, and Traces.
            </div>
          </div>
          <button
            className="cc-btn cc-btn--primary"
            onClick={sendTestEvent}
            disabled={sending}
            style={{ minWidth: "160px" }}
          >
            {sending ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Sending…
              </span>
            ) : (
              <span>🚀 Send Test Event</span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Connection Log */}
      <motion.div variants={rise} className="cc-card">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Connection Info</div>
        <div className="space-y-3 text-[13px]">
          <div className="flex justify-between" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            <span style={{ color: "var(--text-muted)" }}>SDK Endpoint</span>
            <code className="font-mono text-[12px]" style={{ color: "var(--accent)" }}>https://api.graphyn.dev/v1/track</code>
          </div>
          <div className="flex justify-between" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            <span style={{ color: "var(--text-muted)" }}>WebSocket</span>
            <code className="font-mono text-[12px]" style={{ color: "var(--accent)" }}>wss://ws.graphyn.dev</code>
          </div>
          <div className="flex justify-between" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            <span style={{ color: "var(--text-muted)" }}>Protocol</span>
            <span style={{ color: "var(--text-body)" }}>OTLP / HTTP</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--text-muted)" }}>Compression</span>
            <span style={{ color: "var(--text-body)" }}>gzip</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
