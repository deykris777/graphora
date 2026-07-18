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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Latency Trend" subtitle="Average latency">
        <LatencyTrendChart data={data} />
      </ChartCard>
      <ChartCard title="Request Volume" subtitle="Traffic load">
        <RequestVolumeChart data={data} />
      </ChartCard>
      <ChartCard title="Error Rate" subtitle="Failures">
        <ErrorRateChart data={data} />
      </ChartCard>
      <ChartCard title="Throughput" subtitle="Requests per minute">
        <ThroughputChart data={data} />
      </ChartCard>
      <ChartCard title="Traffic Heatmap" subtitle="p95 latency">
        <TrafficHeatmapChart data={data} />
      </ChartCard>
    </div>
  );
};
