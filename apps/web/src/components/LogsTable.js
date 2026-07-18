import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LogsTable = ({ logs }) => {
    if (logs.length === 0) {
        return _jsx("div", { className: "text-sm text-slate-500 dark:text-slate-400", children: "No logs yet." });
    }
    return (_jsx("div", { className: "space-y-2", children: logs.map((log) => (_jsxs("div", { className: "flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-slate-900 dark:text-white", children: log.message }), _jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400", children: log.serviceId ?? "system" })] }), _jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400", children: log.level })] }, log._id ?? log.message))) }));
};
