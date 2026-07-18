import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { AppShell } from "../components/AppShell";
import { LandingPage } from "../pages/LandingPage";
import { AuthPage } from "../pages/AuthPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LiveTrafficPage } from "../pages/LiveTrafficPage";
import { ServiceMapPage } from "../pages/ServiceMapPage";
import { TraceExplorerPage } from "../pages/TraceExplorerPage";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { FailureAnalysisPage } from "../pages/FailureAnalysisPage";
import { LogsPage } from "../pages/LogsPage";
import { AlertsPage } from "../pages/AlertsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { SdkDocsPage } from "../pages/SdkDocsPage";
import { ControlCenterPage } from "../pages/control-center";

const ProtectedApp = () => (
  <>
    <SignedIn>
      <AppShell />
    </SignedIn>
    <SignedOut>
      <Navigate to="/auth" replace />
    </SignedOut>
  </>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/dashboard",
    element: <Navigate to="/app/dashboard" replace />
  },
  {
    path: "/auth",
    element: <AuthPage />
  },
  {
    path: "/auth/sso-callback",
    element: <AuthPage />
  },
  {
    path: "/app",
    element: <ProtectedApp />,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "live", element: <LiveTrafficPage /> },
      { path: "service-map", element: <ServiceMapPage /> },
      { path: "traces", element: <TraceExplorerPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "failures", element: <FailureAnalysisPage /> },
      { path: "logs", element: <LogsPage /> },
      { path: "alerts", element: <AlertsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "sdk", element: <SdkDocsPage /> },
      { path: "control-center", element: <ControlCenterPage /> }
    ]
  }
]);
