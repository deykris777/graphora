import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useAppStore } from "../../store/useAppStore";
import { useToast } from "../../components/ToastProvider";
import { useAuth } from "@clerk/clerk-react";
const STEPS = ["Create Project", "Generate API Key", "Install SDK", "Send First Event", "Verify Connection"];
export const QuickStartWizard = () => {
    const { getToken } = useAuth();
    const { wizardOpen, wizardStep, setWizardStep, closeWizard, projects, apiKeys, selectedProjectId, createProject, generateApiKey, setConnectionStatus, incrementEventsToday, updateUsageStats, usageStats, } = useControlCenterStore();
    const { addTraffic, updateService, setMetrics, addAnalyticsPoint, setAnalytics, setTraces, setLogs, setAlerts, traces: appTraces, logs: appLogs, alerts: appAlerts } = useAppStore();
    const { addToast } = useToast();
    const [projName, setProjName] = useState("");
    const [projEnv, setProjEnv] = useState("production");
    const [createdProjId, setCreatedProjId] = useState(selectedProjectId);
    const [generatedKey, setGeneratedKey] = useState(null);
    const [testSent, setTestSent] = useState(false);
    const [sending, setSending] = useState(false);
    const currentProject = projects.find((p) => p.id === createdProjId);
    const currentKey = generatedKey ?? apiKeys.find((k) => k.projectId === createdProjId && k.status === "active")?.key;
    const handleCreateProject = async () => {
        if (!projName.trim())
            return;
        try {
            const token = await getToken();
            const p = await createProject(projName.trim(), projEnv, token ?? undefined);
            setCreatedProjId(p.id);
            setProjName("");
            addToast(`Project "${p.name}" created`, "success");
            setWizardStep(1);
        }
        catch (err) {
            addToast("Failed to create project", "error");
        }
    };
    const handleGenerateKey = async () => {
        if (!createdProjId)
            return;
        try {
            const token = await getToken();
            const k = await generateApiKey(createdProjId, "Default", token ?? undefined);
            setGeneratedKey(k.key);
            addToast("API Key generated", "success");
            setWizardStep(2);
        }
        catch (err) {
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
        const generatedTraces = [];
        const generatedLogs = [];
        const generatedAlerts = [];
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
                    status: status,
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
    const copy = (t) => { navigator.clipboard.writeText(t); addToast("Copied!", "success"); };
    if (!wizardOpen)
        return null;
    const renderStep = () => {
        switch (wizardStep) {
            case 0:
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83D\uDE80" }), _jsx("div", { className: "text-lg font-bold", style: { color: "var(--text-heading)" }, children: "Let's set up your project" }), _jsx("div", { className: "text-[12px] mt-1", style: { color: "var(--text-muted)" }, children: "This wizard will guide you through the setup." })] }), currentProject ? (_jsxs("div", { className: "cc-card cc-card--sm", style: { borderColor: "var(--accent-border)" }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-lg", children: "\u2705" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", style: { color: "var(--text-heading)" }, children: currentProject.name }), _jsx("div", { className: "text-[11px] font-mono", style: { color: "var(--text-faint)" }, children: currentProject.id })] })] }), _jsx("button", { className: "cc-btn cc-btn--primary w-full mt-4", onClick: () => setWizardStep(1), children: "Continue \u2192" })] })) : (_jsxs(_Fragment, { children: [_jsx("input", { className: "cc-input", placeholder: "Project name", value: projName, onChange: (e) => setProjName(e.target.value), autoFocus: true }), _jsxs("select", { className: "cc-select w-full", value: projEnv, onChange: (e) => setProjEnv(e.target.value), children: [_jsx("option", { value: "production", children: "Production" }), _jsx("option", { value: "staging", children: "Staging" }), _jsx("option", { value: "development", children: "Development" })] }), _jsx("button", { className: "cc-btn cc-btn--primary w-full", onClick: handleCreateProject, disabled: !projName.trim(), children: "Create Project" })] }))] }));
            case 1:
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83D\uDD11" }), _jsx("div", { className: "text-lg font-bold", style: { color: "var(--text-heading)" }, children: "Generate API Key" }), _jsx("div", { className: "text-[12px] mt-1", style: { color: "var(--text-muted)" }, children: "Your SDK needs an API key to authenticate." })] }), currentKey ? (_jsxs("div", { children: [_jsxs("div", { className: "cc-code-block", style: { textAlign: "center" }, children: [_jsx("button", { className: "cc-copy-btn", onClick: () => copy(currentKey), children: "Copy" }), currentKey] }), _jsx("div", { className: "text-[11px] mt-3 text-center", style: { color: "var(--badge-success-text)" }, children: "\u2713 Key generated successfully" }), _jsx("button", { className: "cc-btn cc-btn--primary w-full mt-4", onClick: () => setWizardStep(2), children: "Continue \u2192" })] })) : (_jsx("button", { className: "cc-btn cc-btn--primary w-full", onClick: handleGenerateKey, children: "Generate API Key" }))] }));
            case 2:
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-center mb-4", children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83D\uDCE6" }), _jsx("div", { className: "text-lg font-bold", style: { color: "var(--text-heading)" }, children: "Install SDK" })] }), _jsxs("div", { className: "cc-code-block", children: [_jsx("button", { className: "cc-copy-btn", onClick: () => copy("npm install @graphyn/sdk"), children: "Copy" }), "npm install @graphyn/sdk"] }), _jsxs("div", { className: "cc-code-block", style: { fontSize: "11px", lineHeight: "1.8" }, children: [_jsx("button", { className: "cc-copy-btn", onClick: () => copy(`import { createClient } from "@graphyn/sdk";\n\nconst graphyn = createClient({\n  apiKey: "${currentKey ?? "YOUR_KEY"}",\n  projectId: "${createdProjId ?? "YOUR_ID"}",\n  endpoint: "https://api.graphyn.dev"\n});`), children: "Copy" }), `import { createClient } from "@graphyn/sdk";

const graphyn = createClient({
  apiKey: "${currentKey ?? "YOUR_KEY"}",
  projectId: "${createdProjId ?? "YOUR_ID"}",
  endpoint: "https://api.graphyn.dev"
});`] }), _jsx("button", { className: "cc-btn cc-btn--primary w-full", onClick: () => setWizardStep(3), children: "Continue \u2192" })] }));
            case 3:
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83E\uDDEA" }), _jsx("div", { className: "text-lg font-bold", style: { color: "var(--text-heading)" }, children: "Send First Event" }), _jsx("div", { className: "text-[12px] mt-1", style: { color: "var(--text-muted)" }, children: "Verify your setup by sending a test event." })] }), _jsx("button", { className: "cc-btn cc-btn--primary w-full", onClick: handleSendTest, disabled: sending, style: { padding: "14px" }, children: sending ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }), "Sending test events\u2026"] })) : testSent ? "✓ Events Sent — Continue →" : "🚀 Send Test Events" })] }));
            case 4:
                return (_jsxs("div", { className: "space-y-4 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83C\uDF89" }), _jsx("div", { className: "text-xl font-bold", style: { color: "var(--accent)" }, children: "You're all set!" }), _jsx("div", { className: "text-[13px]", style: { color: "var(--text-muted)" }, children: "Your project is configured and connected. Test events are now visible in Dashboard, Live Traffic, and Traces." }), _jsx("div", { className: "cc-card cc-card--sm mt-4", style: { textAlign: "left" }, children: _jsxs("div", { className: "space-y-2 text-[12px]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { style: { color: "var(--badge-success-text)" }, children: "\u2713" }), " Project created"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { style: { color: "var(--badge-success-text)" }, children: "\u2713" }), " API key generated"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { style: { color: "var(--badge-success-text)" }, children: "\u2713" }), " SDK configured"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { style: { color: "var(--badge-success-text)" }, children: "\u2713" }), " Test events sent"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { style: { color: "var(--badge-success-text)" }, children: "\u2713" }), " Connection verified"] })] }) }), _jsx("button", { className: "cc-btn cc-btn--primary w-full mt-4", onClick: () => { closeWizard(); setTestSent(false); setGeneratedKey(null); }, children: "Close Wizard" })] }));
            default:
                return null;
        }
    };
    return (_jsx(AnimatePresence, { children: _jsx("div", { className: "cc-modal-overlay", onClick: () => { closeWizard(); setTestSent(false); setGeneratedKey(null); }, children: _jsxs(motion.div, { className: "cc-modal", style: { maxWidth: "520px" }, initial: { opacity: 0, y: 20, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.96 }, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "cc-wizard-steps", children: STEPS.map((_, i) => (_jsx("div", { className: `cc-wizard-step ${i < wizardStep ? "cc-wizard-step--done" : i === wizardStep ? "cc-wizard-step--active" : ""}` }, i))) }), _jsx("div", { className: "flex justify-between mb-6", children: STEPS.map((s, i) => (_jsx("button", { className: "text-[9px] font-mono uppercase tracking-wider", style: { color: i <= wizardStep ? "var(--accent)" : "var(--text-faint)", cursor: i < wizardStep ? "pointer" : "default", background: "none", border: "none", padding: 0 }, onClick: () => i < wizardStep && setWizardStep(i), children: s }, s))) }), _jsx("div", { className: "cc-wizard-content", children: renderStep() })] }) }) }));
};
