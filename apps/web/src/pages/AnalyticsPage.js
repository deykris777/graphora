import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from "../store/useAppStore";
import { ChartCard } from "../components/ChartCard";
import { LatencyTrendChart } from "../charts/LatencyTrendChart";
import { RequestVolumeChart } from "../charts/RequestVolumeChart";
import { ErrorRateChart } from "../charts/ErrorRateChart";
import { ThroughputChart } from "../charts/ThroughputChart";
import { TrafficHeatmapChart } from "../charts/TrafficHeatmapChart";
export const AnalyticsPage = () => {
    const analytics = useAppStore((state) => state.analytics);
    const data = analytics.length > 0 ? analytics : [];
    return (_jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(ChartCard, { title: "Latency Trend", subtitle: "Average latency", children: _jsx(LatencyTrendChart, { data: data }) }), _jsx(ChartCard, { title: "Request Volume", subtitle: "Traffic load", children: _jsx(RequestVolumeChart, { data: data }) }), _jsx(ChartCard, { title: "Error Rate", subtitle: "Failures", children: _jsx(ErrorRateChart, { data: data }) }), _jsx(ChartCard, { title: "Throughput", subtitle: "Requests per minute", children: _jsx(ThroughputChart, { data: data }) }), _jsx(ChartCard, { title: "Traffic Heatmap", subtitle: "p95 latency", children: _jsx(TrafficHeatmapChart, { data: data }) })] }));
};
