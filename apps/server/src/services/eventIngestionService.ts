import { TraceEventInput } from "../types/event";
import { upsertTraceSpan } from "./traceService";
import { upsertServiceMetrics } from "./serviceService";
import { updateAnalytics } from "./analyticsService";
import { evaluateAlert } from "./alertService";
import { createLogEntry } from "./logService";

export const ingestTraceEvent = async (event: TraceEventInput) => {
  const trace = await upsertTraceSpan(event);
  const service = await upsertServiceMetrics(event);
  const analytics = await updateAnalytics(event);
  const alert = await evaluateAlert(event);
  const log = await createLogEntry(event);

  return {
    trace,
    service,
    analytics,
    alert,
    log
  };
};
