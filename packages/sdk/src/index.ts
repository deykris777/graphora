export type TraceStatus = "success" | "error";

/*
Example SDK Payload:
{
  "projectId": "default",
  "traceId": "trace_abc123",
  "spanId": "span_auth_01",
  "service": {
    "id": "svc_auth",
    "name": "Auth Service",
    "type": "service"
  },
  "metrics": {
    "latency": 42,
    "method": "POST",
    "path": "/login",
    "statusCode": 200
  },
  "status": "success"
}
*/

export interface TrackPayload {
  projectId: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string | null;
  service: {
    id: string;
    name: string;
    type: string;
  };
  metrics: {
    latency: number;
    method?: string;
    path?: string;
    statusCode?: number;
    size?: number;
  };
  status: TraceStatus;
  timestamp?: number;
  tags?: string[];
}

export interface ClientConfig {
  baseUrl: string;
  apiKey?: string;
}

const defaultConfig: ClientConfig = {
  baseUrl: "http://localhost:3000",
  apiKey: undefined
};

export const createClient = (config: ClientConfig) => {
  return {
    track: (payload: TrackPayload) => track(payload, config)
  };
};

export const track = async (payload: TrackPayload, config?: ClientConfig) => {
  const finalConfig = { ...defaultConfig, ...config };

  const response = await fetch(`${finalConfig.baseUrl}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(finalConfig.apiKey ? { "x-api-key": finalConfig.apiKey } : {})
    },
    body: JSON.stringify(payload)
  });

if (!response.ok) {
  const errorText = await response.text();
  console.error("Backend Error:", errorText);

  throw new Error(`Failed to ingest event: ${response.status}`);
}

  return response.json();
};
