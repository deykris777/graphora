import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const StatBadge = ({ status }) => {
    const isError = status === "error";
    return (_jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", style: {
            backgroundColor: isError ? 'var(--badge-error-bg)' : 'var(--badge-success-bg)',
            color: isError ? 'var(--badge-error-text)' : 'var(--badge-success-text)',
            border: `1px solid ${isError ? 'var(--badge-error-border)' : 'var(--badge-success-border)'}`,
        }, children: [_jsx("span", { className: "h-1 w-1 rounded-full", style: { backgroundColor: isError ? 'var(--badge-error-text)' : 'var(--badge-success-text)' } }), status] }));
};
