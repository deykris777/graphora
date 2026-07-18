import { create } from "zustand";
import { apiClient } from "../services/apiClient";
// ── Helpers ──────────────────────────────────────────
const uid = (prefix) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const hexKey = () => `gph_${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
const STORAGE_KEY = "graphyn-control-center";
// ── Load from localStorage ───────────────────────────
function loadPersistedState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                projects: parsed.projects ?? [],
                apiKeys: parsed.apiKeys ?? [],
                alertRules: parsed.alertRules ?? [],
                teamMembers: parsed.teamMembers ?? [],
                connectionStatus: parsed.connectionStatus ?? defaultConnection(),
                usageStats: parsed.usageStats ?? defaultUsage(),
                dataRetention: parsed.dataRetention ?? defaultRetention(),
                selectedProjectId: parsed.selectedProjectId ?? null,
                activeEnvironment: parsed.activeEnvironment ?? "production",
            };
        }
    }
    catch {
        /* ignore parse errors */
    }
    return {};
}
function persist(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            projects: state.projects,
            apiKeys: state.apiKeys,
            alertRules: state.alertRules,
            teamMembers: state.teamMembers,
            connectionStatus: state.connectionStatus,
            usageStats: state.usageStats,
            dataRetention: state.dataRetention,
            selectedProjectId: state.selectedProjectId,
            activeEnvironment: state.activeEnvironment,
        }));
    }
    catch {
        /* storage full */
    }
}
// ── Defaults ─────────────────────────────────────────
function defaultConnection() {
    return {
        connected: false,
        lastEventAt: null,
        eventsToday: 0,
        connectedServices: 0,
    };
}
function defaultUsage() {
    return {
        totalEvents: 0,
        totalTraces: 0,
        totalServices: 0,
        errorRate: 0,
        avgLatency: 0,
        peakTraffic: 0,
    };
}
function defaultRetention() {
    return {
        retentionDays: 30,
        storageUsedMB: 0,
        eventsStored: 0,
        dailyEventCount: 0,
    };
}
// ── Store ────────────────────────────────────────────
const initial = loadPersistedState();
export const useControlCenterStore = create((set, get) => ({
    // ── Initial state ─
    projects: initial.projects ?? [],
    apiKeys: initial.apiKeys ?? [],
    alertRules: initial.alertRules ?? [],
    teamMembers: initial.teamMembers && initial.teamMembers.length > 0
        ? initial.teamMembers
        : [
            {
                id: uid("mem"),
                email: "you@company.com",
                name: "You",
                role: "owner",
                status: "active",
                joinedAt: new Date().toISOString(),
            },
        ],
    connectionStatus: initial.connectionStatus ?? defaultConnection(),
    usageStats: initial.usageStats ?? defaultUsage(),
    dataRetention: initial.dataRetention ?? defaultRetention(),
    selectedProjectId: initial.selectedProjectId ?? null,
    activeEnvironment: initial.activeEnvironment ?? "production",
    wizardOpen: false,
    wizardStep: 0,
    // ── Project CRUD ───────────────────────────────────
    // ── Database Sync ─────────────────────────────────
    fetchProjects: async (authToken) => {
        try {
            const response = await apiClient("/projects", { authToken });
            if (response && Array.isArray(response)) {
                const fetchedProjects = response.map((p) => ({
                    id: p.projectId,
                    name: p.name,
                    environment: "production", // default mapping
                    status: "active",
                    createdAt: p.createdAt ?? new Date().toISOString(),
                }));
                const fetchedKeys = response.map((p) => ({
                    id: `${p.projectId}_key`,
                    key: p.apiKey,
                    projectId: p.projectId,
                    label: "Primary Key",
                    status: "active",
                    createdAt: p.createdAt ?? new Date().toISOString(),
                    lastUsedAt: null,
                }));
                set((state) => {
                    const nextSelected = state.selectedProjectId ?? (fetchedProjects[0]?.id || null);
                    const next = {
                        ...state,
                        projects: fetchedProjects,
                        apiKeys: fetchedKeys,
                        selectedProjectId: nextSelected,
                    };
                    persist(next);
                    return next;
                });
            }
        }
        catch (error) {
            console.error("Failed to sync projects from database:", error);
        }
    },
    // ── Project CRUD ───────────────────────────────────
    createProject: async (name, environment, authToken) => {
        // Generate optimistic IDs in case offline
        const fallbackId = uid("proj");
        const fallbackKey = hexKey();
        try {
            const res = await apiClient("/projects", {
                method: "POST",
                body: JSON.stringify({ name }),
                authToken,
            });
            if (res && res.projectId) {
                const project = {
                    id: res.projectId,
                    name: res.name,
                    environment,
                    status: "active",
                    createdAt: res.createdAt ?? new Date().toISOString(),
                };
                const key = {
                    id: `${res.projectId}_key`,
                    key: res.apiKey,
                    projectId: res.projectId,
                    label: "Primary Key",
                    status: "active",
                    createdAt: res.createdAt ?? new Date().toISOString(),
                    lastUsedAt: null,
                };
                set((state) => {
                    const next = {
                        ...state,
                        projects: [...state.projects, project],
                        apiKeys: [...state.apiKeys, key],
                        selectedProjectId: project.id,
                    };
                    persist(next);
                    return next;
                });
                return project;
            }
        }
        catch (error) {
            console.error("Failed to save project to database, using fallback local storage:", error);
        }
        // Local fallback if server fails
        const project = {
            id: fallbackId,
            name,
            environment,
            status: "active",
            createdAt: new Date().toISOString(),
        };
        const key = {
            id: `${fallbackId}_key`,
            key: fallbackKey,
            projectId: fallbackId,
            label: "Primary Key",
            status: "active",
            createdAt: new Date().toISOString(),
            lastUsedAt: null,
        };
        set((state) => {
            const next = {
                ...state,
                projects: [...state.projects, project],
                apiKeys: [...state.apiKeys, key],
                selectedProjectId: project.id,
            };
            persist(next);
            return next;
        });
        return project;
    },
    renameProject: async (id, name, authToken) => {
        // Optimistic local update
        set((state) => {
            const next = {
                ...state,
                projects: state.projects.map((p) => (p.id === id ? { ...p, name } : p)),
            };
            persist(next);
            return next;
        });
        try {
            await apiClient(`/projects/${id}`, {
                method: "PUT",
                body: JSON.stringify({ name }),
                authToken,
            });
        }
        catch (error) {
            console.error("Failed to update project name on server:", error);
        }
    },
    deleteProject: async (id, authToken) => {
        // Optimistic local update
        set((state) => {
            const next = {
                ...state,
                projects: state.projects.filter((p) => p.id !== id),
                apiKeys: state.apiKeys.filter((k) => k.projectId !== id),
                alertRules: state.alertRules.filter((a) => a.projectId !== id),
                selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
            };
            persist(next);
            return next;
        });
        try {
            await apiClient(`/projects/${id}`, {
                method: "DELETE",
                authToken,
            });
        }
        catch (error) {
            console.error("Failed to delete project on server:", error);
        }
    },
    setProjectStatus: (id, status) => set((state) => {
        const next = {
            ...state,
            projects: state.projects.map((p) => p.id === id ? { ...p, status } : p),
        };
        persist(next);
        return next;
    }),
    selectProject: (id) => set((state) => {
        const next = { ...state, selectedProjectId: id };
        persist(next);
        return next;
    }),
    // ── API Keys ───────────────────────────────────────
    generateApiKey: async (projectId, label, authToken) => {
        const newKey = hexKey();
        try {
            const res = await apiClient(`/projects/${projectId}`, {
                method: "PUT",
                body: JSON.stringify({ apiKey: newKey }),
                authToken,
            });
            if (res && res.projectId) {
                const key = {
                    id: `${res.projectId}_key`,
                    key: res.apiKey,
                    projectId: res.projectId,
                    label: label ?? "Primary Key",
                    status: "active",
                    createdAt: res.createdAt ?? new Date().toISOString(),
                    lastUsedAt: null,
                };
                set((state) => {
                    const next = {
                        ...state,
                        apiKeys: state.apiKeys.map((k) => k.projectId === projectId ? key : k),
                    };
                    persist(next);
                    return next;
                });
                return key;
            }
        }
        catch (error) {
            console.error("Failed to generate API Key on server, using local fallback:", error);
        }
        const key = {
            id: `${projectId}_key`,
            key: newKey,
            projectId,
            label: label ?? "Primary Key",
            status: "active",
            createdAt: new Date().toISOString(),
            lastUsedAt: null,
        };
        set((state) => {
            const next = { ...state, apiKeys: [...state.apiKeys, key] };
            persist(next);
            return next;
        });
        return key;
    },
    revokeApiKey: async (id, authToken) => {
        // Local update
        set((state) => {
            const next = {
                ...state,
                apiKeys: state.apiKeys.map((k) => k.id === id ? { ...k, status: "revoked" } : k),
            };
            persist(next);
            return next;
        });
        try {
            const apiKeyObj = get().apiKeys.find((k) => k.id === id);
            if (apiKeyObj) {
                await apiClient(`/projects/${apiKeyObj.projectId}`, {
                    method: "PUT",
                    body: JSON.stringify({ apiKey: "revoked" }),
                    authToken,
                });
            }
        }
        catch (error) {
            console.error("Failed to revoke API key on server:", error);
        }
    },
    regenerateApiKey: async (id, authToken) => {
        const newKey = hexKey();
        const apiKeyObj = get().apiKeys.find((k) => k.id === id);
        if (apiKeyObj) {
            try {
                const res = await apiClient(`/projects/${apiKeyObj.projectId}`, {
                    method: "PUT",
                    body: JSON.stringify({ apiKey: newKey }),
                    authToken,
                });
                if (res && res.projectId) {
                    const updatedKey = {
                        id,
                        key: res.apiKey,
                        projectId: res.projectId,
                        label: apiKeyObj.label,
                        status: "active",
                        createdAt: res.createdAt ?? new Date().toISOString(),
                        lastUsedAt: null,
                    };
                    set((state) => {
                        const next = {
                            ...state,
                            apiKeys: state.apiKeys.map((k) => k.id === id ? updatedKey : k),
                        };
                        persist(next);
                        return next;
                    });
                    return updatedKey;
                }
            }
            catch (error) {
                console.error("Failed to regenerate API Key on server, using local fallback:", error);
            }
        }
        // Fallback
        const updatedKey = {
            id,
            key: newKey,
            projectId: apiKeyObj?.projectId ?? "default",
            label: apiKeyObj?.label ?? "Primary Key",
            status: "active",
            createdAt: new Date().toISOString(),
            lastUsedAt: null,
        };
        set((state) => {
            const next = {
                ...state,
                apiKeys: state.apiKeys.map((k) => (k.id === id ? updatedKey : k)),
            };
            persist(next);
            return next;
        });
        return updatedKey;
    },
    touchApiKey: (id) => set((state) => {
        const next = {
            ...state,
            apiKeys: state.apiKeys.map((k) => k.id === id ? { ...k, lastUsedAt: new Date().toISOString() } : k),
        };
        persist(next);
        return next;
    }),
    // ── Alerts ─────────────────────────────────────────
    createAlertRule: (projectId, name, metric, operator, threshold, unit) => set((state) => {
        const rule = {
            id: uid("alert"),
            projectId,
            name,
            metric,
            operator,
            threshold,
            unit,
            enabled: true,
            createdAt: new Date().toISOString(),
        };
        const next = { ...state, alertRules: [...state.alertRules, rule] };
        persist(next);
        return next;
    }),
    updateAlertRule: (id, updates) => set((state) => {
        const next = {
            ...state,
            alertRules: state.alertRules.map((r) => r.id === id ? { ...r, ...updates } : r),
        };
        persist(next);
        return next;
    }),
    deleteAlertRule: (id) => set((state) => {
        const next = {
            ...state,
            alertRules: state.alertRules.filter((r) => r.id !== id),
        };
        persist(next);
        return next;
    }),
    toggleAlertRule: (id) => set((state) => {
        const next = {
            ...state,
            alertRules: state.alertRules.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r),
        };
        persist(next);
        return next;
    }),
    // ── Team ───────────────────────────────────────────
    inviteTeamMember: (email, name, role) => set((state) => {
        const member = {
            id: uid("mem"),
            email,
            name,
            role,
            status: "pending",
            joinedAt: new Date().toISOString(),
        };
        const next = { ...state, teamMembers: [...state.teamMembers, member] };
        persist(next);
        return next;
    }),
    updateTeamMemberRole: (id, role) => set((state) => {
        const next = {
            ...state,
            teamMembers: state.teamMembers.map((m) => m.id === id ? { ...m, role } : m),
        };
        persist(next);
        return next;
    }),
    removeTeamMember: (id) => set((state) => {
        const next = {
            ...state,
            teamMembers: state.teamMembers.filter((m) => m.id !== id),
        };
        persist(next);
        return next;
    }),
    // ── Environment ────────────────────────────────────
    setActiveEnvironment: (env) => set((state) => {
        const next = { ...state, activeEnvironment: env };
        persist(next);
        return next;
    }),
    // ── Connection ─────────────────────────────────────
    setConnectionStatus: (status) => set((state) => {
        const next = {
            ...state,
            connectionStatus: { ...state.connectionStatus, ...status },
        };
        persist(next);
        return next;
    }),
    incrementEventsToday: (count = 1) => set((state) => {
        const next = {
            ...state,
            connectionStatus: {
                ...state.connectionStatus,
                eventsToday: state.connectionStatus.eventsToday + count,
                lastEventAt: new Date().toISOString(),
            },
        };
        persist(next);
        return next;
    }),
    // ── Wizard ─────────────────────────────────────────
    openWizard: () => set({ wizardOpen: true, wizardStep: 0 }),
    closeWizard: () => set({ wizardOpen: false, wizardStep: 0 }),
    setWizardStep: (step) => set({ wizardStep: step }),
    // ── Usage ──────────────────────────────────────────
    updateUsageStats: (stats) => set((state) => {
        const next = {
            ...state,
            usageStats: { ...state.usageStats, ...stats },
        };
        persist(next);
        return next;
    }),
    updateDataRetention: (data) => set((state) => {
        const next = {
            ...state,
            dataRetention: { ...state.dataRetention, ...data },
        };
        persist(next);
        return next;
    }),
}));
