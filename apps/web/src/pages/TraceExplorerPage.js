import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { TraceWaterfall } from "../components/TraceWaterfall";
import { TraceGraphView } from "../graphs/TraceGraph";
import { replayTrace } from "../services/tracesService";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
export const TraceExplorerPage = () => {
    const { projectId } = useOutletContext();
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
    return (_jsxs("div", { className: "grid gap-6 lg:grid-cols-[0.35fr_0.65fr]", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "Trace List" }), _jsx("div", { className: "space-y-2", children: traces.map((trace) => (_jsx("button", { type: "button", onClick: () => setSelected(trace), className: "w-full rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 text-left text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200", children: trace.traceId }, trace.traceId))) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "Trace Details" }), _jsx("button", { type: "button", onClick: handleReplay, className: "rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-200", children: "Replay Trace" })] }), selected ? (_jsxs(_Fragment, { children: [_jsx(TraceGraphView, { graph: selected.graph }), _jsx(TraceWaterfall, { spans: selected.spans })] })) : (_jsx("div", { className: "text-sm text-slate-500 dark:text-slate-400", children: "No trace selected." }))] })] }));
};
