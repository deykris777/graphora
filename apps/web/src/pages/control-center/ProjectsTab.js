import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useToast } from "../../components/ToastProvider";
import { useAuth } from "@clerk/clerk-react";
const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
export const ProjectsTab = () => {
    const { getToken } = useAuth();
    const { projects, selectedProjectId, createProject, renameProject, deleteProject, setProjectStatus, selectProject, openWizard, } = useControlCenterStore();
    const { addToast } = useToast();
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEnv, setNewEnv] = useState("production");
    const [renameId, setRenameId] = useState(null);
    const [renameValue, setRenameValue] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const handleCreate = async () => {
        if (!newName.trim())
            return;
        try {
            const token = await getToken();
            const project = await createProject(newName.trim(), newEnv, token ?? undefined);
            setNewName("");
            setNewEnv("production");
            setShowCreate(false);
            addToast(`Project "${project.name}" created`, "success");
            openWizard();
        }
        catch (err) {
            addToast("Failed to create project", "error");
        }
    };
    const handleRename = async (id) => {
        if (!renameValue.trim())
            return;
        try {
            const token = await getToken();
            await renameProject(id, renameValue.trim(), token ?? undefined);
            setRenameId(null);
            setRenameValue("");
            addToast("Project renamed", "success");
        }
        catch (err) {
            addToast("Failed to rename project", "error");
        }
    };
    const handleDelete = async (id) => {
        const proj = projects.find((p) => p.id === id);
        try {
            const token = await getToken();
            await deleteProject(id, token ?? undefined);
            setDeleteConfirm(null);
            addToast(`Project "${proj?.name}" deleted`, "error");
        }
        catch (err) {
            addToast("Failed to delete project", "error");
        }
    };
    return (_jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", children: [_jsxs(motion.div, { variants: rise, className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("div", { className: "cc-section-title", children: "Projects" }), _jsx("div", { className: "cc-section-desc", children: "Manage your observability projects" })] }), _jsxs("button", { className: "cc-btn cc-btn--primary", onClick: () => setShowCreate(true), children: [_jsx("span", { children: "+" }), " Create Project"] })] }), projects.length === 0 ? (_jsx(motion.div, { variants: rise, className: "cc-card", children: _jsxs("div", { className: "cc-empty", children: [_jsx("div", { className: "cc-empty__icon", children: "\uD83D\uDCE6" }), _jsx("div", { className: "cc-empty__title", children: "No projects yet" }), _jsx("div", { className: "cc-empty__desc", children: "Create your first project to start sending telemetry data." }), _jsx("button", { className: "cc-btn cc-btn--primary", onClick: () => setShowCreate(true), children: "Create First Project" })] }) })) : (_jsx(motion.div, { variants: stagger, className: "space-y-3", children: projects.map((project) => (_jsx(motion.div, { variants: rise, className: `cc-card cc-card--interactive ${selectedProjectId === project.id ? "ring-1" : ""}`, style: selectedProjectId === project.id ? { borderColor: "var(--accent-border)", boxShadow: "0 0 20px var(--glow)" } : {}, onClick: () => selectProject(project.id), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [renameId === project.id ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { className: "cc-input", style: { width: "220px" }, value: renameValue, onChange: (e) => setRenameValue(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleRename(project.id), autoFocus: true, onClick: (e) => e.stopPropagation() }), _jsx("button", { className: "cc-btn cc-btn--sm cc-btn--primary", onClick: (e) => { e.stopPropagation(); handleRename(project.id); }, children: "Save" }), _jsx("button", { className: "cc-btn cc-btn--sm cc-btn--ghost", onClick: (e) => { e.stopPropagation(); setRenameId(null); }, children: "Cancel" })] })) : (_jsx("span", { className: "text-[15px] font-semibold", style: { color: "var(--text-heading)" }, children: project.name })), _jsx("span", { className: `cc-badge cc-env--${project.environment}`, children: project.environment }), _jsxs("span", { className: `cc-badge ${project.status === "active" ? "cc-badge--green" : "cc-badge--muted"}`, children: [project.status === "active" && _jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-current animate-pulse" }), project.status] })] }), _jsxs("div", { className: "flex items-center gap-6 text-[11px] font-mono", style: { color: "var(--text-faint)" }, children: [_jsxs("span", { children: ["ID: ", project.id] }), _jsxs("span", { children: ["Created: ", new Date(project.createdAt).toLocaleDateString()] })] })] }), _jsxs("div", { className: "flex items-center gap-2 ml-4", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: "cc-btn cc-btn--sm cc-btn--ghost", onClick: () => { setRenameId(project.id); setRenameValue(project.name); }, children: "Rename" }), _jsx("button", { className: "cc-btn cc-btn--sm cc-btn--ghost", onClick: () => setProjectStatus(project.id, project.status === "active" ? "paused" : "active"), children: project.status === "active" ? "Pause" : "Activate" }), _jsx("button", { className: "cc-btn cc-btn--sm cc-btn--danger", onClick: () => setDeleteConfirm(project.id), children: "Delete" })] })] }) }, project.id))) })), _jsx(AnimatePresence, { children: showCreate && (_jsx("div", { className: "cc-modal-overlay", onClick: () => setShowCreate(false), children: _jsxs(motion.div, { className: "cc-modal", initial: { opacity: 0, y: 12, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 12, scale: 0.98 }, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "cc-modal-title", children: "Create Project" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Project Name" }), _jsx("input", { className: "cc-input", placeholder: "E-Commerce API", value: newName, onChange: (e) => setNewName(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleCreate(), autoFocus: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Environment" }), _jsxs("select", { className: "cc-select w-full", value: newEnv, onChange: (e) => setNewEnv(e.target.value), children: [_jsx("option", { value: "production", children: "Production" }), _jsx("option", { value: "staging", children: "Staging" }), _jsx("option", { value: "development", children: "Development" })] })] }), _jsxs("div", { className: "flex items-center gap-3 pt-4", children: [_jsx("button", { className: "cc-btn cc-btn--primary flex-1", onClick: handleCreate, disabled: !newName.trim(), children: "Create Project" }), _jsx("button", { className: "cc-btn cc-btn--ghost", onClick: () => setShowCreate(false), children: "Cancel" })] })] })] }) })) }), _jsx(AnimatePresence, { children: deleteConfirm && (_jsx("div", { className: "cc-modal-overlay", onClick: () => setDeleteConfirm(null), children: _jsxs(motion.div, { className: "cc-modal", initial: { opacity: 0, y: 12, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 12, scale: 0.98 }, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "cc-modal-title", children: "Delete Project" }), _jsx("p", { className: "text-sm mb-6", style: { color: "var(--text-muted)" }, children: "This will permanently delete the project and all associated API keys and alert rules. This action cannot be undone." }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { className: "cc-btn cc-btn--danger flex-1", onClick: () => handleDelete(deleteConfirm), children: "Delete Permanently" }), _jsx("button", { className: "cc-btn cc-btn--ghost", onClick: () => setDeleteConfirm(null), children: "Cancel" })] })] }) })) })] }));
};
