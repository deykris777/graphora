import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GlassPanel } from "./GlassPanel";
import { motion } from "framer-motion";
export const MetricCard = ({ label, value, detail }) => {
    return (_jsxs(GlassPanel, { children: [_jsx("div", { className: "text-[10px] uppercase tracking-[0.15em] font-mono", style: { color: 'var(--text-muted)' }, children: label }), _jsx(motion.div, { className: "mt-3 text-2xl font-bold font-mono tabular-nums", style: { color: 'var(--accent)' }, initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 }, children: value }, value), _jsx("div", { className: "mt-2 text-[11px]", style: { color: 'var(--text-faint)' }, children: detail })] }));
};
