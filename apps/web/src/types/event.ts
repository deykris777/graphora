export type EventStatus = "success" | "error";

/*
Example Trace Event Payload:
{
  "traceId": "trace_abc123",
  "service": "Auth Service",
  "latency": 42,
  "status": "success",
  "timestamp": 1715000000000
}
*/

export interface TrafficEvent {
  traceId: string;
  service: string;
  latency: number;
  status: EventStatus;
  timestamp: number;
}
