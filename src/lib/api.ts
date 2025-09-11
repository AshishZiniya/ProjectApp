/* eslint-disable @typescript-eslint/no-explicit-any */
// api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Helper function for handling requests
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include", // send cookies
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (res.ok) {
      // Parse JSON if available
      const text = await res.text();
      return text ? JSON.parse(text) : ({} as T);
    }

    // Handle 401 → try refresh token
    if (res.status === 401 && retry && endpoint !== "/auth/refresh") {
      try {
        await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        // Retry original request once
        return request<T>(endpoint, options, false);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        throw refreshError;
      }
    }

    // Throw error response
    const errorText = await res.text();
    throw new Error(errorText || `HTTP Error ${res.status}`);
  } catch (err) {
    console.error("API request failed:", err);
    throw err;
  }
}

// Generic API methods
export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
