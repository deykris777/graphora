import { useState } from "react";
import { motion } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useToast } from "../../components/ToastProvider";

const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

export const SdkSetupTab = () => {
  const { projects, apiKeys, selectedProjectId } = useControlCenterStore();
  const { addToast } = useToast();
  const [lang, setLang] = useState<"js" | "ts" | "curl">("ts");

  const project = projects.find((p) => p.id === selectedProjectId);
  const key = apiKeys.find((k) => k.projectId === selectedProjectId && k.status === "active");

  const apiKeyStr = key?.key ?? "YOUR_API_KEY";
  const projectIdStr = project?.id ?? "YOUR_PROJECT_ID";

  const copy = (t: string) => { navigator.clipboard.writeText(t); addToast("Copied!", "success"); };

  const installCmd = "npm install @graphyn/sdk";

  const codeSnippets: Record<string, string> = {
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

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={rise}>
        <div className="cc-section-title">SDK Installation</div>
        <div className="cc-section-desc">
          {project ? `Setup instructions for ${project.name}` : "Select a project to see personalized code snippets"}
        </div>
      </motion.div>

      {/* Install Command */}
      <motion.div variants={rise} className="cc-card">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>1. Install the SDK</div>
        <div className="cc-code-block">
          <button className="cc-copy-btn" onClick={() => copy(installCmd)}>Copy</button>
          {installCmd}
        </div>
      </motion.div>

      {/* Init Code */}
      <motion.div variants={rise} className="cc-card">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>2. Initialize the client</div>
          <div className="flex gap-1">
            {(["ts", "js", "curl"] as const).map((l) => (
              <button
                key={l}
                className={`cc-tab ${lang === l ? "cc-tab--active" : ""}`}
                style={{ padding: "5px 12px", fontSize: "10px", borderRadius: "6px" }}
                onClick={() => setLang(l)}
              >
                {l === "ts" ? "TypeScript" : l === "js" ? "JavaScript" : "cURL"}
              </button>
            ))}
          </div>
        </div>
        <div className="cc-code-block">
          <button className="cc-copy-btn" onClick={() => copy(codeSnippets[lang])}>Copy</button>
          {codeSnippets[lang]}
        </div>
        {!project && (
          <div className="mt-3 text-[11px] px-1" style={{ color: "var(--badge-error-text)" }}>
            ⚠ Select a project from the Projects tab to auto-fill credentials
          </div>
        )}
      </motion.div>

      {/* Ingestion Endpoint */}
      <motion.div variants={rise} className="cc-card">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>3. Telemetry Endpoint</div>
        <div className="flex items-center gap-3">
          <div className="cc-code-block flex-1" style={{ padding: "14px 20px" }}>
            {endpoint}
          </div>
          <button className="cc-btn cc-btn--ghost" onClick={() => copy(endpoint)}>Copy</button>
        </div>
        <div className="mt-3 text-[11px]" style={{ color: "var(--text-faint)" }}>
          All telemetry events should be sent to this endpoint via POST request.
        </div>
      </motion.div>

      {/* Quick Reference */}
      <motion.div variants={rise} className="cc-card">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Quick Reference</div>
        <div className="cc-grid-3">
          <div className="cc-card cc-card--sm">
            <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-faint)" }}>Project ID</div>
            <div className="text-[13px] font-mono truncate" style={{ color: "var(--accent)" }}>{projectIdStr}</div>
          </div>
          <div className="cc-card cc-card--sm">
            <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-faint)" }}>API Key</div>
            <div className="text-[13px] font-mono truncate" style={{ color: "var(--accent)" }}>{apiKeyStr.slice(0, 16)}…</div>
          </div>
          <div className="cc-card cc-card--sm">
            <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-faint)" }}>Endpoint</div>
            <div className="text-[13px] font-mono truncate" style={{ color: "var(--accent)" }}>api.graphyn.dev</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
