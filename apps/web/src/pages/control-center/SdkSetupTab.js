import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useToast } from "../../components/ToastProvider";
const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
export const SdkSetupTab = () => {
    const { projects, apiKeys, selectedProjectId } = useControlCenterStore();
    const { addToast } = useToast();
    const [lang, setLang] = useState("ts");
    const project = projects.find((p) => p.id === selectedProjectId);
    const key = apiKeys.find((k) => k.projectId === selectedProjectId && k.status === "active");
    const apiKeyStr = key?.key ?? "YOUR_API_KEY";
    const projectIdStr = project?.id ?? "YOUR_PROJECT_ID";
    const copy = (t) => { navigator.clipboard.writeText(t); addToast("Copied!", "success"); };
    const installCmd = "npm install @graphyn/sdk";
    const codeSnippets = {
        ts: `import { createClient } from "@graphyn/sdk";

const graphyn = createClient({
  apiKey: "${apiKeyStr}",
  projectId: "${projectIdStr}",
  endpoint: "https://api.graphyn.dev"
});

// Track a custom event
await graphyn.track({
  service: "auth-service",
  event: "user.login",
  latency: 42,
  status: "success"
});`,
        js: `const { createClient } = require("@graphyn/sdk");

const graphyn = createClient({
  apiKey: "${apiKeyStr}",
  projectId: "${projectIdStr}",
  endpoint: "https://api.graphyn.dev"
});

// Track a custom event
graphyn.track({
  service: "auth-service",
  event: "user.login",
  latency: 42,
  status: "success"
});`,
        curl: `curl -X POST https://api.graphyn.dev/v1/track \\
  -H "Authorization: Bearer ${apiKeyStr}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "${projectIdStr}",
    "service": "auth-service",
    "event": "user.login",
    "latency": 42,
    "status": "success"
  }'`,
    };
    const endpoint = "https://api.graphyn.dev/v1/track";
    return (_jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", className: "space-y-6", children: [_jsxs(motion.div, { variants: rise, children: [_jsx("div", { className: "cc-section-title", children: "SDK Installation" }), _jsx("div", { className: "cc-section-desc", children: project ? `Setup instructions for ${project.name}` : "Select a project to see personalized code snippets" })] }), _jsxs(motion.div, { variants: rise, className: "cc-card", children: [_jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider mb-3", style: { color: "var(--text-muted)" }, children: "1. Install the SDK" }), _jsxs("div", { className: "cc-code-block", children: [_jsx("button", { className: "cc-copy-btn", onClick: () => copy(installCmd), children: "Copy" }), installCmd] })] }), _jsxs(motion.div, { variants: rise, className: "cc-card", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider", style: { color: "var(--text-muted)" }, children: "2. Initialize the client" }), _jsx("div", { className: "flex gap-1", children: ["ts", "js", "curl"].map((l) => (_jsx("button", { className: `cc-tab ${lang === l ? "cc-tab--active" : ""}`, style: { padding: "5px 12px", fontSize: "10px", borderRadius: "6px" }, onClick: () => setLang(l), children: l === "ts" ? "TypeScript" : l === "js" ? "JavaScript" : "cURL" }, l))) })] }), _jsxs("div", { className: "cc-code-block", children: [_jsx("button", { className: "cc-copy-btn", onClick: () => copy(codeSnippets[lang]), children: "Copy" }), codeSnippets[lang]] }), !project && (_jsx("div", { className: "mt-3 text-[11px] px-1", style: { color: "var(--badge-error-text)" }, children: "\u26A0 Select a project from the Projects tab to auto-fill credentials" }))] }), _jsxs(motion.div, { variants: rise, className: "cc-card", children: [_jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider mb-3", style: { color: "var(--text-muted)" }, children: "3. Telemetry Endpoint" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "cc-code-block flex-1", style: { padding: "14px 20px" }, children: endpoint }), _jsx("button", { className: "cc-btn cc-btn--ghost", onClick: () => copy(endpoint), children: "Copy" })] }), _jsx("div", { className: "mt-3 text-[11px]", style: { color: "var(--text-faint)" }, children: "All telemetry events should be sent to this endpoint via POST request." })] }), _jsxs(motion.div, { variants: rise, className: "cc-card", children: [_jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider mb-3", style: { color: "var(--text-muted)" }, children: "Quick Reference" }), _jsxs("div", { className: "cc-grid-3", children: [_jsxs("div", { className: "cc-card cc-card--sm", children: [_jsx("div", { className: "text-[10px] font-mono uppercase tracking-wider mb-1", style: { color: "var(--text-faint)" }, children: "Project ID" }), _jsx("div", { className: "text-[13px] font-mono truncate", style: { color: "var(--accent)" }, children: projectIdStr })] }), _jsxs("div", { className: "cc-card cc-card--sm", children: [_jsx("div", { className: "text-[10px] font-mono uppercase tracking-wider mb-1", style: { color: "var(--text-faint)" }, children: "API Key" }), _jsxs("div", { className: "text-[13px] font-mono truncate", style: { color: "var(--accent)" }, children: [apiKeyStr.slice(0, 16), "\u2026"] })] }), _jsxs("div", { className: "cc-card cc-card--sm", children: [_jsx("div", { className: "text-[10px] font-mono uppercase tracking-wider mb-1", style: { color: "var(--text-faint)" }, children: "Endpoint" }), _jsx("div", { className: "text-[13px] font-mono truncate", style: { color: "var(--accent)" }, children: "api.graphyn.dev" })] })] })] })] }));
};
