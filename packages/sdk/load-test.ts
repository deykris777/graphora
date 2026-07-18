import { createClient } from "./src/index";

const client = createClient({
  baseUrl: "http://localhost:3000",
  apiKey: "graphyn_demo_key"
});

const services = [
  {
    id: "svc_auth",
    name: "Auth Service",
    type: "service"
  },
  {
    id: "svc_payment",
    name: "Payment Service",
    type: "service"
  },
  {
    id: "svc_notification",
    name: "Notification Service",
    type: "service"
  },
  {
    id: "svc_database",
    name: "Database Service",
    type: "database"
  }
];

const endpoints = [
  "/login",
  "/signup",
  "/checkout",
  "/notifications",
  "/profile",
  "/orders"
];

const methods = ["GET", "POST", "PUT"];

const random = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const generateTrace = async (index: number) => {
  const traceId = `trace_${Date.now()}_${index}`;

  for (let i = 0; i < 4; i++) {
    const service = random(services);

    const latency = Math.floor(Math.random() * 900) + 50;

    const isError = Math.random() > 0.8;

    await client.track({
      projectId: "default",

      traceId,

      spanId: `span_${index}_${i}`,

      parentSpanId: i === 0 ? null : `span_${index}_${i - 1}`,

      service,

      metrics: {
        latency,
        method: random(methods),
        path: random(endpoints),
        statusCode: isError ? 500 : 200,
        size: Math.floor(Math.random() * 5000)
      },

      status: isError ? "error" : "success",

      timestamp: Date.now(),

      tags: [
        service.name.toLowerCase(),
        isError ? "failure" : "healthy"
      ]
    });

    console.log(
      `Sent span ${i + 1} for ${traceId} (${service.name})`
    );

    await new Promise((resolve) => setTimeout(resolve, 300));
  }
};

async function main() {
  console.log("Starting Graphyn load test...\n");

  for (let i = 0; i < 20; i++) {
    await generateTrace(i);
  }

  console.log("\nLoad test completed.");
}

main().catch(console.error);