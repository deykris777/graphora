import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    const [revealed, setRevealed] = useState(new Set());
    const [regenId, setRegenId] = useState(null);
    const filtered = selectedProjectId ? apiKeys.filter((k) => k.projectId === selectedProjectId) : apiKeys;
    const mask = (k) => k.slice(0, 8) + "••••••••••••";
    const { getToken } = useAuth();
    const copy = (t) => { navigator.clipboard.writeText(t); addToast("Copied to clipboard", "success"); };
    const toggle = (id) => setRevealed((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const handleGen = async () => {
        if (!keyProjId)
            return;
        try {
            const token = await getToken();
            const k = await generateApiKey(keyProjId, keyLabel || "Default", token ?? undefined);
            setShowGen(false);
            setKeyLabel("");
            addToast(`Key generated: ${k.key.slice(0, 12)}…`, "success");
        }
        catch (err) {
            addToast("Failed to generate key", "error");
        }
    };
    const handleRevoke = async (id) => {
        try {
            const token = await getToken();
            await revokeApiKey(id, token ?? undefined);
            addToast("Key revoked", "error");
        }
        catch (err) {
            addToast("Failed to revoke key", "error");
        }
    };
    const handleRegen = async (id) => {
        try {
            const token = await getToken();
            await regenerateApiKey(id, token ?? undefined);
            setRegenId(null);
            addToast("Key regenerated", "success");
        }
        catch (err) {
            addToast("Failed to regenerate key", "error");
        }
    };
    return (_jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", children: [_jsxs(motion.div, { variants: rise, className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("div", { className: "cc-section-title", children: "API Keys" }), _jsx("div", { className: "cc-section-desc", children: selectedProjectId ? `Keys for ${projects.find((p) => p.id === selectedProjectId)?.name}` : "All API keys" })] }), _jsxs("button", { className: "cc-btn cc-btn--primary", disabled: !projects.length, onClick: () => { setKeyProjId(selectedProjectId ?? projects[0]?.id ?? ""); setShowGen(true); }, children: [_jsx("span", { children: "\uD83D\uDD11" }), " Generate Key"] })] }), filtered.length === 0 ? (_jsx(motion.div, { variants: rise, className: "cc-card", children: _jsxs("div", { className: "cc-empty", children: [_jsx("div", { className: "cc-empty__icon", children: "\uD83D\uDD10" }), _jsx("div", { className: "cc-empty__title", children: "No API keys" }), _jsx("div", { className: "cc-empty__desc", children: "Generate an API key to authenticate your SDK." }), _jsx("button", { className: "cc-btn cc-btn--primary", disabled: !projects.length, onClick: () => { setKeyProjId(selectedProjectId ?? projects[0]?.id ?? ""); setShowGen(true); }, children: "Generate First Key" })] }) })) : (_jsx(motion.div, { variants: rise, className: "cc-card", style: { padding: 0, overflow: "hidden" }, children: _jsxs("table", { className: "cc-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Label" }), _jsx("th", { children: "Key" }), _jsx("th", { children: "Project" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Created" }), _jsx("th", { style: { textAlign: "right" }, children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((ak) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("span", { className: "font-medium", style: { color: "var(--text-heading)" }, children: ak.label }) }), _jsx("td", { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("code", { className: "cc-key-mask", children: revealed.has(ak.id) ? ak.key : mask(ak.key) }), _jsx("button", { className: "cc-btn cc-btn--sm cc-btn--ghost", style: { padding: "3px 8px", fontSize: "10px" }, onClick: () => toggle(ak.id), children: revealed.has(ak.id) ? "Hide" : "Show" })] }) }), _jsx("td", { children: _jsx("span", { className: "text-[11px] font-mono", style: { color: "var(--text-muted)" }, children: projects.find((p) => p.id === ak.projectId)?.name ?? ak.projectId }) }), _jsx("td", { children: _jsx("span", { className: `cc-badge ${ak.status === "active" ? "cc-badge--green" : "cc-badge--red"}`, children: ak.status }) }), _jsx("td", { children: _jsx("span", { className: "text-[11px] font-mono", style: { color: "var(--text-faint)" }, children: new Date(ak.createdAt).toLocaleDateString() }) }), _jsx("td", { children: _jsxs("div", { className: "flex items-center gap-2 justify-end", children: [_jsx("button", { className: "cc-btn cc-btn--sm cc-btn--ghost", onClick: () => copy(ak.key), children: "Copy" }), ak.status === "active" && _jsxs(_Fragment, { children: [_jsx("button", { className: "cc-btn cc-btn--sm cc-btn--ghost", onClick: () => setRegenId(ak.id), children: "Regen" }), _jsx("button", { className: "cc-btn cc-btn--sm cc-btn--danger", onClick: () => handleRevoke(ak.id), children: "Revoke" })] })] }) })] }, ak.id))) })] }) })), _jsx(AnimatePresence, { children: showGen && (_jsx("div", { className: "cc-modal-overlay", onClick: () => setShowGen(false), children: _jsxs(motion.div, { className: "cc-modal", initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "cc-modal-title", children: "Generate API Key" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Project" }), _jsx("select", { className: "cc-select w-full", value: keyProjId, onChange: (e) => setKeyProjId(e.target.value), children: projects.map((p) => _jsx("option", { value: p.id, children: p.name }, p.id)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Label" }), _jsx("input", { className: "cc-input", placeholder: "Production Key", value: keyLabel, onChange: (e) => setKeyLabel(e.target.value) })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { className: "cc-btn cc-btn--primary flex-1", onClick: handleGen, disabled: !keyProjId, children: "Generate" }), _jsx("button", { className: "cc-btn cc-btn--ghost", onClick: () => setShowGen(false), children: "Cancel" })] })] })] }) })) }), _jsx(AnimatePresence, { children: regenId && (_jsx("div", { className: "cc-modal-overlay", onClick: () => setRegenId(null), children: _jsxs(motion.div, { className: "cc-modal", initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "cc-modal-title", children: "Regenerate Key?" }), _jsx("p", { className: "text-sm mb-6", style: { color: "var(--text-muted)" }, children: "The current key will be invalidated immediately." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { className: "cc-btn cc-btn--primary flex-1", onClick: () => handleRegen(regenId), children: "Regenerate" }), _jsx("button", { className: "cc-btn cc-btn--ghost", onClick: () => setRegenId(null), children: "Cancel" })] })] }) })) })] }));
};
