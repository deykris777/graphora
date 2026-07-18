import { listAnalytics } from "./analyticsService";
import { listServices } from "./serviceService";

/*
Example Analysis Output:
{
  "summary": "MongoDB query latency exceeded threshold.",
  "recommendations": [
    "Add an index to reduce query time",
    "Introduce a Redis cache for hot paths"
  ]
}
*/

export const analyzeProject = async (projectId: string) => {
  const services = await listServices(projectId);
  const analytics = await listAnalytics(projectId, 10);

  const recommendations: string[] = [];
  let summary = "System health is stable.";

  const highLatencyServices = services.filter((service) => service.avgLatency > 300);
  if (highLatencyServices.length > 0) {
    summary = "Latency hotspots detected in core services.";
    recommendations.push("Add caching on hot endpoints for high latency services.");
    recommendations.push("Review database query plans for latency spikes.");
  }

  const latest = analytics[0];
  if (latest && latest.errorCount > 0) {
    recommendations.push("Inspect error traces for failed spans and retries.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Continue monitoring for regressions.");
  }

  return {
    summary,
    recommendations,
    servicesChecked: services.length,
    analyticsPoints: analytics.length
  };
};
