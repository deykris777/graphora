export interface AlertRecord {
  _id?: string;
  traceId?: string;
  serviceId?: string;
  type: string;
  severity: string;
  message: string;
  status?: string;
  createdAt?: string;
}
