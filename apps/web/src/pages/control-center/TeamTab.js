import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useControlCenterStore } from "../../store/useControlCenterStore";
import { useToast } from "../../components/ToastProvider";
const rise = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const ROLES = ["owner", "admin", "developer", "viewer"];
const roleColors = {
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
    const [role, setRole] = useState("developer");
    const handleInvite = () => {
        if (!email.trim() || !name.trim())
            return;
        inviteTeamMember(email.trim(), name.trim(), role);
        setShowInvite(false);
        setEmail("");
        setName("");
        setRole("developer");
        addToast(`Invited ${email}`, "success");
    };
    return (_jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", className: "space-y-6", children: [_jsxs(motion.div, { variants: rise, className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "cc-section-title", children: "Team Management" }), _jsx("div", { className: "cc-section-desc", children: "Manage team members and access roles" })] }), _jsxs("button", { className: "cc-btn cc-btn--primary", onClick: () => setShowInvite(true), children: [_jsx("span", { children: "\uD83D\uDC65" }), " Invite Member"] })] }), _jsx(motion.div, { variants: rise, className: "cc-card", style: { padding: 0, overflow: "hidden" }, children: _jsxs("table", { className: "cc-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Member" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Role" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Joined" }), _jsx("th", { style: { textAlign: "right" }, children: "Actions" })] }) }), _jsx("tbody", { children: teamMembers.map((m) => (_jsxs("tr", { children: [_jsx("td", { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold", style: { background: "var(--accent-bg)", color: "var(--accent)" }, children: m.name.charAt(0).toUpperCase() }), _jsx("span", { className: "font-medium", style: { color: "var(--text-heading)" }, children: m.name })] }) }), _jsx("td", { children: _jsx("span", { className: "text-[12px] font-mono", style: { color: "var(--text-muted)" }, children: m.email }) }), _jsx("td", { children: m.role === "owner" ? (_jsx("span", { className: "cc-badge", style: { color: roleColors[m.role], background: "transparent", border: `1px solid ${roleColors[m.role]}33` }, children: m.role })) : (_jsx("select", { className: "cc-select", style: { padding: "4px 28px 4px 10px", fontSize: "11px" }, value: m.role, onChange: (e) => { updateTeamMemberRole(m.id, e.target.value); addToast("Role updated", "success"); }, children: ROLES.filter((r) => r !== "owner").map((r) => _jsx("option", { value: r, children: r }, r)) })) }), _jsx("td", { children: _jsx("span", { className: `cc-badge ${m.status === "active" ? "cc-badge--green" : m.status === "pending" ? "cc-badge--accent" : "cc-badge--red"}`, children: m.status }) }), _jsx("td", { children: _jsx("span", { className: "text-[11px] font-mono", style: { color: "var(--text-faint)" }, children: new Date(m.joinedAt).toLocaleDateString() }) }), _jsx("td", { children: _jsx("div", { className: "flex justify-end", children: m.role !== "owner" && (_jsx("button", { className: "cc-btn cc-btn--sm cc-btn--danger", onClick: () => { removeTeamMember(m.id); addToast("Member removed", "error"); }, children: "Remove" })) }) })] }, m.id))) })] }) }), _jsx(AnimatePresence, { children: showInvite && (_jsx("div", { className: "cc-modal-overlay", onClick: () => setShowInvite(false), children: _jsxs(motion.div, { className: "cc-modal", initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "cc-modal-title", children: "Invite Team Member" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Name" }), _jsx("input", { className: "cc-input", placeholder: "Jane Doe", value: name, onChange: (e) => setName(e.target.value), autoFocus: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Email" }), _jsx("input", { className: "cc-input", placeholder: "jane@company.com", type: "email", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wider mb-2", style: { color: "var(--text-muted)" }, children: "Role" }), _jsx("select", { className: "cc-select w-full", value: role, onChange: (e) => setRole(e.target.value), children: ROLES.filter((r) => r !== "owner").map((r) => _jsx("option", { value: r, children: r }, r)) })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { className: "cc-btn cc-btn--primary flex-1", onClick: handleInvite, disabled: !email.trim() || !name.trim(), children: "Send Invite" }), _jsx("button", { className: "cc-btn cc-btn--ghost", onClick: () => setShowInvite(false), children: "Cancel" })] })] })] }) })) })] }));
};
