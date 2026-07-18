import { motion } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";

const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

const statusColor = (errors: number, requests: number) => {
  if (requests === 0) return "down";
  const rate = errors / requests;
  if (rate > 0.1) return "down";
  if (rate > 0.03) return "degraded";
  return "healthy";
};

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  healthy: { bg: "var(--badge-success-bg)", text: "var(--badge-success-text)", border: "var(--badge-success-border)" },
  degraded: { bg: "rgba(251,191,36,0.1)", text: "#fbbf24", border: "rgba(251,191,36,0.2)" },
  down: { bg: "var(--badge-error-bg)", text: "var(--badge-error-text)", border: "var(--badge-error-border)" },
};

const DEFAULT_SERVICES = [
  { serviceId: "svc_auth", name: "Auth Service", type: "service", requestCount: 1240, errorCount: 3, avgLatency: 42, p95Latency: 95 },
  { serviceId: "svc_product", name: "Product Service", type: "service", requestCount: 3100, errorCount: 12, avgLatency: 67, p95Latency: 145 },
  { serviceId: "svc_payment", name: "Payment Service", type: "service", requestCount: 890, errorCount: 5, avgLatency: 120, p95Latency: 280 },
  { serviceId: "svc_notify", name: "Notification Service", type: "service", requestCount: 2200, errorCount: 1, avgLatency: 15, p95Latency: 35 },
  { serviceId: "svc_db", name: "Database Service", type: "database", requestCount: 5600, errorCount: 8, avgLatency: 8, p95Latency: 22 },
];

export const ServicesTab = () => {
  const appServices = useAppStore((s) => s.services);
  const services = appServices.length > 0 ? appServices : DEFAULT_SERVICES.map((s) => ({ ...s, projectId: "default" }));

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={rise}>
        <div className="cc-section-title">Service Discovery</div>
        <div className="cc-section-desc">Automatically detected services sending telemetry</div>
      </motion.div>

      <motion.div variants={rise} className="cc-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="cc-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Requests</th>
              <th>Errors</th>
              <th>Avg Latency</th>
              <th>p95 Latency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => {
              const s = statusColor(svc.errorCount, svc.requestCount);
              const st = statusStyles[s];
              return (
                <tr key={svc.serviceId}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[11px] font-bold" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                        {svc.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-[13px]" style={{ color: "var(--text-heading)" }}>{svc.name}</div>
                        <div className="text-[10px] font-mono" style={{ color: "var(--text-faint)" }}>{svc.serviceId}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="font-mono font-semibold" style={{ color: "var(--accent)" }}>{svc.requestCount.toLocaleString()}</span></td>
                  <td><span className="font-mono" style={{ color: svc.errorCount > 5 ? "var(--badge-error-text)" : "var(--text-body)" }}>{svc.errorCount}</span></td>
                  <td><span className="font-mono">{svc.avgLatency}ms</span></td>
                  <td><span className="font-mono">{svc.p95Latency}ms</span></td>
                  <td>
                    <span className="cc-badge" style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" style={s === "healthy" ? { animation: "cc-pulse 2s infinite" } : {}} />
                      {s}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Summary */}
      <motion.div variants={rise} className="cc-grid-3">
        <div className="cc-card cc-card--sm">
          <div className="cc-metric">
            <span className="cc-metric__label">Total Services</span>
            <span className="cc-metric__value">{services.length}</span>
          </div>
        </div>
        <div className="cc-card cc-card--sm">
          <div className="cc-metric">
            <span className="cc-metric__label">Total Requests</span>
            <span className="cc-metric__value">{services.reduce((a, s) => a + s.requestCount, 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="cc-card cc-card--sm">
          <div className="cc-metric">
            <span className="cc-metric__label">Avg Latency</span>
            <span className="cc-metric__value">{Math.round(services.reduce((a, s) => a + s.avgLatency, 0) / services.length)}ms</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
