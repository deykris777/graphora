import { createClient } from "./src/index.ts";

const client = createClient({
  baseUrl: "http://localhost:3000",
  apiKey: "graphyn_demo_key"
});

async function main() {
  await client.track({
    projectId: "default",
    traceId: "trace_001",
    spanId: "span_001",

    service: {
      id: "svc_auth",
      name: "Auth Service",
      type: "service"
    },

    metrics: {
      latency: 120,
      method: "POST",
      path: "/login",
      statusCode: 200
    },

    status: "success",

    timestamp: Date.now(),

    tags: ["auth", "login"]
  });

  console.log("Event sent successfully");
}

main().catch(console.error);