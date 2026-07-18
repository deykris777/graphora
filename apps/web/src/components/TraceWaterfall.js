import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const TraceWaterfall = ({ spans }) => {
    if (spans.length === 0) {
        return _jsx("div", { className: "text-sm text-slate-500 dark:text-slate-400", children: "No trace spans yet." });
    }
    const maxLatency = Math.max(...spans.map((span) => span.metrics.latency));
    return (_jsx("div", { className: "space-y-3", children: spans.map((span) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-40 text-xs text-slate-600 dark:text-slate-300", children: span.service.name }), _jsx("div", { className: "h-3 flex-1 rounded-full bg-white/5", children: _jsx("div", { className: `h-3 rounded-full ${span.status === "error" ? "bg-red-500/70" : "bg-cyan-400/70"}`, style: { width: `${(span.metrics.latency / maxLatency) * 100}%` } }) }), _jsxs("div", { className: "w-16 text-right text-xs text-slate-600 dark:text-slate-300", children: [span.metrics.latency, "ms"] })] }, span.spanId))) }));
};
