import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useToast } from "../../components/ToastProvider";
const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const METRIC_LABELS = { latency: "Latency", error_rate: "Error Rate", no_data: "No Data", throughput: "Throughput", p95_latency: "p95 Latency" };
const METRIC_UNITS = { latency: "ms", error_rate: "%", no_data: "min", throughput: "req/s", p95_latency: "ms" };
const PRESETS = [
    { name: "High Latency", metric: "latency", operator: ">", threshold: 1000, unit: "ms" },
    { name: "High Error Rate", metric: "error_rate", operator: ">", threshold: 5, unit: "%" },
    { name: "No Data", metric: "no_data", operator: ">", threshold: 10, unit: "min" },
];
export const AlertsConfigTab = () => {
    const { alertRules, selectedProjectId, createAlertRule, deleteAlertRule, toggleAlertRule } = useControlCenterStore();
    const { addToast } = useToast();
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState("");
    const [metric, setMetric] = useState("latency");
    const [operator, setOperator] = useState(">");
    const [threshold, setThreshold] = useState(1000);
    const rules = selectedProjectId ? alertRules.filter((r) => r.projectId === selectedProjectId) : alertRules;
    const handleCreate = () => {
        if (!name.trim() || !selectedProjectId)
            return;
        createAlertRule(selectedProjectId, name.trim(), metric, operator, threshold, METRIC_UNITS[metric]);
        setShowCreate(false);
        setName("");
        setMetric("latency");
        setOperator(">");
        setThreshold(1000);
        addToast("Alert rule created", "success");
    };
    const applyPreset = (preset) => {
        setName(preset.name);
        setMetric(preset.metric);
        setOperator(preset.operator);
        setThreshold(preset.threshold);
    };
    return (_jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", className: "space-y-6", children: [_jsxs(motion.div, { variants: rise, className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "cc-section-title", children: "Alert Configuration" }), _jsx("div", { className: "cc-section-desc", children: "Set up alert rules for anomaly detection" })] }), _jsx("button", { className: "cc-btn cc-btn--primary", onClick: () => setShowCreate(true), disabled: !selectedProjectId, children: "+ Create Alert" })] }), !selectedProjectId && (_jsx(motion.div, { variants: rise, className: "cc-card", children: _jsx("div", { className: "text-[12px]", style: { color: "var(--badge-error-text)" }, children: "\u26A0 Select a project first to manage alerts." }) })), rules.length === 0 && selectedProjectId ? (_jsx(motion.div, { variants: rise, className: "cc-card", children: _jsxs("div", { className: "cc-empty", children: [_jsx("div", { className: "cc-empty__icon", children: "\uD83D\uDD14" }), _jsx("div", { className: "cc-empty__title", children: "No alert rules" }), _jsx("div", { className: "cc-empty__desc", children: "Create alert rules to get notified of anomalies." }), _jsx("button", { className: "cc-btn cc-btn--primary", onClick: () => setShowCreate(true), children: "Create First Alert" })] }) })) : (_jsx(motion.div, { variants: stagger, className: "space-y-3", children: rules.map((rule) => (_jsx(motion.div, { variants: rise, className: "cc-card cc-card--sm", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { className: `cc-toggle ${rule.enabled ? "cc-toggle--on" : ""}`, onClick: () => toggleAlertRule(rule.id) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-[13px]", style: { color: rule.enabled ? "var(--text-heading)" : "var(--text-faint)" }, children: rule.name }), _jsxs("div", { className: "text-[11px] font-mono mt-1", style: { color: "var(--text-muted)" }, children: [METRIC_LABELS[rule.metric], " ", rule.operator, " ", rule.threshold, rule.unit] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `cc-badge ${rule.enabled ? "cc-badge--green" : "cc-badge--muted"}`, children: rule.enabled ? "Active" : "Disabled" }), _jsx("button", { className: "cc-btn cc-btn--sm cc-btn--danger", onClick: () => { deleteAlertRule(rule.id); addToast("Alert deleted", "error"); }, children: "Delete" })] })] }) }, rule.id))) })), _jsx(AnimatePresence, { children: showCreate && (_jsx("div", { className: "cc-modal-overlay", onClick: () => setShowCreate(false), children: _jsxs(motion.div, { className: "cc-modal", initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "cc-modal-title", children: "Create Alert Rule" }), _jsxs("div", { className: "mb-4", children: [_jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-faint)" }, children: "Quick Presets" }), _jsx("div", { className: "flex gap-2", children: PRESETS.map((p) => (_jsx("button", { className: "cc-btn cc-btn--sm cc-btn--ghost", onClick: () => applyPreset(p), children: p.name }, p.name))) })] }), _jsx("div", { className: "cc-separator" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Name" }), _jsx("input", { className: "cc-input", placeholder: "High Latency Alert", value: name, onChange: (e) => setName(e.target.value), autoFocus: true })] }), _jsxs("div", { className: "cc-grid-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Metric" }), _jsx("select", { className: "cc-select w-full", value: metric, onChange: (e) => setMetric(e.target.value), children: Object.entries(METRIC_LABELS).map(([k, v]) => _jsx("option", { value: k, children: v }, k)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Operator" }), _jsx("select", { className: "cc-select w-full", value: operator, onChange: (e) => setOperator(e.target.value), children: [">", "<", ">=", "<=", "=="].map((op) => _jsx("option", { value: op, children: op }, op)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Threshold" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { className: "cc-input", type: "number", value: threshold, onChange: (e) => setThreshold(Number(e.target.value)) }), _jsx("span", { className: "text-[11px] font-mono", style: { color: "var(--text-faint)" }, children: METRIC_UNITS[metric] })] })] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { className: "cc-btn cc-btn--primary flex-1", onClick: handleCreate, disabled: !name.trim(), children: "Create Alert" }), _jsx("button", { className: "cc-btn cc-btn--ghost", onClick: () => setShowCreate(false), children: "Cancel" })] })] })] }) })) })] }));
};
