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
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_COMPONENTS: Record<TabId, React.FC> = {
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
  const [activeTab, setActiveTab] = useState<TabId>("projects");
  const { projects, selectedProjectId, activeEnvironment, selectProject } = useControlCenterStore();

  const ActiveComponent = TAB_COMPONENTS[activeTab];
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--accent)" }}>
              Control Center
            </h1>
            <p className="text-[11px] font-mono mt-1" style={{ color: "var(--text-faint)" }}>
              Developer onboarding & project management
            </p>
          </div>

          {/* Project Selector + Environment Badge */}
          <div className="flex items-center gap-3">
            {projects.length > 0 && (
              <select
                className="cc-select"
                value={selectedProjectId ?? ""}
                onChange={(e) => selectProject(e.target.value || null)}
              >
                <option value="">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
            <span className={`cc-badge cc-env--${activeEnvironment}`}>
              {activeEnvironment}
            </span>
          </div>
        </div>

        {/* Active Project Indicator */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 flex items-center gap-4 text-[11px] font-mono"
            style={{ color: "var(--text-faint)" }}
          >
            <span>
              Project:{" "}
              <span style={{ color: "var(--accent)" }}>
                {selectedProject.name}
              </span>
            </span>
            <span>ID: {selectedProject.id}</span>
            <span
              className={`cc-badge ${selectedProject.status === "active" ? "cc-badge--green" : "cc-badge--muted"}`}
            >
              {selectedProject.status}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <nav className="cc-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`cc-tab ${activeTab === tab.id ? "cc-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <ActiveComponent />
      </motion.div>

      {/* Quick Start Wizard Overlay */}
      <QuickStartWizard />
    </div>
  );
};
