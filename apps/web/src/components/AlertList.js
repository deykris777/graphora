import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AlertList = ({ alerts }) => {
    if (alerts.length === 0) {
        return _jsx("div", { className: "text-sm text-slate-500 dark:text-slate-400", children: "No alerts yet." });
    }
    return (_jsx("div", { className: "space-y-3", children: alerts.map((alert) => (_jsxs("div", { className: "rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5", children: [_jsx("div", { className: "text-xs uppercase text-slate-500 dark:text-slate-400", children: alert.severity }), _jsx("div", { className: "text-sm text-slate-900 dark:text-white", children: alert.message })] }, alert._id ?? alert.message))) }));
};
