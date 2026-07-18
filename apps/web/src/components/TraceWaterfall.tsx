import { TraceSpan } from "../types/trace";

interface TraceWaterfallProps {
  spans: TraceSpan[];
}

export const TraceWaterfall = ({ spans }: TraceWaterfallProps) => {
  if (spans.length === 0) {
    return <div className="text-sm text-slate-500 dark:text-slate-400">No trace spans yet.</div>;
  }

  const maxLatency = Math.max(...spans.map((span) => span.metrics.latency));

  return (
    <div className="space-y-3">
      {spans.map((span) => (
        <div key={span.spanId} className="flex items-center gap-4">
          <div className="w-40 text-xs text-slate-600 dark:text-slate-300">{span.service.name}</div>
          <div className="h-3 flex-1 rounded-full bg-white/5">
            <div
              className={`h-3 rounded-full ${
                span.status === "error" ? "bg-red-500/70" : "bg-cyan-400/70"
              }`}
              style={{ width: `${(span.metrics.latency / maxLatency) * 100}%` }}
            />
          </div>
          <div className="w-16 text-right text-xs text-slate-600 dark:text-slate-300">
            {span.metrics.latency}ms
          </div>
        </div>
      ))}
    </div>
  );
};
