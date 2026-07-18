import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from "../store/useAppStore";
import { LogsTable } from "../components/LogsTable";
export const LogsPage = () => {
    const logs = useAppStore((state) => state.logs);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "Logs Viewer" }), _jsx(LogsTable, { logs: logs })] }));
};
