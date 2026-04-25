import { env } from "../config/env";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export const apiClient = async <T>(path: string, method: HttpMethod = "GET", body?: unknown): Promise<T> => {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
};
