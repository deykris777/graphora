import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GlassPanel } from "./GlassPanel";
export const ChartCard = ({ title, subtitle, children }) => {
    return (_jsxs(GlassPanel, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-semibold", style: { color: 'var(--accent)' }, children: title }), subtitle ? (_jsx("div", { className: "text-[11px] font-mono mt-0.5", style: { color: 'var(--text-faint)' }, children: subtitle })) : null] }), _jsx("div", { className: "h-1.5 w-1.5 rounded-full animate-pulse", style: { backgroundColor: 'var(--pulse-dot)' } })] }), _jsx("div", { className: "mt-5 h-56", children: children })] }));
};
