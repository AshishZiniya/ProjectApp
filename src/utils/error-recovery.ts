/**
 * Error recovery utilities and strategies
 */

import { logger } from './logger';
import { isNetworkError, isAuthError } from './errors';

export interface RetryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableErrors?: Array<new (...args: never[]) => Error>;
}

export interface ErrorRecoveryAction {
  label: string;
  action: () => void | Promise<void>;
  primary?: boolean;
}

export interface ErrorRecoveryStrategy {
  canRecover: (error: Error) => boolean;
  getActions: (error: Error, context?: Record<string, unknown>) => ErrorRecoveryAction[];
  getMessage: (error: Error) => string;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

/**
 * Network error recovery strategy
 */
export const networkErrorStrategy: ErrorRecoveryStrategy = {
  canRecover: (error) => isNetworkError(error),

  getActions: (_error, context) => [
    {
      label: 'Retry',
      action: (context?.retryAction as () => void) || (() => window.location.reload()),
      primary: true,
    },
    {
      label: 'Check Connection',
      action: async () => {
        // Try to fetch a small resource to test connectivity
        try {
          await fetch('/favicon.ico', {
            method: 'HEAD',
            cache: 'no-cache'
          });
          alert('Connection appears to be working. The error might be temporary.');
        } catch {
          alert('Please check your internet connection and try again.');
        }
      },
    },
  ],

  getMessage: () => 'Unable to connect to the server. Please check your internet connection.',
};

/**
 * Authentication error recovery strategy
 */
export const authErrorStrategy: ErrorRecoveryStrategy = {
  canRecover: (error) => isAuthError(error),

  getActions: () => [
    {
      label: 'Sign In',
      action: () => {
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      },
      primary: true,
    },
    {
      label: 'Clear Cache',
      action: async () => {
        // Clear local storage and session storage
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/auth/login';
        }
      },
    },
  ],

  getMessage: () => 'Your session has expired. Please sign in again.',
};

/**
 * Validation error recovery strategy
 */
export const validationErrorStrategy: ErrorRecoveryStrategy = {
  canRecover: (error) => error.name === 'ValidationError',

  getActions: (_error, context) => [
    {
      label: 'Fix Issues',
      action: (context?.focusFirstError as () => void) || (() => {}),
      primary: true,
    },
  ],

  getMessage: (error) => error.message || 'Please check your input and try again.',
};

/**
 * Server error recovery strategy
 */
export const serverErrorStrategy: ErrorRecoveryStrategy = {
  canRecover: (error) => error.name === 'ServerError',

  getActions: (error, context) => [
    {
      label: 'Retry',
      action: (context?.retryAction as () => void) || (() => window.location.reload()),
      primary: true,
    },
    {
      label: 'Report Issue',
      action: async () => {
        // Copy error details to clipboard for reporting
        const errorDetails = {
          message: error.message,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        };

        try {
          await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
          alert('Error details copied to clipboard. Please share with support.');
        } catch {
          alert('Please take a screenshot and share with support.');
        }
      },
    },
  ],

  getMessage: () => 'Server error occurred. Please try again or contact support if the issue persists.',
};

/**
 * Generic error recovery strategy (fallback)
 */
export const genericErrorStrategy: ErrorRecoveryStrategy = {
  canRecover: () => true,

  getActions: (_error, context) => [
    {
      label: 'Retry',
      action: (typeof context?.retryAction === 'function')
        ? (context.retryAction as () => void | Promise<void>)
        : (() => window.location.reload()),
      primary: true,
    },
    {
      label: 'Go Home',
      action: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
    },
  ],

  getMessage: () => 'An unexpected error occurred. Please try again.',
};

/**
 * All available error recovery strategies
 */
const ERROR_STRATEGIES = [
  networkErrorStrategy,
  authErrorStrategy,
  validationErrorStrategy,
  serverErrorStrategy,
  genericErrorStrategy,
];

/**
 * Get the appropriate recovery strategy for an error
 */
export function getErrorRecoveryStrategy(error: Error): ErrorRecoveryStrategy {
  return ERROR_STRATEGIES.find(strategy => strategy.canRecover(error)) || genericErrorStrategy;
}

/**
 * Get recovery actions for an error
 */
export function getErrorRecoveryActions(
  error: Error,
  context?: Record<string, unknown>
): ErrorRecoveryAction[] {
  const strategy = getErrorRecoveryStrategy(error);
  return strategy.getActions(error, context);
}

/**
 * Get user-friendly error message
 */
export function getErrorRecoveryMessage(error: Error): string {
  const strategy = getErrorRecoveryStrategy(error);
  return strategy.getMessage(error);
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retryable
      const isRetryable = !config.retryableErrors ||
        config.retryableErrors.some(ErrorClass => lastError instanceof ErrorClass);

      if (!isRetryable || attempt === config.maxAttempts - 1) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffFactor, attempt),
        config.maxDelay
      );

      logger.warn(`Operation failed, retrying in ${delay}ms`, {
        attempt: attempt + 1,
        maxAttempts: config.maxAttempts,
        error: lastError.message,
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Create a retryable version of a function
 */
export function withRetry<T extends (...args: never[]) => Promise<unknown>>(
  fn: T,
  options?: Partial<RetryOptions>
): T {
  return (async (...args: Parameters<T>) => {
    return retryWithBackoff(() => fn(...args), options);
  }) as T;
}

/**
 * Error reporting utility
 */
export async function reportError(
  error: Error,
  context?: Record<string, unknown>
): Promise<void> {
  try {
    logger.error('Reporting error to external service', error, context);

    // Here you would typically send to an error reporting service
    // like Sentry, LogRocket, or Bugsnag

    // For now, we'll just log it
    console.error('Error reported:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
      timestamp: new Date().toISOString(),
    });
  } catch (reportingError) {
    logger.error('Failed to report error', reportingError as Error);
  }
}

/**
 * Create error context for recovery actions
 */
export function createErrorContext(
  retryAction?: () => void | Promise<void>,
  focusFirstError?: () => void
): Record<string, unknown> {
  return {
    retryAction,
    focusFirstError,
    timestamp: new Date().toISOString(),
  };
}
