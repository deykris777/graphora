import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useToast } from "../../components/ToastProvider";
import type { AlertMetric, AlertOperator } from "../../types/controlCenter";

const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

const METRIC_LABELS: Record<AlertMetric, string> = { latency: "Latency", error_rate: "Error Rate", no_data: "No Data", throughput: "Throughput", p95_latency: "p95 Latency" };
const METRIC_UNITS: Record<AlertMetric, string> = { latency: "ms", error_rate: "%", no_data: "min", throughput: "req/s", p95_latency: "ms" };

const PRESETS = [
  { name: "High Latency", metric: "latency" as AlertMetric, operator: ">" as AlertOperator, threshold: 1000, unit: "ms" },
  { name: "High Error Rate", metric: "error_rate" as AlertMetric, operator: ">" as AlertOperator, threshold: 5, unit: "%" },
  { name: "No Data", metric: "no_data" as AlertMetric, operator: ">" as AlertOperator, threshold: 10, unit: "min" },
];

export const AlertsConfigTab = () => {
  const { alertRules, selectedProjectId, createAlertRule, deleteAlertRule, toggleAlertRule } = useControlCenterStore();
  const { addToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [metric, setMetric] = useState<AlertMetric>("latency");
  const [operator, setOperator] = useState<AlertOperator>(">");
  const [threshold, setThreshold] = useState(1000);

  const rules = selectedProjectId ? alertRules.filter((r) => r.projectId === selectedProjectId) : alertRules;

  const handleCreate = () => {
    if (!name.trim() || !selectedProjectId) return;
    createAlertRule(selectedProjectId, name.trim(), metric, operator, threshold, METRIC_UNITS[metric]);
    setShowCreate(false);
    setName(""); setMetric("latency"); setOperator(">"); setThreshold(1000);
    addToast("Alert rule created", "success");
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setName(preset.name);
    setMetric(preset.metric);
    setOperator(preset.operator);
    setThreshold(preset.threshold);
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={rise} className="flex items-center justify-between">
        <div>
          <div className="cc-section-title">Alert Configuration</div>
          <div className="cc-section-desc">Set up alert rules for anomaly detection</div>
        </div>
        <button className="cc-btn cc-btn--primary" onClick={() => setShowCreate(true)} disabled={!selectedProjectId}>
          + Create Alert
        </button>
      </motion.div>

      {!selectedProjectId && (
        <motion.div variants={rise} className="cc-card">
          <div className="text-[12px]" style={{ color: "var(--badge-error-text)" }}>⚠ Select a project first to manage alerts.</div>
        </motion.div>
      )}

      {rules.length === 0 && selectedProjectId ? (
        <motion.div variants={rise} className="cc-card">
          <div className="cc-empty">
            <div className="cc-empty__icon">🔔</div>
            <div className="cc-empty__title">No alert rules</div>
            <div className="cc-empty__desc">Create alert rules to get notified of anomalies.</div>
            <button className="cc-btn cc-btn--primary" onClick={() => setShowCreate(true)}>Create First Alert</button>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={stagger} className="space-y-3">
          {rules.map((rule) => (
            <motion.div key={rule.id} variants={rise} className="cc-card cc-card--sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className={`cc-toggle ${rule.enabled ? "cc-toggle--on" : ""}`} onClick={() => toggleAlertRule(rule.id)} />
                  <div>
                    <div className="font-medium text-[13px]" style={{ color: rule.enabled ? "var(--text-heading)" : "var(--text-faint)" }}>{rule.name}</div>
                    <div className="text-[11px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                      {METRIC_LABELS[rule.metric]} {rule.operator} {rule.threshold}{rule.unit}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`cc-badge ${rule.enabled ? "cc-badge--green" : "cc-badge--muted"}`}>{rule.enabled ? "Active" : "Disabled"}</span>
                  <button className="cc-btn cc-btn--sm cc-btn--danger" onClick={() => { deleteAlertRule(rule.id); addToast("Alert deleted", "error"); }}>Delete</button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {showCreate && (
          <div className="cc-modal-overlay" onClick={() => setShowCreate(false)}>
            <motion.div className="cc-modal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} onClick={(e) => e.stopPropagation()}>
              <div className="cc-modal-title">Create Alert Rule</div>
              {/* Presets */}
              <div className="mb-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-faint)" }}>Quick Presets</div>
                <div className="flex gap-2">
                  {PRESETS.map((p) => (
                    <button key={p.name} className="cc-btn cc-btn--sm cc-btn--ghost" onClick={() => applyPreset(p)}>{p.name}</button>
                  ))}
                </div>
              </div>
              <div className="cc-separator" />
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Name</label>
                  <input className="cc-input" placeholder="High Latency Alert" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                </div>
                <div className="cc-grid-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Metric</label>
                    <select className="cc-select w-full" value={metric} onChange={(e) => setMetric(e.target.value as AlertMetric)}>
                      {Object.entries(METRIC_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Operator</label>
                    <select className="cc-select w-full" value={operator} onChange={(e) => setOperator(e.target.value as AlertOperator)}>
                      {[">", "<", ">=", "<=", "=="].map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Threshold</label>
                    <div className="flex items-center gap-2">
                      <input className="cc-input" type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
                      <span className="text-[11px] font-mono" style={{ color: "var(--text-faint)" }}>{METRIC_UNITS[metric]}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button className="cc-btn cc-btn--primary flex-1" onClick={handleCreate} disabled={!name.trim()}>Create Alert</button>
                  <button className="cc-btn cc-btn--ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
