import { env } from "../config/env";
import { mockApiCall } from "./mockApiHandlers";

const USE_MOCK = process.env.REACT_APP_USE_MOCK === "true";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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
  if (USE_MOCK) {
    const token = localStorage.getItem("gc_token");
    try {
      return await mockApiCall<T>(path, method, body, token);
    } catch (err: any) {
      if (err.status === 401 && !path.startsWith("/auth/")) {
        localStorage.removeItem("gc_token");
        localStorage.removeItem("gc_user");
        window.location.href = "/auth/login";
      }
      throw new ApiError(err.status ?? 500, err.message);
    }
  }

  const token = localStorage.getItem("gc_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("/auth/")) {
      localStorage.removeItem("gc_token");
      localStorage.removeItem("gc_user");
      window.location.href = "/auth/login";
    }
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
