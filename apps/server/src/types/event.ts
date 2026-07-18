export type TraceStatus = "success" | "error";

/*
Example Trace Event:
{
  "projectId": "proj_92hs7",
  "traceId": "trace_abc123",
  "spanId": "span_01",
  "parentSpanId": null,
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
  "status": "success",
  "timestamp": 1715000000000
}
*/

export interface TraceEventInput {
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
