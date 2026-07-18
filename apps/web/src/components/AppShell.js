import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useRealtime } from "../hooks/useRealtime";
import { useProjectData } from "../hooks/useProjectData";
import { useControlCenterStore } from "../store/useControlCenterStore";
import { useAuth } from "@clerk/clerk-react";
export const AppShell = () => {
    const { getToken } = useAuth();
    const selectedProjectId = useControlCenterStore((state) => state.selectedProjectId);
    const fetchProjects = useControlCenterStore((state) => state.fetchProjects);
    const projectId = selectedProjectId ?? "default";
    // Sync projects with server database on-mount
    useEffect(() => {
        const syncDb = async () => {
            try {
                const token = await getToken();
                await fetchProjects(token ?? undefined);
            }
            catch (err) {
                console.error("Failed to sync project database", err);
            }
        };
        syncDb();
    }, [getToken, fetchProjects]);
    useRealtime();
    useProjectData(projectId);
    return (_jsx("div", { className: "min-h-screen transition-colors duration-300", style: { backgroundColor: 'var(--bg-base)', color: 'var(--text-body)' }, children: _jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx(Topbar, {}), _jsx("main", { className: "px-6 py-6 lg:px-8", children: _jsx(Outlet, { context: { projectId } }) })] })] }) }));
};
