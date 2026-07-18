import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from "../app/theme";
export const SettingsPage = () => {
    const { mode } = useTheme();
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "Settings" }), _jsxs("div", { className: "rounded-2xl border border-slate-200/70 bg-white/70 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300", children: [_jsxs("div", { children: ["Active theme: ", mode] }), _jsx("div", { className: "mt-2", children: "Theme selection persists across sessions." })] })] }));
};
