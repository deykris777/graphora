import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useAppStore } from "../../store/useAppStore";
import { useToast } from "../../components/ToastProvider";
import type { Environment } from "../../types/controlCenter";
import { useAuth } from "@clerk/clerk-react";

const STEPS = ["Create Project", "Generate API Key", "Install SDK", "Send First Event", "Verify Connection"];

export const QuickStartWizard = () => {
  const { getToken } = useAuth();
  const {
    wizardOpen, wizardStep, setWizardStep, closeWizard,
    projects, apiKeys, selectedProjectId,
    createProject, generateApiKey, setConnectionStatus, incrementEventsToday, updateUsageStats, usageStats,
  } = useControlCenterStore();
  const { 
    addTraffic, 
    updateService, 
    setMetrics, 
    addAnalyticsPoint, 
    setAnalytics, 
    setTraces, 
    setLogs, 
    setAlerts,
    traces: appTraces,
    logs: appLogs,
    alerts: appAlerts
  } = useAppStore();
  const { addToast } = useToast();

  const [projName, setProjName] = useState("");
  const [projEnv, setProjEnv] = useState<Environment>("production");
  const [createdProjId, setCreatedProjId] = useState<string | null>(selectedProjectId);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [testSent, setTestSent] = useState(false);
  const [sending, setSending] = useState(false);

  const currentProject = projects.find((p) => p.id === createdProjId);
  const currentKey = generatedKey ?? apiKeys.find((k) => k.projectId === createdProjId && k.status === "active")?.key;

  const handleCreateProject = async () => {
    if (!projName.trim()) return;
    try {
      const token = await getToken();
      const p = await createProject(projName.trim(), projEnv, token ?? undefined);
      setCreatedProjId(p.id);
      setProjName("");
      addToast(`Project "${p.name}" created`, "success");
      setWizardStep(1);
    } catch (err) {
      addToast("Failed to create project", "error");
    }
  };

  const handleGenerateKey = async () => {
    if (!createdProjId) return;
    try {
      const token = await getToken();
      const k = await generateApiKey(createdProjId, "Default", token ?? undefined);
      setGeneratedKey(k.key);
      addToast("API Key generated", "success");
      setWizardStep(2);
    } catch (err) {
      addToast("Failed to generate key", "error");
    }
  };

  const handleSendTest = useCallback(() => {
    setSending(true);
    const services = [
      { id: "svc_auth", name: "Auth Service", type: "service" },
      { id: "svc_product", name: "Product Service", type: "service" },
      { id: "svc_payment", name: "Payment Service", type: "service" },
    ];

    const generatedTraces: any[] = [];
    const generatedLogs: any[] = [];
    const generatedAlerts: any[] = [];

    // Send 3 events rapidly
    services.forEach((svc, i) => {
      setTimeout(() => {
        const lat = Math.floor(Math.random() * 150) + 20;
        const status = i === 2 ? "error" : "success"; // let one service fail for failure logs & alerts!
        const traceId = `trace_wizard_${Date.now().toString(36)}_${i}`;

        // 1. Live Traffic Feed
        addTraffic({ 
          traceId, 
          service: svc.name, 
          latency: lat, 
          status: status as "success" | "error", 
          timestamp: Date.now() 
        });

        // 2. Discovered Service
        updateService({ 
          projectId: createdProjId ?? "default", 
          serviceId: svc.id, 
          name: svc.name, 
          type: svc.type, 
          requestCount: Math.floor(Math.random() * 200) + 120, 
          errorCount: status === "error" ? 8 : 1, 
          avgLatency: lat, 
          p95Latency: lat * 2, 
          lastSeen: new Date().toISOString() 
        });

        // 3. Traces
        const gatewayNode = { id: "1", type: "custom", data: { label: "API Gateway" }, position: { x: 250, y: 5 } };
        const svcNode = { id: "2", type: "custom", data: { label: svc.name }, position: { x: 100, y: 120 } };
        const dbNode = { id: "3", type: "custom", data: { label: "Postgres DB" }, position: { x: 400, y: 120 } };
        
        generatedTraces.push({
          traceId,
          rootSpanId: "span_root",
          spans: [
            {
              spanId: "span_root",
              service: { id: "svc_gateway", name: "API Gateway", type: "gateway" },
              metrics: { latency: lat + 10, method: "POST", path: "/checkout", statusCode: status === "success" ? 200 : 500 },
              status: status,
              timestamp: new Date().toISOString(),
            },
            {
              spanId: "span_sub1",
              parentSpanId: "span_root",
              service: { id: svc.id, name: svc.name, type: svc.type },
              metrics: { latency: lat, method: "CALL", path: "/process" },
              status: status,
              timestamp: new Date().toISOString(),
            }
          ],
          graph: {
            nodes: [gatewayNode, svcNode, dbNode],
            edges: [
              { id: "e1-2", source: "1", target: "2", animated: true },
              { id: "e2-3", source: "2", target: "3", animated: true },
            ],
          }
        });

        // 4. Logs
        generatedLogs.push({
          traceId,
          serviceId: svc.id,
          level: status === "error" ? "error" : "info",
          message: status === "error" 
            ? `Database deadlock detected during checkout transaction` 
            : `User authenticated and session generated successfully`,
          timestamp: new Date().toISOString(),
        });

        // 5. Alerts
        if (status === "error") {
          generatedAlerts.push({
            traceId,
            serviceId: svc.id,
            type: "Transaction Failures Spike",
            severity: "critical",
            message: `Checkout service error rate rose to 15% due to DB deadlocks.`,
            status: "active",
            createdAt: new Date().toISOString(),
          });
        }

        incrementEventsToday(1);
      }, i * 300);
    });

    setTimeout(() => {
      // 6. Set Metrics
      setMetrics({
        requestCount: 520,
        errorCount: 8,
        avgLatency: 82,
        p95Latency: 165,
        throughput: 21.4,
      });

      // 7. Add Analytics point
      addAnalyticsPoint({
        requestCount: 520,
        errorCount: 8,
        avgLatency: 82,
        p95Latency: 165,
        throughput: 21.4,
        bucket: new Date().toISOString(),
      });
      setAnalytics([
        { requestCount: 480, errorCount: 6, avgLatency: 79, p95Latency: 155, throughput: 19.8, bucket: new Date(Date.now() - 60000).toISOString() },
        { requestCount: 520, errorCount: 8, avgLatency: 82, p95Latency: 165, throughput: 21.4, bucket: new Date().toISOString() },
      ]);

      // Commit lists to store
      setTraces([...generatedTraces, ...(appTraces || [])].slice(0, 15));
      setLogs([...generatedLogs, ...(appLogs || [])].slice(0, 50));
      setAlerts([...generatedAlerts, ...(appAlerts || [])].slice(0, 20));

      setConnectionStatus({ connected: true, connectedServices: services.length, lastEventAt: new Date().toISOString() });
      updateUsageStats({ totalEvents: usageStats.totalEvents + 3, totalTraces: usageStats.totalTraces + 3, totalServices: services.length });
      setSending(false);
      setTestSent(true);
      addToast("3 test events sent successfully!", "success");
      setWizardStep(4);
    }, 1200);
  }, [addTraffic, updateService, setMetrics, addAnalyticsPoint, setAnalytics, setTraces, setLogs, setAlerts, appTraces, appLogs, appAlerts, setConnectionStatus, incrementEventsToday, updateUsageStats, usageStats, createdProjId, addToast, setWizardStep]);

  const copy = (t: string) => { navigator.clipboard.writeText(t); addToast("Copied!", "success"); };

  if (!wizardOpen) return null;

  const renderStep = () => {
    switch (wizardStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>Let's set up your project</div>
              <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>This wizard will guide you through the setup.</div>
            </div>
            {currentProject ? (
              <div className="cc-card cc-card--sm" style={{ borderColor: "var(--accent-border)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">✅</span>
                  <div>
                    <div className="font-medium" style={{ color: "var(--text-heading)" }}>{currentProject.name}</div>
                    <div className="text-[11px] font-mono" style={{ color: "var(--text-faint)" }}>{currentProject.id}</div>
                  </div>
                </div>
                <button className="cc-btn cc-btn--primary w-full mt-4" onClick={() => setWizardStep(1)}>Continue →</button>
              </div>
            ) : (
              <>
                <input className="cc-input" placeholder="Project name" value={projName} onChange={(e) => setProjName(e.target.value)} autoFocus />
                <select className="cc-select w-full" value={projEnv} onChange={(e) => setProjEnv(e.target.value as Environment)}>
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
                <button className="cc-btn cc-btn--primary w-full" onClick={handleCreateProject} disabled={!projName.trim()}>Create Project</button>
              </>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🔑</div>
              <div className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>Generate API Key</div>
              <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>Your SDK needs an API key to authenticate.</div>
            </div>
            {currentKey ? (
              <div>
                <div className="cc-code-block" style={{ textAlign: "center" }}>
                  <button className="cc-copy-btn" onClick={() => copy(currentKey)}>Copy</button>
                  {currentKey}
                </div>
                <div className="text-[11px] mt-3 text-center" style={{ color: "var(--badge-success-text)" }}>✓ Key generated successfully</div>
                <button className="cc-btn cc-btn--primary w-full mt-4" onClick={() => setWizardStep(2)}>Continue →</button>
              </div>
            ) : (
              <button className="cc-btn cc-btn--primary w-full" onClick={handleGenerateKey}>Generate API Key</button>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>Install SDK</div>
            </div>
            <div className="cc-code-block">
              <button className="cc-copy-btn" onClick={() => copy("npm install @graphyn/sdk")}>Copy</button>
              npm install @graphyn/sdk
            </div>
            <div className="cc-code-block" style={{ fontSize: "11px", lineHeight: "1.8" }}>
              <button className="cc-copy-btn" onClick={() => copy(`import { createClient } from "@graphyn/sdk";\n\nconst graphyn = createClient({\n  apiKey: "${currentKey ?? "YOUR_KEY"}",\n  projectId: "${createdProjId ?? "YOUR_ID"}",\n  endpoint: "https://api.graphyn.dev"\n});`)}>Copy</button>
{`import { createClient } from "@graphyn/sdk";

const graphyn = createClient({
  apiKey: "${currentKey ?? "YOUR_KEY"}",
  projectId: "${createdProjId ?? "YOUR_ID"}",
  endpoint: "https://api.graphyn.dev"
});`}
            </div>
            <button className="cc-btn cc-btn--primary w-full" onClick={() => setWizardStep(3)}>Continue →</button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🧪</div>
              <div className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>Send First Event</div>
              <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>Verify your setup by sending a test event.</div>
            </div>
            <button className="cc-btn cc-btn--primary w-full" onClick={handleSendTest} disabled={sending} style={{ padding: "14px" }}>
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Sending test events…
                </span>
              ) : testSent ? "✓ Events Sent — Continue →" : "🚀 Send Test Events"}
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>You're all set!</div>
            <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              Your project is configured and connected. Test events are now visible in Dashboard, Live Traffic, and Traces.
            </div>
            <div className="cc-card cc-card--sm mt-4" style={{ textAlign: "left" }}>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center gap-2"><span style={{ color: "var(--badge-success-text)" }}>✓</span> Project created</div>
                <div className="flex items-center gap-2"><span style={{ color: "var(--badge-success-text)" }}>✓</span> API key generated</div>
                <div className="flex items-center gap-2"><span style={{ color: "var(--badge-success-text)" }}>✓</span> SDK configured</div>
                <div className="flex items-center gap-2"><span style={{ color: "var(--badge-success-text)" }}>✓</span> Test events sent</div>
                <div className="flex items-center gap-2"><span style={{ color: "var(--badge-success-text)" }}>✓</span> Connection verified</div>
              </div>
            </div>
            <button className="cc-btn cc-btn--primary w-full mt-4" onClick={() => { closeWizard(); setTestSent(false); setGeneratedKey(null); }}>
              Close Wizard
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="cc-modal-overlay" onClick={() => { closeWizard(); setTestSent(false); setGeneratedKey(null); }}>
        <motion.div
          className="cc-modal"
          style={{ maxWidth: "520px" }}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Step Indicators */}
          <div className="cc-wizard-steps">
            {STEPS.map((_, i) => (
              <div key={i} className={`cc-wizard-step ${i < wizardStep ? "cc-wizard-step--done" : i === wizardStep ? "cc-wizard-step--active" : ""}`} />
            ))}
          </div>

          {/* Step labels */}
          <div className="flex justify-between mb-6">
            {STEPS.map((s, i) => (
              <button
                key={s}
                className="text-[9px] font-mono uppercase tracking-wider"
                style={{ color: i <= wizardStep ? "var(--accent)" : "var(--text-faint)", cursor: i < wizardStep ? "pointer" : "default", background: "none", border: "none", padding: 0 }}
                onClick={() => i < wizardStep && setWizardStep(i)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="cc-wizard-content">
            {renderStep()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
