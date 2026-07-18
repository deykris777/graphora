export interface LogRecord {
  _id?: string;
  traceId?: string;
  serviceId?: string;
  level: string;
  message: string;
  timestamp: string;
}
