/**
 * Enhanced API client with improved error handling, logging, and retry logic
 *
 * This module provides a centralized HTTP client for making API requests with:
 * - Automatic error handling and classification
 * - Request/response logging for debugging
 * - Token-based authentication with automatic refresh
 * - Request timeout management
 * - Type-safe request/response handling
 *
 * @example
 * ```typescript
 * import api from '@/lib/api-client';
 *
 * // GET request
 * const users = await api.get<User[]>('/users');
 *
 * // POST request with body
 * const newUser = await api.post<User>('/users', userData);
 *
 * // Request with custom options
 * const data = await api.get('/data', {
 *   params: { page: 1, limit: 10 },
 *   timeout: 5000
 * });
 * ```
 */

import { API_BASE_URL } from '@/constants';
import { getSession } from 'next-auth/react';
import { logger } from '@/utils/logger';
import {
  AppError,
  NetworkError,
  TimeoutError,
} from '@/utils/errors';

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
interface FetchOptions<TBody> extends Omit<RequestInit, 'body'> {
  params?: Record<string, ParamValue>;
  body?: TBody | undefined;
  timeout?: number;
  retries?: number;
}

/**
 * API Error class with enhanced error information
 */
export class ApiError extends AppError {
  public readonly endpoint: string;
  public readonly method: string;

