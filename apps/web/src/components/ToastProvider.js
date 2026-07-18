import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
const ToastContext = createContext(null);
const TOAST_TTL_MS = 2800;
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = "info") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const toast = { id, message, type };
        setToasts((prev) => [...prev, toast]);
        window.setTimeout(() => {
            setToasts((prev) => prev.filter((item) => item.id !== id));
        }, TOAST_TTL_MS);
    }, []);
    const value = useMemo(() => ({ addToast }), [addToast]);
    return (_jsxs(ToastContext.Provider, { value: value, children: [children, _jsx("div", { className: "pointer-events-none fixed right-6 top-6 z-50 space-y-3", children: toasts.map((toast) => (_jsx("div", { className: `pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg ${toast.type === "success"
                        ? "border-[var(--badge-success-border)] bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]"
                        : toast.type === "error"
                            ? "border-[var(--badge-error-border)] bg-[var(--badge-error-bg)] text-[var(--badge-error-text)]"
                            : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-body)]"}`, children: toast.message }, toast.id))) })] }));
};
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};
