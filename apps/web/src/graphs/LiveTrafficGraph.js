import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length)
        return null;
    return (_jsxs("div", { className: "rounded-xl px-3 py-2 shadow-lg", style: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--accent-border)' }, children: [_jsx("div", { className: "text-[10px] uppercase tracking-wider font-mono", style: { color: 'var(--text-muted)' }, children: "Latency" }), _jsxs("div", { className: "text-sm font-bold font-mono", style: { color: 'var(--accent)' }, children: [payload[0].value, "ms"] }), _jsx("div", { className: "text-[10px] font-mono", style: { color: 'var(--text-faint)' }, children: payload[0].payload.time })] }));
};
export const LiveTrafficGraph = ({ events }) => {
    const data = [...events]
        .reverse()
        .map((event) => ({
        time: new Date(event.timestamp).toLocaleTimeString(),
        latency: event.latency,
    }));
    /* Read CSS variable values at render time for recharts (which needs raw color strings) */
    const root = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    const strokeColor = root?.getPropertyValue('--chart-stroke').trim() || '#FF6B35';
    const gridColor = root?.getPropertyValue('--chart-grid').trim() || 'rgba(255,255,255,0.03)';
    const fillStart = root?.getPropertyValue('--chart-fill-start').trim() || 'rgba(255,107,53,0.15)';
    const fillEnd = root?.getPropertyValue('--chart-fill-end').trim() || 'rgba(255,107,53,0)';
    return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: data, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "latencyGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: fillStart, stopOpacity: 1 }), _jsx("stop", { offset: "100%", stopColor: fillEnd, stopOpacity: 1 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: gridColor }), _jsx(XAxis, { dataKey: "time", hide: true }), _jsx(YAxis, { hide: true }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Area, { type: "monotone", dataKey: "latency", stroke: strokeColor, strokeWidth: 2, fill: "url(#latencyGrad)", dot: false, animationDuration: 300 })] }) }));
};
