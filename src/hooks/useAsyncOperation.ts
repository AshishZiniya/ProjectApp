import { useState, useCallback } from "react";
import useToast from "./useToast";

interface UseAsyncOperationOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseAsyncOperationReturn<T> {
  execute: (operation: () => Promise<T>) => Promise<T | undefined>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Custom hook for handling async operations with loading states and error handling
 */
export function useAsyncOperation<T = unknown>({
  onSuccess,
  onError,
  successMessage,
  errorMessage,
}: UseAsyncOperationOptions = {}): UseAsyncOperationReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useToast();

  const execute = useCallback(
    async (operation: () => Promise<T>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await operation();

        if (successMessage) {
          showSuccess(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        if (errorMessage) {
          showError(errorMessage);
        } else {
          showError(error.message);
        }

        onError?.(error);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError, successMessage, errorMessage, showSuccess, showError],
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    execute,
    loading,
    error,
    reset,
  };
}
