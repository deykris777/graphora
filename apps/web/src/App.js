import { jsx as _jsx } from "react/jsx-runtime";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./app/providers";
import { router } from "./app/router";
import { env } from "./lib/env";
export const App = () => {
    const content = (_jsx(AppProviders, { children: _jsx(RouterProvider, { router: router }) }));
    if (!env.clerkPublishableKey) {
        return content;
    }
    return _jsx(ClerkProvider, { publishableKey: env.clerkPublishableKey, children: content });
};
