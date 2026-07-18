import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { TraceWaterfall } from "../components/TraceWaterfall";
import { TraceGraphView } from "../graphs/TraceGraph";
import { replayTrace } from "../services/tracesService";
import { useOutletContext } from "react-router-dom";
import { AppShellContext } from "../components/AppShell";
import { useAuth } from "@clerk/clerk-react";

export const TraceExplorerPage = () => {
  const { projectId } = useOutletContext<AppShellContext>();
  const { getToken } = useAuth();
  const traces = useAppStore((state) => state.traces);
  const [selected, setSelected] = useState(traces[0]);

  useEffect(() => {
    if (!selected && traces[0]) {
      setSelected(traces[0]);
    }
  }, [selected, traces]);

  const handleReplay = async () => {
    if (!selected) {
      return;
    }
    const authToken = await getToken();
    await replayTrace(projectId, selected.traceId, authToken ?? undefined);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
      <div className="space-y-4">
        <div className="text-lg font-semibold text-slate-900 dark:text-white">Trace List</div>
        <div className="space-y-2">
          {traces.map((trace) => (
            <button
              key={trace.traceId}
              type="button"
              onClick={() => setSelected(trace)}
              className="w-full rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 text-left text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              {trace.traceId}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900 dark:text-white">Trace Details</div>
          <button
            type="button"
            onClick={handleReplay}
            className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-200"
          >
            Replay Trace
          </button>
        </div>
        {selected ? (
          <>
            <TraceGraphView graph={selected.graph} />
            <TraceWaterfall spans={selected.spans} />
          </>
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400">No trace selected.</div>
        )}
      </div>
    </div>
  );
};
