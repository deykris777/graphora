import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export const ThroughputChart = ({ data }) => {
    const chartData = [...data].reverse().map((point) => ({
        time: point.bucket ?? "",
        throughput: point.throughput
    }));
    const root = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    const strokeColor = root?.getPropertyValue('--accent-secondary').trim() || '#E0F7FA';
    return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: chartData, children: [_jsx(XAxis, { dataKey: "time", hide: true }), _jsx(YAxis, { hide: true }), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "throughput", stroke: strokeColor, fill: strokeColor, fillOpacity: 0.12 })] }) }));
};
