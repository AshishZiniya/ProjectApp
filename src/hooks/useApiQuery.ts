"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

// Simple cache for API responses
const queryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Supported parameter value types for API requests
 */
type ParamValue =
  | string
  | number
  | boolean
  | undefined
  | Array<string | number | boolean>;

interface UseApiQueryOptions<T> {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  params?: Record<string, ParamValue>;
}

interface UseApiQueryReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook for data fetching with built-in error handling and loading states
 * Provides a consistent interface for API calls throughout the application
 */
export function useApiQuery<T>(
  endpoint: string,
  options?: UseApiQueryOptions<T>,
): UseApiQueryReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (options?.enabled === false) return;
    if (isFetching) return; // Prevent concurrent requests

    // Generate cache key
    const paramsString = options?.params ? JSON.stringify(options.params) : "";
    const cacheKey = `${endpoint}:${paramsString}`;

    // Check cache first
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data as T);
      return;
    }

    setLoading(true);
    setIsFetching(true);
    setError(null);

    try {
      const apiOptions = options?.params
        ? { params: options.params }
        : undefined;
      const result = await api.get<T>(endpoint, apiOptions);

      // Cache the result
      queryCache.set(cacheKey, { data: result, timestamp: Date.now() });

      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An error occurred");
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [options, isFetching, endpoint]);

  // Cleanup old cache entries
  const cleanupCache = useCallback(() => {
    const now = Date.now();
    for (const [key, value] of queryCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        queryCache.delete(key);
      }
    }
  }, []);

  useEffect(() => {
    // Only fetch if we don't have cached data
    const paramsString = options?.params ? JSON.stringify(options.params) : "";
    const cacheKey = `${endpoint}:${paramsString}`;
    const cached = queryCache.get(cacheKey);

    if (!cached || Date.now() - cached.timestamp >= CACHE_DURATION) {
      fetchData();
    } else {
      // Use cached data
      setData(cached.data as T);
    }

    // Cleanup cache periodically
    const interval = setInterval(cleanupCache, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [fetchData, cleanupCache, endpoint, options?.params]);

  // Refetch function that bypasses cache
  const refetch = useCallback(async () => {
    const paramsString = options?.params ? JSON.stringify(options.params) : "";
    const cacheKey = `${endpoint}:${paramsString}`;
    queryCache.delete(cacheKey); // Remove from cache
    await fetchData();
  }, [fetchData, endpoint, options?.params]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for mutation operations (POST, PUT, PATCH, DELETE)
 */
export function useApiMutation<TData, TVariables = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = useCallback(
    async (
      endpoint: string,
      variables: TVariables,
      method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
    ) => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        let result: TData;

        switch (method) {
          case "POST":
            result = await api.post<TData, TVariables>(endpoint, variables);
            break;
          case "PUT":
            result = await api.put<TData, TVariables>(endpoint, variables);
            break;
          case "PATCH":
            result = await api.patch<TData, TVariables>(endpoint, variables);
            break;
          case "DELETE":
            result = await api.delete<TData>(endpoint);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        setData(result);
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An error occurred");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    mutate,
    loading,
    error,
    data,
  };
}
