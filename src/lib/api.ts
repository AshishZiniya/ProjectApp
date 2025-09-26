import { API_BASE_URL } from "@/constants";
import { getSession } from "next-auth/react";

// Debug: Log the API base URL being used
console.log("🔗 API Base URL:", API_BASE_URL);
console.log("🔗 Environment variable:", process.env.NEXT_PUBLIC_API_BASE_URL);

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

/**
 * API Error class with enhanced error information
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string | undefined;
  public readonly endpoint: string;
  public readonly method: string;

  constructor(
    message: string,
    status: number,
    code?: string | undefined,
    endpoint?: string,
    method?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.endpoint = endpoint || "unknown";
    this.method = method || "unknown";
  }
}

/**
 * Builds a query string from parameters object
 * @param params - Object containing query parameters
 * @returns URL-encoded query string
 */
const buildQueryString = (params?: Record<string, ParamValue>): string => {
  if (!params || Object.keys(params).length === 0) return "";

  const pairs: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const v of value) {
        if (v !== undefined && v !== null) {
          pairs.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`,
          );
        }
      }
    } else {
      pairs.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      );
    }
  }

  return pairs.length ? `?${pairs.join("&")}` : "";
};

const parseJsonMaybe = async (res: Response): Promise<unknown> => {
  // Handle 204 or empty body safely
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return undefined;
  }

  const text = await res.text();
  if (!text.trim()) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

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

  // Get session with better error handling
  let session = null;
  try {
    session = await getSession();
  } catch (error) {
    console.warn("Failed to get session:", error);
  }

  const accessToken = session?.accessToken as string | undefined;

  console.log("🌐 API Request:", {
    method: options.method || "GET",
    url,
    hasBody: body !== undefined,
    hasToken: !!accessToken,
    hasSession: !!session,
  });

  // If no session and trying to access protected endpoint, throw error early
  if (!session && endpoint !== "/auth/login" && endpoint !== "/auth/register" && endpoint !== "/auth/refresh") {
    console.warn("No active session found for protected endpoint:", endpoint);
  }

  const hasBody = body !== undefined;

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
      console.error("⏰ API Request timed out:", url);
      throw new Error("Request timed out");
    }
    console.error("❌ API Request failed:", url, error);
    throw error;
  }
}

async function processResponse<TResponse, TBody>(
  response: Response,
  endpoint: string,
  options: FetchOptions<TBody>,
  internalRetry: boolean,
): Promise<TResponse> {
  // Handle authentication errors with token refresh
  if (
    response.status === 401 &&
    endpoint !== "/auth/refresh" &&
    !internalRetry
  ) {
    try {
      // Get fresh session for token refresh
      const currentSession = await getSession();
      const refreshToken = currentSession?.refreshToken as string | undefined;
      if (refreshToken) {
        console.log("🔄 Attempting token refresh for:", endpoint);
        const refreshController = new AbortController();
        const refreshTimeoutId = setTimeout(
          () => refreshController.abort(),
          30000,
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
          // Note: Since we can't update session here, the refresh might not persist
          // NextAuth handles session updates, but for now, we'll retry the request
          console.log(
            "✅ Token refresh successful, retrying original request",
          );
          return fetchApi<TResponse, TBody>(endpoint, options, true);
        } else {
          console.log("❌ Token refresh failed:", refreshRes.status);
        }
      }
    } catch (err) {
      console.log("❌ Token refresh error:", err);
      // Can't clear session here
      throw err;
    }
  }

  // Handle non-2xx responses
  if (!response.ok) {
    const message = await extractErrorMessage(response);
    const code = await extractErrorCode(response);

    console.error("❌ API Error Response:", {
      status: response.status,
      statusText: response.statusText,
      message,
      code,
      endpoint,
      method: options.method || "GET",
    });

    throw new ApiError(
      message,
      response.status,
      code,
      endpoint,
      options.method || "GET",
    );
  }

  // Parse successful response
  const data = await parseJsonMaybe(response);
  return data as TResponse;
}

/**
 * Extract error message from response
 */
const extractErrorMessage = async (response: Response): Promise<string> => {
  try {
    const json = await parseJsonMaybe(response);
    if (json && typeof json === "object") {
      const errorData = json as Record<string, unknown>;
      if ("message" in errorData && typeof errorData.message === "string") {
        return errorData.message;
      }
    }

    const text = await response.text();
    if (text.trim()) return text;
  } catch {
    // ignore parsing errors
  }

  return `HTTP error! status: ${response.status}`;
};

/**
 * Extract error code from response
 */
const extractErrorCode = async (
  response: Response,
): Promise<string | undefined> => {
  try {
    const json = await parseJsonMaybe(response);
    if (json && typeof json === "object") {
      const errorData = json as Record<string, unknown>;
      if ("code" in errorData && typeof errorData.code === "string") {
        return errorData.code;
      }
    }
  } catch {
    // ignore parsing errors
  }
  return undefined;
};

/**
 * Enhanced API client with improved type safety and error handling
 * Automatically handles authentication tokens and token refresh
 */
interface ApiClient {
  /**
   * Perform GET request
   * @param endpoint - API endpoint path
   * @param options - Additional fetch options
   * @returns Promise with typed response data
   */
  get: <T>(endpoint: string, options?: FetchOptions<never>) => Promise<T>;

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
  ) => Promise<T>;

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
  ) => Promise<T>;

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
  ) => Promise<T>;

  /**
   * Perform DELETE request
   * @param endpoint - API endpoint path
   * @param options - Additional fetch options
   * @returns Promise with typed response data
   */
  delete: <T>(endpoint: string, options?: FetchOptions<never>) => Promise<T>;
}

const api: ApiClient = {
  get: <T>(endpoint: string, options?: FetchOptions<never>) =>
    fetchApi<T>(endpoint, { method: "GET", ...options }),

  post: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => fetchApi<T, B>(endpoint, { method: "POST", body, ...options }),

  put: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => fetchApi<T, B>(endpoint, { method: "PUT", body, ...options }),

  patch: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => fetchApi<T, B>(endpoint, { method: "PATCH", body, ...options }),

  delete: <T>(endpoint: string, options?: FetchOptions<never>) =>
    fetchApi<T>(endpoint, { method: "DELETE", ...options }),
};

export default api;
