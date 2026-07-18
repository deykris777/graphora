import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { ThemeProvider } from "./theme";
import { ToastProvider } from "../components/ToastProvider";
export const AppProviders = ({ children }) => {
    useEffect(() => {
        document.body.classList.add("min-h-screen");
    }, []);
    return (_jsx(ThemeProvider, { children: _jsx(ToastProvider, { children: children }) }));
};
