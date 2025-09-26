"use client";

import { useCallback } from "react";
import useToast from "./useToast";
import { ApiError } from "@/lib/api";

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

interface UseErrorHandlerReturn {
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void;
  handleApiError: (error: ApiError, options?: ErrorHandlerOptions) => void;
  clearError: () => void;
}

/**
 * Custom hook for centralized error handling
 * Provides consistent error handling patterns across the application
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  const { showError } = useToast();

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        fallbackMessage = "An unexpected error occurred",
      } = options;

      let errorMessage = fallbackMessage;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      if (logError) {
        console.error("Error handled:", error);
      }

      if (showToast) {
        showError(errorMessage);
      }
    },
    [showError],
  );

  const handleApiError = useCallback(
    (error: ApiError, options: ErrorHandlerOptions = {}) => {
      const { showToast = true, logError = true, fallbackMessage } = options;

      let errorMessage = fallbackMessage || `API Error: ${error.message}`;

      // Provide more specific error messages based on status code
      switch (error.status) {
        case 400:
          errorMessage = "Invalid request. Please check your input.";
          break;
        case 401:
          errorMessage = "You are not authorized to perform this action.";
          break;
        case 403:
          errorMessage = "You don't have permission to access this resource.";
          break;
        case 404:
          errorMessage = "The requested resource was not found.";
          break;
        case 409:
          errorMessage = "This action conflicts with the current state.";
          break;
        case 422:
          errorMessage = "The provided data is invalid.";
          break;
        case 500:
          errorMessage = "A server error occurred. Please try again later.";
          break;
        default:
          errorMessage =
            error.message || fallbackMessage || "An API error occurred";
      }

      if (logError) {
        console.error(`API Error [${error.status}]:`, {
          message: error.message,
          endpoint: error.endpoint,
          method: error.method,
          code: error.code,
        });
      }

      if (showToast) {
        showError(errorMessage);
      }
    },
    [showError],
  );

  const clearError = useCallback(() => {
    // This could be extended to clear global error state if needed
    console.log("Error state cleared");
  }, []);

  return {
    handleError,
    handleApiError,
    clearError,
  };
}

/**
 * Error fallback component for error boundaries
 * Note: This would normally be a JSX component, but keeping it simple for now
 */
export function createErrorFallback(error: Error, retry: () => void) {
  return {
    error,
    retry,
    message: "An unexpected error occurred. Please try again.",
  };
}
