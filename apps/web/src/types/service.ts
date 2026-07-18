export interface ServiceSnapshot {
  _id?: string;
  projectId: string;
  serviceId: string;
  name: string;
  type: string;
  requestCount: number;
  errorCount: number;
  avgLatency: number;
  p95Latency: number;
  lastSeen?: string;
}
