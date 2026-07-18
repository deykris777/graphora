import { env } from "../lib/env";

interface ApiOptions extends RequestInit {
  authToken?: string;
}

export const apiClient = async <T>(path: string, options?: ApiOptions): Promise<T> => {
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
