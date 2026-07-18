import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AnalyticsPoint } from "../types/analytics";

interface RequestVolumeChartProps {
  data: AnalyticsPoint[];
}

export const RequestVolumeChart = ({ data }: RequestVolumeChartProps) => {
  const chartData = [...data].reverse().map((point) => ({
    time: point.bucket ?? "",
    requests: point.requestCount
  }));

  const root = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const fillColor = root?.getPropertyValue('--accent-secondary').trim() || '#E0F7FA';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="time" hide />
        <YAxis hide />
        <Tooltip />
        <Bar dataKey="requests" fill={fillColor} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
