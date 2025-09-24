import { API_BASE_URL } from "@/constants";

type ParamValue =
  | string
  | number
  | boolean
  | undefined
  | Array<string | number | boolean>;

interface FetchOptions<TBody> extends Omit<RequestInit, "body"> {
  params?: Record<string, ParamValue>;
  body?: TBody;
}

function buildQueryString(params?: Record<string, ParamValue>) {
  if (!params) return "";
  const pairs: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
      }
    } else {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return pairs.length ? `?${pairs.join("&")}` : "";
}

async function parseJsonMaybe(res: Response) {
  // Handle 204 or empty body safely
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return undefined;
  }
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/**
 * Centralized fetch wrapper
 * - Sends cookies with 'credentials: include'
 * - On 401 (except refresh endpoint), calls /auth/refresh once and retries the original request
 * - Does not attach Authorization headers; backend handles JWT via cookies
 */
async function fetchApi<TResponse, TBody = unknown>(
  endpoint: string,
  options: FetchOptions<TBody> = {},
  internalRetry = false
): Promise<TResponse> {
  const { params, body, headers, ...rest } = options;

  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}${endpoint}${queryString}`;

  const hasBody = body !== undefined;

  const response = await fetch(url, {
    ...rest,
    credentials: "include",
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  // Attempt one refresh-retry cycle on 401
  if (response.status === 401 && endpoint !== "/auth/refresh" && !internalRetry) {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (refreshRes.ok) {
        return fetchApi<TResponse, TBody>(endpoint, options, true);
      }
    } catch (err) {
      console.error("Failed to refresh session:", err);
      throw err;
    }
  }

  if (!response.ok) {
    // Try to extract a meaningful error message
    let message = `HTTP error! status: ${response.status}`;
    try {
      const json = await parseJsonMaybe(response);
      if (json && typeof json === "object" && "message" in json) {
        message = (json as { message: string }).message || message;
      } else {
        const text = await response.text();
        if (text) message = text;
      }
    } catch {
      // ignore parsing errors and fall back to default message
    }
    throw new Error(message);
  }

  const data = await parseJsonMaybe(response);
  return data as TResponse;
}

const api = {
  get: <T>(endpoint: string, options?: FetchOptions<never>) =>
    fetchApi<T>(endpoint, { method: "GET", ...options }),

  post: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>
  ) => fetchApi<T, B>(endpoint, { method: "POST", body, ...options }),

  put: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>
  ) => fetchApi<T, B>(endpoint, { method: "PUT", body, ...options }),

  patch: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>
  ) => fetchApi<T, B>(endpoint, { method: "PATCH", body, ...options }),

  delete: <T>(endpoint: string, options?: FetchOptions<never>) =>
    fetchApi<T>(endpoint, { method: "DELETE", ...options }),
};

export default api;
