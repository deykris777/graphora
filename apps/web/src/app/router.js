import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
const ProtectedApp = () => (_jsxs(_Fragment, { children: [_jsx(SignedIn, { children: _jsx(AppShell, {}) }), _jsx(SignedOut, { children: _jsx(Navigate, { to: "/auth", replace: true }) })] }));
export const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(LandingPage, {})
    },
    {
        path: "/dashboard",
        element: _jsx(Navigate, { to: "/app/dashboard", replace: true })
    },
    {
        path: "/auth",
        element: _jsx(AuthPage, {})
    },
    {
        path: "/auth/sso-callback",
        element: _jsx(AuthPage, {})
    },
    {
        path: "/app",
        element: _jsx(ProtectedApp, {}),
        children: [
            { index: true, element: _jsx(Navigate, { to: "/app/dashboard", replace: true }) },
            { path: "dashboard", element: _jsx(DashboardPage, {}) },
            { path: "live", element: _jsx(LiveTrafficPage, {}) },
            { path: "service-map", element: _jsx(ServiceMapPage, {}) },
            { path: "traces", element: _jsx(TraceExplorerPage, {}) },
            { path: "analytics", element: _jsx(AnalyticsPage, {}) },
            { path: "failures", element: _jsx(FailureAnalysisPage, {}) },
            { path: "logs", element: _jsx(LogsPage, {}) },
            { path: "alerts", element: _jsx(AlertsPage, {}) },
            { path: "settings", element: _jsx(SettingsPage, {}) },
            { path: "sdk", element: _jsx(SdkDocsPage, {}) },
            { path: "control-center", element: _jsx(ControlCenterPage, {}) }
        ]
    }
]);
