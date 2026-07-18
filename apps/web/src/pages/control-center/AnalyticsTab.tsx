import { motion } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";

const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

export const AnalyticsTab = () => {
  const { usageStats, dataRetention } = useControlCenterStore();

  const metrics = [
    { label: "Total Events", value: usageStats.totalEvents.toLocaleString(), detail: "All time" },
    { label: "Total Traces", value: usageStats.totalTraces.toLocaleString(), detail: "Across services" },
    { label: "Total Services", value: `${usageStats.totalServices}`, detail: "Discovered" },
    { label: "Error Rate", value: `${usageStats.errorRate.toFixed(1)}%`, detail: "Current window" },
    { label: "Avg Latency", value: `${usageStats.avgLatency}ms`, detail: "All services" },
    { label: "Peak Traffic", value: usageStats.peakTraffic.toLocaleString(), detail: "Events/hour" },
  ];

  const retentionItems = [
    { label: "Retention Period", value: `${dataRetention.retentionDays} Days`, icon: "📅" },
    { label: "Storage Used", value: dataRetention.storageUsedMB > 1024 ? `${(dataRetention.storageUsedMB / 1024).toFixed(1)} GB` : `${dataRetention.storageUsedMB} MB`, icon: "💾" },
    { label: "Events Stored", value: dataRetention.eventsStored > 1000000 ? `${(dataRetention.eventsStored / 1000000).toFixed(1)}M` : dataRetention.eventsStored.toLocaleString(), icon: "📊" },
    { label: "Daily Events", value: dataRetention.dailyEventCount.toLocaleString(), icon: "📈" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={rise}>
        <div className="cc-section-title">Usage Analytics</div>
        <div className="cc-section-desc">Overview of telemetry usage and storage</div>
      </motion.div>

      {/* Usage Metrics */}
      <motion.div variants={rise} className="cc-grid-3">
        {metrics.map((m) => (
          <div key={m.label} className="cc-card cc-card--sm">
            <div className="cc-metric">
              <span className="cc-metric__label">{m.label}</span>
              <span className="cc-metric__value">{m.value}</span>
              <span className="cc-metric__detail">{m.detail}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Data Retention */}
      <motion.div variants={rise}>
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Data Retention</div>
        <div className="cc-grid-4">
          {retentionItems.map((item) => (
            <div key={item.label} className="cc-card cc-card--sm">
              <div className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div className="cc-metric">
                  <span className="cc-metric__label">{item.label}</span>
                  <span className="cc-metric__value" style={{ fontSize: "22px" }}>{item.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Chart placeholder */}
      <motion.div variants={rise} className="cc-card">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Event Volume (Last 7 Days)</div>
        <div className="flex items-end gap-2 h-40">
          {Array.from({ length: 7 }, (_, i) => {
            const h = 30 + Math.random() * 70;
            const day = new Date(Date.now() - (6 - i) * 86400000);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80" style={{ height: `${h}%`, background: `linear-gradient(to top, var(--accent-bg), var(--accent))`, opacity: 0.7 + i * 0.04 }} />
                <span className="text-[9px] font-mono" style={{ color: "var(--text-faint)" }}>{day.toLocaleDateString(undefined, { weekday: "short" })}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
