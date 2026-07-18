import { Router } from "express";
import { eventsRoutes } from "./events";
import { tracesRoutes } from "./traces";
import { servicesRoutes } from "./services";
import { analyticsRoutes } from "./analytics";
import { logsRoutes } from "./logs";
import { alertsRoutes } from "./alerts";
import { analysisRoutes } from "./analysis";
import { projectsRoutes } from "./projects";

export const apiRoutes = Router();

apiRoutes.use("/events", eventsRoutes);
apiRoutes.use("/traces", tracesRoutes);
apiRoutes.use("/services", servicesRoutes);
apiRoutes.use("/analytics", analyticsRoutes);
apiRoutes.use("/logs", logsRoutes);
apiRoutes.use("/alerts", alertsRoutes);
apiRoutes.use("/analysis", analysisRoutes);
apiRoutes.use("/projects", projectsRoutes);
