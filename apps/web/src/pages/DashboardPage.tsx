import { useAppStore } from "../store/useAppStore";
import { MetricCard } from "../components/MetricCard";
import { ChartCard } from "../components/ChartCard";
import { LiveTrafficGraph } from "../graphs/LiveTrafficGraph";
import { EventFeed } from "../components/EventFeed";
import { motion } from "framer-motion";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const rise = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export const DashboardPage = () => {
  const metrics = useAppStore((state) => state.metrics);
  const traffic = useAppStore((state) => state.traffic);
  const services = useAppStore((state) => state.services);
  const socketConnections = useAppStore((state) => state.socketConnections);

  const requests = metrics?.requestCount ?? 0;
  const latency = metrics?.avgLatency ?? 0;
  const errors = metrics?.errorCount ?? 0;
  const p95 = metrics?.p95Latency ?? 0;
  const activeServices = services.length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Page header */}
      <motion.div variants={rise} className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>Dashboard</h1>
          <p className="text-[10px] uppercase tracking-wider font-mono mt-1" style={{ color: 'var(--text-muted)' }}>Real-time system overview</p>
        </div>
        <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </motion.div>

      {/* Metric cards */}
      <motion.div variants={stagger} className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <motion.div variants={rise}><MetricCard label="Requests / min" value={`${requests}`} detail="Live throughput" /></motion.div>
        <motion.div variants={rise}><MetricCard label="Avg Latency" value={`${latency}ms`} detail="Across services" /></motion.div>
        <motion.div variants={rise}><MetricCard label="p95 Latency" value={`${p95}ms`} detail="Performance tail" /></motion.div>
        <motion.div variants={rise}><MetricCard label="Errors" value={`${errors}`} detail="Current window" /></motion.div>
        <motion.div variants={rise}><MetricCard label="Services" value={`${activeServices}`} detail="Reporting now" /></motion.div>
        <motion.div variants={rise}><MetricCard label="WS Connections" value={`${socketConnections}`} detail="Active sockets" /></motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div variants={rise} className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <ChartCard title="Realtime Latency" subtitle="websocket stream">
          <LiveTrafficGraph events={traffic} />
        </ChartCard>
        <ChartCard title="Live Event Feed" subtitle="most recent spans">
          <div className="h-56 overflow-y-auto pr-1 custom-scrollbar">
            <EventFeed />
          </div>
        </ChartCard>
      </motion.div>

      {/* Service quick-status */}
      {services.length > 0 && (
        <motion.div variants={rise}>
          <div className="text-[10px] uppercase tracking-[0.2em] font-mono mb-3" style={{ color: 'var(--text-muted)' }}>Active Services</div>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {services.map((svc) => (
              <div
                key={svc.serviceId}
                className="rounded-xl border p-4 transition-all duration-300 hover:shadow-[0_0_20px_var(--glow)]"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${svc.errorCount > 5 ? "bg-brand-primary" : "bg-brand-secondary"}`} />
                  <span className="text-[12px] font-semibold truncate" style={{ color: 'var(--text-heading)' }}>{svc.name}</span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  <span>{svc.avgLatency}ms avg</span>
                  <span>{svc.requestCount} req</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
