import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useToast } from "../../components/ToastProvider";
import type { TeamRole } from "../../types/controlCenter";

const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

const ROLES: TeamRole[] = ["owner", "admin", "developer", "viewer"];

const roleColors: Record<TeamRole, string> = {
  owner: "#fbbf24",
  admin: "#f87171",
  developer: "var(--accent)",
  viewer: "var(--text-muted)",
};

export const TeamTab = () => {
  const { teamMembers, inviteTeamMember, updateTeamMemberRole, removeTeamMember } = useControlCenterStore();
  const { addToast } = useToast();
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<TeamRole>("developer");

  const handleInvite = () => {
    if (!email.trim() || !name.trim()) return;
    inviteTeamMember(email.trim(), name.trim(), role);
    setShowInvite(false);
    setEmail(""); setName(""); setRole("developer");
    addToast(`Invited ${email}`, "success");
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={rise} className="flex items-center justify-between">
        <div>
          <div className="cc-section-title">Team Management</div>
          <div className="cc-section-desc">Manage team members and access roles</div>
        </div>
        <button className="cc-btn cc-btn--primary" onClick={() => setShowInvite(true)}>
          <span>👥</span> Invite Member
        </button>
      </motion.div>

      <motion.div variants={rise} className="cc-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="cc-table">
          <thead>
            <tr><th>Member</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th style={{ textAlign: "right" }}>Actions</th></tr>
          </thead>
          <tbody>
            {teamMembers.map((m) => (
              <tr key={m.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium" style={{ color: "var(--text-heading)" }}>{m.name}</span>
                  </div>
                </td>
                <td><span className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>{m.email}</span></td>
                <td>
                  {m.role === "owner" ? (
                    <span className="cc-badge" style={{ color: roleColors[m.role], background: "transparent", border: `1px solid ${roleColors[m.role]}33` }}>
                      {m.role}
                    </span>
                  ) : (
                    <select
                      className="cc-select"
                      style={{ padding: "4px 28px 4px 10px", fontSize: "11px" }}
                      value={m.role}
                      onChange={(e) => { updateTeamMemberRole(m.id, e.target.value as TeamRole); addToast("Role updated", "success"); }}
                    >
                      {ROLES.filter((r) => r !== "owner").map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  )}
                </td>
                <td>
                  <span className={`cc-badge ${m.status === "active" ? "cc-badge--green" : m.status === "pending" ? "cc-badge--accent" : "cc-badge--red"}`}>
                    {m.status}
                  </span>
                </td>
                <td><span className="text-[11px] font-mono" style={{ color: "var(--text-faint)" }}>{new Date(m.joinedAt).toLocaleDateString()}</span></td>
                <td>
                  <div className="flex justify-end">
                    {m.role !== "owner" && (
                      <button className="cc-btn cc-btn--sm cc-btn--danger" onClick={() => { removeTeamMember(m.id); addToast("Member removed", "error"); }}>
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <AnimatePresence>
        {showInvite && (
          <div className="cc-modal-overlay" onClick={() => setShowInvite(false)}>
            <motion.div className="cc-modal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} onClick={(e) => e.stopPropagation()}>
              <div className="cc-modal-title">Invite Team Member</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Name</label>
                  <input className="cc-input" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Email</label>
                  <input className="cc-input" placeholder="jane@company.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Role</label>
                  <select className="cc-select w-full" value={role} onChange={(e) => setRole(e.target.value as TeamRole)}>
                    {ROLES.filter((r) => r !== "owner").map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button className="cc-btn cc-btn--primary flex-1" onClick={handleInvite} disabled={!email.trim() || !name.trim()}>Send Invite</button>
                  <button className="cc-btn cc-btn--ghost" onClick={() => setShowInvite(false)}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
