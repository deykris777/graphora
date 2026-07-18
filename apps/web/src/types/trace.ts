export interface TraceSpan {
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
  status: string;
  timestamp: string;
}

/*
Example Trace Record:
{
  "traceId": "trace_abc123",
  "rootSpanId": "span_root",
  "spans": [
    {
      "spanId": "span_root",
      "service": { "id": "svc_gateway", "name": "API Gateway", "type": "gateway" },
      "metrics": { "latency": 120, "method": "GET", "path": "/payments" },
      "status": "success",
      "timestamp": "2024-01-10T12:00:00Z"
    }
  ]
}
*/

import { Node, Edge } from "reactflow";

export interface TraceGraph {
  nodes: Node[];
  edges: Edge[];
}

export interface TraceRecord {
  traceId: string;
  rootSpanId: string;
  spans: TraceSpan[];
  graph: TraceGraph;
}
