import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export const ErrorRateChart = ({ data }) => {
    const chartData = [...data].reverse().map((point) => ({
        time: point.bucket ?? "",
        errors: point.errorCount
    }));
    const root = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    const strokeColor = root?.getPropertyValue('--accent').trim() || '#FF6B35';
    return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: chartData, children: [_jsx(XAxis, { dataKey: "time", hide: true }), _jsx(YAxis, { hide: true }), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "errors", stroke: strokeColor, strokeWidth: 2, dot: false })] }) }));
};
