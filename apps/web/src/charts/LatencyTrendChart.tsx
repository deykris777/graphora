import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AnalyticsPoint } from "../types/analytics";

interface LatencyTrendChartProps {
  data: AnalyticsPoint[];
}

export const LatencyTrendChart = ({ data }: LatencyTrendChartProps) => {
  const chartData = [...data].reverse().map((point) => ({
    time: point.bucket ?? "",
    latency: point.avgLatency
  }));

  const root = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const strokeColor = root?.getPropertyValue('--accent-secondary').trim() || '#E0F7FA';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <XAxis dataKey="time" hide />
        <YAxis hide />
        <Tooltip />
        <Line type="monotone" dataKey="latency" stroke={strokeColor} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};
