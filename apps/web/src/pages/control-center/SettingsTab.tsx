import { motion } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useToast } from "../../components/ToastProvider";
import type { Environment } from "../../types/controlCenter";

const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

const ENVS: { value: Environment; label: string; desc: string; color: string }[] = [
  { value: "development", label: "Development", desc: "Local testing and debugging", color: "#60a5fa" },
  { value: "staging", label: "Staging", desc: "Pre-production validation", color: "#fbbf24" },
  { value: "production", label: "Production", desc: "Live customer-facing traffic", color: "#f87171" },
];

export const SettingsTab = () => {
  const { activeEnvironment, setActiveEnvironment, dataRetention, updateDataRetention } = useControlCenterStore();
  const { addToast } = useToast();

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={rise}>
        <div className="cc-section-title">Settings</div>
        <div className="cc-section-desc">Environment and data configuration</div>
      </motion.div>

      {/* Environment Switcher */}
      <motion.div variants={rise} className="cc-card">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Environment</div>
        <div className="cc-grid-3">
          {ENVS.map((env) => (
            <button
              key={env.value}
              className="cc-card cc-card--sm cc-card--interactive text-left"
              style={activeEnvironment === env.value ? { borderColor: env.color, boxShadow: `0 0 20px ${env.color}20` } : {}}
              onClick={() => { setActiveEnvironment(env.value); addToast(`Switched to ${env.label}`, "success"); }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: env.color, boxShadow: activeEnvironment === env.value ? `0 0 8px ${env.color}` : "none" }} />
                <span className="text-[13px] font-semibold" style={{ color: activeEnvironment === env.value ? env.color : "var(--text-heading)" }}>{env.label}</span>
              </div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{env.desc}</div>
              {activeEnvironment === env.value && (
                <div className="mt-2">
                  <span className="cc-badge cc-badge--accent">Active</span>
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-4 text-[11px]" style={{ color: "var(--text-faint)" }}>
          ℹ Telemetry data is isolated per environment. Switching environments will show data only for the selected environment.
        </div>
      </motion.div>

      {/* Retention Settings */}
      <motion.div variants={rise} className="cc-card">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Data Retention</div>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--text-body)" }}>Retention Period</label>
            <div className="flex items-center gap-3">
              <select
                className="cc-select"
                value={dataRetention.retentionDays}
                onChange={(e) => { updateDataRetention({ retentionDays: Number(e.target.value) }); addToast("Retention updated", "success"); }}
              >
                <option value={7}>7 Days</option>
                <option value={14}>14 Days</option>
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days</option>
              </select>
              <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>Events older than this will be automatically purged.</span>
            </div>
          </div>
          <div className="cc-separator" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-medium" style={{ color: "var(--text-body)" }}>Current Storage</div>
              <div className="text-[11px] mt-1" style={{ color: "var(--text-faint)" }}>{dataRetention.eventsStored.toLocaleString()} events stored</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold font-mono" style={{ color: "var(--accent)" }}>
                {dataRetention.storageUsedMB > 1024 ? `${(dataRetention.storageUsedMB / 1024).toFixed(1)} GB` : `${dataRetention.storageUsedMB} MB`}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={rise} className="cc-card" style={{ borderColor: "var(--badge-error-border)" }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--badge-error-text)" }}>Danger Zone</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium" style={{ color: "var(--text-body)" }}>Clear All Data</div>
            <div className="text-[11px] mt-1" style={{ color: "var(--text-faint)" }}>Permanently delete all telemetry data for the current environment.</div>
          </div>
          <button className="cc-btn cc-btn--sm cc-btn--danger" onClick={() => addToast("Data cleared (simulated)", "error")}>
            Clear Data
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
