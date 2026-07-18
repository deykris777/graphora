import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useToast } from "./ToastProvider";
export const ProfileMenu = () => {
    const { user, isSignedIn } = useUser();
    const { signOut, openUserProfile } = useClerk();
    const { addToast } = useToast();
    const [open, setOpen] = useState(false);
    if (!isSignedIn) {
        return (_jsx(Link, { to: "/auth", className: "rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur-sm transition-all", style: { backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }, children: "Sign In" }));
    }
    const displayName = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Profile";
    const handleSignOut = async () => {
        addToast("Signed out", "success");
        await signOut();
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", onClick: () => setOpen((prev) => !prev), className: "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all", style: { backgroundColor: 'var(--accent-bg)', color: 'var(--text-body)', border: '1px solid var(--accent-border)' }, children: [_jsx("img", { src: user?.imageUrl, alt: displayName, className: "h-6 w-6 rounded-full object-cover", style: { border: '1px solid var(--accent-border)' } }), _jsx("span", { className: "max-w-[100px] truncate text-[11px]", children: displayName })] }), open ? (_jsxs("div", { className: "absolute right-0 mt-2 w-52 rounded-2xl p-2 text-sm shadow-xl backdrop-blur-xl z-50", style: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }, children: [_jsx("div", { className: "px-3 py-2 text-[10px] uppercase tracking-[0.15em] font-mono", style: { color: 'var(--text-muted)' }, children: "Account" }), _jsx("div", { className: "px-3 pb-2 text-[11px] font-mono truncate", style: { color: 'var(--text-faint)' }, children: user?.primaryEmailAddress?.emailAddress ?? "" }), _jsx("button", { type: "button", onClick: () => { setOpen(false); openUserProfile(); }, className: "w-full rounded-xl px-3 py-2 text-left text-[13px] transition-colors", style: { color: 'var(--text-body)' }, children: "Profile" }), _jsx("button", { type: "button", onClick: () => { setOpen(false); void handleSignOut(); }, className: "w-full rounded-xl px-3 py-2 text-left text-[13px] transition-colors", style: { color: 'var(--badge-error-text)' }, children: "Sign out" })] })) : null] }));
};
