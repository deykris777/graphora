import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { ProjectsTab } from "./ProjectsTab";
import { ApiKeysTab } from "./ApiKeysTab";
import { SdkSetupTab } from "./SdkSetupTab";
import { ConnectionTab } from "./ConnectionTab";
import { ServicesTab } from "./ServicesTab";
import { AlertsConfigTab } from "./AlertsConfigTab";
import { TeamTab } from "./TeamTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { SettingsTab } from "./SettingsTab";
import { QuickStartWizard } from "./QuickStartWizard";
import "./control-center.css";
const TABS = [
    { id: "projects", label: "Projects", icon: "📦" },
    { id: "api-keys", label: "API Keys", icon: "🔑" },
    { id: "sdk", label: "SDK Setup", icon: "📦" },
    { id: "connection", label: "Connection", icon: "🔗" },
    { id: "services", label: "Services", icon: "🔍" },
    { id: "alerts", label: "Alerts", icon: "🔔" },
    { id: "team", label: "Team", icon: "👥" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
];
const TAB_COMPONENTS = {
    projects: ProjectsTab,
    "api-keys": ApiKeysTab,
    sdk: SdkSetupTab,
    connection: ConnectionTab,
    services: ServicesTab,
    alerts: AlertsConfigTab,
    team: TeamTab,
    analytics: AnalyticsTab,
    settings: SettingsTab,
};
export const ControlCenterPage = () => {
    const [activeTab, setActiveTab] = useState("projects");
    const { projects, selectedProjectId, activeEnvironment, selectProject } = useControlCenterStore();
    const ActiveComponent = TAB_COMPONENTS[activeTab];
    const selectedProject = projects.find((p) => p.id === selectedProjectId);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 }, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold", style: { color: "var(--accent)" }, children: "Control Center" }), _jsx("p", { className: "text-[11px] font-mono mt-1", style: { color: "var(--text-faint)" }, children: "Developer onboarding & project management" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [projects.length > 0 && (_jsxs("select", { className: "cc-select", value: selectedProjectId ?? "", onChange: (e) => selectProject(e.target.value || null), children: [_jsx("option", { value: "", children: "All Projects" }), projects.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] })), _jsx("span", { className: `cc-badge cc-env--${activeEnvironment}`, children: activeEnvironment })] })] }), selectedProject && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, className: "mt-3 flex items-center gap-4 text-[11px] font-mono", style: { color: "var(--text-faint)" }, children: [_jsxs("span", { children: ["Project:", " ", _jsx("span", { style: { color: "var(--accent)" }, children: selectedProject.name })] }), _jsxs("span", { children: ["ID: ", selectedProject.id] }), _jsx("span", { className: `cc-badge ${selectedProject.status === "active" ? "cc-badge--green" : "cc-badge--muted"}`, children: selectedProject.status })] }))] }), _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 }, children: _jsx("nav", { className: "cc-tabs", children: TABS.map((tab) => (_jsxs("button", { className: `cc-tab ${activeTab === tab.id ? "cc-tab--active" : ""}`, onClick: () => setActiveTab(tab.id), children: [_jsx("span", { className: "mr-1.5", children: tab.icon }), tab.label] }, tab.id))) }) }), _jsx(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 }, children: _jsx(ActiveComponent, {}) }, activeTab), _jsx(QuickStartWizard, {})] }));
};
