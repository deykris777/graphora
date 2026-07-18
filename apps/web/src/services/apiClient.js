import { env } from "../lib/env";
export const apiClient = async (path, options) => {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options?.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}),
            ...(options?.headers ?? {})
        },
        ...options
    });
    if (!response.ok) {
        throw new Error("API request failed");
    }
    return response.json();
};
