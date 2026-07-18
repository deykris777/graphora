import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", className: "space-y-6", children: [_jsxs(motion.div, { variants: rise, className: "flex items-end justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold tracking-tight", style: { color: 'var(--text-heading)' }, children: "Dashboard" }), _jsx("p", { className: "text-[10px] uppercase tracking-wider font-mono mt-1", style: { color: 'var(--text-muted)' }, children: "Real-time system overview" })] }), _jsxs("div", { className: "text-[9px] font-mono uppercase tracking-wider", style: { color: 'var(--text-faint)' }, children: ["Last updated: ", new Date().toLocaleTimeString()] })] }), _jsxs(motion.div, { variants: stagger, className: "grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6", children: [_jsx(motion.div, { variants: rise, children: _jsx(MetricCard, { label: "Requests / min", value: `${requests}`, detail: "Live throughput" }) }), _jsx(motion.div, { variants: rise, children: _jsx(MetricCard, { label: "Avg Latency", value: `${latency}ms`, detail: "Across services" }) }), _jsx(motion.div, { variants: rise, children: _jsx(MetricCard, { label: "p95 Latency", value: `${p95}ms`, detail: "Performance tail" }) }), _jsx(motion.div, { variants: rise, children: _jsx(MetricCard, { label: "Errors", value: `${errors}`, detail: "Current window" }) }), _jsx(motion.div, { variants: rise, children: _jsx(MetricCard, { label: "Services", value: `${activeServices}`, detail: "Reporting now" }) }), _jsx(motion.div, { variants: rise, children: _jsx(MetricCard, { label: "WS Connections", value: `${socketConnections}`, detail: "Active sockets" }) })] }), _jsxs(motion.div, { variants: rise, className: "grid gap-5 lg:grid-cols-[1.3fr_0.7fr]", children: [_jsx(ChartCard, { title: "Realtime Latency", subtitle: "websocket stream", children: _jsx(LiveTrafficGraph, { events: traffic }) }), _jsx(ChartCard, { title: "Live Event Feed", subtitle: "most recent spans", children: _jsx("div", { className: "h-56 overflow-y-auto pr-1 custom-scrollbar", children: _jsx(EventFeed, {}) }) })] }), services.length > 0 && (_jsxs(motion.div, { variants: rise, children: [_jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] font-mono mb-3", style: { color: 'var(--text-muted)' }, children: "Active Services" }), _jsx("div", { className: "grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4", children: services.map((svc) => (_jsxs("div", { className: "rounded-xl border p-4 transition-all duration-300 hover:shadow-[0_0_20px_var(--glow)]", style: {
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border)',
                            }, onMouseEnter: (e) => {
                                e.currentTarget.style.borderColor = 'var(--border-hover)';
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.borderColor = 'var(--border)';
                            }, children: [_jsxs("div", { className: "flex items-center gap-2.5 mb-2.5", children: [_jsx("span", { className: `h-1.5 w-1.5 rounded-full ${svc.errorCount > 5 ? "bg-brand-primary" : "bg-brand-secondary"}` }), _jsx("span", { className: "text-[12px] font-semibold truncate", style: { color: 'var(--text-heading)' }, children: svc.name })] }), _jsxs("div", { className: "flex items-center gap-4 text-[9px] font-mono", style: { color: 'var(--text-muted)' }, children: [_jsxs("span", { children: [svc.avgLatency, "ms avg"] }), _jsxs("span", { children: [svc.requestCount, " req"] })] })] }, svc.serviceId))) })] }))] }));
};
