import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import type { Environment } from "../../types/controlCenter";
import { useToast } from "../../components/ToastProvider";
import { useAuth } from "@clerk/clerk-react";

const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

export const ProjectsTab = () => {
  const { getToken } = useAuth();
  const {
    projects,
    selectedProjectId,
    createProject,
    renameProject,
    deleteProject,
    setProjectStatus,
    selectProject,
    openWizard,
  } = useControlCenterStore();
  const { addToast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEnv, setNewEnv] = useState<Environment>("production");
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const token = await getToken();
      const project = await createProject(newName.trim(), newEnv, token ?? undefined);
      setNewName("");
      setNewEnv("production");
      setShowCreate(false);
      addToast(`Project "${project.name}" created`, "success");
      openWizard();
    } catch (err) {
      addToast("Failed to create project", "error");
    }
  };

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return;
    try {
      const token = await getToken();
      await renameProject(id, renameValue.trim(), token ?? undefined);
      setRenameId(null);
      setRenameValue("");
      addToast("Project renamed", "success");
    } catch (err) {
      addToast("Failed to rename project", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const proj = projects.find((p) => p.id === id);
    try {
      const token = await getToken();
      await deleteProject(id, token ?? undefined);
      setDeleteConfirm(null);
      addToast(`Project "${proj?.name}" deleted`, "error");
    } catch (err) {
      addToast("Failed to delete project", "error");
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={rise} className="flex items-center justify-between mb-6">
        <div>
          <div className="cc-section-title">Projects</div>
          <div className="cc-section-desc">Manage your observability projects</div>
        </div>
        <button className="cc-btn cc-btn--primary" onClick={() => setShowCreate(true)}>
          <span>+</span> Create Project
        </button>
      </motion.div>

      {/* Project List */}
      {projects.length === 0 ? (
        <motion.div variants={rise} className="cc-card">
          <div className="cc-empty">
            <div className="cc-empty__icon">📦</div>
            <div className="cc-empty__title">No projects yet</div>
            <div className="cc-empty__desc">Create your first project to start sending telemetry data.</div>
            <button className="cc-btn cc-btn--primary" onClick={() => setShowCreate(true)}>
              Create First Project
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={stagger} className="space-y-3">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={rise}
              className={`cc-card cc-card--interactive ${selectedProjectId === project.id ? "ring-1" : ""}`}
              style={selectedProjectId === project.id ? { borderColor: "var(--accent-border)", boxShadow: "0 0 20px var(--glow)" } : {}}
              onClick={() => selectProject(project.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {renameId === project.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          className="cc-input"
                          style={{ width: "220px" }}
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleRename(project.id)}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button className="cc-btn cc-btn--sm cc-btn--primary" onClick={(e) => { e.stopPropagation(); handleRename(project.id); }}>Save</button>
                        <button className="cc-btn cc-btn--sm cc-btn--ghost" onClick={(e) => { e.stopPropagation(); setRenameId(null); }}>Cancel</button>
                      </div>
                    ) : (
                      <span className="text-[15px] font-semibold" style={{ color: "var(--text-heading)" }}>{project.name}</span>
                    )}
                    <span className={`cc-badge cc-env--${project.environment}`}>{project.environment}</span>
                    <span className={`cc-badge ${project.status === "active" ? "cc-badge--green" : "cc-badge--muted"}`}>
                      {project.status === "active" && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-[11px] font-mono" style={{ color: "var(--text-faint)" }}>
                    <span>ID: {project.id}</span>
                    <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="cc-btn cc-btn--sm cc-btn--ghost"
                    onClick={() => { setRenameId(project.id); setRenameValue(project.name); }}
                  >
                    Rename
                  </button>
                  <button
                    className="cc-btn cc-btn--sm cc-btn--ghost"
                    onClick={() => setProjectStatus(project.id, project.status === "active" ? "paused" : "active")}
                  >
                    {project.status === "active" ? "Pause" : "Activate"}
                  </button>
                  <button
                    className="cc-btn cc-btn--sm cc-btn--danger"
                    onClick={() => setDeleteConfirm(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="cc-modal-overlay" onClick={() => setShowCreate(false)}>
            <motion.div
              className="cc-modal"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cc-modal-title">Create Project</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Project Name</label>
                  <input
                    className="cc-input"
                    placeholder="E-Commerce API"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Environment</label>
                  <select className="cc-select w-full" value={newEnv} onChange={(e) => setNewEnv(e.target.value as Environment)}>
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button className="cc-btn cc-btn--primary flex-1" onClick={handleCreate} disabled={!newName.trim()}>
                    Create Project
                  </button>
                  <button className="cc-btn cc-btn--ghost" onClick={() => setShowCreate(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="cc-modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <motion.div
              className="cc-modal"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cc-modal-title">Delete Project</div>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                This will permanently delete the project and all associated API keys and alert rules. This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button className="cc-btn cc-btn--danger flex-1" onClick={() => handleDelete(deleteConfirm!)}>
                  Delete Permanently
                </button>
                <button className="cc-btn cc-btn--ghost" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
