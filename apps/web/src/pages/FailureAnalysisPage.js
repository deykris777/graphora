import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useOutletContext } from "react-router-dom";
import { useProjectData } from "../hooks/useProjectData";
import { AlertList } from "../components/AlertList";
import { useAppStore } from "../store/useAppStore";
export const FailureAnalysisPage = () => {
    const { projectId } = useOutletContext();
    const analysis = useProjectData(projectId);
    const alerts = useAppStore((state) => state.alerts);
    return (_jsxs("div", { className: "grid gap-6 lg:grid-cols-[0.55fr_0.45fr]", children: [_jsxs("div", { className: "rounded-2xl border border-slate-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5", children: [_jsx("div", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "AI Failure Analysis" }), _jsx("div", { className: "mt-4 text-sm text-slate-600 dark:text-slate-300", children: analysis?.summary ?? "Waiting for analysis." }), _jsx("div", { className: "mt-6 space-y-2 text-sm text-slate-700 dark:text-slate-200", children: (analysis?.recommendations ?? []).map((rec) => (_jsx("div", { className: "rounded-xl border border-slate-200/70 bg-white/70 px-4 py-2 dark:border-white/10 dark:bg-white/5", children: rec }, rec))) })] }), _jsxs("div", { className: "rounded-2xl border border-slate-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5", children: [_jsx("div", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "Recent Alerts" }), _jsx("div", { className: "mt-4", children: _jsx(AlertList, { alerts: alerts }) })] })] }));
};
