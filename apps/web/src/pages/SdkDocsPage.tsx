export const SdkDocsPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-slate-900 dark:text-white">SDK Installation</div>
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        <div className="text-sm font-semibold text-slate-900 dark:text-white">Quick Start</div>
        <pre className="mt-4 rounded-xl border border-slate-200/70 bg-white/80 p-4 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200">
{`import { track } from "@graphyn/sdk";

track({
  projectId: "default",
  traceId: "trace_abc123",
  spanId: "span_auth_01",
  service: {
    id: "svc_auth",
    name: "Auth Service",
    type: "service"
  },
  metrics: {
    latency: 42,
    method: "POST",
    path: "/login",
    statusCode: 200
  },
  status: "success"
});`}
        </pre>
      </div>
    </div>
  );
};
