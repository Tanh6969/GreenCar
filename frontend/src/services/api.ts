import { env } from "../config/env";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export { ApiError };

export const apiClient = async <T>(
  path: string,
  method: HttpMethod = "GET",
  body?: unknown
): Promise<T> => {
  const token = localStorage.getItem("gc_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const err = await response.json();
      if (err.error) message = err.error;
    } catch {}
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};
