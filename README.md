# Graphora

Graphora is a realtime API traffic visualizer and observability platform. It ingests trace-span events from your services, stores them in MongoDB, aggregates metrics, and streams live updates to the web UI via Socket.io.

## What Graphora Tracks

- Traces: span-by-span timelines for a request flow
- Services: per-service request counts, errors, and latency stats
- Analytics: minute buckets with throughput and latency
- Alerts: error and latency threshold notifications
- Logs: lightweight activity logs per span

## How It Works

1. Your service sends a trace-span event to the backend at POST /api/events.
2. The server validates the payload, then runs a pipeline:
   - Trace: upsert span into the trace document
   - Service: update counters + latency stats
   - Analytics: update a per-minute bucket
   - Alerts: create alert on errors or high latency
   - Logs: append a log entry for the span
3. The backend emits realtime Socket.io events so the UI updates instantly.
4. The web app loads initial data via REST and then keeps it live via sockets.

## API Overview

Base: http://localhost:4000 (configurable via env)

- GET /health -> health check
- POST /api/events -> ingest trace-span events (optional API key)
- GET /api/services -> list service snapshots (optional Clerk auth)
- GET /api/traces -> list traces with computed graphs (optional Clerk auth)
- GET /api/traces/:traceId/replay -> replay a trace via sockets (optional Clerk auth)
- GET /api/analytics -> list analytics buckets (optional Clerk auth)
- GET /api/alerts -> list alerts (optional Clerk auth)
- GET /api/logs -> list logs (optional Clerk auth)
- GET /api/analysis -> heuristic summary/recommendations (optional Clerk auth)

## Realtime Events

Socket.io broadcasts on the same base URL:

- traffic:event -> span-level traffic events
- services:update -> updated service metrics
- metrics:update -> latest analytics snapshot
- alerts:new -> newly generated alerts
- socket:stats -> active socket connections
- trace:replay -> replayed spans from a trace

## Data Model (MongoDB)

- Trace: traceId, rootSpanId, spans[]
- Service: serviceId, request/error counts, avg/p95 latency
- Analytics: per-minute bucket stats
- Alert: error or latency alerts with severity
- Log: span-level log entries

## Requirements

- Node.js 20+
- MongoDB

## Setup

1. Copy environment files:
   - apps/server/.env.example to apps/server/.env
   - apps/web/.env.example to apps/web/.env
2. Install dependencies from the repository root:
   - npm install
3. Start the development servers:
   - npm run dev

## Authentication and API Key

- If CLERK_SECRET_KEY is set, REST read endpoints require Clerk auth.
- If API_KEY is set, /api/events requires an x-api-key header.
- If these env vars are empty, the middleware allows requests through.

## SDK

A lightweight SDK exists in packages/sdk.

Build it with:

- npm run build --workspace packages/sdk

Usage (set baseUrl to your backend):

```ts
import { createClient } from "@graphora/sdk";

const client = createClient({
  baseUrl: "http://localhost:4000",
  apiKey: "your_api_key_if_set"
});

await client.track({
  projectId: "default",
  traceId: "trace_abc123",
  spanId: "span_auth_01",
  service: { id: "svc_auth", name: "Auth Service", type: "service" },
  metrics: { latency: 42, method: "POST", path: "/login", statusCode: 200 },
  status: "success",
  timestamp: Date.now()
});
```

There is also a load test script in packages/sdk/load-test.ts to simulate traces.

## Frontend

- React 19 + Vite
- Tailwind CSS
- React Flow + Recharts + Framer Motion

## Debug and Launch

To run the platform locally:

1. Ensure MongoDB is running and reachable via MONGODB_URI
2. Start the backend and frontend with npm run dev
3. Open the frontend URL from the Vite server output
