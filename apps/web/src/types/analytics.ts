export interface AnalyticsPoint {
  bucket?: string;
  requestCount: number;
  errorCount: number;
  avgLatency: number;
  p95Latency: number;
  throughput: number;
}
