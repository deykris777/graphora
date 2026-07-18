import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export const TrafficHeatmapChart = ({ data }) => {
    const chartData = [...data].reverse().map((point) => ({
        time: point.bucket ?? "",
        latency: point.p95Latency
    }));
    const root = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    const fillColor = root?.getPropertyValue('--accent-secondary').trim() || '#E0F7FA';
    return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: chartData, children: [_jsx(XAxis, { dataKey: "time", hide: true }), _jsx(YAxis, { hide: true }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "latency", fill: fillColor, radius: [2, 2, 0, 0] })] }) }));
};
