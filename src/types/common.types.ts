/**
 * Common types used across the application
 */

// Base entity interface for common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination response interface
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form validation error interface
export interface ValidationErrors {
  [key: string]: string;
}

// Loading state interface
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Strict API response types (more type-safe than the existing ApiResponse)
export type StrictApiResponseSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type StrictApiResponseError = {
  success: false;
  error: string;
  code?: string;
};

export type StrictApiResponse<T> =
  | StrictApiResponseSuccess<T>
  | StrictApiResponseError;

// Utility types for better type safety
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

// Component prop types
export type ComponentWithChildren<P = Record<string, unknown>> = P & {
  children?: React.ReactNode;
};

export type ComponentWithClassName<P = Record<string, unknown>> = P & {
  className?: string;
};
