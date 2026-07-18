import { ChartCard } from "../components/ChartCard";
import { EventFeed } from "../components/EventFeed";
import { LiveTrafficGraph } from "../graphs/LiveTrafficGraph";
import { useAppStore } from "../store/useAppStore";

export const LiveTrafficPage = () => {
  const traffic = useAppStore((state) => state.traffic);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <ChartCard title="Latency Stream" subtitle="Realtime request flow">
        <LiveTrafficGraph events={traffic} />
      </ChartCard>
      <ChartCard title="Live Event Feed" subtitle="Trace spans">
        <div className="h-56 overflow-y-auto">
          <EventFeed />
        </div>
      </ChartCard>
    </div>
  );
};
