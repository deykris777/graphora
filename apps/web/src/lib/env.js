export const env = {
    apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:4000").replace(/\/$/, ""),
    socketUrl: (import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:4000").replace(/\/$/, ""),
    clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "",
    appName: import.meta.env.VITE_APP_NAME ?? "Graphyn",
};
