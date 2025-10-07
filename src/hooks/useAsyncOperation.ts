/**
 * Enhanced async operation hook with improved error handling
 */

import { useState, useCallback } from 'react';
import useToast from './useToast';
import { logger } from '@/utils/logger';
import {
  getUserFriendlyMessage,
  isNetworkError,
  isAuthError,
} from '@/utils/errors';

interface UseAsyncOperationOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
}

interface UseAsyncOperationReturn<T> {
  execute: (operation: () => Promise<T>) => Promise<T | undefined>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Enhanced custom hook for handling async operations with comprehensive error handling
 */
export function useAsyncOperation<T = unknown>({
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  showErrorToast = true,
  showSuccessToast = true,
}: UseAsyncOperationOptions = {}): UseAsyncOperationReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useToast();

  const execute = useCallback(
    async (operation: () => Promise<T>) => {
      setLoading(true);
      setError(null);

      const timer = logger.startTimer('async-operation');

      try {
        const result = await operation();
        timer();

        logger.info('Async operation completed successfully', {
          operation: operation.toString(),
        });

        if (showSuccessToast && successMessage) {
          showSuccess(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        timer();

        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        logger.error('Async operation failed', error, {
          operation: operation.toString(),
        });

        // Show appropriate error message based on error type
        if (showErrorToast) {
          if (errorMessage) {
            showError(errorMessage);
          } else if (isNetworkError(error)) {
            showError('Network error. Please check your connection and try again.');
          } else if (isAuthError(error)) {
            showError('Authentication error. Please log in again.');
          } else {
            showError(getUserFriendlyMessage(error));
          }
        }

        onError?.(error);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [
      onSuccess,
      onError,
      successMessage,
      errorMessage,
      showErrorToast,
      showSuccessToast,
      showSuccess,
      showError,
    ],
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
