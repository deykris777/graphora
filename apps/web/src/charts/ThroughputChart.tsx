import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AnalyticsPoint } from "../types/analytics";

interface ThroughputChartProps {
  data: AnalyticsPoint[];
}

export const ThroughputChart = ({ data }: ThroughputChartProps) => {
  const chartData = [...data].reverse().map((point) => ({
    time: point.bucket ?? "",
    throughput: point.throughput
  }));

  const root = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const strokeColor = root?.getPropertyValue('--accent-secondary').trim() || '#E0F7FA';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <XAxis dataKey="time" hide />
        <YAxis hide />
        <Tooltip />
        <Area type="monotone" dataKey="throughput" stroke={strokeColor} fill={strokeColor} fillOpacity={0.12} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
