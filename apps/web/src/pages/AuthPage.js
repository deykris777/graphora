import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { SignedIn, SignedOut, SignIn, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { env } from "../lib/env";
import { useToast } from "../components/ToastProvider";
export const AuthPage = () => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();
    const { addToast } = useToast();
    useEffect(() => {
        if (isSignedIn) {
            addToast("Signed in successfully", "success");
            navigate("/dashboard", { replace: true });
        }
    }, [addToast, isSignedIn, navigate]);
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white", children: _jsxs("div", { className: "rounded-3xl border border-slate-200/70 bg-white/70 p-10 dark:border-white/10 dark:bg-white/5", children: [_jsx("div", { className: "mb-6 text-lg font-semibold", children: "Sign in to Graphyn" }), env.clerkPublishableKey ? (_jsxs(_Fragment, { children: [_jsx(SignedOut, { children: _jsx(SignIn, { routing: "path", path: "/auth", redirectUrl: "/dashboard", afterSignInUrl: "/dashboard", afterSignUpUrl: "/dashboard" }) }), _jsx(SignedIn, { children: _jsx("div", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Redirecting to dashboard..." }) })] })) : (_jsx("div", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Set VITE_CLERK_PUBLISHABLE_KEY to enable authentication." }))] }) }));
};
