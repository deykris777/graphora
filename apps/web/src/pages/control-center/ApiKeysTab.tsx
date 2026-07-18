import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useToast } from "../../components/ToastProvider";
import { useAuth } from "@clerk/clerk-react";

const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

export const ApiKeysTab = () => {
  const { projects, apiKeys, selectedProjectId, generateApiKey, revokeApiKey, regenerateApiKey } = useControlCenterStore();
  const { addToast } = useToast();
  const [showGen, setShowGen] = useState(false);
  const [keyLabel, setKeyLabel] = useState("");
  const [keyProjId, setKeyProjId] = useState(selectedProjectId ?? "");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [regenId, setRegenId] = useState<string | null>(null);

  const filtered = selectedProjectId ? apiKeys.filter((k) => k.projectId === selectedProjectId) : apiKeys;
  const mask = (k: string) => k.slice(0, 8) + "••••••••••••";
  const { getToken } = useAuth();
  const copy = (t: string) => { navigator.clipboard.writeText(t); addToast("Copied to clipboard", "success"); };
  const toggle = (id: string) => setRevealed((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleGen = async () => {
    if (!keyProjId) return;
    try {
      const token = await getToken();
      const k = await generateApiKey(keyProjId, keyLabel || "Default", token ?? undefined);
      setShowGen(false); setKeyLabel("");
      addToast(`Key generated: ${k.key.slice(0, 12)}…`, "success");
    } catch (err) {
      addToast("Failed to generate key", "error");
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      const token = await getToken();
      await revokeApiKey(id, token ?? undefined);
      addToast("Key revoked", "error");
    } catch (err) {
      addToast("Failed to revoke key", "error");
    }
  };

  const handleRegen = async (id: string) => {
    try {
      const token = await getToken();
      await regenerateApiKey(id, token ?? undefined);
      setRegenId(null);
      addToast("Key regenerated", "success");
    } catch (err) {
      addToast("Failed to regenerate key", "error");
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={rise} className="flex items-center justify-between mb-6">
        <div>
          <div className="cc-section-title">API Keys</div>
          <div className="cc-section-desc">{selectedProjectId ? `Keys for ${projects.find((p) => p.id === selectedProjectId)?.name}` : "All API keys"}</div>
        </div>
        <button className="cc-btn cc-btn--primary" disabled={!projects.length} onClick={() => { setKeyProjId(selectedProjectId ?? projects[0]?.id ?? ""); setShowGen(true); }}>
          <span>🔑</span> Generate Key
        </button>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div variants={rise} className="cc-card">
          <div className="cc-empty">
            <div className="cc-empty__icon">🔐</div>
            <div className="cc-empty__title">No API keys</div>
            <div className="cc-empty__desc">Generate an API key to authenticate your SDK.</div>
            <button className="cc-btn cc-btn--primary" disabled={!projects.length} onClick={() => { setKeyProjId(selectedProjectId ?? projects[0]?.id ?? ""); setShowGen(true); }}>Generate First Key</button>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={rise} className="cc-card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="cc-table">
            <thead><tr><th>Label</th><th>Key</th><th>Project</th><th>Status</th><th>Created</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((ak) => (
                <tr key={ak.id}>
                  <td><span className="font-medium" style={{ color: "var(--text-heading)" }}>{ak.label}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <code className="cc-key-mask">{revealed.has(ak.id) ? ak.key : mask(ak.key)}</code>
                      <button className="cc-btn cc-btn--sm cc-btn--ghost" style={{ padding: "3px 8px", fontSize: "10px" }} onClick={() => toggle(ak.id)}>{revealed.has(ak.id) ? "Hide" : "Show"}</button>
                    </div>
                  </td>
                  <td><span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{projects.find((p) => p.id === ak.projectId)?.name ?? ak.projectId}</span></td>
                  <td><span className={`cc-badge ${ak.status === "active" ? "cc-badge--green" : "cc-badge--red"}`}>{ak.status}</span></td>
                  <td><span className="text-[11px] font-mono" style={{ color: "var(--text-faint)" }}>{new Date(ak.createdAt).toLocaleDateString()}</span></td>
                  <td>
                    <div className="flex items-center gap-2 justify-end">
                      <button className="cc-btn cc-btn--sm cc-btn--ghost" onClick={() => copy(ak.key)}>Copy</button>
                      {ak.status === "active" && <>
                        <button className="cc-btn cc-btn--sm cc-btn--ghost" onClick={() => setRegenId(ak.id)}>Regen</button>
                        <button className="cc-btn cc-btn--sm cc-btn--danger" onClick={() => handleRevoke(ak.id)}>Revoke</button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <AnimatePresence>
        {showGen && (
          <div className="cc-modal-overlay" onClick={() => setShowGen(false)}>
            <motion.div className="cc-modal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} onClick={(e) => e.stopPropagation()}>
              <div className="cc-modal-title">Generate API Key</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Project</label>
                  <select className="cc-select w-full" value={keyProjId} onChange={(e) => setKeyProjId(e.target.value)}>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Label</label>
                  <input className="cc-input" placeholder="Production Key" value={keyLabel} onChange={(e) => setKeyLabel(e.target.value)} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button className="cc-btn cc-btn--primary flex-1" onClick={handleGen} disabled={!keyProjId}>Generate</button>
                  <button className="cc-btn cc-btn--ghost" onClick={() => setShowGen(false)}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {regenId && (
          <div className="cc-modal-overlay" onClick={() => setRegenId(null)}>
            <motion.div className="cc-modal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} onClick={(e) => e.stopPropagation()}>
              <div className="cc-modal-title">Regenerate Key?</div>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>The current key will be invalidated immediately.</p>
              <div className="flex gap-3">
                <button className="cc-btn cc-btn--primary flex-1" onClick={() => handleRegen(regenId!)}>Regenerate</button>
                <button className="cc-btn cc-btn--ghost" onClick={() => setRegenId(null)}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
