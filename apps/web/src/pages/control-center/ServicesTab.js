import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const statusColor = (errors, requests) => {
    if (requests === 0)
        return "down";
    const rate = errors / requests;
    if (rate > 0.1)
        return "down";
    if (rate > 0.03)
        return "degraded";
    return "healthy";
};
const statusStyles = {
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
    return (_jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", className: "space-y-6", children: [_jsxs(motion.div, { variants: rise, children: [_jsx("div", { className: "cc-section-title", children: "Service Discovery" }), _jsx("div", { className: "cc-section-desc", children: "Automatically detected services sending telemetry" })] }), _jsx(motion.div, { variants: rise, className: "cc-card", style: { padding: 0, overflow: "hidden" }, children: _jsxs("table", { className: "cc-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Service" }), _jsx("th", { children: "Requests" }), _jsx("th", { children: "Errors" }), _jsx("th", { children: "Avg Latency" }), _jsx("th", { children: "p95 Latency" }), _jsx("th", { children: "Status" })] }) }), _jsx("tbody", { children: services.map((svc) => {
                                const s = statusColor(svc.errorCount, svc.requestCount);
                                const st = statusStyles[s];
                                return (_jsxs("tr", { children: [_jsx("td", { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-8 w-8 rounded-lg flex items-center justify-center text-[11px] font-bold", style: { background: "var(--accent-bg)", color: "var(--accent)" }, children: svc.name.charAt(0) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-[13px]", style: { color: "var(--text-heading)" }, children: svc.name }), _jsx("div", { className: "text-[10px] font-mono", style: { color: "var(--text-faint)" }, children: svc.serviceId })] })] }) }), _jsx("td", { children: _jsx("span", { className: "font-mono font-semibold", style: { color: "var(--accent)" }, children: svc.requestCount.toLocaleString() }) }), _jsx("td", { children: _jsx("span", { className: "font-mono", style: { color: svc.errorCount > 5 ? "var(--badge-error-text)" : "var(--text-body)" }, children: svc.errorCount }) }), _jsx("td", { children: _jsxs("span", { className: "font-mono", children: [svc.avgLatency, "ms"] }) }), _jsx("td", { children: _jsxs("span", { className: "font-mono", children: [svc.p95Latency, "ms"] }) }), _jsx("td", { children: _jsxs("span", { className: "cc-badge", style: { background: st.bg, color: st.text, border: `1px solid ${st.border}` }, children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-current", style: s === "healthy" ? { animation: "cc-pulse 2s infinite" } : {} }), s] }) })] }, svc.serviceId));
                            }) })] }) }), _jsxs(motion.div, { variants: rise, className: "cc-grid-3", children: [_jsx("div", { className: "cc-card cc-card--sm", children: _jsxs("div", { className: "cc-metric", children: [_jsx("span", { className: "cc-metric__label", children: "Total Services" }), _jsx("span", { className: "cc-metric__value", children: services.length })] }) }), _jsx("div", { className: "cc-card cc-card--sm", children: _jsxs("div", { className: "cc-metric", children: [_jsx("span", { className: "cc-metric__label", children: "Total Requests" }), _jsx("span", { className: "cc-metric__value", children: services.reduce((a, s) => a + s.requestCount, 0).toLocaleString() })] }) }), _jsx("div", { className: "cc-card cc-card--sm", children: _jsxs("div", { className: "cc-metric", children: [_jsx("span", { className: "cc-metric__label", children: "Avg Latency" }), _jsxs("span", { className: "cc-metric__value", children: [Math.round(services.reduce((a, s) => a + s.avgLatency, 0) / services.length), "ms"] })] }) })] })] }));
};
