import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
const navItems = [
    { label: "Dashboard", to: "/app/dashboard" },
    { label: "Control Center", to: "/app/control-center" },
    { label: "Live Traffic", to: "/app/live" },
    { label: "Service Map", to: "/app/service-map" },
    { label: "Traces", to: "/app/traces" },
    { label: "Analytics", to: "/app/analytics" },
    { label: "Failures", to: "/app/failures" },
    { label: "Logs", to: "/app/logs" },
    { label: "Alerts", to: "/app/alerts" },
    { label: "Settings", to: "/app/settings" },
    { label: "SDK", to: "/app/sdk" },
];
export const Sidebar = () => {
    return (_jsxs("aside", { className: "sticky top-0 h-screen w-56 flex-shrink-0 px-5 py-8 flex flex-col transition-colors duration-300", style: { backgroundColor: 'var(--bg-base)', borderRight: '1px solid var(--border)' }, children: [_jsxs("div", { className: "flex items-center gap-3 px-2 mb-10", children: [_jsx("div", { className: "h-6 w-6 rounded flex items-center justify-center flex-shrink-0", style: { backgroundColor: 'var(--accent)' }, children: _jsx("span", { className: "text-xs font-black text-black", children: "G" }) }), _jsx("span", { className: "text-sm font-bold tracking-widest uppercase font-mono", style: { color: 'var(--text-heading)' }, children: "Graphyn" })] }), _jsx("nav", { className: "flex-1 space-y-1.5", children: navItems.map((item) => (_jsxs(NavLink, { to: item.to, className: ({ isActive }) => `group flex items-center justify-between rounded-md px-3 py-2 text-[12px] font-medium tracking-wide transition-all duration-200`, style: ({ isActive }) => isActive ? {
                        backgroundColor: 'rgba(255, 107, 53, 0.05)',
                        color: 'var(--accent)',
                    } : {
                        color: 'var(--text-muted)',
                    }, children: [_jsx("span", { children: item.label }), _jsx("span", { className: "h-1.5 w-1.5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200", style: { backgroundColor: 'var(--accent)' } })] }, item.label))) }), _jsx("div", { className: "mt-auto pt-6 px-2", style: { borderTop: '1px solid var(--border)' }, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full animate-pulse", style: { backgroundColor: 'var(--pulse-dot)' } }), _jsx("span", { className: "text-[9px] uppercase tracking-[0.2em] font-mono", style: { color: 'var(--text-muted)' }, children: "sys active" })] }) })] }));
};
