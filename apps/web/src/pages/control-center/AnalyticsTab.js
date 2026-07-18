import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", className: "space-y-6", children: [_jsxs(motion.div, { variants: rise, children: [_jsx("div", { className: "cc-section-title", children: "Usage Analytics" }), _jsx("div", { className: "cc-section-desc", children: "Overview of telemetry usage and storage" })] }), _jsx(motion.div, { variants: rise, className: "cc-grid-3", children: metrics.map((m) => (_jsx("div", { className: "cc-card cc-card--sm", children: _jsxs("div", { className: "cc-metric", children: [_jsx("span", { className: "cc-metric__label", children: m.label }), _jsx("span", { className: "cc-metric__value", children: m.value }), _jsx("span", { className: "cc-metric__detail", children: m.detail })] }) }, m.label))) }), _jsxs(motion.div, { variants: rise, children: [_jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider mb-3", style: { color: "var(--text-muted)" }, children: "Data Retention" }), _jsx("div", { className: "cc-grid-4", children: retentionItems.map((item) => (_jsx("div", { className: "cc-card cc-card--sm", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-xl", children: item.icon }), _jsxs("div", { className: "cc-metric", children: [_jsx("span", { className: "cc-metric__label", children: item.label }), _jsx("span", { className: "cc-metric__value", style: { fontSize: "22px" }, children: item.value })] })] }) }, item.label))) })] }), _jsxs(motion.div, { variants: rise, className: "cc-card", children: [_jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider mb-4", style: { color: "var(--text-muted)" }, children: "Event Volume (Last 7 Days)" }), _jsx("div", { className: "flex items-end gap-2 h-40", children: Array.from({ length: 7 }, (_, i) => {
                            const h = 30 + Math.random() * 70;
                            const day = new Date(Date.now() - (6 - i) * 86400000);
                            return (_jsxs("div", { className: "flex-1 flex flex-col items-center gap-2", children: [_jsx("div", { className: "w-full rounded-t-lg transition-all duration-300 hover:opacity-80", style: { height: `${h}%`, background: `linear-gradient(to top, var(--accent-bg), var(--accent))`, opacity: 0.7 + i * 0.04 } }), _jsx("span", { className: "text-[9px] font-mono", style: { color: "var(--text-faint)" }, children: day.toLocaleDateString(undefined, { weekday: "short" }) })] }, i));
                        }) })] })] }));
};
