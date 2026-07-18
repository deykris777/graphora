import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from "../store/useAppStore";
import { AlertList } from "../components/AlertList";
export const AlertsPage = () => {
    const alerts = useAppStore((state) => state.alerts);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "Alerts System" }), _jsx(AlertList, { alerts: alerts })] }));
};
