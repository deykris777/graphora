import { jsx as _jsx } from "react/jsx-runtime";
import { useTheme } from "../app/theme";
export const ThemeToggle = () => {
    const { mode, toggle } = useTheme();
    return (_jsx("button", { type: "button", onClick: toggle, className: "rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur-sm transition-all duration-300", style: {
            backgroundColor: 'var(--accent-bg)',
            color: 'var(--accent)',
            border: '1px solid var(--accent-border)',
        }, children: mode === "dark" ? "☀️ Light" : "🌙 Dark" }));
};
