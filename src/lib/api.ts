import { API_BASE_URL } from "@/constants";

/**
 * Supported parameter value types for API requests
 */
type ParamValue =
  | string
  | number
  | boolean
  | undefined
  | Array<string | number | boolean>;

/**
 * Extended fetch options with support for query parameters and typed body
 */
interface FetchOptions<TBody> extends Omit<RequestInit, "body"> {
  params?: Record<string, ParamValue>;
  body?: TBody | undefined;
}

class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string | undefined;

  constructor(message: string, status: number, code?: string | undefined) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Builds a query string from parameters object
 * @param params - Object containing query parameters
 * @returns URL-encoded query string
 */
function buildQueryString(params?: Record<string, ParamValue>) {
  if (!params) return "";
  const pairs: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        pairs.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`,
        );
      }
    } else {
      pairs.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      );
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
 * - Sends Authorization header with access token from localStorage
 * - On 401 (except refresh endpoint), calls refresh and retries the original request
 */
async function fetchApi<TResponse, TBody = unknown>(
  endpoint: string,
  options: FetchOptions<TBody> = {},
  internalRetry = false,
): Promise<TResponse> {
  const { params, body, headers, ...rest } = options;

  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}${endpoint}${queryString}`;

  const hasBody = body !== undefined;
  const accessToken = localStorage.getItem("accessToken");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      ...rest,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      body: hasBody ? JSON.stringify(body) : null,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return await processResponse(response, endpoint, options, internalRetry);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
}

async function processResponse<TResponse, TBody>(
  response: Response,
  endpoint: string,
  options: FetchOptions<TBody>,
  internalRetry: boolean,
): Promise<TResponse> {
  // Attempt one refresh-retry cycle on 401
  if (
    response.status === 401 &&
    endpoint !== "/auth/refresh" &&
    !internalRetry
  ) {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const refreshController = new AbortController();
        const refreshTimeoutId = setTimeout(
          () => refreshController.abort(),
          10000,
        );
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
          signal: refreshController.signal,
        });
        clearTimeout(refreshTimeoutId);
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          localStorage.setItem("accessToken", refreshData.accessToken);
          localStorage.setItem("refreshToken", refreshData.refreshToken);
          return fetchApi<TResponse, TBody>(endpoint, options, true);
        }
      }
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw err;
    }
  }

  if (!response.ok) {
    // Try to extract a meaningful error message
    let message = `HTTP error! status: ${response.status}`;
    let code: string | undefined;

    try {
      const json = await parseJsonMaybe(response);
      if (json && typeof json === "object") {
        const errorData = json as Record<string, unknown>;
        if ("message" in errorData && typeof errorData.message === "string") {
          message = errorData.message;
        }
        if ("code" in errorData && typeof errorData.code === "string") {
          code = errorData.code;
        }
      } else {
        const text = await response.text();
        if (text) message = text;
      }
    } catch {
      // ignore parsing errors and fall back to default message
    }

    throw new ApiError(message, response.status, code);
  }

  const data = await parseJsonMaybe(response);
  return data as TResponse;
}

/**
 * API client with methods for all HTTP verbs
 * Automatically handles authentication tokens and token refresh
 */
const api = {
  /**
   * Perform GET request
   * @param endpoint - API endpoint path
   * @param options - Additional fetch options
   * @returns Promise with typed response data
   */
  get: <T>(endpoint: string, options?: FetchOptions<never>) =>
    fetchApi<T>(endpoint, { method: "GET", ...options }),

  /**
   * Perform POST request
   * @param endpoint - API endpoint path
   * @param body - Request body data
   * @param options - Additional fetch options
   * @returns Promise with typed response data
   */
  post: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => fetchApi<T, B>(endpoint, { method: "POST", body, ...options }),

  /**
   * Perform PUT request
   * @param endpoint - API endpoint path
   * @param body - Request body data
   * @param options - Additional fetch options
   * @returns Promise with typed response data
   */
  put: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => fetchApi<T, B>(endpoint, { method: "PUT", body, ...options }),

  /**
   * Perform PATCH request
   * @param endpoint - API endpoint path
   * @param body - Request body data
   * @param options - Additional fetch options
   * @returns Promise with typed response data
   */
  patch: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => fetchApi<T, B>(endpoint, { method: "PATCH", body, ...options }),

  /**
   * Perform DELETE request
   * @param endpoint - API endpoint path
   * @param options - Additional fetch options
   * @returns Promise with typed response data
   */
  delete: <T>(endpoint: string, options?: FetchOptions<never>) =>
    fetchApi<T>(endpoint, { method: "DELETE", ...options }),
};

export default api;