  constructor(
    message: string,
    status: number,
    code?: string,
    endpoint?: string,
    method?: string,
  ) {
    super(message, code, status);
    this.name = 'ApiError';
    this.endpoint = endpoint || 'unknown';
    this.method = method || 'unknown';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Builds a query string from parameters object
 */
const buildQueryString = (params?: Record<string, ParamValue>): string => {
  if (!params || Object.keys(params).length === 0) return '';

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

  return pairs.length ? `?${pairs.join('&')}` : '';
};

/**
 * Parse JSON response safely
 */
const parseJsonMaybe = async (res: Response): Promise<unknown> => {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
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
 * Extract error message from response
 */
const extractErrorMessage = async (response: Response): Promise<string> => {
  try {
    const json = await parseJsonMaybe(response);
    if (json && typeof json === 'object') {
      const errorData = json as Record<string, unknown>;
      if ('message' in errorData && typeof errorData.message === 'string') {
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
    if (json && typeof json === 'object') {
      const errorData = json as Record<string, unknown>;
      if ('code' in errorData && typeof errorData.code === 'string') {
        return errorData.code;
      }
    }
  } catch {
    // ignore parsing errors
  }
  return undefined;
};

/**
 * Create timeout controller
 */
const createTimeoutController = (timeout: number): AbortController => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller;
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate retry delay with exponential backoff
 */
const getRetryDelay = (attempt: number): number => {
  return Math.min(1000 * Math.pow(2, attempt), 10000);
};

/**
 * Centralized fetch wrapper with enhanced error handling and retry logic
 */
async function fetchApi<TResponse, TBody = unknown>(
  endpoint: string,
  options: FetchOptions<TBody> = {},
  internalRetry = false,
): Promise<TResponse> {
  const {
    params,
    body,
    headers,
    timeout = 10000,
    retries = 3,
    ...rest
  } = options;

  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}${endpoint}${queryString}`;

  logger.apiRequest(options.method || 'GET', url, { params, body });

  // Get session with better error handling
  let session = null;
  try {
    session = await getSession();
  } catch (error) {
    logger.warn('Failed to get session', { error });
  }

  const accessToken = session?.accessToken as string | undefined;

  // Check if this is a protected endpoint
  const isProtectedEndpoint = ![
    '/auth/login',
    '/auth/register',
    '/auth/refresh'
  ].includes(endpoint);

  if (isProtectedEndpoint && !session) {
    logger.warn('No active session found for protected endpoint', { endpoint });
  }

  const hasBody = body !== undefined;
  const controller = createTimeoutController(timeout);

  // Retry logic with exponential backoff
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...rest,
        headers: {
          ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          ...headers,
        },
        body: hasBody ? JSON.stringify(body) : null,
        signal: controller.signal,
      });

      logger.apiResponse(
        options.method || 'GET',
        url,
        response.status,
        { status: response.status, attempt: attempt + 1 }
      );

      return await processResponse(response, endpoint, options, internalRetry);
    } catch (error) {
      const isLastAttempt = attempt === retries;
      const isAbortError = error instanceof Error && error.name === 'AbortError';

      if (isAbortError) {
        logger.error('Request timeout', error, { endpoint, timeout, attempt: attempt + 1 });
        if (isLastAttempt) {
          throw new TimeoutError('Request timed out');
        }
      } else if (isLastAttempt) {
        logger.error('Network error - max retries exceeded', error, {
          endpoint,
          url,
          attempts: attempt + 1
        });
        throw new NetworkError('Network request failed');
      } else {
        const delay = getRetryDelay(attempt);
        logger.warn('Request failed, retrying...', {
          error: error instanceof Error ? error.message : String(error),
          endpoint,
          attempt: attempt + 1,
          delay,
          remainingRetries: retries - attempt
        });
        await sleep(delay);
      }
    }
  }

  // This should never be reached, but TypeScript requires it
  throw new NetworkError('Network request failed');
}

/**
 * Process API response with enhanced error handling
 */
async function processResponse<TResponse, TBody>(
  response: Response,
  endpoint: string,
  options: FetchOptions<TBody>,
  internalRetry: boolean,
): Promise<TResponse> {
  // Handle authentication errors with token refresh
  if (
    response.status === 401 &&
    endpoint !== '/auth/refresh' &&
    !internalRetry
  ) {
    try {
      const currentSession = await getSession();
      const refreshToken = currentSession?.refreshToken as string | undefined;

      if (refreshToken) {
        logger.info('Attempting token refresh', { endpoint });

        const refreshController = createTimeoutController(30000);
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
          signal: refreshController.signal,
        });

        if (refreshRes.ok) {
          logger.info('Token refresh successful, retrying request', { endpoint });
          return fetchApi<TResponse, TBody>(endpoint, options, true);
        } else {
          logger.warn('Token refresh failed', {
            endpoint,
            status: refreshRes.status
          });
        }
      }
    } catch (err) {
      logger.error('Token refresh error', err, { endpoint });
    }
  }

  // Handle non-2xx responses
  if (!response.ok) {
    const message = await extractErrorMessage(response);
    const code = await extractErrorCode(response);

    logger.error('API error response', new Error(message), {
      endpoint,
      method: options.method || 'GET',
      status: response.status,
      code,
    });

    throw new ApiError(
      message,
      response.status,
      code,
      endpoint,
      options.method || 'GET',
    );
  }

  // Parse successful response
  const data = await parseJsonMaybe(response);
  return data as TResponse;
}

/**
 * Enhanced API client with improved type safety and error handling
 */
interface ApiClient {
  /**
   * Perform GET request
   */
  get: <T>(endpoint: string, options?: FetchOptions<never>) => Promise<T>;

  /**
   * Perform POST request
   */
  post: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => Promise<T>;

  /**
   * Perform PUT request
   */
  put: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => Promise<T>;

  /**
   * Perform PATCH request
   */
  patch: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => Promise<T>;

  /**
   * Perform DELETE request
   */
  delete: <T>(endpoint: string, options?: FetchOptions<never>) => Promise<T>;
}

const api: ApiClient = {
  get: <T>(endpoint: string, options?: FetchOptions<never>) =>
    fetchApi<T>(endpoint, { method: 'GET', ...options }),

  post: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => fetchApi<T, B>(endpoint, { method: 'POST', body, ...options }),

  put: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => fetchApi<T, B>(endpoint, { method: 'PUT', body, ...options }),

  patch: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: FetchOptions<B>,
  ) => fetchApi<T, B>(endpoint, { method: 'PATCH', body, ...options }),

  delete: <T>(endpoint: string, options?: FetchOptions<never>) =>
    fetchApi<T>(endpoint, { method: 'DELETE', ...options }),
};

export default api;
