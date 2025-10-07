/**
 * Enhanced error handling utilities
 */

/**
 * Custom error classes for different error types
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 'SERVER_ERROR', 500);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = 'Request timeout') {
    super(message, 'TIMEOUT_ERROR', 408);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Classify HTTP errors into specific error types
 */
export function classifyHttpError(
  status: number,
  message: string,
  code?: string
): AppError {
  switch (status) {
    case 400:
      return new ValidationError(message);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new AuthorizationError(message);
    case 404:
      return new NotFoundError(message);
    case 408:
      return new TimeoutError(message);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(message);
    default:
      return new AppError(message, code, status);
  }
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  // Check for API error response structure
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  
  return 'An unknown error occurred';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError ||
    (error instanceof Error && error.message.includes('network'));
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  return error instanceof AuthenticationError ||
    (error instanceof AppError && error.statusCode === 401);
}

/**
 * Check if error requires user action
 */
export function requiresUserAction(error: unknown): boolean {
  return (
    error instanceof ValidationError ||
    error instanceof AuthenticationError ||
    error instanceof AuthorizationError
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof NetworkError) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  if (error instanceof TimeoutError) {
    return 'The request took too long. Please try again.';
  }
  
  if (error instanceof ServerError) {
    return 'Something went wrong on our end. Please try again later.';
  }
  
  if (error instanceof AuthenticationError) {
    return 'Please log in to continue.';
  }
  
  if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action.';
  }
  
  return getErrorMessage(error);
}
