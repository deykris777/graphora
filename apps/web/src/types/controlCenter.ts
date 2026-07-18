// ── Control Center Types ─────────────────────────────

export type Environment = "development" | "staging" | "production";
export type ProjectStatus = "active" | "paused" | "archived";

export interface Project {
  id: string;
  name: string;
  environment: Environment;
  status: ProjectStatus;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  key: string;
  projectId: string;
  label: string;
  status: "active" | "revoked";
  createdAt: string;
  lastUsedAt: string | null;
}

export type AlertMetric =
  | "latency"
  | "error_rate"
  | "no_data"
  | "throughput"
  | "p95_latency";

export type AlertOperator = ">" | "<" | ">=" | "<=" | "==";

export interface AlertRule {
  id: string;
  projectId: string;
  name: string;
  metric: AlertMetric;
  operator: AlertOperator;
  threshold: number;
  unit: string;
  enabled: boolean;
  createdAt: string;
}

export type TeamRole = "owner" | "admin" | "developer" | "viewer";
export type InviteStatus = "active" | "pending" | "removed";

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: TeamRole;
  status: InviteStatus;
  joinedAt: string;
}

export interface ConnectionStatus {
  connected: boolean;
  lastEventAt: string | null;
  eventsToday: number;
  connectedServices: number;
}

export interface UsageStats {
  totalEvents: number;
  totalTraces: number;
  totalServices: number;
  errorRate: number;
  avgLatency: number;
  peakTraffic: number;
}

export interface DataRetention {
  retentionDays: number;
  storageUsedMB: number;
  eventsStored: number;
  dailyEventCount: number;
}

export interface DiscoveredService {
  id: string;
  name: string;
  requests: number;
  errors: number;
  latency: number;
  status: "healthy" | "degraded" | "down";
  lastSeen: string;
}
