import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "graphyn-theme";
export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState("dark");
    useEffect(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
            setMode(stored);
        }
    }, []);
    useEffect(() => {
        const root = document.documentElement;
        if (mode === "dark") {
            root.classList.add("dark");
        }
        else {
            root.classList.remove("dark");
        }
        localStorage.setItem(THEME_STORAGE_KEY, mode);
    }, [mode]);
    const value = useMemo(() => ({
        mode,
        toggle: () => setMode((prev) => (prev === "dark" ? "light" : "dark"))
    }), [mode]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
};
export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
};
